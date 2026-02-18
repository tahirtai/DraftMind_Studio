import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const ForContentCreators: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="AI Writer for Content Creators — Scripts, Captions & More | DraftMind"
                description="DraftMind helps content creators write YouTube scripts, podcast outlines, social captions, and newsletters faster with AI. Create more content in less time."
                canonical="https://draft-mind-studio.vercel.app/ai-writer-for-content-creators"
            />

            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">videocam</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">For Creators</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        AI Writing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">Content Creators</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">YouTube scripts, podcast outlines, newsletter drafts, social captions — create all your written content in one beautiful workspace powered by AI.</p>
                    <button onClick={() => navigate('/signup')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 hover:scale-105 transition-all">Start Creating Free →</button>
                </div>
            </section>

            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Content Creation, Supercharged</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: 'play_circle', title: 'YouTube Scripts', desc: 'Generate video scripts with hooks, talking points, and CTAs. Structure your videos before hitting record.' },
                            { icon: 'podcasts', title: 'Podcast Outlines', desc: 'Create episode outlines, talking points, intro/outro scripts, and show notes for every episode.' },
                            { icon: 'mail', title: 'Newsletters', desc: 'Draft engaging newsletters with compelling subject lines, valuable content, and clear calls-to-action.' },
                            { icon: 'tag', title: 'Social Captions', desc: 'Write captions for Instagram, TikTok, Twitter, and LinkedIn. Generate hashtags and engagement hooks.' },
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
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Benefits for Creators</h2>
                    <div className="space-y-4">
                        {['Create content 10x faster with AI generation', 'Keep all scripts and drafts organized by project', 'Export to PDF for client deliverables', 'Never face creative block again', 'Cloud autosave — draft from anywhere', 'Beautiful, distraction-free writing environment'].map((b, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-surface-dark border border-border-dark">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-white">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                <h2 className="text-3xl font-bold text-white mb-4">Create more content with less effort</h2>
                <p className="text-text-secondary mb-8">Try <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">DraftMind's AI writing tool</button> — built for creators like you.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Get Started Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default ForContentCreators;
