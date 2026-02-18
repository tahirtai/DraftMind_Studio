import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const ForMarketers: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="AI Writer for Marketers — Create Marketing Copy Faster | DraftMind"
                description="DraftMind helps marketers create ad copy, email campaigns, landing pages, and social media posts with AI. Scale your content production effortlessly."
                canonical="https://draft-mind-studio.vercel.app/ai-writer-for-marketers"
            />

            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">campaign</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">For Marketers</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        AI Writing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Marketers</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Create high-converting ad copy, email campaigns, landing page text, and social media posts — all in one workspace. Scale your content without scaling your team.</p>
                    <button onClick={() => navigate('/signup')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 hover:scale-105 transition-all">Start Writing Free →</button>
                </div>
            </section>

            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Marketing Content, Powered by AI</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: 'ads_click', title: 'Ad Copy', desc: 'Generate Google Ads, Facebook Ads, and LinkedIn ad copy that converts. A/B test variations in seconds.' },
                            { icon: 'email', title: 'Email Campaigns', desc: 'Write compelling email subject lines, body copy, and CTAs. Create entire newsletter sequences with AI.' },
                            { icon: 'web', title: 'Landing Page Copy', desc: 'Generate hero headlines, value propositions, feature descriptions, and persuasive CTAs for landing pages.' },
                            { icon: 'share', title: 'Social Media Posts', desc: 'Create engaging Twitter threads, Instagram captions, LinkedIn posts, and Facebook updates at scale.' },
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
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Why Marketers Choose DraftMind</h2>
                    <div className="space-y-4">
                        {['Produce 10x more content with the same team', 'Generate multiple copy variations for A/B testing', 'Keep all marketing content organized by campaign', 'Export directly to PDF or Word for client presentations', 'Maintain brand voice consistency with AI', 'Free to start — upgrade as you grow'].map((b, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-surface-dark border border-border-dark">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-white">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                <h2 className="text-3xl font-bold text-white mb-4">Scale your marketing content with AI</h2>
                <p className="text-text-secondary mb-8">Explore <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">DraftMind's AI writing tool</button> or try a <button onClick={() => navigate('/product-description-template')} className="text-primary hover:underline font-semibold">product description template</button>.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Get Started Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default ForMarketers;
