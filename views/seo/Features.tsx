import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../components/PublicPageLayout';
import SEOHead from '../../components/SEOHead';

const FEATURES = [
    { icon: 'auto_awesome', title: 'AI Content Generation', desc: 'Generate blog posts, essays, marketing copy, and more with a single prompt. Our AI understands context and writes in your style.' },
    { icon: 'edit_note', title: 'Rich Text Editor', desc: 'A powerful TipTap-based editor with formatting, headings, lists, code blocks, and markdown support — distraction-free.' },
    { icon: 'folder_open', title: 'Project Organization', desc: 'Organize documents into projects. Keep research, drafts, and finals neatly structured with drag-and-drop simplicity.' },
    { icon: 'cloud_sync', title: 'Cloud Autosave', desc: 'Every keystroke is saved automatically to the cloud. Never lose a thought — pick up exactly where you left off on any device.' },
    { icon: 'download', title: 'Export Anywhere', desc: 'Download your work as PDF, Word (.docx), or HTML. Share via WhatsApp, Gmail, or copy a direct link.' },
    { icon: 'bar_chart', title: 'Analytics Dashboard', desc: 'Track word counts, writing streaks, and productivity trends. Visualize your progress with beautiful charts.' },
    { icon: 'palette', title: 'Theming & Customization', desc: 'Dark mode by default with a premium aesthetic. Customize your workspace to match your creative vibe.' },
    { icon: 'lock', title: 'Secure & Private', desc: 'Built on Supabase with row-level security. Your documents are encrypted and only accessible by you.' },
    { icon: 'speed', title: 'Lightning Fast', desc: 'Built with Vite and React for instant page loads. No bloat, no lag — just pure writing speed.' },
];

const Features: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Features — DraftMind Studio | AI Writing Workspace"
                description="Explore DraftMind Studio features: AI content generation, rich text editor, project organization, cloud autosave, export to PDF/DOCX, analytics, and more."
                canonical="https://draft-mind-studio.vercel.app/features"
            />

            {/* Hero */}
            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] opacity-40"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">stars</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Powerful Features</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">write smarter</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        DraftMind Studio combines a beautiful writing environment with powerful AI tools. No clutter, no distractions — just pure creative flow.
                    </p>
                    <button onClick={() => navigate('/signup')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 hover:scale-105 transition-all">
                        Start Writing Free →
                    </button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-surface-dark/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-background-dark border border-border-dark hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/5">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[28px]">{f.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pillar Link CTA */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-4">See what makes DraftMind the #1 AI writing tool</h2>
                    <p className="text-text-secondary mb-8">Learn how our AI writing technology helps you create better content, faster.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/ai-writing-tool')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">
                            Explore AI Writing Tool →
                        </button>
                        <button onClick={() => navigate('/use-cases')} className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
                            View Use Cases
                        </button>
                    </div>
                </div>
            </section>
        </PublicPageLayout>
    );
};

export default Features;
