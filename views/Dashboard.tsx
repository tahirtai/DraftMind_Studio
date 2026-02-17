import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats, getRecentDocuments, getProjects, createProject } from '../lib/database';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [stats, setStats] = useState({ projectCount: 0, documentCount: 0, totalWords: 0, aiQueries: 0 });
    const [recentDocs, setRecentDocs] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', dateOptions);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [statsData, docsResult, projectsResult] = await Promise.all([
            getDashboardStats(),
            getRecentDocuments(5),
            getProjects(),
        ]);
        setStats(statsData);
        setRecentDocs(docsResult.data ?? []);
        setProjects((projectsResult.data ?? []).slice(0, 3));
        setLoading(false);
    };

    const handleNewProject = async () => {
        const name = prompt('Enter project name:');
        if (!name) return;
        const { data } = await createProject(name);
        if (data) {
            navigate(`/projects/${data.id}`);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-yellow-900/30 text-yellow-500 border-yellow-900/40';
            case 'Review': return 'bg-green-900/30 text-green-500 border-green-900/40';
            case 'Final': return 'bg-blue-900/30 text-blue-400 border-blue-900/40';
            case 'Published': return 'bg-purple-900/30 text-purple-400 border-purple-900/40';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const projectIcons = ['campaign', 'article', 'rocket_launch', 'edit_note', 'description'];
    const projectColors = ['text-primary', 'text-emerald-500', 'text-orange-400', 'text-blue-400', 'text-purple-400'];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-dark">
            <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-background-dark border-b border-border-dark shrink-0 z-10">
                <div className="flex items-center gap-4 text-sm text-text-secondary hidden md:flex">
                    <span className="text-xs font-medium bg-surface-dark px-2 py-1 rounded border border-border-dark shadow-sm">
                        Today is <span className="text-text-primary font-semibold">{formattedDate}</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 md:flex-none">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </span>
                        <input className="pl-10 pr-4 py-2 text-sm bg-surface-dark text-text-primary border-none ring-1 ring-border-dark rounded-lg focus:ring-2 focus:ring-primary w-full md:w-64 transition-all placeholder-gray-500" placeholder="Search..." type="text" />
                    </div>
                    <button className="relative p-2 text-text-secondary hover:bg-surface-dark rounded-lg transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-2">
                <div className="max-w-6xl mx-auto flex flex-col gap-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-2 border-b border-border-dark mt-4 md:mt-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Dashboard</h2>
                            <p className="text-sm md:text-base text-text-secondary">Welcome back, {profile?.full_name || 'there'}. Here's what's happening in your workspace.</p>
                        </div>
                        <button onClick={handleNewProject} className="flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 font-medium border border-transparent hover:border-orange-400/30 w-full md:w-auto">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            New Project
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Projects Section */}
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">folder_copy</span>
                                        Your Projects
                                    </h3>
                                    <button onClick={() => navigate('/projects')} className="text-sm font-medium text-primary hover:text-orange-400 hover:underline">View all</button>
                                </div>
                                {projects.length === 0 ? (
                                    <div className="bg-surface-dark rounded-xl p-10 border border-border-dark text-center">
                                        <span className="material-symbols-outlined text-4xl text-text-secondary mb-3 block">folder_off</span>
                                        <p className="text-text-secondary mb-4">No projects yet. Create your first project to get started!</p>
                                        <button onClick={handleNewProject} className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Create First Project
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {projects.map((project, idx) => (
                                            <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="group bg-surface-dark rounded-xl p-5 border border-border-dark hover:shadow-lg hover:shadow-black/40 hover:border-primary/50 transition-all duration-300 relative cursor-pointer">
                                                <div className="w-12 h-12 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center mb-4">
                                                    <span className={`material-symbols-outlined ${projectColors[idx % projectColors.length]}`}>{projectIcons[idx % projectIcons.length]}</span>
                                                </div>
                                                <h4 className="text-base font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">{project.name}</h4>
                                                <p className="text-sm text-text-secondary mb-4">{project.description || `${project.type} project`}</p>
                                                <div className="flex items-center justify-between text-xs text-text-secondary border-t border-border-dark pt-3">
                                                    <span>{formatTimeAgo(project.updated_at)}</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColor(project.status)}`}>{project.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Recent Documents */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">history</span>
                                        Recent Documents
                                    </h3>
                                </div>
                                <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-sm">
                                    {recentDocs.length === 0 ? (
                                        <div className="p-8 text-center text-text-secondary">
                                            <span className="material-symbols-outlined text-3xl mb-2 block">description</span>
                                            <p>No documents yet. Create a project and add your first document.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border-dark">
                                            {recentDocs.map((doc) => (
                                                <div key={doc.id} onClick={() => navigate(`/editor/${doc.id}`)} className="group flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded bg-blue-900/20 text-blue-400 flex items-center justify-center border border-blue-900/30">
                                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{doc.title}</h4>
                                                            <p className="text-xs text-text-secondary">{doc.projects?.name || 'Unknown'} • Edited {formatTimeAgo(doc.updated_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColor(doc.status)}`}>{doc.status}</span>
                                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-300 transition-all">
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Stats & CTA */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                                <div className="bg-gradient-to-br from-primary to-orange-600 rounded-xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden group cursor-pointer border border-primary/20">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg mb-2">Try AI Assistant</h3>
                                        <p className="text-orange-100 text-sm mb-4 max-w-sm">Generate blog posts, social media captions, and more in seconds with our new AI model.</p>
                                        <button onClick={(e) => { e.stopPropagation(); navigate('/projects'); }} className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">Start Writing</button>
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[120px]">auto_awesome</span>
                                    </div>
                                </div>
                                <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col justify-center items-start">
                                    <h3 className="font-bold text-lg text-text-primary mb-2">Workspace Stats</h3>
                                    <div className="flex flex-wrap gap-8 mt-2">
                                        <div>
                                            <p className="text-3xl font-bold text-text-primary">{stats.projectCount}</p>
                                            <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mt-1">Active Projects</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-text-primary">{stats.documentCount}</p>
                                            <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mt-1">Documents</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-text-primary">{stats.totalWords.toLocaleString()}</p>
                                            <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mt-1">Words Written</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;