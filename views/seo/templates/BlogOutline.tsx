import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const BlogOutline: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Blog Post Outline Template — Free AI Writing Template | DraftMind"
                description="Use DraftMind's free blog post outline template to structure your articles. AI fills in headings, subpoints, and CTAs — start writing instantly."
                canonical="https://draft-mind-studio.vercel.app/blog-outline-template"
            />

            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">article</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Template</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Blog Post Outline Template</h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Structured outlines for SEO-optimized blog posts. Let AI generate headings, talking points, and a clear flow — then customize in the editor.</p>
                </div>
            </section>

            {/* Example Template */}
            <section className="pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Example: Blog Post Outline</h2>
                    <div className="p-8 rounded-2xl bg-surface-dark border border-border-dark space-y-6 font-mono text-sm">
                        <div>
                            <p className="text-primary font-bold mb-1">Title</p>
                            <p className="text-text-secondary">[Your Blog Post Title — Include Primary Keyword]</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Introduction (100-150 words)</p>
                            <p className="text-text-secondary">• Hook: Attention-grabbing opening line</p>
                            <p className="text-text-secondary">• Context: Why this topic matters</p>
                            <p className="text-text-secondary">• Thesis: What the reader will learn</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">H2: [Main Point 1]</p>
                            <p className="text-text-secondary">• Key argument or information</p>
                            <p className="text-text-secondary">• Supporting evidence or example</p>
                            <p className="text-text-secondary">• Transition to next section</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">H2: [Main Point 2]</p>
                            <p className="text-text-secondary">• Key argument or information</p>
                            <p className="text-text-secondary">• Data, statistics, or case study</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">H2: [Main Point 3]</p>
                            <p className="text-text-secondary">• Final major insight</p>
                            <p className="text-text-secondary">• Practical tips or action items</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Conclusion</p>
                            <p className="text-text-secondary">• Summary of key takeaways</p>
                            <p className="text-text-secondary">• Call-to-action</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 text-center border-t border-border-dark">
                <h2 className="text-2xl font-bold text-white mb-4">Use this template with AI</h2>
                <p className="text-text-secondary mb-8">DraftMind's <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button> can fill in this outline with your topic in seconds.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Start Writing Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default BlogOutline;
