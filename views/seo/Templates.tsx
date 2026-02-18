import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../components/PublicPageLayout';
import SEOHead from '../../components/SEOHead';

const TEMPLATES = [
    { title: 'Blog Post Outline', desc: 'Structured outline for SEO-optimized blog posts with intro, subheadings, and conclusion.', icon: 'article', path: '/blog-outline-template' },
    { title: 'Essay Template', desc: 'Academic essay structure with thesis, body paragraphs, evidence blocks, and conclusion.', icon: 'history_edu', path: '/essay-template' },
    { title: 'LinkedIn Post', desc: 'Attention-grabbing LinkedIn post with hook, value delivery, and call-to-action.', icon: 'work', path: '/linkedin-post-template' },
    { title: 'Product Description', desc: 'Compelling product descriptions with features, benefits, and persuasive copy.', icon: 'shopping_bag', path: '/product-description-template' },
];

const Templates: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Writing Templates — Start Faster with AI | DraftMind Studio"
                description="Browse DraftMind's collection of AI writing templates. Blog outlines, essays, LinkedIn posts, product descriptions, and more — ready to use in seconds."
                canonical="https://draft-mind-studio.vercel.app/templates"
            />

            {/* Hero */}
            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">description</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Templates</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Start Writing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">Seconds</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
                        Choose a template, let AI fill in your content, and customize it in our editor. No blank pages, no writer's block.
                    </p>
                </div>
            </section>

            {/* Template Cards */}
            <section className="py-16 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
                    {TEMPLATES.map((t, i) => (
                        <button key={i} onClick={() => navigate(t.path)} className="text-left p-8 rounded-2xl bg-background-dark border border-border-dark hover:border-primary/40 transition-all group hover:shadow-xl hover:shadow-primary/5">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[28px]">{t.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed mb-4">{t.desc}</p>
                            <span className="text-primary font-semibold text-sm group-hover:underline">Use Template →</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Need something custom?</h2>
                <p className="text-text-secondary mb-8">Our <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button> can generate any type of content from a simple prompt.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">
                    Start Writing Free →
                </button>
            </section>
        </PublicPageLayout>
    );
};

export default Templates;
