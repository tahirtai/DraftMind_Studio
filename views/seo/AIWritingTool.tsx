import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../components/PublicPageLayout';
import SEOHead from '../../components/SEOHead';

const AIWritingTool: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'DraftMind Studio',
            applicationCategory: 'Productivity',
            operatingSystem: 'Web',
            url: 'https://draft-mind-studio.vercel.app/ai-writing-tool',
            description: 'AI-powered writing tool for generating blog posts, essays, marketing copy, and more.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        }}>
            <SEOHead
                title="AI Writing Tool — Write Faster with AI | DraftMind Studio"
                description="DraftMind Studio is the best AI writing tool for creating blog posts, essays, marketing copy, and documents. Generate, edit, and export content 10x faster with AI."
                canonical="https://draft-mind-studio.vercel.app/ai-writing-tool"
            />

            {/* Hero */}
            <section className="relative overflow-hidden py-28 px-4">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] opacity-30"></div>
                <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[80px] opacity-30"></div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">#1 AI Writing Tool</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
                        The AI Writing Tool <br />That <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-yellow-300">Actually Delivers</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
                        DraftMind Studio is the all-in-one AI writing tool that helps you generate, edit, organize, and export professional content — all in a stunning workspace designed for focus.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/signup')} className="group relative px-10 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,100,0,0.5)] hover:scale-105 transition-all overflow-hidden">
                            <span className="relative z-10">Start Writing Free →</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </button>
                        <button onClick={() => navigate('/features')} className="px-10 py-4 rounded-full border border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all">
                            View All Features
                        </button>
                    </div>
                    <p className="text-sm text-text-secondary mt-6">Free to use · No credit card required · Export unlimited</p>
                </div>
            </section>

            {/* What Is Section */}
            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">What Is an AI Writing Tool?</h2>
                    <p className="text-text-secondary text-center max-w-3xl mx-auto leading-relaxed mb-8">
                        An AI writing tool uses advanced language models to help you create content faster. Instead of staring at a blank page, you describe what you need — and the AI generates polished, contextual content in seconds. DraftMind Studio takes this further by combining AI generation with a professional editor, project management, and one-click export.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        {[
                            { icon: 'bolt', stat: '10x', label: 'Faster Writing' },
                            { icon: 'group', stat: '50,000+', label: 'Documents Created' },
                            { icon: 'thumb_up', stat: '98%', label: 'User Satisfaction' },
                        ].map((s, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-background-dark border border-border-dark">
                                <span className="material-symbols-outlined text-primary text-[32px] mb-2">{s.icon}</span>
                                <div className="text-3xl font-black text-white mb-1">{s.stat}</div>
                                <div className="text-sm text-text-secondary">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Why DraftMind Is the Best AI Writing Tool</h2>
                    <p className="text-text-secondary text-center max-w-2xl mx-auto mb-16">More than just a text generator — it's a complete writing workspace.</p>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { icon: 'auto_awesome', title: 'AI Content Generation', desc: 'Generate complete blog posts, essays, emails, and marketing copy from a simple text prompt. The AI adapts to your tone and style.' },
                            { icon: 'edit_note', title: 'Professional Rich Editor', desc: 'Built on TipTap with headings, lists, code blocks, links, and formatting — the same editor used by top writing platforms.' },
                            { icon: 'folder_managed', title: 'Project Organization', desc: 'Group documents into projects. Track status (Draft → Review → Published). Never lose track of your content pipeline.' },
                            { icon: 'download', title: 'One-Click Export', desc: 'Export to PDF, DOCX, or HTML instantly. Share directly via WhatsApp, Gmail, or copy a shareable link.' },
                            { icon: 'cloud_sync', title: 'Cloud Autosave', desc: 'Every keystroke is saved to the cloud automatically. Access your documents from any device, anywhere.' },
                            { icon: 'bar_chart', title: 'Writing Analytics', desc: 'Track word counts, writing streaks, and productivity. Visualize your progress with real-time analytics dashboards.' },
                        ].map((f, i) => (
                            <div key={i} className="flex gap-5 p-6 rounded-2xl bg-surface-dark border border-border-dark hover:border-primary/30 transition-all group">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">{f.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
                                    <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Who Uses DraftMind?</h2>
                    <p className="text-text-secondary mb-12">Our AI writing tool is designed for everyone who creates with words.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Students', path: '/ai-writer-for-students', desc: 'Write essays, research papers, and notes faster', icon: 'school' },
                            { label: 'Bloggers', path: '/ai-writer-for-bloggers', desc: 'Generate blog posts, outlines, and SEO content', icon: 'rss_feed' },
                            { label: 'Marketers', path: '/ai-writer-for-marketers', desc: 'Create ad copy, emails, and landing page text', icon: 'campaign' },
                            { label: 'Content Creators', path: '/ai-writer-for-content-creators', desc: 'Scripts, captions, descriptions, and social posts', icon: 'videocam' },
                        ].map((uc, i) => (
                            <button key={i} onClick={() => navigate(uc.path)} className="flex items-start gap-4 p-6 rounded-xl bg-background-dark border border-border-dark hover:border-primary/40 transition-all text-left group">
                                <span className="material-symbols-outlined text-primary text-[28px] mt-0.5">{uc.icon}</span>
                                <div>
                                    <span className="text-white font-bold block mb-1">{uc.label}</span>
                                    <span className="text-text-secondary text-sm">{uc.desc}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Start Faster with Templates</h2>
                    <p className="text-text-secondary mb-8">Choose from ready-made templates and let AI fill in the details.</p>
                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        {[
                            { label: 'Blog Outline', path: '/blog-outline-template' },
                            { label: 'Essay', path: '/essay-template' },
                            { label: 'LinkedIn Post', path: '/linkedin-post-template' },
                            { label: 'Product Description', path: '/product-description-template' },
                        ].map((t, i) => (
                            <button key={i} onClick={() => navigate(t.path)} className="px-5 py-2.5 rounded-full bg-surface-dark border border-border-dark text-sm text-white font-medium hover:border-primary/40 hover:text-primary transition-all">
                                {t.label} →
                            </button>
                        ))}
                    </div>
                    <button onClick={() => navigate('/templates')} className="text-primary font-bold hover:underline">View All Templates →</button>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 bg-surface-dark/30 border-t border-border-dark">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: 'Is DraftMind Studio free?', a: 'Yes! DraftMind offers a generous free tier that includes AI content generation, the full editor, cloud autosave, and unlimited exports. No credit card required.' },
                            { q: 'What types of content can the AI write?', a: 'The AI can generate blog posts, essays, marketing copy, social media captions, product descriptions, emails, outlines, and virtually any text-based content.' },
                            { q: 'How is DraftMind different from ChatGPT?', a: 'DraftMind is a complete writing workspace — not just a chatbot. It combines AI generation with a rich editor, project organization, autosave, analytics, and export tools all in one cohesive interface.' },
                            { q: 'Is my data secure?', a: 'Absolutely. DraftMind is built on Supabase with row-level security. Your documents are encrypted and only accessible by you.' },
                            { q: 'Can I export my documents?', a: 'Yes! Export to PDF, Word (.docx), or HTML with a single click. You can also share documents via WhatsApp, Gmail, or a direct link.' },
                        ].map((faq, i) => (
                            <div key={i} className="p-6 rounded-xl bg-background-dark border border-border-dark">
                                <h3 className="text-white font-bold mb-2">{faq.q}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                <h2 className="text-4xl font-bold text-white mb-6">Ready to write smarter?</h2>
                <p className="text-text-secondary mb-8 text-lg">Join thousands of creators using DraftMind Studio — the AI writing tool built for results.</p>
                <button onClick={() => navigate('/signup')} className="px-10 py-4 rounded-full bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:scale-105 transition-transform hover:bg-orange-600">
                    Get Started Free →
                </button>
            </section>
        </PublicPageLayout>
    );
};

export default AIWritingTool;
