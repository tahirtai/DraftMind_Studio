import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center bg-background-dark overflow-y-auto">
            <header className="w-full sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-border-dark bg-background-dark/80 px-6 py-3 backdrop-blur-md lg:px-10">
                <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => navigate('/')}>
                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[24px]">edit_note</span>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">DraftMind Studio</h2>
                </div>
                <div className="hidden md:flex items-center gap-9">
                    <a className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Product</a>
                    <a className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Pricing</a>
                    <a className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">About</a>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/login')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors">
                        <span className="truncate">Login</span>
                    </button>
                    <button onClick={() => navigate('/signup')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90 transition-all hover:shadow-primary/20 hover:shadow-lg">
                        <span className="truncate">Start Free</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center w-full">
                <section className="w-full max-w-7xl px-4 py-16 md:py-24 lg:px-8 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">DraftMind 2.0 Released</span>
                    </div>
                    <h1 className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
                        DraftMind Studio – <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-300">AI Writing Workspace</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
                        The premium workspace blending human creativity with neural intelligence. Focus on your masterpiece while we handle the mechanics.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button onClick={() => navigate('/signup')} className="flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark">
                            Start Free
                        </button>
                        <button className="flex h-12 min-w-[160px] items-center justify-center rounded-lg border border-border-dark bg-surface-dark px-8 text-base font-bold text-text-secondary transition-all hover:bg-white/5 hover:text-white">
                            <span className="material-symbols-outlined mr-2 text-[20px]">play_circle</span>
                            Watch Demo
                        </button>
                    </div>

                    <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-xl border border-border-dark bg-surface-dark shadow-2xl shadow-black/50 perspective-1000">
                        <div className="flex items-center gap-2 border-b border-border-dark bg-background-dark/50 px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="mx-auto flex h-6 w-1/3 min-w-[200px] items-center justify-center rounded-md bg-black/40 text-xs text-text-secondary shadow-sm">
                                Untitled Draft - DraftMind Studio
                            </div>
                            <div className="w-10"></div>
                        </div>
                        <div className="relative flex w-full flex-col bg-surface-dark h-[500px]">
                            <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIOXZOxzuS3DCK0lo-MWwSr37meZUdU20jo8yhvMn1PDrcon3op59Jdl-vz17oXEN4QjQktbc9CnYwQB1ZOGFRLOW1J9ZXXBwKUOChDEbLXnqbb-iqsF84FlS8mtA_5u4Th4POPnwfiUiUdp9x52nXnyWFIRhWUtmT_wrobE4piA2qjZ4SfJ3vJWLkYcKqV-fWLrhl8BKHo-c8dthnJ4QeSlsvtoeANOUmi9D7YhS7ux2-0HFYukE_3peftCY8xjwvjZPC4vD6bj0')" }}>
                                <div className="absolute inset-0 bg-surface-dark/95 backdrop-blur-[2px]"></div>
                            </div>
                            <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform p-4">
                                <div className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-[#16191D]/90 p-6 shadow-2xl backdrop-blur-xl dark:shadow-primary/5">
                                    <div className="flex items-center gap-3 text-primary">
                                        <span className="material-symbols-outlined animate-pulse">auto_awesome</span>
                                        <span className="text-sm font-semibold">AI Assistant</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-3/4 rounded bg-white/5"></div>
                                        <div className="h-4 w-full rounded bg-white/5"></div>
                                        <div className="h-4 w-5/6 rounded bg-white/5"></div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">Simplify</button>
                                        <button className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">Expand</button>
                                        <button className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">Fix Grammar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full border-y border-border-dark bg-surface-dark/30 py-10">
                    <div className="mx-auto max-w-7xl px-4 lg:px-8">
                        <p className="mb-6 text-center text-sm font-medium text-text-secondary">Trusted by modern teams at</p>
                        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale transition-all hover:grayscale-0">
                            <span className="text-xl font-bold text-white">Acme Inc.</span>
                            <span className="text-xl font-bold text-white italic">Vertex</span>
                            <span className="text-xl font-bold text-white tracking-widest">GLOBAL</span>
                            <span className="text-xl font-bold text-white font-serif">Starlight</span>
                            <span className="text-xl font-bold text-white underline decoration-primary decoration-4">Next</span>
                        </div>
                    </div>
                </section>

                <section className="w-full py-24 px-4 bg-background-dark">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Everything you need to write better</h2>
                            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">Powerful tools designed to help you focus on your best work, without the clutter.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="group relative overflow-hidden rounded-2xl border border-border-dark bg-surface-dark p-8 transition-all hover:shadow-xl hover:border-primary/40 hover:bg-[#1f2329]">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-[28px]">folder_open</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-white">Project Organization</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Keep your drafts, research, and notes in one structured sidebar. Organize with drag-and-drop simplicity.
                                </p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl border border-border-dark bg-surface-dark p-8 transition-all hover:shadow-xl hover:border-primary/40 hover:bg-[#1f2329]">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-white">AI Generation</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Expand your ideas or rewrite paragraphs with a single keystroke. Our AI understands context and tone perfectly.
                                </p>
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl border border-border-dark bg-surface-dark p-8 transition-all hover:shadow-xl hover:border-primary/40 hover:bg-[#1f2329]">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-white">Cloud Autosave</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Never lose a thought. Synced instantly across all your devices so you can pick up exactly where you left off.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-16 px-4">
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
                                    <button className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-transparent px-8 text-base font-bold text-white transition-all hover:bg-white/10">
                                        Read Case Studies
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

                <footer className="w-full border-t border-border-dark bg-background-dark px-4 py-12">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-6 rounded bg-primary text-white">
                                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                            </div>
                            <span className="text-lg font-bold text-white">DraftMind Studio</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-text-secondary">
                            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                            <a className="hover:text-primary transition-colors" href="#">Twitter</a>
                            <a className="hover:text-primary transition-colors" href="#">LinkedIn</a>
                        </div>
                        <p className="text-sm text-text-secondary">
                            © 2023 DraftMind Studio Inc. All rights reserved.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Landing;