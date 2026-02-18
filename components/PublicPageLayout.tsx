import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface PublicPageLayoutProps {
    children: React.ReactNode;
    jsonLd?: object;
}

const NAV_LINKS = [
    { label: 'Features', path: '/features' },
    { label: 'AI Writer', path: '/ai-writing-tool' },
    { label: 'Templates', path: '/templates' },
    { label: 'Blog', path: '/blog' },
    { label: 'Pricing', path: '/pricing' },
];

const FOOTER_LINKS = {
    product: [
        { label: 'Features', path: '/features' },
        { label: 'AI Writing Tool', path: '/ai-writing-tool' },
        { label: 'AI Writer', path: '/ai-writer' },
        { label: 'Templates', path: '/templates' },
        { label: 'Pricing', path: '/pricing' },
    ],
    useCases: [
        { label: 'For Students', path: '/ai-writer-for-students' },
        { label: 'For Bloggers', path: '/ai-writer-for-bloggers' },
        { label: 'For Marketers', path: '/ai-writer-for-marketers' },
        { label: 'For Content Creators', path: '/ai-writer-for-content-creators' },
    ],
    resources: [
        { label: 'Blog', path: '/blog' },
        { label: 'Use Cases', path: '/use-cases' },
        { label: 'About', path: '/about' },
    ],
};

const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children, jsonLd }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background-dark text-text-primary font-sans selection:bg-primary/30">
            {/* JSON-LD */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="cursor-pointer" onClick={() => navigate('/')}>
                        <Logo />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-7">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/login')} className="text-sm font-medium text-white hover:text-primary transition-colors">Login</button>
                        <button onClick={() => navigate('/signup')} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-orange-600 hover:scale-105 active:scale-95">
                            Start Free
                        </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-white hover:text-primary transition-colors">Login</button>
                        <button className="p-2 text-text-secondary hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-surface-dark border-b border-border-dark p-4 flex flex-col gap-2 md:hidden shadow-2xl z-50">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.path}
                                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                                className={`text-left px-4 py-3 rounded-lg hover:bg-white/5 font-medium ${isActive(link.path) ? 'text-primary' : 'text-text-primary'}`}
                            >
                                {link.label}
                            </button>
                        ))}
                        <hr className="border-border-dark" />
                        <button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} className="text-center w-full py-3 rounded-lg bg-primary text-white font-bold shadow-lg">Start Free</button>
                    </div>
                )}
            </header>

            {/* Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="w-full border-t border-border-dark bg-surface-dark/50 px-4 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="cursor-pointer mb-4" onClick={() => navigate('/')}>
                                <Logo />
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">AI-powered writing workspace for creators, students, and professionals.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
                            <ul className="space-y-2">
                                {FOOTER_LINKS.product.map(link => (
                                    <li key={link.path}><button onClick={() => navigate(link.path)} className="text-sm text-text-secondary hover:text-primary transition-colors">{link.label}</button></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Use Cases</h4>
                            <ul className="space-y-2">
                                {FOOTER_LINKS.useCases.map(link => (
                                    <li key={link.path}><button onClick={() => navigate(link.path)} className="text-sm text-text-secondary hover:text-primary transition-colors">{link.label}</button></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {FOOTER_LINKS.resources.map(link => (
                                    <li key={link.path}><button onClick={() => navigate(link.path)} className="text-sm text-text-secondary hover:text-primary transition-colors">{link.label}</button></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-text-secondary">© 2026 DraftMind Studio. All rights reserved.</p>
                        <div className="flex gap-6 text-sm text-text-secondary">
                            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicPageLayout;
