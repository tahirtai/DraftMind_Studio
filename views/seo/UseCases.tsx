import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../components/PublicPageLayout';
import SEOHead from '../../components/SEOHead';

const USE_CASES = [
    { title: 'AI Writer for Students', desc: 'Write essays, research papers, and study notes faster with AI assistance. Focus on ideas while AI handles structure and grammar.', icon: 'school', path: '/ai-writer-for-students' },
    { title: 'AI Writer for Bloggers', desc: 'Generate blog post outlines, full articles, and SEO-optimized content. Publish consistently without burning out.', icon: 'rss_feed', path: '/ai-writer-for-bloggers' },
    { title: 'AI Writer for Marketers', desc: 'Create ad copy, email campaigns, landing page text, and social media posts that convert. Marketing content at scale.', icon: 'campaign', path: '/ai-writer-for-marketers' },
    { title: 'AI Writer for Content Creators', desc: 'Write YouTube scripts, podcast outlines, social captions, and newsletters. Create more content in less time.', icon: 'videocam', path: '/ai-writer-for-content-creators' },
];

const UseCases: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Use Cases — AI Writing for Every Creator | DraftMind Studio"
                description="Discover how students, bloggers, marketers, and content creators use DraftMind Studio's AI writing tool to produce better content, faster."
                canonical="https://draft-mind-studio.vercel.app/use-cases"
            />

            {/* Hero */}
            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">groups</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Use Cases</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">Every Creator</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Whether you write for work, school, or passion — DraftMind's AI writing tool adapts to your unique workflow and goals.
                    </p>
                </div>
            </section>

            {/* Use Case Cards */}
            <section className="py-16 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto space-y-6">
                    {USE_CASES.map((uc, i) => (
                        <button key={i} onClick={() => navigate(uc.path)} className="w-full flex items-start gap-6 p-8 rounded-2xl bg-background-dark border border-border-dark hover:border-primary/40 transition-all text-left group hover:shadow-xl hover:shadow-primary/5">
                            <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[32px]">{uc.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{uc.title}</h3>
                                <p className="text-text-secondary leading-relaxed">{uc.desc}</p>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary text-[24px] mt-2 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                <h2 className="text-3xl font-bold text-white mb-4">Find your use case</h2>
                <p className="text-text-secondary mb-8">Try our <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button> and see how it fits your workflow.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">
                    Start Writing Free →
                </button>
            </section>
        </PublicPageLayout>
    );
};

export default UseCases;
