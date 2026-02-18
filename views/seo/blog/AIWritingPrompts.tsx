import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const PROMPTS = [
    { cat: 'Blog Posts', items: ['Write a 1000-word blog post about sustainable living tips for beginners', 'Create a listicle: 10 productivity hacks for remote workers', 'Write a how-to guide on starting a newsletter from scratch', 'Generate a comparison post: freelancing vs full-time employment', 'Write an opinion piece on the future of AI in education'] },
    { cat: 'Essays', items: ['Write a persuasive essay arguing that remote work improves productivity', 'Create an analytical essay on the impact of social media on democracy', 'Write a reflective essay on how technology has changed communication', 'Generate a cause-and-effect essay about climate change on agriculture', 'Write a compare-and-contrast essay: online vs traditional education'] },
    { cat: 'Marketing Copy', items: ['Write a product launch email for a new AI writing tool', 'Create 5 Google Ads headlines for a project management app', 'Generate a landing page hero section for a fitness app', 'Write an abandoned cart email sequence (3 emails)', 'Create 10 Instagram caption ideas for a coffee brand'] },
    { cat: 'Social Media', items: ['Write a viral LinkedIn post about lessons learned from failure', 'Create a Twitter thread explaining blockchain to beginners', 'Generate 5 TikTok video script hooks about personal finance', 'Write an Instagram carousel script about healthy morning routines', 'Create a YouTube video intro script for a tech review channel'] },
    { cat: 'Creative Writing', items: ['Write the opening chapter of a dystopian novel set in 2050', 'Create a short story about a robot learning to cook', 'Write a poem about the night sky in a big city', 'Generate dialogue between two strangers stuck in an elevator', 'Write a flash fiction piece (500 words) about time travel'] },
];

const AIWritingPrompts: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout jsonLd={{ '@context': 'https://schema.org', '@type': 'Article', headline: '50 AI Writing Prompts to Spark Creativity', datePublished: '2026-02-05', author: { '@type': 'Organization', name: 'DraftMind Studio' } }}>
            <SEOHead
                title="50 AI Writing Prompts to Spark Creativity | DraftMind Blog"
                description="A curated collection of 50 AI writing prompts for blog posts, essays, marketing copy, social media, and creative writing. Copy, paste, and start writing."
                canonical="https://draft-mind-studio.vercel.app/blog/ai-writing-prompts"
            />

            <article className="py-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">Prompts</span>
                            <span className="text-sm text-text-secondary">Feb 5, 2026 · 10 min read</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">50 AI Writing Prompts to Spark Creativity</h1>
                        <p className="text-lg text-text-secondary leading-relaxed">Not sure what to write? These 50 prompts work perfectly with any <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button> — including DraftMind. Copy a prompt, paste it in, and start creating.</p>
                    </div>

                    <div className="space-y-10">
                        {PROMPTS.map((section, i) => (
                            <div key={i}>
                                <h2 className="text-2xl font-bold text-white mb-4">{section.cat}</h2>
                                <div className="space-y-3">
                                    {section.items.map((prompt, j) => (
                                        <div key={j} className="flex items-start gap-3 p-4 rounded-xl bg-surface-dark border border-border-dark">
                                            <span className="text-primary font-bold text-sm mt-0.5">{i * 10 + j + 1}.</span>
                                            <p className="text-text-secondary text-sm leading-relaxed">{prompt}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/20">
                        <h2 className="text-xl font-bold text-white mb-2">How to Use These Prompts</h2>
                        <p className="text-text-secondary leading-relaxed">Copy any prompt above and paste it into DraftMind's AI writer. The AI will generate a complete first draft that you can then edit, expand, and export. Try combining prompts or modifying them to match your unique voice.</p>
                    </div>
                </div>
            </article>

            <section className="py-12 px-4 text-center border-t border-border-dark">
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Try These Prompts in DraftMind →</button>
                <div className="mt-6">
                    <button onClick={() => navigate('/blog')} className="text-text-secondary hover:text-primary transition-colors text-sm">← Back to Blog</button>
                </div>
            </section>
        </PublicPageLayout>
    );
};

export default AIWritingPrompts;
