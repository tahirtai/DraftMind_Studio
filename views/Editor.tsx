import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import { getDocument, updateDocumentContent, logAiGeneration, updateDocumentStatus } from '../lib/database';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const DOC_STATUSES = ['Draft', 'Review', 'Final', 'Published', 'Archived'] as const;

const Editor: React.FC = () => {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init-1', role: 'model', text: 'How can I help you refine your draft today? I can generate sections, fix tone, or brainstorm ideas.' }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Document state
    const [docTitle, setDocTitle] = useState('Loading...');
    const [projectName, setProjectName] = useState('');
    const [docStatus, setDocStatus] = useState('Draft');
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [docLoaded, setDocLoaded] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    // Autosave timer ref
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Tiptap Editor
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: false,
                underline: false,
            }),
            Underline,
            Typography,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer hover:text-orange-600',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing or ask AI for help...',
            }),
            BubbleMenuExtension,
        ],
        content: '',
        onUpdate: ({ editor }) => {
            handleContentChange();
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-invert max-w-none focus:outline-none min-h-[60vh]',
            },
        },
    });

    // Load document on mount
    useEffect(() => {
        if (docId) loadDocument();
    }, [docId]);

    const loadDocument = async () => {
        const { data, error } = await getDocument(docId!);
        if (error || !data) {
            navigate('/dashboard');
            return;
        }
        setDocTitle(data.title);
        setProjectName(data.projects?.name || 'Unknown');
        setDocStatus(data.status || 'Draft');
        setWordCount(data.word_count || 0);
        setLastSaved(new Date(data.updated_at));

        if (editor && !docLoaded) {
            // Only set content once to avoid overwriting unsaved changes if re-renders happen
            editor.commands.setContent(data.content || '');
            setDocLoaded(true);
        }
    };

    // Sync content when editor becomes ready if data loaded first
    useEffect(() => {
        if (editor && !docLoaded && docTitle !== 'Loading...') {
            // ThisEffect runs if editor wasn't ready during loadDocument
            // We need to fetch and set content again? ideally data.content is stored in state?
            // Actually, best to fetch content again or store it in ref/state temporarily.
            // Simplified: re-fetch content for editor if needed.
            getDocument(docId!).then(({ data }) => {
                if (data && editor.isEmpty) {
                    editor.commands.setContent(data.content || '');
                    setDocLoaded(true);
                }
            });
        }
    }, [editor, docId, docLoaded]);


    // Autosave logic
    const saveContent = useCallback(async (html: string, wc: number) => {
        if (!docId) return;
        setSaveStatus('saving');
        const { error } = await updateDocumentContent(docId, html, wc);
        if (!error) {
            setSaveStatus('saved');
            setLastSaved(new Date());
        } else {
            setSaveStatus('unsaved');
        }
    }, [docId]);

    const handleContentChange = () => {
        if (!editor) return;
        const html = editor.getHTML();
        const text = editor.getText();
        const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(wc);
        setSaveStatus('unsaved');

        // Debounce autosave — 2 seconds of inactivity
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => saveContent(html, wc), 2000);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, []);

    // Scroll chat to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isGenerating]);

    // Status change
    const handleStatusChange = async (newStatus: string) => {
        if (!docId) return;
        setDocStatus(newStatus);
        setStatusMenuOpen(false);
        await updateDocumentStatus(docId, newStatus);
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-gray-800 text-gray-300 border-gray-600';
            case 'Review': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50';
            case 'Final': return 'bg-green-900/30 text-green-400 border-green-700/50';
            case 'Published': return 'bg-purple-900/30 text-purple-400 border-purple-700/50';
            case 'Archived': return 'bg-red-900/30 text-red-400 border-red-700/50';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    // AI generation via OpenRouter
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isGenerating) return;
        const userText = inputValue.trim();
        setInputValue('');
        setIsGenerating(true);

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) throw new Error('OpenRouter API key not configured');

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'DraftMind Studio',
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-001',
                    messages: [
                        { role: 'system', content: 'You are DraftMind AI, a professional writing assistant...' },
                        ...messages.filter(m => m.id !== 'init-1').map(m => ({
                            role: m.role === 'model' ? 'assistant' : 'user',
                            content: m.text
                        })),
                        { role: 'user', content: userText }
                    ],
                }),
            });

            if (!response.ok) throw new Error(`API returned ${response.status}`);

            const result = await response.json();
            const responseText = result.choices?.[0]?.message?.content || "I couldn't generate a response.";
            const tokensUsed = result.usage?.total_tokens || 0;

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, aiMsg]);

            if (docId) {
                await logAiGeneration(docId, userText, responseText, tokensUsed);
            }
        } catch (error: any) {
            console.error('AI error:', error);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: `Error: ${error.message}` };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimeSince = (date: Date | null) => {
        if (!date) return '';
        const diff = Date.now() - date.getTime();
        const secs = Math.floor(diff / 1000);
        if (secs < 60) return 'just now';
        const mins = Math.floor(secs / 60);
        return `${mins}m ago`;
    };

    if (!editor) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-dark h-screen">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-background-dark">
            {/* Top Header */}
            <header className="h-16 shrink-0 border-b border-border-dark bg-background-dark/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
                <div className="flex items-center gap-4 min-w-0">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-dark text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <h2 className="text-white text-lg font-semibold leading-tight tracking-tight truncate">{docTitle}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
                                {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
                            </span>
                            {lastSaved && (
                                <>
                                    <span>•</span>
                                    <span>Last saved {formatTimeSince(lastSaved)}</span>
                                </>
                            )}
                            <span>•</span>
                            <span>{projectName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-text-secondary bg-surface-dark px-2 py-1 rounded border border-border-dark">{wordCount.toLocaleString()} words</span>

                    {/* Status Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${statusColor(docStatus)}`}
                        >
                            {docStatus}
                            <span className="material-symbols-outlined text-[14px]">expand_more</span>
                        </button>
                        {statusMenuOpen && (
                            <div className="absolute right-0 top-9 z-50 w-36 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/40 py-1">
                                {DOC_STATUSES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${docStatus === s ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${s === 'Draft' ? 'bg-gray-400' : s === 'Review' ? 'bg-yellow-400' : s === 'Final' ? 'bg-green-400' : s === 'Published' ? 'bg-purple-400' : 'bg-red-400'}`}></span>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-border-dark mx-1"></div>
                    <button className="flex items-center justify-center h-9 px-3 rounded-lg bg-surface-dark text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-border-dark/50" title="Export">
                        <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-primary text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 font-medium tracking-wide">
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        <span className="hidden sm:inline">AI Generate</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto w-full flex justify-center bg-background-dark relative scroll-smooth">
                    <div className="w-full max-w-[900px] min-h-[calc(100vh-4rem)] py-12 px-8 md:px-16 bg-background-dark">

                        {/* Fixed Toolbar */}
                        <div className="sticky top-0 z-10 mx-auto w-fit flex items-center gap-1 p-1 mb-8 bg-surface-dark/90 backdrop-blur border border-border-dark rounded-xl shadow-lg shadow-black/20 transform transition-all hover:scale-[1.02]">
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Heading 1"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_h1</span>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Heading 2"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_h2</span>
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Bold (Ctrl+B)"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_bold</span>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Italic (Ctrl+I)"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_italic</span>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Underline (Ctrl+U)"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_underlined</span>
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Bullet List"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Ordered List"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            <button
                                onClick={() => {
                                    const url = window.prompt('Enter URL');
                                    if (url) {
                                        editor.chain().focus().setLink({ href: url }).run();
                                    }
                                }}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Link"
                            >
                                <span className="material-symbols-outlined text-[18px]">link</span>
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                                title="Quote"
                            >
                                <span className="material-symbols-outlined text-[18px]">format_quote</span>
                            </button>
                        </div>

                        {/* Bubble Menu */}
                        {editor && (
                            <BubbleMenu editor={editor} className="flex bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/40 overflow-hidden">
                                <button
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-primary bg-primary/10' : 'text-white'}`}
                                >
                                    Bold
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-primary bg-primary/10' : 'text-white'}`}
                                >
                                    Italic
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleStrike().run()}
                                    className={`px-3 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors ${editor.isActive('strike') ? 'text-primary bg-primary/10' : 'text-white'}`}
                                >
                                    Strike
                                </button>
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors flex items-center gap-1 border-l border-white/10"
                                >
                                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                    Ask AI
                                </button>
                            </BubbleMenu>
                        )}

                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* Right Sidebar (AI Assistant) */}
                {sidebarOpen && (
                    <aside className="w-80 bg-sidebar-dark border-l border-border-dark flex flex-col shrink-0 h-full shadow-2xl z-20">
                        {/* AI Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b border-border-dark shrink-0 bg-surface-dark/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <span className="material-symbols-outlined">smart_toy</span>
                                <span>AI Assistant</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-dark text-gray-500 hover:text-gray-300 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Chat History */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                                    {msg.role === 'model' && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary text-[14px]">smart_toy</span>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-400">DraftMind AI</span>
                                        </div>
                                    )}
                                    <div className={`p-3 rounded-xl leading-relaxed shadow-sm text-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-primary/10 rounded-tr-none border border-primary/20 text-white max-w-[90%]'
                                        : 'bg-surface-dark rounded-tl-none border border-border-dark text-gray-300'
                                        }`}>
                                        {msg.text}
                                        {msg.role === 'model' && msg.id !== 'init-1' && (
                                            <div className="mt-3 flex gap-2 pt-2 border-t border-white/5">
                                                <button onClick={() => {
                                                    navigator.clipboard.writeText(msg.text);
                                                }} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-border-dark hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">content_copy</span> Copy
                                                </button>
                                                <button onClick={() => {
                                                    if (editor) {
                                                        editor.chain().focus().insertContent(msg.text).run();
                                                    }
                                                }} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-border-dark hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 transition-colors flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">add</span> Insert
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isGenerating && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-primary text-[14px]">smart_toy</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400">DraftMind AI</span>
                                    </div>
                                    <div className="p-3 bg-surface-dark rounded-xl rounded-tl-none border border-border-dark text-sm text-gray-300 w-fit">
                                        <div className="flex gap-1.5 items-center h-4">
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border-dark bg-sidebar-dark shrink-0">
                            <div className="relative group">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full bg-surface-dark border border-border-dark group-focus-within:border-primary/50 group-focus-within:ring-1 group-focus-within:ring-primary/50 rounded-xl p-3 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none resize-none h-24 transition-all"
                                    placeholder="Write, rewrite, or ask anything..."
                                    disabled={isGenerating}
                                ></textarea>
                                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isGenerating}
                                        className={`p-1.5 rounded-lg transition-all shadow-lg ${!inputValue.trim() || isGenerating
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-br from-primary to-orange-600 hover:to-orange-500 text-white shadow-orange-900/20'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 px-1">
                                <span>Powered by DraftMind AI</span>
                                <span>Ctrl+Enter to send</span>
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            {/* Custom Styles for Editor Content */}
            <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #4B5563;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                
                /* Typography enhancements */
                .ProseMirror {
                    min-height: 60vh;
                    outline: none;
                }
                .ProseMirror h1 { font-size: 2.25em; font-weight: 800; margin-top: 0; margin-bottom: 0.5em; line-height: 1.2; color: #fff; }
                .ProseMirror h2 { font-size: 1.75em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; color: #f3f4f6; }
                .ProseMirror h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; color: #e5e7eb; }
                .ProseMirror p { margin-top: 0.75em; margin-bottom: 0.75em; line-height: 1.75; color: #d1d5db; }
                .ProseMirror ul, .ProseMirror ol { padding-left: 1.25em; margin-top: 0.75em; margin-bottom: 0.75em; color: #d1d5db; }
                .ProseMirror ul { list-style-type: disc; }
                .ProseMirror ol { list-style-type: decimal; }
                .ProseMirror blockquote { border-left: 3px solid #f97316; padding-left: 1em; margin-left: 0; margin-right: 0; font-style: italic; color: #9ca3af; }
                .ProseMirror code { background-color: rgba(255,255,255,0.1); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
                .ProseMirror pre { background-color: #1f2937; padding: 1em; border-radius: 8px; overflow-x: auto; color: #e5e7eb; margin: 1em 0; }
                .ProseMirror a { color: #fb923c; text-decoration: underline; cursor: pointer; }
            `}</style>
            {statusMenuOpen && <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)}></div>}
        </div>
    );
};

export default Editor;