import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProject, getDocuments, createDocument, renameDocument, deleteDocument, updateDocumentStatus } from '../lib/database';
import { generateZip, shareContent } from '../lib/export';

const DOC_STATUSES = ['Draft', 'Review', 'Final', 'Published', 'Archived'] as const;

const ProjectDetails: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [statusMenuFor, setStatusMenuFor] = useState<string | null>(null);
    const [downloadMenuFor, setDownloadMenuFor] = useState<string | null>(null);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        const [projResult, docsResult] = await Promise.all([
            getProject(id!),
            getDocuments(id!),
        ]);
        setProject(projResult.data);
        setDocuments(docsResult.data ?? []);
        setLoading(false);
    };

    const handleCreateDocument = async () => {
        const title = prompt('Enter document title:');
        if (!title) return;
        const { data } = await createDocument(id!, title);
        if (data) {
            navigate(`/editor/${data.id}`);
        }
    };

    const handleRename = async (docId: string, currentTitle: string) => {
        const newTitle = prompt('Rename document:', currentTitle);
        if (!newTitle || newTitle === currentTitle) return;
        await renameDocument(docId, newTitle);
        setDocuments(prev => prev.map(d => d.id === docId ? { ...d, title: newTitle } : d));
        setMenuOpen(null);
    };

    const handleDelete = async (docId: string) => {
        if (!confirm('Delete this document?')) return;
        await deleteDocument(docId);
        setDocuments(prev => prev.filter(d => d.id !== docId));
        setMenuOpen(null);
    };

    const handleStatusChange = async (docId: string, newStatus: string) => {
        await updateDocumentStatus(docId, newStatus);
        setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
        setStatusMenuFor(null);
        setMenuOpen(null);
    };

    const handleDownloadProject = async () => {
        if (!documents.length) {
            alert('No documents to download.');
            return;
        }
        await generateZip(
            documents.map(d => ({ title: d.title, content: d.content || '' })),
            `${project.name.replace(/[^a-z0-9]/gi, '_')}_archive.zip`
        );
    };

    const handleShareProject = async () => {
        const url = window.location.href;
        await shareContent({
            title: project.name,
            text: `Check out my project "${project.name}" on DraftMind Studio!`,
            url: url
        });
    };

    const handleDownloadDoc = async (doc: any, format: 'pdf' | 'docx' | 'html') => {
        const filename = doc.title.replace(/[^a-z0-9]/gi, '_');
        // Dynamic import to avoid SSR issues if any, though here it's SPA
        const { generatePdf, generateDocx, generateHtml } = await import('../lib/export');

        switch (format) {
            case 'pdf':
                await generatePdf(doc.content || '', `${filename}.pdf`);
                break;
            case 'docx':
                await generateDocx(doc.content || '', `${filename}.docx`);
                break;
            case 'html':
                generateHtml(doc.content || '', `${filename}.html`);
                break;
        }
        setDownloadMenuFor(null);
        setMenuOpen(null);
    };

    const handleShareDoc = async (doc: any) => {
        const url = `${window.location.origin}/editor/${doc.id}`;
        await shareContent({
            title: doc.title,
            text: `Check out "${doc.title}" on DraftMind Studio!`,
            url: url,
        });
        setMenuOpen(null);
    };

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-gray-800 text-gray-300 border-gray-700';
            case 'Review': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50';
            case 'Final': return 'bg-green-900/30 text-green-400 border-green-800/50';
            case 'Published': return 'bg-purple-900/30 text-purple-400 border-purple-800/50';
            case 'Archived': return 'bg-red-900/30 text-red-400 border-red-700/50';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const statusDot = (s: string) => {
        switch (s) {
            case 'Draft': return 'bg-gray-400';
            case 'Review': return 'bg-yellow-400';
            case 'Final': return 'bg-green-400';
            case 'Published': return 'bg-purple-400';
            case 'Archived': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-5xl text-text-secondary">folder_off</span>
                <p className="text-text-secondary">Project not found</p>
                <button onClick={() => navigate('/projects')} className="text-primary hover:underline text-sm">Back to Projects</button>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button onClick={() => navigate('/projects')} className="text-text-secondary flex items-center gap-1 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                        Projects
                    </button>
                    <span className="text-text-secondary/50 material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-text-primary font-medium bg-white/10 px-2 py-0.5 rounded text-xs">{project.name}</span>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-dark pb-6">
                    <div className="flex flex-col gap-2 max-w-2xl">
                        <h1 className="text-text-primary text-3xl md:text-4xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-text-secondary text-base font-normal leading-relaxed">
                            {project.description || `${project.type} project`} • <span className="text-primary font-medium">{documents.length} documents</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button onClick={handleShareProject} className="flex items-center justify-center h-10 px-4 rounded-lg bg-surface-dark text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-border-dark/50" title="Share Project">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                        </button>
                        <button onClick={handleDownloadProject} className="flex items-center justify-center h-10 px-4 rounded-lg bg-surface-dark text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border border-border-dark/50" title="Download Project (ZIP)">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                        <button onClick={handleCreateDocument} className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="whitespace-nowrap">New Document</span>
                        </button>
                    </div>
                </div>

                {/* Documents Table */}
                {documents.length === 0 ? (
                    <div className="bg-surface-dark rounded-xl p-10 border border-border-dark text-center">
                        <span className="material-symbols-outlined text-4xl text-text-secondary mb-3 block">description</span>
                        <p className="text-text-secondary mb-4">No documents yet. Create your first document to start writing.</p>
                        <button onClick={handleCreateDocument} className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Create First Document
                        </button>
                    </div>
                ) : (
                    <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-dark bg-black/20 text-xs uppercase tracking-wider text-text-secondary font-semibold">
                                        <th className="px-6 py-4 w-[35%]">Title</th>
                                        <th className="px-6 py-4 w-[12%]">Status</th>
                                        <th className="px-6 py-4 w-[12%]">Words</th>
                                        <th className="px-6 py-4 w-[15%]">Author</th>
                                        <th className="px-6 py-4 w-[16%]">Last Edited</th>
                                        <th className="px-6 py-4 w-[10%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark text-sm">
                                    {documents.map((doc) => {
                                        const authorName = doc.profiles?.full_name || 'Unknown';
                                        const authorAvatar = doc.profiles?.avatar_url;
                                        return (
                                            <tr key={doc.id} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate(`/editor/${doc.id}`)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-900/20 text-blue-400">
                                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                                        </div>
                                                        <span className="font-medium text-text-primary group-hover:text-primary transition-colors">{doc.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(doc.status)}`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary">{(doc.word_count || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold border border-primary/20 shrink-0">
                                                            {authorAvatar ? (
                                                                <img src={authorAvatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                                                            ) : (
                                                                authorName.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <span className="text-text-secondary text-xs truncate">{authorName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary">{formatTimeAgo(doc.updated_at)}</td>
                                                <td className="px-6 py-4 text-right relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const spaceBelow = window.innerHeight - rect.bottom;
                                                            if (spaceBelow < 280) {
                                                                setMenuStyle({ bottom: window.innerHeight - rect.top + 5, right: window.innerWidth - rect.right });
                                                            } else {
                                                                setMenuStyle({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
                                                            }
                                                            setMenuOpen(menuOpen === doc.id ? null : doc.id);
                                                            setStatusMenuFor(null);
                                                            setDownloadMenuFor(null);
                                                        }}
                                                        className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-700 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                                    </button>

                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Action Menu */}
            {menuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => { setMenuOpen(null); setStatusMenuFor(null); setDownloadMenuFor(null); }}></div>
                    <div
                        className="fixed z-50 w-44 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/60 py-1"
                        style={menuStyle}
                    >
                        {(() => {
                            const doc = documents.find(d => d.id === menuOpen);
                            if (!doc) return null;
                            return (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); handleRename(doc.id, doc.title); }} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">edit</span> Rename
                                    </button>
                                    {/* Change Status submenu */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setStatusMenuFor(statusMenuFor === doc.id ? null : doc.id); }}
                                            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2 justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Status
                                            </div>
                                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                        </button>
                                        {statusMenuFor === doc.id && (
                                            <div className="absolute right-full top-0 mr-1 z-50 w-40 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/40 py-1">
                                                {DOC_STATUSES.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(doc.id, s); }}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${doc.status === s ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                                                    >
                                                        <span className={`w-2 h-2 rounded-full ${statusDot(s)}`}></span>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <hr className="border-border-dark my-1" />
                                    {/* Download submenu */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDownloadMenuFor(downloadMenuFor === doc.id ? null : doc.id); }}
                                            className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2 justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">download</span> Download
                                            </div>
                                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                        </button>
                                        {downloadMenuFor === doc.id && (
                                            <div className="absolute right-full top-0 mr-1 z-50 w-32 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/40 py-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleDownloadDoc(doc, 'pdf'); }} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5">PDF</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDownloadDoc(doc, 'docx'); }} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5">Word</button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDownloadDoc(doc, 'html'); }} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5">HTML</button>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); handleShareDoc(doc); }} className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">share</span> Share
                                    </button>
                                    <hr className="border-border-dark my-1" />
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectDetails;
