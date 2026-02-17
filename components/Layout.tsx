import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="h-screen w-full bg-background-dark text-text-primary flex overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar with Mobile State */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-dark w-full">
                {/* Mobile Header */}
                <div className="md:hidden h-14 border-b border-border-dark flex items-center px-4 shrink-0 bg-background-dark">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-sm ml-2">DraftMind Studio</span>
                </div>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
