import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const About: React.FC = () => {
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-background-dark text-text-primary font-sans selection:bg-primary/30">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="cursor-pointer" onClick={() => navigate('/')}>
                        <Logo />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => navigate('/')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Home</button>
                        <button onClick={() => navigate('/pricing')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Pricing</button>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-medium text-white hover:text-primary transition-colors">Login</button>
                        <button onClick={() => navigate('/signup')} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-orange-600 hover:scale-105 active:scale-95">
                            Get Started
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
                        <button onClick={() => navigate('/')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Home</button>
                        <button onClick={() => navigate('/pricing')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Pricing</button>
                        <hr className="border-border-dark" />
                        <button onClick={() => navigate('/login')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Login</button>
                        <button onClick={() => navigate('/signup')} className="text-center w-full py-3 rounded-lg bg-primary text-white font-bold shadow-lg">Get Started</button>
                    </div>
                )}
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden min-h-[90vh] flex items-center py-20 px-4 sm:px-6 lg:px-8">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] opacity-40"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Text Content */}
                        <div className="lg:col-span-7 flex flex-col justify-center lg:pr-12 animate-in slide-in-from-bottom-8 fade-in duration-1000">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mb-8 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-xs font-medium text-white tracking-wide uppercase">The Creator Behind DraftMind</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                Building the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-400 animate-gradient-x">Santuary</span> for <br />
                                Thought.
                            </h1>

                            <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-2xl font-light">
                                "I got tired of tools that felt like spreadsheets. Writing is an art, and your environment should inspire you, not just manage your words. DraftMind is my answer to the clutter."
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <button onClick={() => navigate('/signup')} className="group relative px-8 py-4 rounded-full bg-white text-black font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    <span className="relative flex items-center gap-2">
                                        Join the Journey
                                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                                    </span>
                                </button>

                                <div className="flex items-center gap-4 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background-dark bg-gray-700"></div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">Trusted by 2,000+ writers</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Content - 3D Avatar */}
                        <div className="lg:col-span-5 relative h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000 animate-in zoom-in-95 fade-in duration-1000 delay-200">
                            {/* Abstract Shapes behind */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[400px] h-[400px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                <div className="absolute w-[300px] h-[300px] border border-dashed border-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            </div>

                            {/* The Card Container */}
                            <div className="relative w-full max-w-md bg-gradient-to-br from-[#1A1D21] to-[#121416] border border-white/10 rounded-3xl p-2 shadow-2xl transform transition-transform hover:scale-[1.02] hover:rotate-1 duration-500 group">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 group-hover:opacity-75 transition-opacity duration-700 opacity-20"></div>

                                <div className="relative rounded-2xl overflow-hidden bg-[#16191D] aspect-[3/4]">
                                    {/* Placeholder for 3D Avatar - Using a high quality Notion-style or 3D avatar service */}
                                    <img
                                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Taheer&backgroundColor=ffb300"
                                        alt="Taheer Tai 3D Profile"
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Floating Stats Cards */}
                                    <div className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="material-symbols-outlined text-yellow-400 text-2xl">electric_bolt</span>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-white font-bold text-lg">Taheer Tai</h3>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-white">FOUNDER</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-primary loading-bar"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                                            <span>COMMITS: 8,432</span>
                                            <span>COFFEE: ∞</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-surface-dark border-y border-border-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
                            <p className="text-text-secondary max-w-2xl mx-auto">
                                Built on principles that prioritize user experience and ethical AI.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: 'bolt', title: 'Speed & Simplicity', desc: 'Tools should accelerate your workflow, not complicate it. We obsess over every millisecond and interaction.' },
                                { icon: 'psychology', title: 'Human-Centric AI', desc: 'AI is a bicycle for the mind. We build features that amplify your intelligence, not replace it.' },
                                { icon: 'diversity_3', title: 'Community First', desc: 'We build in public and listen to every piece of feedback. DraftMind is shaped by its users.' }
                            ].map((value, idx) => (
                                <div key={idx} className="p-8 rounded-2xl bg-background-dark border border-border-dark hover:border-primary/50 transition-colors group animate-in slide-in-from-bottom-8 fade-in duration-700" style={{ animationDelay: `${300 + (idx * 100)}ms` }}>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">{value.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                    <p className="text-text-secondary leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story/Timeline */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">The Journey</h2>
                    <div className="relative border-l border-border-dark ml-4 md:ml-0 space-y-12 pl-8 md:pl-0">
                        {[
                            { year: '2023', title: 'The Spark', desc: 'Taheer, frustrated with clunky writing tools, starts prototyping a distraction-free editor in a small cafe in Pune.' },
                            { year: '2024', title: 'DraftMind v1.0', desc: 'After months of coding and coffee, the first version launches. It’s simple, fast, and people love it.' },
                            { year: '2025', title: 'AI Integration', desc: 'Recognizing the potential of LLMs, we integrate the first AI writing assistant, focusing on privacy and control.' },
                            { year: 'Now', title: 'The Studio', desc: 'DraftMind evolves into a full Studio. A complete workspace for the modern creator.' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative md:grid md:grid-cols-5 md:gap-8 items-start animate-in slide-in-from-left-4 fade-in duration-500" style={{ animationDelay: `${500 + (idx * 100)}ms` }}>
                                <div className="hidden md:block col-span-1 text-right pt-1">
                                    <span className="text-2xl font-black text-primary/50">{item.year}</span>
                                </div>
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-background-dark bg-primary md:left-auto md:right-auto md:relative md:col-span-1 md:flex md:justify-center md:items-center md:mx-auto md:w-5 md:h-5 md:p-0 md:bg-primary"></div>
                                <div className="col-span-3 pt-1">
                                    <span className="md:hidden text-primary font-bold text-sm mb-1 block">{item.year}</span>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-text-secondary">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Founder's Testimonial / Vision */}
                <section className="py-24 px-4 text-center bg-surface-dark border-t border-border-dark">
                    <div className="max-w-3xl mx-auto">
                        <span className="material-symbols-outlined text-4xl text-primary mb-6">format_quote</span>
                        <h2 className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed">
                            "We're not just building an editor; we're building a sanctuary for thought. Every feature is designed to respect your focus and amplify your creativity."
                        </h2>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&top[]=shortHair&hairColor[]=2c1b18&skinColor[]=f8d25c&backgroundColor=transparent" alt="S" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-bold text-sm">Taheer Tai</p>
                                <p className="text-text-secondary text-xs">Founder</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to write your story?</h2>
                    <button onClick={() => navigate('/signup')} className="px-10 py-4 rounded-full bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-transform hover:bg-orange-600">
                        Get Started for Free
                    </button>
                </section>
            </main>

            <footer className="w-full border-t border-border-dark bg-surface-dark px-4 py-12 text-center text-text-secondary">
                <p>© 2026 DraftMind Studio. Crafted with ❤️ in India.</p>
            </footer>
        </div>
    );
};

export default About;
