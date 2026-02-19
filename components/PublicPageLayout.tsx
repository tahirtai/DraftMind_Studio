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
    { label: 'About', path: '/about' },
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
                        <button onClick={() => navigate('/login')} className="login-btn-animated group relative flex items-center gap-2 cursor-pointer rounded-xl h-10 px-6 text-white text-sm font-bold leading-normal tracking-wide transition-all duration-300 hover:scale-105">
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:rotate-[360deg]">login</span>
                                Login
                            </span>
                        </button>
                        <button onClick={() => navigate('/signup')} className="flex items-center gap-2 cursor-pointer overflow-hidden rounded-xl h-10 px-6 bg-gradient-to-r from-primary to-orange-500 text-white text-sm font-bold leading-normal tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.03] transition-all duration-300">
                            <span>Start Free</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
                            <p className="text-sm text-text-secondary leading-relaxed mb-4">AI-powered writing workspace for creators, students, and professionals.</p>
                            <a href="mailto:tahirtai147@gmail.com" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                tahirtai147@gmail.com
                            </a>
                            {/* Social Icons */}
                            <div className="flex items-center gap-3 mt-5">
                                <a href="https://linkedin.com/in/tahirtai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                                <a href="#" aria-label="X (Twitter)" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-black hover:border-white/30 transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </a>
                                <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                </a>
                            </div>
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
                            <button onClick={() => navigate('/privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
                            <button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Terms of Service</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicPageLayout;
