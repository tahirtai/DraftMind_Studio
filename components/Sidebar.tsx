import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, getDocument } from '../lib/database';

interface SidebarProps {
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, signOut } = useAuth();
    const [recentProjects, setRecentProjects] = useState<any[]>([]);
    const [favoriteProjects, setFavoriteProjects] = useState<any[]>([]);
    const [activeProject, setActiveProject] = useState<any>(null);
    const [allProjects, setAllProjects] = useState<any[]>([]);

    useEffect(() => {
        loadProjects();
    }, []);

    // Detect active project from URL
    useEffect(() => {
        detectActiveProject();
    }, [location.pathname, allProjects]);

    const loadProjects = async () => {
        const { data } = await getProjects();
        if (data) {
            setAllProjects(data);
            setFavoriteProjects(data.filter(p => p.is_favorite).slice(0, 3));
        }
    };

    const detectActiveProject = async () => {
        const path = location.pathname;

        // Check if we're on a project detail page: /projects/:id
        const projectMatch = path.match(/^\/projects\/([^/]+)$/);
        if (projectMatch) {
            const projectId = projectMatch[1];
            const found = allProjects.find(p => p.id === projectId);
            if (found) {
                setActiveProject(found);
                return;
            }
        }

        // Check if we're on an editor page: /editor/:docId
        const editorMatch = path.match(/^\/editor\/([^/]+)$/);
        if (editorMatch) {
            const docId = editorMatch[1];
            try {
                const { data } = await getDocument(docId);
                if (data) {
                    const found = allProjects.find(p => p.id === data.project_id);
                    if (found) {
                        setActiveProject(found);
                        return;
                    }
                }
            } catch { }
        }

        // If not on a project/editor page, show the most recently updated one
        if (allProjects.length > 0 && !activeProject) {
            setActiveProject(allProjects[0]);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const displayEmail = user?.email || '';
    const displayPlan = profile?.plan || 'Free';

    return (
        <aside className="w-64 bg-sidebar-dark border-r border-border-dark flex flex-col justify-between h-full shrink-0 transition-all duration-300 md:flex">
            <div className="flex flex-col gap-6 p-6 overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                        <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-text-primary text-sm font-bold leading-none tracking-tight truncate">DraftMind Studio</h1>
                        <p className="text-text-secondary text-xs font-medium mt-1 truncate">{displayPlan} Plan</p>
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="flex flex-col gap-1">
                    <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left group ${isActive ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">home</span>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/projects" end onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left group ${isActive ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">folder_open</span>
                        <span>All Projects</span>
                    </NavLink>
                    <NavLink to="/analytics" onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left group ${isActive ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">bar_chart</span>
                        <span>Analytics</span>
                    </NavLink>

                    {/* Active Project */}
                    {activeProject && (
                        <>
                            <div className="mt-4 mb-2 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Project</div>
                            <NavLink to={`/projects/${activeProject.id}`} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors border w-full text-left ${isActive || location.pathname.includes(`/projects/${activeProject.id}`) ? 'bg-primary/20 text-primary border-primary/20' : 'text-text-secondary border-transparent hover:text-white hover:bg-white/5'}`}>
                                <span className="material-symbols-outlined text-[20px] filled">folder</span>
                                <span className="text-sm truncate">{activeProject.name}</span>
                            </NavLink>
                        </>
                    )}

                    {/* Favorites */}
                    {favoriteProjects.length > 0 && (
                        <>
                            <div className="mt-4 mb-2 px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Favorites</div>
                            {favoriteProjects.map((p, i) => (
                                <NavLink key={p.id} to={`/projects/${p.id}`} onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${['bg-purple-500', 'bg-orange-400', 'bg-blue-400'][i % 3]}`}></div>
                                    <span className="text-sm font-medium truncate">{p.name}</span>
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>
            </div>

            {/* Bottom Nav */}
            <div className="flex flex-col gap-2 p-4 border-t border-border-dark bg-background-dark/30">
                <NavLink to="/settings" onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${isActive ? 'text-white bg-white/5' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span>Settings</span>
                </NavLink>
                <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm w-full text-left">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>Sign Out</span>
                </button>

                <button onClick={() => { navigate('/projects'); if (onClose) onClose(); }} className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-primary/20 transition-all mt-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>New Project</span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 mt-2 rounded-xl bg-surface-dark border border-border-dark cursor-pointer hover:bg-white/5 transition-colors" onClick={() => { navigate('/settings'); if (onClose) onClose(); }}>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold border border-primary/20">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">{displayName}</p>
                        <p className="text-[10px] text-text-secondary truncate">{displayEmail}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;