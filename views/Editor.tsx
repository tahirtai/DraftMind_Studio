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
import { getDocument, updateDocumentContent, updateDocumentStatus, getDailyAiUsage } from '../lib/database';
import { supabase } from '../lib/supabase';
import { generatePdf, generateDocx, generateHtml, copyToClipboard, shareToWhatsApp, shareViaGmail, shareNative } from '../lib/export';
import { trackEvent } from '../lib/analytics';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const DOC_STATUSES = ['Draft', 'Review', 'Final', 'Published', 'Archived'] as const;

const Editor: React.FC = () => {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 'init-1', role: 'model', text: 'How can I help you refine your draft today? I can generate sections, fix tone, or brainstorm ideas.' }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Resize listener to toggle sidebar on desktop
    useEffect(() => {
        const handleResize = () => {
            // Optional: Only auto-open if scaling UP to desktop, but let's trust user preference for now.
            // Or we can just leave it controlled by the user. 
            // For now, let's remove the auto-forcing to give user full control.
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Document state
    const [docTitle, setDocTitle] = useState('Loading...');
    const [projectName, setProjectName] = useState('');
    const [docStatus, setDocStatus] = useState('Draft');
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [exportLoading, setExportLoading] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [docLoaded, setDocLoaded] = useState(false);
    const docLoadedRef = useRef(false);
    const [wordCount, setWordCount] = useState(0);

    // Refs for autosave to avoid stale closures in cleanup
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const contentRef = useRef<string>('');
    const wordCountRef = useRef(0);
    const isDirtyRef = useRef(false);
    const docIdRef = useRef<string | null>(null);
    const lastRequestTimeRef = useRef<number>(0); // Cooldown tracking
    const [cooldown, setCooldown] = useState(false); // Visual cooldown state

    const [quotaError, setQuotaError] = useState<{ limit: number, reset: string } | null>(null);
    const [usageCount, setUsageCount] = useState(0);
    const DAILY_LIMIT = 25;

    // Sync docId ref
    useEffect(() => {
        docIdRef.current = docId || null;
    }, [docId]);

    // Autosave logic - Immediate
    const saveNow = async () => {
        if (!docIdRef.current || !isDirtyRef.current) return;
        // Guard: only save if initial content load is complete
        if (!docLoadedRef.current) return;

        const content = contentRef.current;
        const wc = wordCountRef.current;

        // Clear pending timer
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        setSaveStatus('saving');
        const { error } = await updateDocumentContent(docIdRef.current, content, wc);

        if (!error) {
            setSaveStatus('saved');
            setLastSaved(new Date());
            isDirtyRef.current = false;
            console.log('[Editor] Content saved successfully');
        } else {
            setSaveStatus('unsaved');
            console.error('[Editor] Autosave failed:', error);
        }
    };

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
            // CRITICAL: Use ref (not state) to avoid stale closure — editor is created once
            if (!docLoadedRef.current) return;
            handleContentChange();
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-invert max-w-none focus:outline-none min-h-[60vh] px-4 md:px-0',
            },
        },
    });

    // Fetched document data — stored in state so the hydration useEffect can react to it
    const [documentData, setDocumentData] = useState<any>(null);

    // Fetch document whenever docId changes
    useEffect(() => {
        if (!docId) return;
        let cancelled = false;

        const fetchDoc = async () => {
            const { data, error } = await getDocument(docId);
            if (cancelled) return;
            if (error || !data) {
                navigate('/dashboard');
                return;
            }
            console.log('[Editor] Content fetched from DB, length:', (data.content || '').length);
            setDocumentData(data);
        };

        // Reset before fetching new doc
        setDocumentData(null);
        setDocLoaded(false);
        docLoadedRef.current = false;

        fetchDoc();
        return () => { cancelled = true; };
    }, [docId]);

    // Hydrate editor when BOTH editor instance AND documentData are available
    useEffect(() => {
        if (!editor || !documentData || docLoadedRef.current) return;

        // Set metadata state
        setDocTitle(documentData.title);
        setProjectName(documentData.projects?.name || 'Unknown');
        setDocStatus(documentData.status || 'Draft');
        setWordCount(documentData.word_count || 0);
        setLastSaved(new Date(documentData.updated_at));

        // Inject content into editor
        const content = documentData.content || '';
        editor.commands.setContent(content, { emitUpdate: false });
        contentRef.current = content;
        wordCountRef.current = documentData.word_count || 0;

        // Mark as loaded — unlocks autosave and onUpdate
        docLoadedRef.current = true;
        setDocLoaded(true);
        console.log('[Editor] Content hydrated into editor');
    }, [editor, documentData]);

    // Fetch Daily Usage (Unmount Safe)
    useEffect(() => {
        let mounted = true;

        const fetchUsage = async () => {
            try {
                const { count, error } = await getDailyAiUsage();
                if (!mounted) return;

                if (error) {
                    console.error('[Editor] Failed to fetch daily usage:', error);
                    return;
                }

                setUsageCount(count || 0);
                if ((count || 0) >= DAILY_LIMIT) {
                    setQuotaError({ limit: DAILY_LIMIT, reset: 'tomorrow' });
                    trackEvent('ai_limit_hit', { source: 'initial_load', count });
                }
            } catch (err) {
                if (mounted) console.error('[Editor] Error checking quota:', err);
            }
        };

        fetchUsage();

        return () => { mounted = false; };
    }, []);


    const handleContentChange = () => {
        if (!editor) return;
        const html = editor.getHTML();
        const text = editor.getText();
        const wc = text.trim() ? text.trim().split(/\s+/).length : 0;

        // Update refs
        contentRef.current = html;
        wordCountRef.current = wc;
        isDirtyRef.current = true;

        setWordCount(wc);
        setSaveStatus('unsaved');

        // Debounce autosave — 1 second (faster than before)
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(saveNow, 1000);
    };

    // Safe Back Navigation
    const handleBack = async () => {
        if (isDirtyRef.current) {
            await saveNow();
        }
        navigate(-1);
    };

    // Save on unmount / navigation
    useEffect(() => {
        return () => {
            // Immediate save on unmount if dirty
            if (isDirtyRef.current && docIdRef.current) {
                // We cannot await here effectively in all browsers, but triggering the promise 
                // gives it a chance to run. For 100% reliability specifically on *tab close*, 
                // we'd need navigator.sendBeacon, but Supabase JS client doesn't expose that easily.
                // For in-app navigation (React Router), this works perfectly.
                updateDocumentContent(docIdRef.current, contentRef.current, wordCountRef.current);
            }
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
    const closeAllMenus = () => {
        setStatusMenuOpen(false);
        setDownloadMenuOpen(false);
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!docId) return;
        setDocStatus(newStatus);
        closeAllMenus();
        const { error } = await updateDocumentStatus(docId, newStatus);
        if (!error) {
            console.log('[Editor] Status updated to:', newStatus);
        } else {
            console.error('[Editor] Status update failed:', error);
        }
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

    const handleDownload = async (format: 'pdf' | 'docx' | 'html') => {
        if (!editor) return;
        const html = editor.getHTML();
        const text = editor.getText().trim();
        if (!text) {
            alert('Nothing to export — document is empty.');
            return;
        }
        const filename = docTitle.replace(/[^a-z0-9]/gi, '_');
        setExportLoading(format);
        setDownloadMenuOpen(false);

        try {
            switch (format) {
                case 'pdf':
                    await generatePdf(html, `${filename}.pdf`);
                    break;
                case 'docx':
                    await generateDocx(html, `${filename}.docx`);
                    break;
                case 'html':
                    generateHtml(html, `${filename}.html`);
                    break;
            }
        } finally {
            setExportLoading(null);
        }
    };

    const handleShare = () => {
        setShareModalOpen(true);
        closeAllMenus();
    };

    const handleCopyLink = async () => {
        const url = window.location.href;
        const success = await copyToClipboard(url);
        if (success) {
            alert('Link copied to clipboard!');
        } else {
            alert('Failed to copy link.');
        }
        setShareModalOpen(false);
    };

    const handleShareWhatsApp = () => {
        shareToWhatsApp({
            title: docTitle,
            url: window.location.href,
        });
        setShareModalOpen(false);
    };

    const handleShareGmail = () => {
        shareViaGmail({
            title: docTitle,
            text: `Check out "${docTitle}" on DraftMind Studio!`,
            url: window.location.href,
        });
        setShareModalOpen(false);
    };

    // AI generation via Supabase Edge Function
    // AI generation via Supabase Edge Function
    const handleSendMessage = async () => {
        // Cooldown Check (2s)
        const now = Date.now();
        if (now - lastRequestTimeRef.current < 2000) {
            setCooldown(true);
            setTimeout(() => setCooldown(false), 2000);
            return;
        }

        if (!inputValue.trim() || isGenerating || quotaError) return;

        // Auth/session guard: avoid invoking Edge Function until session is restored (e.g. after OAuth redirect).
        const [{ data: sessionData }, { data: userData, error: userError }] = await Promise.all([
            supabase.auth.getSession(),
            supabase.auth.getUser(),
        ]);
        if (userError || !sessionData.session?.access_token || !userData.user) {
            console.warn('[Editor] AI invoke skipped: authenticated session is not ready yet');
            return;
        }

        lastRequestTimeRef.current = now;
        const userText = inputValue.trim();
        setInputValue('');
        setIsGenerating(true);

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);

        try {
            const { data, error } = await supabase.functions.invoke('generate-content', {
                body: {
                    document_id: docId || undefined, // Include document_id for traceability
                    messages: [
                        { role: 'system', content: 'You are DraftMind AI, a helpful and concise writing assistant. Keep your responses short and to the point unless asked to generate long content. Avoid unnecessary pleasantries. Focus on the user\'s specific writing needs.' },
                        ...messages.filter(m => m.id !== 'init-1').map(m => ({
                            role: m.role === 'model' ? 'assistant' : 'user',
                            content: m.text
                        })),
                        { role: 'user', content: userText }
                    ]
                }
            });

            if (error) {
                trackEvent('ai_error', { error: error.message });
                // Handle Rate Limit specifically
                // Supabase functions invoke wrapper might obtain 429 as error context or we parse body if data is null
                // Actually handle non-200 via error
                try {
                    // Sometimes error is string, sometimes object. 
                    // If it is a FunctionInvokeError, we might need to parse.
                    // But if our function returned 429 with JSON, invoke() often treats it as error.
                    // Let's check context.

                    const errorBody = error && typeof error === 'object' && 'context' in error
                        ? await (error.context as Response).json()
                        : null;

                    if (errorBody && errorBody.error === 'DAILY_LIMIT_REACHED') {
                        setQuotaError({ limit: errorBody.limit, reset: errorBody.reset });
                        trackEvent('ai_limit_hit', { limit: errorBody.limit });
                        throw new Error(`Daily limit reached (${errorBody.limit} requests/day). Resets ${errorBody.reset}.`);
                    }
                } catch (e) {
                    // ignore parsing error, throw original
                }

                // Fallback for when we can't parse the 429 body easily or it's another error
                throw error;
            }

            trackEvent('ai_generation_success', { model: 'google/gemini-2.0-flash-001' });

            // Check if data itself has error (custom 200 OK with error field?)

            // Check if data itself has error (custom 200 OK with error field?)
            // Our Edge function returns 429 status, so it should be caught in error block above, 
            // OR strictly speaking supabase-js documentation says for 2xx it returns data, for others error.

            // However, verify if 429 comes as data or error. usually
            const responseText = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, aiMsg]);

            // Increment usage count locally with functional update for safety
            setUsageCount(prev => {
                const nextCount = prev + 1;
                if (nextCount >= DAILY_LIMIT) {
                    // Start blocking immediately after this render
                    setQuotaError({ limit: DAILY_LIMIT, reset: 'tomorrow' });
                    trackEvent('ai_limit_hit', { source: 'usage_increment', count: nextCount });
                }
                return nextCount;
            });

        } catch (error: any) {
            console.error('AI error:', error);

            // Attempt to parse validation error from string if possible
            if (error.message && error.message.includes('DAILY_LIMIT_REACHED')) {
                // Already handled above
            }

            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: `Error: ${error.message || 'Failed to generate response.'}` };
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

    if (!editor || !docLoaded) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-dark h-screen gap-3">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="text-text-secondary text-sm animate-pulse">Loading document...</span>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-background-dark">
            {/* Top Header */}
            <header className="h-16 shrink-0 border-b border-border-dark bg-background-dark/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 gap-4">
                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                    <button onClick={handleBack} className="p-2 rounded-lg hover:bg-surface-dark text-gray-400 hover:text-white transition-colors shrink-0">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 group cursor-pointer min-w-0">
                            <h2 className="text-white text-base md:text-lg font-semibold leading-tight tracking-tight truncate">{docTitle}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 truncate">
                            <span className="flex items-center gap-1 shrink-0">
                                <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className="hidden sm:inline">{saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate hidden sm:inline">{projectName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-text-secondary bg-surface-dark px-2 py-1 rounded border border-border-dark hidden lg:inline-block">{wordCount.toLocaleString()} words</span>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Status Selector */}
                        <div className="relative">
                            <button
                                onClick={() => { setDownloadMenuOpen(false); setStatusMenuOpen(!statusMenuOpen); }}
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

                        {/* Download Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setStatusMenuOpen(false); setDownloadMenuOpen(!downloadMenuOpen); }}
                                className="flex items-center justify-center gap-2 h-9 px-3 rounded-lg bg-surface-dark text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-border-dark/50"
                                title="Download"
                            >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span className="material-symbols-outlined text-[14px]">expand_more</span>
                            </button>
                            {downloadMenuOpen && (
                                <div className="absolute right-0 top-10 z-50 w-36 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/40 py-1">
                                    <button onClick={() => handleDownload('pdf')} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> PDF
                                    </button>
                                    <button onClick={() => handleDownload('docx')} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">description</span> Word
                                    </button>
                                    <button onClick={() => handleDownload('html')} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">html</span> HTML
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={handleShare} className="flex items-center justify-center h-9 px-3 rounded-lg bg-surface-dark text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-border-dark/50" title="Share">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                        </button>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-primary text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20 font-medium tracking-wide">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                            <span className="hidden lg:inline">AI Generate</span>
                        </button>
                    </div>

                    {/* Mobile Actions Menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => { setStatusMenuOpen(false); setDownloadMenuOpen(!downloadMenuOpen); }}
                                className="flex items-center justify-center h-9 w-9 rounded-lg bg-surface-dark text-gray-300 border border-border-dark/50"
                            >
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>
                            {downloadMenuOpen && (
                                <div className="absolute right-0 top-10 z-50 w-48 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/40 py-1">
                                    <div className="px-4 py-2 border-b border-border-dark mb-1">
                                        <div className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-2">Status</div>
                                        <div className="flex flex-col gap-1">
                                            {DOC_STATUSES.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(s)}
                                                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${docStatus === s ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${s === 'Draft' ? 'bg-gray-400' : s === 'Review' ? 'bg-yellow-400' : s === 'Final' ? 'bg-green-400' : s === 'Published' ? 'bg-purple-400' : 'bg-red-400'}`}></span>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDownload('pdf')} className="w-full text-left px-4 py-3 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> Download PDF
                                    </button>
                                    <button onClick={() => handleShare()} className="w-full text-left px-4 py-3 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[18px]">share</span> Share
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header >

            <div className="flex flex-1 overflow-hidden">
                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto w-full flex justify-center bg-background-dark relative scroll-smooth">
                    <div className="w-full max-w-[900px] min-h-[calc(100vh-4rem)] py-12 px-8 md:px-16 bg-background-dark">

                        {/* Fixed Toolbar */}
                        <div className="sticky top-20 z-10 mx-auto w-fit flex items-center gap-1 p-1 mb-8 bg-surface-dark/90 backdrop-blur border border-border-dark rounded-xl shadow-lg shadow-black/20 transform transition-all hover:scale-[1.02] flex-wrap justify-center">
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
                {/* Backdrop for mobile */}
                {sidebarOpen && <div className="fixed inset-x-0 top-16 bottom-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

                {/* Sidebar container */}
                <aside className={`
                    fixed right-0 z-40 w-80 lg:relative lg:shadow-none transition-transform duration-300 transform 
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                    bg-sidebar-dark border-l border-border-dark flex flex-col shrink-0 shadow-2xl
                    top-16 bottom-0 lg:top-auto lg:bottom-auto lg:h-full
                `}>
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
                                                    trackEvent('document_generated', { action: 'insert' });
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
                        {/* Quota Indicator */}
                        {!quotaError && (
                            <div className="mb-3 px-1 flex items-center justify-between text-xs">
                                <span className="text-gray-400">Daily Quota</span>
                                <span className={`font-medium ${usageCount >= 20 ? 'text-orange-400' : 'text-primary'}`}>
                                    {usageCount} / {DAILY_LIMIT} free requests
                                </span>
                            </div>
                        )}
                        {/* Progress Bar for Quota */}
                        {!quotaError && (
                            <div className="mb-4 h-1 bg-surface-dark rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full transition-all duration-500 ${usageCount >= 20 ? 'bg-orange-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min((usageCount / DAILY_LIMIT) * 100, 100)}%` }}
                                ></div>
                            </div>
                        )}

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
                                    disabled={!inputValue.trim() || isGenerating || !!quotaError || cooldown}
                                    className={`p-1.5 rounded-lg transition-all shadow-lg ${!inputValue.trim() || isGenerating || !!quotaError || cooldown
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-br from-primary to-orange-600 hover:to-orange-500 text-white shadow-orange-900/20'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                        {quotaError && (
                            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[16px]">lock</span>
                                    Daily Limit Reached
                                </div>
                                <p className="text-gray-400 text-xs">
                                    You've used all {quotaError.limit} free requests for today. Resets {quotaError.reset}.
                                </p>
                                <button
                                    onClick={() => trackEvent('upgrade_clicked', { source: 'quota_error' })}
                                    className="mt-2 w-full py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded text-xs font-medium transition-colors"
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        )}
                        {!quotaError && (
                            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500 px-1">
                                <span>Powered by DraftMind AI</span>
                                <span>Ctrl+Enter to send</span>
                            </div>
                        )}
                    </div>
                </aside>

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
            {downloadMenuOpen && <div className="fixed inset-0 z-10" onClick={() => setDownloadMenuOpen(false)}></div>}

            {/* Share Modal */}
            {shareModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShareModalOpen(false)}></div>
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface-dark border border-border-dark rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-border-dark flex items-center justify-between">
                            <h3 className="text-white font-semibold text-base">Share Document</h3>
                            <button onClick={() => setShareModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm">
                                <span className="material-symbols-outlined text-[20px] text-blue-400">content_copy</span>
                                Copy Link
                            </button>
                            <button onClick={handleShareWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                Share to WhatsApp
                            </button>
                            <button onClick={handleShareGmail} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm">
                                <span className="material-symbols-outlined text-[20px] text-red-400">mail</span>
                                Share via Gmail
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

export default Editor;
