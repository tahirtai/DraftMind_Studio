import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, renameProject, deleteProject, toggleFavorite, updateProjectStatus, getDocuments } from '../lib/database';
import { generateZip, shareContent } from '../lib/export';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const PROJ_STATUSES = ['Draft', 'Review', 'Final', 'Idea', 'Published', 'Archived'] as const;

const Projects: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [statusMenuFor, setStatusMenuFor] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; name: string }>({ open: false, id: null, name: '' });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        const { data } = await getProjects();
        setProjects(data ?? []);
        setLoading(false);
    };

    const handleCreate = async () => {
        const name = prompt('Enter project name:');
        if (!name) return;
        const { data } = await createProject(name);
        if (data) {
            setProjects(prev => [data, ...prev]);
        }
    };

    const handleRename = async (id: string, currentName: string) => {
        const newName = prompt('Rename project:', currentName);
        if (!newName || newName === currentName) return;
        await renameProject(id, newName);
        setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
        setMenuOpen(null);
    };

    const confirmDelete = async (id: string) => { // Renamed from handleDelete to confirmDelete (action-wise) or keep handleDelete as the opener
        // This opens the modal
        setDeleteModal({ open: true, id, name: projects.find(p => p.id === id)?.name || 'Project' });
        setMenuOpen(null);
    };

    const executeDelete = async () => {
        if (!deleteModal.id) return;
        await deleteProject(deleteModal.id);
        setProjects(prev => prev.filter(p => p.id !== deleteModal.id));
        setDeleteModal({ open: false, id: null, name: '' });
    };

    const handleToggleFavorite = async (id: string, current: boolean) => {
        await toggleFavorite(id, !current);
        setProjects(prev => prev.map(p => p.id === id ? { ...p, is_favorite: !current } : p));
        setMenuOpen(null);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateProjectStatus(id, newStatus);
        setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setStatusMenuFor(null);
        setMenuOpen(null);
    };

    const handleDownloadProject = async (project: any) => {
        // We need to fetch documents for this project first
        // If we don't have them in state, we must fetch
        // Assuming getDocuments returns { data }
        const { data: docs } = await getDocuments(project.id);
        if (!docs || docs.length === 0) {
            alert('No documents to download in this project.');
            return;
        }

        await generateZip(
            docs.map((d: any) => ({ title: d.title, content: d.content || '' })),
            `${project.name.replace(/[^a-z0-9]/gi, '_')}_archive.zip`
        );
        setMenuOpen(null);
    };

    const handleShareProject = async (project: any) => {
        const url = `${window.location.origin}/projects/${project.id}`;
        await shareContent({
            title: project.name,
            text: `Check out my project "${project.name}" on DraftMind Studio!`,
            url: url
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
            case 'Idea': return 'bg-blue-900/30 text-blue-400 border-blue-800/50';
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
            case 'Idea': return 'bg-blue-400';
            case 'Archived': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    const typeIcons: Record<string, { icon: string; color: string; bg: string }> = {
        blog: { icon: 'article', color: 'text-blue-400', bg: 'bg-blue-900/20' },
        email: { icon: 'mail', color: 'text-green-400', bg: 'bg-green-900/20' },
        social: { icon: 'post_add', color: 'text-purple-400', bg: 'bg-purple-900/20' },
        landing: { icon: 'web', color: 'text-orange-400', bg: 'bg-orange-900/20' },
        video: { icon: 'mic', color: 'text-pink-400', bg: 'bg-pink-900/20' },
    };

    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.status === filter);

    return (
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">domain</span>
                        Workspace
                    </span>
                    <span className="text-text-secondary/50 material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-text-primary font-medium bg-white/10 px-2 py-0.5 rounded text-xs">All Projects</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-dark pb-6">
                    <div className="flex flex-col gap-2 max-w-2xl">
                        <h1 className="text-text-primary text-3xl md:text-4xl font-bold tracking-tight">All Projects</h1>
                        <p className="text-text-secondary text-base font-normal leading-relaxed">
                            Manage all your projects. Use the <span className="text-primary font-medium">DraftMind Assistant</span> for new ideas.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button onClick={handleCreate} className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span className="whitespace-nowrap">New Project</span>
                        </button>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    {['All', 'Draft', 'Idea', 'Review', 'Final', 'Published', 'Archived'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary/20 text-primary border border-primary/20' : 'text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="bg-surface-dark rounded-xl p-10 border border-border-dark text-center">
                        <span className="material-symbols-outlined text-4xl text-text-secondary mb-3 block">folder_off</span>
                        <p className="text-text-secondary mb-4">{filter === 'All' ? 'No projects yet.' : `No ${filter} projects.`}</p>
                        {filter === 'All' && (
                            <button onClick={handleCreate} className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Create First Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-dark bg-black/20 text-xs uppercase tracking-wider text-text-secondary font-semibold">
                                        <th className="px-6 py-4 w-[40%]">Name</th>
                                        <th className="px-6 py-4 w-[12%]">Type</th>
                                        <th className="px-6 py-4 w-[15%]">Status</th>
                                        <th className="px-6 py-4 w-[20%]">Last Edited</th>
                                        <th className="px-6 py-4 w-[13%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark text-sm">
                                    {filteredProjects.map((project) => {
                                        const t = typeIcons[project.type] || typeIcons.blog;
                                        return (
                                            <tr key={project.id} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${t.bg} ${t.color}`}>
                                                            <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-text-primary hover:text-primary transition-colors">{project.name}</span>
                                                                {project.is_favorite && <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>}
                                                            </div>
                                                            <span className="text-xs text-text-secondary truncate max-w-[200px]">{project.description || `${project.type} project`}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary capitalize">{project.type}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(project.status)}`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary">{formatTimeAgo(project.updated_at)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const spaceBelow = window.innerHeight - rect.bottom;
                                                            if (spaceBelow < 280) { // Open upwards
                                                                setMenuStyle({ bottom: window.innerHeight - rect.top + 5, right: window.innerWidth - rect.right });
                                                            } else {
                                                                setMenuStyle({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
                                                            }
                                                            if (menuOpen === project.id) {
                                                                setMenuOpen(null);
                                                            } else {
                                                                setMenuOpen(project.id);
                                                            }
                                                            setStatusMenuFor(null);
                                                        }}
                                                        className={`p-1.5 rounded-md transition-all ${menuOpen === project.id ? 'text-text-primary bg-gray-700 opacity-100' : 'text-text-secondary hover:text-text-primary hover:bg-gray-700 opacity-100 md:opacity-0 group-hover:opacity-100'}`}
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

            {/* Fixed Menu Overlay */}
            {menuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => { setMenuOpen(null); setStatusMenuFor(null); }}></div>
                    <div
                        className="fixed z-50 w-48 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/60 py-1 slide-in-from-top-2 animate-in fade-in zoom-in-95 duration-100"
                        style={menuStyle}
                    >
                        {(() => {
                            const project = projects.find(p => p.id === menuOpen);
                            if (!project) return null;

                            return (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }} className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">open_in_new</span> Open
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDownloadProject(project); }} className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">download</span> Download ZIP
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleShareProject(project); }} className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">share</span> Share
                                    </button>
                                    <div className="h-px bg-border-dark my-1"></div>
                                    <button onClick={(e) => { e.stopPropagation(); handleRename(project.id, project.name); }} className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">edit</span> Rename
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(project.id, project.is_favorite); }} className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">{project.is_favorite ? 'star' : 'star_border'}</span> {project.is_favorite ? 'Unfavorite' : 'Favorite'}
                                    </button>

                                    {/* Status Submenu */}
                                    <div className="relative group/status">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setStatusMenuFor(statusMenuFor === project.id ? null : project.id); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px]">swap_horiz</span> Status
                                            </div>
                                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                        </button>

                                        {statusMenuFor === project.id && (
                                            <div className="absolute right-full top-0 mr-1 z-50 w-40 bg-surface-dark border border-border-dark rounded-lg shadow-xl shadow-black/60 py-1">
                                                {PROJ_STATUSES.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(project.id, s); }}
                                                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${project.status === s ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                                    >
                                                        <span className={`w-2 h-2 rounded-full ${statusDot(s)}`}></span>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-px bg-border-dark my-1"></div>
                                    <button onClick={(e) => { e.stopPropagation(); confirmDelete(project.id); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </>
            )}
            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                onConfirm={executeDelete}
                itemName={deleteModal.name}
                itemType="project"
            />
        </div>
    );
};

export default Projects;