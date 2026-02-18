import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const ProductDescription: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Product Description Template — Free AI Writing Template | DraftMind"
                description="Use DraftMind's free product description template to write compelling product copy. AI generates features, benefits, and persuasive CTAs for any product."
                canonical="https://draft-mind-studio.vercel.app/product-description-template"
            />

            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">shopping_bag</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Template</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Product Description Template</h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Write product descriptions that sell. This template covers features, benefits, social proof, and CTAs — perfect for e-commerce, SaaS, or any product.</p>
                </div>
            </section>

            <section className="pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Example: Product Description</h2>
                    <div className="p-8 rounded-2xl bg-surface-dark border border-border-dark space-y-6 font-mono text-sm">
                        <div>
                            <p className="text-primary font-bold mb-1">Product Name</p>
                            <p className="text-text-secondary">[Your Product Name]</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Tagline (1 line)</p>
                            <p className="text-text-secondary">[Short, punchy tagline that captures the essence]</p>
                            <p className="text-text-secondary italic mt-1">Example: "The AI writing tool that actually delivers."</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Opening Paragraph (2-3 sentences)</p>
                            <p className="text-text-secondary">• What is the product?</p>
                            <p className="text-text-secondary">• Who is it for?</p>
                            <p className="text-text-secondary">• What's the core value proposition?</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Key Features (3-5 bullet points)</p>
                            <p className="text-text-secondary">• Feature 1: [Name] — [Benefit]</p>
                            <p className="text-text-secondary">• Feature 2: [Name] — [Benefit]</p>
                            <p className="text-text-secondary">• Feature 3: [Name] — [Benefit]</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Benefits (Why it matters)</p>
                            <p className="text-text-secondary">• Save time / money / effort</p>
                            <p className="text-text-secondary">• Outperform alternatives</p>
                            <p className="text-text-secondary">• Specific, measurable result</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Social Proof</p>
                            <p className="text-text-secondary">"[Customer quote or statistic]"</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Call-to-Action</p>
                            <p className="text-text-secondary">[Clear CTA button text, e.g. "Start Free Trial" or "Buy Now"]</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 text-center border-t border-border-dark">
                <h2 className="text-2xl font-bold text-white mb-4">Write product descriptions with AI</h2>
                <p className="text-text-secondary mb-8">Use DraftMind's <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button> to generate persuasive product descriptions instantly.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Start Writing Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default ProductDescription;
