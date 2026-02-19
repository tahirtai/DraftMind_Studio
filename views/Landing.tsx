import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

/* ─── Hooks ─── */

/** Count from 0 to `end` when visible, with optional suffix ('+', '★' etc.) */
function useCountUp(end: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const step = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    // ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * end));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        }, { threshold: 0.4 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration]);

    return { count, ref };
}

/** Scroll-triggered reveal via inline styles (bypasses Tailwind v4 specificity) */
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        // Set initial hidden state via inline styles (can't be overridden by Tailwind)
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';

                // Animate staggered children
                const staggerChildren = el.querySelectorAll('.stagger');
                staggerChildren.forEach((child, i) => {
                    const c = child as HTMLElement;
                    c.style.opacity = '0';
                    c.style.transform = 'translateY(24px)';
                    c.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08 + 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08 + 0.1}s`;
                    // Trigger reflow then animate
                    requestAnimationFrame(() => {
                        c.style.opacity = '1';
                        c.style.transform = 'translateY(0)';
                    });
                });

                observer.unobserve(el);
            }
        }, { threshold: 0.1 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

/* ─── Component ─── */

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navLinks = [
        { label: 'Features', to: '/features' },
        { label: 'AI Writer', to: '/ai-writer' },
        { label: 'Templates', to: '/templates' },
        { label: 'Blog', to: '/blog' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'About', to: '/about' },
    ];

    /* Stats with countUp refs */
    const writers = useCountUp(50000, 2200);
    const docs = useCountUp(1000000, 2600);
    const templates = useCountUp(20, 1800);
    const rating = useCountUp(49, 2000); // 4.9 ×10

    /* Reveal refs for sections */
    const revealHero = useReveal();
    const revealStats = useReveal();
    const revealFeatures = useReveal();
    const revealUseCases = useReveal();
    const revealTemplates = useReveal();
    const revealBlog = useReveal();
    const revealMarquee = useReveal();
    const revealTestimonials = useReveal();
    const revealCTA = useReveal();

    /* Format large numbers for display */
    const fmtK = (n: number) => n >= 1000 ? `${Math.floor(n / 1000)}K` : `${n}`;
    const fmtM = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(0)}M` : fmtK(n);

    /* Marquee items — SEO-friendly with real keywords */
    const marqueeItems = [
        'AI Writing Tool', 'Content Generator', 'Blog Outline Maker', 'Essay Writer',
        'LinkedIn Post Writer', 'SEO Content Creator', 'Product Description Generator',
        'AI Writing Assistant', 'Writing Workspace', 'AI Copywriting', 'Draft Editor',
        'Content Templates', 'Writing Analytics', 'AI Proofreader',
    ];

    return (
        <div className="flex-1 flex flex-col items-center bg-background-dark overflow-y-auto w-full">
            {/* ─── Header ─── */}
            <header className="w-full sticky top-0 z-50 border-b border-solid border-b-border-dark bg-background-dark/80 px-4 sm:px-6 py-3 backdrop-blur-md lg:px-10">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    <div className="cursor-pointer" onClick={() => navigate('/')}>
                        <Logo />
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((l) => (
                            <Link key={l.to} to={l.to} className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors">{l.label}</Link>
                        ))}
                    </div>

                    <div className="hidden md:flex gap-3 items-center">
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
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-white hover:text-primary transition-colors">
                            Login
                        </button>
                        <button
                            className="p-2 text-text-secondary hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-surface-dark border-b border-border-dark p-4 flex flex-col gap-2 md:hidden shadow-2xl">
                        {navLinks.map((l) => (
                            <button key={l.to} onClick={() => { navigate(l.to); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">{l.label}</button>
                        ))}
                        <hr className="border-border-dark" />
                        <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Login</button>
                        <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }} className="text-center w-full py-3 rounded-lg bg-primary text-white font-bold shadow-lg">Start Free</button>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col items-center w-full overflow-x-hidden">
                {/* ─── Hero ─── */}
                <section ref={revealHero} className="w-full max-w-7xl px-4 py-20 md:py-32 lg:px-8 flex flex-col items-center text-center relative z-10">
                    {/* Background Glows */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Now with AI Templates & Blog</span>
                    </div>

                    <h1 className="max-w-5xl text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl md:text-8xl lg:text-9xl mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-yellow-200">DraftMind Studio</span>
                    </h1>

                    <h2 className="max-w-4xl text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-8">
                        Write <span className="italic text-gray-400">Beyond</span> Your Limits.
                    </h2>

                    <p className="max-w-2xl text-lg text-text-secondary md:text-xl font-light leading-relaxed">
                        The premium AI writing workspace that blends human creativity with neural intelligence. Generate content, use ready-made templates, and publish — all in one place.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button onClick={() => navigate('/signup')} className="group relative flex h-12 min-w-[160px] items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(255,100,0,0.5)] transition-all hover:scale-105 hover:bg-orange-600">
                            <span className="relative z-10">Start Writing Free</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </button>
                        <button onClick={() => navigate('/features')} className="flex h-12 min-w-[160px] items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                            <span className="material-symbols-outlined mr-2 text-[20px]">apps</span>
                            Explore Features
                        </button>
                    </div>

                    {/* Editor Preview */}
                    <div className="mt-20 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl group">
                        <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="mx-auto flex h-6 w-1/3 min-w-[200px] items-center justify-center rounded-md bg-black/40 text-xs text-text-secondary shadow-sm font-mono opacity-50">
                                draftmind.studio/editor
                            </div>
                            <div className="w-10"></div>
                        </div>
                        <div className="relative flex w-full flex-col bg-[#0A0C10] h-[400px] sm:h-[500px] overflow-hidden group-hover:shadow-[0_0_50px_-10px_rgba(249,115,22,0.3)] transition-shadow duration-500">
                            <div className="w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-[20s] ease-linear transform group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIOXZOxzuS3DCK0lo-MWwSr37meZUdU20jo8yhvMn1PDrcon3op59Jdl-vz17oXEN4QjQktbc9CnYwQB1ZOGFRLOW1J9ZXXBwKUOChDEbLXnqbb-iqsF84FlS8mtA_5u4Th4POPnwfiUiUdp9x52nXnyWFIRhWUtmT_wrobE4piA2qjZ4SfJ3vJWLkYcKqV-fWLrhl8BKHo-c8dthnJ4QeSlsvtoeANOUmi9D7YhS7ux2-0HFYukE_3peftCY8xjwvjZPC4vD6bj0')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent"></div>
                            <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform p-4">
                                <div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-[#16191D]/80 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                                    <div className="flex items-center gap-3 text-primary">
                                        <span className="material-symbols-outlined animate-pulse text-xl">auto_awesome</span>
                                        <span className="text-sm font-bold tracking-wide uppercase">AI Assistant</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse"></div>
                                        <div className="h-3 w-full rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '75ms' }}></div>
                                        <div className="h-3 w-5/6 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        {['Simplify', 'Expand', 'Fix Grammar'].map((action) => (
                                            <button key={action} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300">
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Stats Bar (Animated Counters) ─── */}
                <section ref={revealStats} className="w-full border-y border-border-dark bg-surface-dark/30 py-16 relative overflow-hidden">
                    {/* subtle animated background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] animate-float"></div>
                        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] animate-float" style={{ animationDelay: '2s' }}></div>
                    </div>

                    <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 px-4 text-center relative z-10">
                        {/* Writers */}
                        <div ref={writers.ref} className="stagger group">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300 tabular-nums">
                                {fmtK(writers.count)}+
                            </div>
                            <div className="text-sm text-text-secondary mt-2 font-medium tracking-wide uppercase">Writers</div>
                            <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-primary/30 group-hover:w-16 group-hover:bg-primary transition-all duration-500"></div>
                        </div>

                        {/* Documents */}
                        <div ref={docs.ref} className="stagger group">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tabular-nums">
                                {fmtM(docs.count)}+
                            </div>
                            <div className="text-sm text-text-secondary mt-2 font-medium tracking-wide uppercase">Documents Created</div>
                            <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-blue-400/30 group-hover:w-16 group-hover:bg-blue-400 transition-all duration-500"></div>
                        </div>

                        {/* Templates */}
                        <div ref={templates.ref} className="stagger group">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 tabular-nums">
                                {templates.count}+
                            </div>
                            <div className="text-sm text-text-secondary mt-2 font-medium tracking-wide uppercase">AI Templates</div>
                            <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-green-400/30 group-hover:w-16 group-hover:bg-green-400 transition-all duration-500"></div>
                        </div>

                        {/* Rating */}
                        <div ref={rating.ref} className="stagger group">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tabular-nums">
                                {(rating.count / 10).toFixed(1)}★
                            </div>
                            <div className="text-sm text-text-secondary mt-2 font-medium tracking-wide uppercase">Avg Rating</div>
                            <div className="mx-auto mt-3 h-0.5 w-8 rounded-full bg-yellow-400/30 group-hover:w-16 group-hover:bg-yellow-400 transition-all duration-500"></div>
                        </div>
                    </div>
                </section>

                {/* ─── SEO Marquee ─── */}
                <section ref={revealMarquee} className="w-full py-14 bg-background-dark overflow-hidden relative" aria-label="DraftMind features and capabilities">
                    {/* Top glow line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                    {/* Row 1 — scrolls LEFT */}
                    <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)' }} className="mb-4">
                        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', width: 'max-content', willChange: 'transform', animation: 'marquee 25s linear infinite' }}>
                            {[...marqueeItems.slice(0, 7), ...marqueeItems.slice(0, 7)].map((item, i) => (
                                <span key={`r1-${i}`} className="mx-3 md:mx-5 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm text-sm md:text-base font-semibold text-white/30 hover:text-white/70 hover:border-primary/30 hover:bg-primary/[0.06] cursor-default select-none transition-all duration-300" aria-hidden={i >= 7 ? 'true' : undefined}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Glowing center divider */}
                    <div className="w-full flex items-center justify-center my-2">
                        <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                    </div>

                    {/* Row 2 — scrolls RIGHT (reverse) */}
                    <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)' }} className="mt-4">
                        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', width: 'max-content', willChange: 'transform', animation: 'marquee-reverse 30s linear infinite' }}>
                            {[...marqueeItems.slice(7), ...marqueeItems.slice(7)].map((item, i) => (
                                <span key={`r2-${i}`} className="mx-3 md:mx-5 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm text-sm md:text-base font-semibold text-white/30 hover:text-white/70 hover:border-primary/30 hover:bg-primary/[0.06] cursor-default select-none transition-all duration-300" aria-hidden={i >= 7 ? 'true' : undefined}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400/50 shrink-0"></span>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bottom glow line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                    {/* Hidden crawlable text for SEO */}
                    <div className="sr-only">
                        <h3>DraftMind Studio Features</h3>
                        <ul>
                            {marqueeItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </section>

                {/* ─── Core Features ─── */}
                <section ref={revealFeatures} className="w-full py-24 px-4 bg-background-dark">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Core Features</div>
                            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Everything you need to write better</h2>
                            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">Powerful tools designed to help you focus on your best work, without the clutter.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                { icon: 'auto_awesome', title: 'AI Writing Assistant', desc: 'Generate, expand, and rewrite content with our context-aware AI. Understands your tone and style perfectly.', link: '/ai-writer' },
                                { icon: 'dashboard_customize', title: 'Ready-Made Templates', desc: 'Blog outlines, essays, LinkedIn posts, product descriptions — start writing in seconds with professionally crafted templates.', link: '/templates' },
                                { icon: 'folder_open', title: 'Project Organization', desc: 'Keep your drafts, research, and notes in one structured sidebar. Organize with drag-and-drop simplicity.', link: '/features' },
                                { icon: 'cloud_upload', title: 'Cloud Autosave', desc: 'Never lose a thought. Synced instantly across all your devices so you can pick up exactly where you left off.', link: '/features' },
                                { icon: 'bar_chart', title: 'Writing Analytics', desc: 'Track word count, readability scores, and writing streaks. Build better habits with real-time insights.', link: '/features' },
                                { icon: 'group', title: 'Built for Every Creator', desc: 'Students, bloggers, marketers, content creators — DraftMind adapts to your workflow.', link: '/use-cases' },
                            ].map((f, idx) => (
                                <div key={f.title} onClick={() => navigate(f.link)} className="stagger cursor-pointer group relative overflow-hidden rounded-2xl border border-border-dark bg-surface-dark p-8 transition-all hover:shadow-xl hover:border-primary/40 hover:bg-[#1f2329]">
                                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined text-[28px]">{f.icon}</span>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">{f.title}</h3>
                                    <p className="text-text-secondary leading-relaxed">{f.desc}</p>
                                    <span className="inline-flex items-center mt-4 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Learn more <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Use Cases ─── */}
                <section ref={revealUseCases} className="w-full py-24 bg-surface-dark/30 border-y border-border-dark">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Use Cases</div>
                            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Built for every kind of writer</h2>
                            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">Whether you're a student, blogger, marketer, or content creator — DraftMind adapts to your workflow.</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: 'school', title: 'Students', desc: 'Write essays, research papers, and study notes faster with AI help.', link: '/ai-writer-for-students' },
                                { icon: 'edit_note', title: 'Bloggers', desc: 'Outline, draft, and publish blog posts with built-in SEO guidance.', link: '/ai-writer-for-bloggers' },
                                { icon: 'campaign', title: 'Marketers', desc: 'Create ad copy, landing pages, and email campaigns at scale.', link: '/ai-writer-for-marketers' },
                                { icon: 'movie', title: 'Content Creators', desc: 'Script videos, write captions, and plan content calendars effortlessly.', link: '/ai-writer-for-content-creators' },
                            ].map((uc) => (
                                <div key={uc.title} onClick={() => navigate(uc.link)} className="stagger cursor-pointer group p-6 rounded-2xl border border-border-dark bg-background-dark hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[24px]">{uc.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{uc.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{uc.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Templates Showcase ─── */}
                <section ref={revealTemplates} className="w-full py-24 px-4 bg-background-dark">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Template Hub</div>
                            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Start with a template, finish with a masterpiece</h2>
                            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">Choose from professionally crafted templates and let AI fill in the blanks.</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: 'article', title: 'Blog Outline', desc: 'Structure posts with headings, subheadings, and key points.', link: '/blog-outline-template' },
                                { icon: 'history_edu', title: 'Essay', desc: 'Academic-ready format with thesis, body, and conclusion.', link: '/essay-template' },
                                { icon: 'work', title: 'LinkedIn Post', desc: 'Engaging professional posts that drive engagement.', link: '/linkedin-post-template' },
                                { icon: 'inventory_2', title: 'Product Description', desc: 'Compelling copy that converts browsers into buyers.', link: '/product-description-template' },
                            ].map((t) => (
                                <div key={t.title} onClick={() => navigate(t.link)} className="stagger cursor-pointer group relative overflow-hidden rounded-xl border border-border-dark bg-surface-dark p-6 transition-all hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[24px]">{t.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{t.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{t.desc}</p>
                                    <span className="inline-flex items-center mt-3 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Use Template <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 text-center">
                            <button onClick={() => navigate('/templates')} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                                View All Templates <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ─── Blog Preview (Creative) ─── */}
                <section ref={revealBlog} className="w-full py-28 bg-surface-dark/30 border-y border-border-dark relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="mx-auto max-w-7xl px-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
                            <div>
                                <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Blog</div>
                                <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Fresh from the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">DraftMind</span> Blog</h2>
                            </div>
                            <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 w-fit">
                                Read All Articles <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {[
                                {
                                    title: 'Best AI Writing Tools in 2026',
                                    desc: 'A comprehensive comparison of the top AI writing tools — and why DraftMind leads the pack.',
                                    link: '/blog/best-ai-writing-tools',
                                    tag: 'Comparison',
                                    tagColor: 'from-blue-500 to-cyan-400',
                                    accentGradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
                                    icon: 'emoji_events',
                                    readTime: '8 min read',
                                },
                                {
                                    title: 'How to Write 10x Faster with AI',
                                    desc: 'Practical tips and workflows for supercharging your writing speed using AI assistants.',
                                    link: '/blog/write-faster-with-ai',
                                    tag: 'Productivity',
                                    tagColor: 'from-primary to-orange-400',
                                    accentGradient: 'from-primary/20 via-orange-500/10 to-transparent',
                                    icon: 'bolt',
                                    readTime: '6 min read',
                                },
                                {
                                    title: 'AI Writing Prompts That Actually Work',
                                    desc: 'A curated collection of prompts to get the best output from any AI writing tool.',
                                    link: '/blog/ai-writing-prompts',
                                    tag: 'Guide',
                                    tagColor: 'from-green-400 to-emerald-400',
                                    accentGradient: 'from-green-500/20 via-emerald-500/10 to-transparent',
                                    icon: 'lightbulb',
                                    readTime: '5 min read',
                                },
                            ].map((post, idx) => (
                                <article key={post.title} onClick={() => navigate(post.link)} className="stagger blog-card cursor-pointer group rounded-3xl border border-border-dark bg-background-dark overflow-hidden" style={{ perspective: '1000px' }}>
                                    {/* Card Header / Thumbnail Area */}
                                    <div className={`relative h-52 bg-gradient-to-br ${post.accentGradient} bg-surface-dark flex items-center justify-center overflow-hidden`}>
                                        {/* Animated icon */}
                                        <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 animate-glow-pulse">
                                            <span className="material-symbols-outlined text-[40px] text-white/60 group-hover:text-white transition-colors">{post.icon}</span>
                                        </div>
                                        {/* Floating decoration circles */}
                                        <div className="absolute top-6 right-6 w-16 h-16 rounded-full border border-white/5 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}></div>
                                        <div className="absolute bottom-8 left-8 w-10 h-10 rounded-full bg-white/5 animate-float" style={{ animationDelay: `${idx * 0.5 + 1}s` }}></div>
                                        {/* Tag */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${post.tagColor} shadow-lg`}>
                                                {post.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex flex-col gap-3">
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{post.desc}</p>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-dark">
                                            <span className="text-xs text-text-secondary flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {post.readTime}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-8px] group-hover:translate-x-0">
                                                Read <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Testimonials ─── */}
                <section ref={revealTestimonials} className="w-full py-32 bg-background-dark relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>

                    <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
                        <div className="text-center mb-20">
                            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">Community</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for the <span className="text-gray-500">obsessive.</span></h2>
                            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-light">Writers who care about aesthetics, focus, and speed call DraftMind home.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    quote: "It's rare to use a tool that feels like it respects your intelligence. The AI doesn't get in your way; it waits for you.",
                                    author: "Sarah Jenkins", role: "Editorial Director",
                                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4"
                                },
                                {
                                    quote: "I switched from Notion. The difference isn't features—it's the feeling. DraftMind makes me want to write.",
                                    author: "Marcus Chen", role: "Tech Columnist",
                                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Marcus&backgroundColor=d1d4f9"
                                },
                                {
                                    quote: "The templates saved me hours every week. Blog outline to published post in under 30 minutes.",
                                    author: "Elena Rodriguez", role: "Content Marketer",
                                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Elena&backgroundColor=ffdfbf"
                                }
                            ].map((testimonial, idx) => (
                                <div key={idx} className="stagger group relative p-8 rounded-3xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-background-dark border border-border-dark rounded-full flex items-center justify-center text-primary rotate-12 group-hover:rotate-0 transition-all">
                                        <span className="material-symbols-outlined">format_quote</span>
                                    </div>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                        <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full bg-white/10" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{testimonial.author}</h4>
                                            <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CTA ─── */}
                <section ref={revealCTA} className="w-full py-16 px-4">
                    <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-black border border-border-dark shadow-2xl">
                        <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-20 items-center">
                            <div className="flex flex-col gap-6">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-md">
                                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                                    <span>Turbo Mode</span>
                                </div>
                                <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-white">Ready to transform your writing workflow?</h2>
                                <p className="text-lg text-text-secondary">
                                    Join thousands of writers, marketers, and creators who use DraftMind Studio daily to produce high-quality content 10x faster.
                                </p>
                                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                                    <button onClick={() => navigate('/signup')} className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90">
                                        Get Started for Free
                                    </button>
                                    <button onClick={() => navigate('/use-cases')} className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-transparent px-8 text-base font-bold text-white transition-all hover:bg-white/10">
                                        View Use Cases
                                    </button>
                                </div>
                            </div>
                            <div className="relative min-h-[300px] lg:h-full rounded-xl bg-[#1A1D21] overflow-hidden border border-border-dark">
                                <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkrj7SdyeTxgNi2n26li9b63D987v_Co_0rcQPRRbQxL_uZUVv_IOZArU5-COOo8_bQBBrPqa0EXvQRjSCycsO4m5nbGmXwHKbnFIIGCIBIGwBuCfKm5BXeealNSOMa13szVl53xDRCYk3X98_RJUx9Gk_waTH1OsN1osIqbDFtDdjnicUTumWfmZdA8NkT1zy3NzRTMYchk0Pno8VJfQi5n_gJfbbFBe7e5hfU2qvZYb_YhJCSLdK1mIsoJHAtzkuGfFt8QjAngo')" }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="w-full border-t border-border-dark bg-background-dark px-4 py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                            <div className="col-span-2 md:col-span-1">
                                <Logo />
                                <p className="mt-4 text-sm text-text-secondary leading-relaxed mb-4">The premium AI writing workspace for modern creators.</p>
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
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</h4>
                                <div className="flex flex-col gap-2">
                                    <Link to="/features" className="text-sm text-text-secondary hover:text-primary transition-colors">Features</Link>
                                    <Link to="/ai-writer" className="text-sm text-text-secondary hover:text-primary transition-colors">AI Writer</Link>
                                    <Link to="/ai-writing-tool" className="text-sm text-text-secondary hover:text-primary transition-colors">AI Writing Tool</Link>
                                    <Link to="/pricing" className="text-sm text-text-secondary hover:text-primary transition-colors">Pricing</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Templates</h4>
                                <div className="flex flex-col gap-2">
                                    <Link to="/blog-outline-template" className="text-sm text-text-secondary hover:text-primary transition-colors">Blog Outline</Link>
                                    <Link to="/essay-template" className="text-sm text-text-secondary hover:text-primary transition-colors">Essay</Link>
                                    <Link to="/linkedin-post-template" className="text-sm text-text-secondary hover:text-primary transition-colors">LinkedIn Post</Link>
                                    <Link to="/product-description-template" className="text-sm text-text-secondary hover:text-primary transition-colors">Product Description</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Use Cases</h4>
                                <div className="flex flex-col gap-2">
                                    <Link to="/ai-writer-for-students" className="text-sm text-text-secondary hover:text-primary transition-colors">For Students</Link>
                                    <Link to="/ai-writer-for-bloggers" className="text-sm text-text-secondary hover:text-primary transition-colors">For Bloggers</Link>
                                    <Link to="/ai-writer-for-marketers" className="text-sm text-text-secondary hover:text-primary transition-colors">For Marketers</Link>
                                    <Link to="/ai-writer-for-content-creators" className="text-sm text-text-secondary hover:text-primary transition-colors">For Content Creators</Link>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Resources</h4>
                                <div className="flex flex-col gap-2">
                                    <Link to="/blog" className="text-sm text-text-secondary hover:text-primary transition-colors">Blog</Link>
                                    <Link to="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">About</Link>
                                    <Link to="/use-cases" className="text-sm text-text-secondary hover:text-primary transition-colors">Use Cases</Link>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-border-dark pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-text-secondary">
                                © 2026 DraftMind Studio Inc. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-sm text-text-secondary">
                                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Landing;