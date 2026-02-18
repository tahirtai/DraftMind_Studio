import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../components/PublicPageLayout';
import SEOHead from '../../components/SEOHead';

const ARTICLES = [
    { slug: 'best-ai-writing-tools', title: 'Best AI Writing Tools in 2026', desc: 'Compare the top AI writing tools including DraftMind, Jasper, Copy.ai, and more. Find the best tool for your writing needs.', date: 'Feb 15, 2026', readTime: '8 min', tag: 'Comparison' },
    { slug: 'write-faster-with-ai', title: 'How to Write Faster with AI', desc: 'Learn practical techniques to 10x your writing speed using AI tools without sacrificing quality or authenticity.', date: 'Feb 10, 2026', readTime: '6 min', tag: 'Productivity' },
    { slug: 'ai-writing-prompts', title: '50 AI Writing Prompts to Spark Creativity', desc: 'A curated collection of AI writing prompts for blog posts, essays, social media, marketing, and creative writing.', date: 'Feb 5, 2026', readTime: '10 min', tag: 'Prompts' },
    { slug: 'ai-writing-for-students', title: 'AI Writing for Students: A Complete Guide', desc: 'How students can ethically use AI writing tools for essays, research papers, study notes, and academic success.', date: 'Jan 28, 2026', readTime: '7 min', tag: 'Education' },
    { slug: 'notion-vs-ai-writing-tools', title: 'Notion vs AI Writing Tools: Which Is Better?', desc: 'A detailed comparison of Notion and dedicated AI writing tools like DraftMind. Which one is right for your workflow?', date: 'Jan 20, 2026', readTime: '9 min', tag: 'Versus' },
];

const Blog: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Blog — AI Writing Tips, Guides & Insights | DraftMind Studio"
                description="Read the DraftMind blog for AI writing tips, productivity guides, tool comparisons, and creative prompts. Stay ahead of the AI writing revolution."
                canonical="https://draft-mind-studio.vercel.app/blog"
            />

            {/* Hero */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">menu_book</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Blog</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        The DraftMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-300">Blog</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Tips, guides, and insights on AI writing, productivity, and content creation.
                    </p>
                </div>
            </section>

            {/* Articles */}
            <section className="pb-20 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {ARTICLES.map((article, i) => (
                        <button key={i} onClick={() => navigate(`/blog/${article.slug}`)} className="w-full text-left p-8 rounded-2xl bg-surface-dark border border-border-dark hover:border-primary/40 transition-all group hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{article.tag}</span>
                                <span className="text-xs text-text-secondary">{article.date}</span>
                                <span className="text-xs text-text-secondary">· {article.readTime} read</span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{article.title}</h2>
                            <p className="text-text-secondary leading-relaxed">{article.desc}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 text-center border-t border-border-dark">
                <p className="text-text-secondary mb-4">Ready to try the AI writing tool we keep talking about?</p>
                <button onClick={() => navigate('/ai-writing-tool')} className="text-primary font-bold hover:underline text-lg">
                    Explore DraftMind AI Writing Tool →
                </button>
            </section>
        </PublicPageLayout>
    );
};

export default Blog;
