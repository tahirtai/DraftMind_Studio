import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const ForBloggers: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="AI Writer for Bloggers — Generate Blog Posts Fast | DraftMind"
                description="DraftMind helps bloggers generate blog post outlines, full articles, and SEO content. Publish consistently and grow your audience with AI-powered writing."
                canonical="https://draft-mind-studio.vercel.app/ai-writer-for-bloggers"
            />

            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 right-1/3 w-96 h-96 bg-green-500/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">rss_feed</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">For Bloggers</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        AI Writing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Bloggers</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Publish more content, more consistently. Generate blog post outlines, full articles, and SEO-optimized content — all within a beautiful writing workspace.</p>
                    <button onClick={() => navigate('/signup')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 hover:scale-105 transition-all">Start Blogging Free →</button>
                </div>
            </section>

            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">How Bloggers Use DraftMind</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: 'list_alt', title: 'Blog Outlines', desc: 'Generate structured outlines with headings, subpoints, and key arguments in seconds. Start every post with a clear roadmap.' },
                            { icon: 'article', title: 'Full Articles', desc: 'Generate complete blog posts from a single prompt. The AI writes in your tone and adapts to your niche.' },
                            { icon: 'trending_up', title: 'SEO Content', desc: 'Create keyword-rich content that ranks on Google. Optimize titles, meta descriptions, and headers.' },
                            { icon: 'schedule', title: 'Consistent Publishing', desc: 'Never miss a publish date again. Batch-generate content and maintain your editorial calendar effortlessly.' },
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-background-dark border border-border-dark group hover:border-primary/40 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Why Bloggers Love DraftMind</h2>
                    <div className="space-y-4">
                        {['Generate a full blog post in under 2 minutes', 'Built-in rich editor — no switching between tools', 'Export to HTML for direct publishing', 'Organize posts by project and topic', 'Cloud autosave means no lost drafts', 'Use the blog outline template to get started instantly'].map((b, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-surface-dark border border-border-dark">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-white">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                <h2 className="text-3xl font-bold text-white mb-4">Start your next blog post with AI</h2>
                <p className="text-text-secondary mb-8">Try <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">DraftMind's AI writing tool</button> or use our <button onClick={() => navigate('/blog-outline-template')} className="text-primary hover:underline font-semibold">blog outline template</button>.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Get Started Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default ForBloggers;
