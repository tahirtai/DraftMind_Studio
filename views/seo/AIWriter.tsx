import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../components/PublicPageLayout';
import SEOHead from '../../components/SEOHead';

const AIWriter: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="AI Writer — Generate Content Instantly | DraftMind Studio"
                description="DraftMind's AI Writer generates blog posts, essays, marketing copy, and more. Write 10x faster with AI-powered content generation in a beautiful editor."
                canonical="https://draft-mind-studio.vercel.app/ai-writer"
            />

            {/* Hero */}
            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">auto_awesome</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">AI-Powered</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">Writing Partner</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
                        Tell DraftMind what you need and watch it generate polished content in seconds. Blog posts, essays, emails, marketing copy — all in your voice.
                    </p>
                    <button onClick={() => navigate('/signup')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 hover:scale-105 transition-all">
                        Try AI Writer Free →
                    </button>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-16">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', icon: 'chat', title: 'Describe Your Content', desc: 'Type what you need — a blog post, essay outline, product description, or any content type.' },
                            { step: '02', icon: 'auto_awesome', title: 'AI Generates', desc: 'Our AI crafts high-quality content tailored to your style, tone, and requirements instantly.' },
                            { step: '03', icon: 'edit', title: 'Edit & Export', desc: 'Polish the output in our rich editor, then export to PDF, Word, or HTML. Share with a click.' },
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-2xl bg-background-dark border border-border-dark">
                                <span className="absolute -top-4 -left-2 text-5xl font-black text-primary/15">{item.step}</span>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                                    <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Built for Every Writer</h2>
                    <p className="text-text-secondary mb-12 max-w-2xl mx-auto">Whether you're a student, blogger, marketer, or content creator — DraftMind adapts to your workflow.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { label: 'AI Writer for Students', path: '/ai-writer-for-students', icon: 'school' },
                            { label: 'AI Writer for Bloggers', path: '/ai-writer-for-bloggers', icon: 'rss_feed' },
                            { label: 'AI Writer for Marketers', path: '/ai-writer-for-marketers', icon: 'campaign' },
                            { label: 'AI Writer for Content Creators', path: '/ai-writer-for-content-creators', icon: 'videocam' },
                        ].map((uc, i) => (
                            <button key={i} onClick={() => navigate(uc.path)} className="flex items-center gap-4 p-5 rounded-xl bg-surface-dark border border-border-dark hover:border-primary/40 hover:bg-surface-dark/80 transition-all text-left group">
                                <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">{uc.icon}</span>
                                <span className="text-white font-semibold">{uc.label}</span>
                                <span className="material-symbols-outlined text-text-secondary text-[18px] ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pillar CTA */}
            <section className="py-20 px-4 bg-gradient-to-b from-background-dark to-primary/5 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Discover the full AI writing experience</h2>
                <p className="text-text-secondary mb-8">See why thousands choose DraftMind as their go-to AI writing tool.</p>
                <button onClick={() => navigate('/ai-writing-tool')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">
                    Learn More About AI Writing Tool →
                </button>
            </section>
        </PublicPageLayout>
    );
};

export default AIWriter;
