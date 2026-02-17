import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex-1 flex flex-col items-center bg-background-dark overflow-y-auto w-full">
            <header className="w-full sticky top-0 z-50 border-b border-solid border-b-border-dark bg-background-dark/80 px-4 sm:px-6 py-3 backdrop-blur-md lg:px-10">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    <div className="cursor-pointer" onClick={() => navigate('/')}>
                        <Logo />
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-9">
                        <button className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors" onClick={() => navigate('/pricing')}>Pricing</button>
                        <button className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors" onClick={() => navigate('/about')}>About</button>
                    </div>

                    <div className="hidden md:flex gap-3">
                        <button onClick={() => navigate('/login')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors">
                            <span className="truncate">Login</span>
                        </button>
                        <button onClick={() => navigate('/signup')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:bg-primary/90 transition-all hover:shadow-primary/20 hover:shadow-lg">
                            <span className="truncate">Start Free</span>
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
                    <div className="absolute top-full left-0 w-full bg-surface-dark border-b border-border-dark p-4 flex flex-col gap-4 md:hidden shadow-2xl animate-in slide-in-from-top-2 duration-200">
                        <button onClick={() => navigate('/pricing')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Pricing</button>
                        <button onClick={() => navigate('/about')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">About</button>
                        <hr className="border-border-dark" />
                        <button onClick={() => navigate('/login')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Login</button>
                        <button onClick={() => navigate('/signup')} className="text-center w-full py-3 rounded-lg bg-primary text-white font-bold shadow-lg">Start Free</button>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col items-center w-full overflow-x-hidden">
                <section className="w-full max-w-7xl px-4 py-20 md:py-32 lg:px-8 flex flex-col items-center text-center relative z-10">
                    {/* Hero Background Glows */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8 backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">DraftMind 2.0 Released</span>
                    </div>

                    <h1 className="max-w-5xl text-6xl font-black leading-[1.1] tracking-tight text-white md:text-8xl lg:text-9xl mb-6 animate-in slide-in-from-bottom-8 fade-in duration-1000">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-yellow-200 animate-gradient-x">DraftMind Studio</span>
                    </h1>

                    <h2 className="max-w-4xl text-3xl md:text-5xl font-bold text-white mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
                        Write <span className="italic text-gray-400">Beyond</span> Your Limits.
                    </h2>

                    <p className="max-w-2xl text-lg text-text-secondary md:text-xl font-light leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
                        The premium workspace blending human creativity with neural intelligence. Focus on your masterpiece while we handle the mechanics.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
                        <button onClick={() => navigate('/signup')} className="group relative flex h-12 min-w-[160px] items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(255,100,0,0.5)] transition-all hover:scale-105 hover:bg-orange-600">
                            <span className="relative z-10">Start Free</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </button>
                        <button className="flex h-12 min-w-[160px] items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-8 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                            <span className="material-symbols-outlined mr-2 text-[20px] group-hover:scale-110 transition-transform">play_circle</span>
                            Watch Demo
                        </button>
                    </div>

                    <div className="mt-20 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500 transform perspective-1000 group">
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
                        <div className="relative flex w-full flex-col bg-[#0A0C10] h-[500px] overflow-hidden group-hover:shadow-[0_0_50px_-10px_rgba(var(--primary),0.3)] transition-shadow duration-500">
                            <div className="w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-[20s] ease-linear transform group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIOXZOxzuS3DCK0lo-MWwSr37meZUdU20jo8yhvMn1PDrcon3op59Jdl-vz17oXEN4QjQktbc9CnYwQB1ZOGFRLOW1J9ZXXBwKUOChDEbLXnqbb-iqsF84FlS8mtA_5u4Th4POPnwfiUiUdp9x52nXnyWFIRhWUtmT_wrobE4piA2qjZ4SfJ3vJWLkYcKqV-fWLrhl8BKHo-c8dthnJ4QeSlsvtoeANOUmi9D7YhS7ux2-0HFYukE_3peftCY8xjwvjZPC4vD6bj0')" }}>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent"></div>

                            <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform p-4">
                                <div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-[#16191D]/80 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 animate-in zoom-in-95 duration-700 delay-700">
                                    <div className="flex items-center gap-3 text-primary">
                                        <span className="material-symbols-outlined animate-pulse text-xl">auto_awesome</span>
                                        <span className="text-sm font-bold tracking-wide uppercase">AI Assistant</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 w-3/4 rounded-full bg-white/10 animate-pulse"></div>
                                        <div className="h-3 w-full rounded-full bg-white/10 animate-pulse delay-75"></div>
                                        <div className="h-3 w-5/6 rounded-full bg-white/10 animate-pulse delay-150"></div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        {['Simplify', 'Expand', 'Fix Grammar'].map((action, i) => (
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

                <section className="w-full border-y border-border-dark bg-surface-dark/30 py-10 overflow-hidden">
                    <div className="mb-8 text-center text-sm font-medium text-text-secondary">Trusted by modern teams at</div>

                    <div className="relative w-full flex overflow-hidden mask-gradient-x">
                        <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-16 items-center shrink-0 opacity-50 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
                                    <span className="text-2xl font-bold text-white">Acme Inc.</span>
                                    <span className="text-2xl font-bold text-white italic">Vertex</span>
                                    <span className="text-2xl font-bold text-white tracking-[0.2em]">GLOBAL</span>
                                    <span className="text-2xl font-bold text-white font-serif">Starlight</span>
                                    <span className="text-2xl font-bold text-white underline decoration-primary decoration-4 underline-offset-4">Next</span>
                                    <span className="text-2xl font-bold text-white font-mono">CODE_IO</span>
                                    <span className="text-2xl font-bold text-white flex items-center gap-1"><div className="w-6 h-6 rounded-full bg-white"></div>Circle</span>
                                    <span className="text-2xl font-bold text-white">Bolt.new</span>
                                    {/* Repeat for seamless loop */}
                                    <span className="text-2xl font-bold text-white">Acme Inc.</span>
                                    <span className="text-2xl font-bold text-white italic">Vertex</span>
                                    <span className="text-2xl font-bold text-white tracking-[0.2em]">GLOBAL</span>
                                    <span className="text-2xl font-bold text-white font-serif">Starlight</span>
                                    <span className="text-2xl font-bold text-white underline decoration-primary decoration-4 underline-offset-4">Next</span>
                                    <span className="text-2xl font-bold text-white font-mono">CODE_IO</span>
                                    <span className="text-2xl font-bold text-white flex items-center gap-1"><div className="w-6 h-6 rounded-full bg-white"></div>Circle</span>
                                    <span className="text-2xl font-bold text-white">Bolt.new</span>
                                </div>
                            ))}
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

                {/* Testimonials Section */}
                <section className="w-full py-32 bg-background-dark relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>

                    <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
                        <div className="text-center mb-20">
                            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary tracking-widest uppercase">
                                Community
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for the <span className="text-gray-500">obsessive.</span></h2>
                            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-light">
                                Writers who care about aesthetics, focus, and speed call DraftMind home.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    quote: "It’s rare to use a tool that feels like it respects your intelligence. The AI doesn't get in your way; it waits for you.",
                                    author: "Sarah Jenkins",
                                    role: "Editorial Director",
                                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4"
                                },
                                {
                                    quote: "I switched from Notion. The difference isn't features—it's the feeling. DraftMind makes me want to write.",
                                    author: "Marcus Chen",
                                    role: "Tech Columnist",
                                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Marcus&backgroundColor=d1d4f9"
                                },
                                {
                                    quote: "The auto-save is bulletproof and the sidebar keeps me sane. Best aesthetic upgrade I've made this year.",
                                    author: "Elena Rodriguez",
                                    role: "Sci-Fi Author",
                                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Elena&backgroundColor=ffdfbf"
                                }
                            ].map((testimonial, idx) => (
                                <div key={idx} className="group relative p-8 rounded-3xl bg-surface-dark/50 backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5">
                                    {/* Quote Icon */}
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
                        <LogoWrapper />
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

// Helper to avoid duplicate Logo imports if configured differently in future
const LogoWrapper = () => (
    <div className="flex items-center gap-2">
        <Logo />
    </div>
);

export default Landing;