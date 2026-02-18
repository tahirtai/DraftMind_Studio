import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const LinkedInPost: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="LinkedIn Post Template — Free AI Writing Template | DraftMind"
                description="Use DraftMind's free LinkedIn post template to write attention-grabbing posts. AI generates hooks, value delivery, and CTAs — grow your audience faster."
                canonical="https://draft-mind-studio.vercel.app/linkedin-post-template"
            />

            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">work</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Template</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">LinkedIn Post Template</h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Write LinkedIn posts that get engagement. Use this template or let AI generate high-performing posts with hooks, storytelling, and CTAs.</p>
                </div>
            </section>

            <section className="pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Example: LinkedIn Post Structure</h2>
                    <div className="p-8 rounded-2xl bg-surface-dark border border-border-dark space-y-6 font-mono text-sm">
                        <div>
                            <p className="text-primary font-bold mb-1">Hook (Line 1 — Most Critical)</p>
                            <p className="text-text-secondary">[Bold, attention-grabbing first line that makes people stop scrolling]</p>
                            <p className="text-text-secondary italic mt-1">Example: "I spent 6 months building an AI writing tool. Here's what I learned."</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Story / Context</p>
                            <p className="text-text-secondary">• Setup the situation (2-3 short lines)</p>
                            <p className="text-text-secondary">• Problem or challenge you faced</p>
                            <p className="text-text-secondary">• Keep paragraphs to 1-2 lines max</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Value / Insight (Core of the Post)</p>
                            <p className="text-text-secondary">• Key lesson or takeaway #1</p>
                            <p className="text-text-secondary">• Key lesson or takeaway #2</p>
                            <p className="text-text-secondary">• Key lesson or takeaway #3</p>
                            <p className="text-text-secondary italic mt-1">Use line breaks between each point for readability</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Call-to-Action</p>
                            <p className="text-text-secondary">[Question to drive comments, or link to resource]</p>
                            <p className="text-text-secondary italic mt-1">Example: "What's the biggest lesson you've learned building something from scratch?"</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Hashtags (3-5)</p>
                            <p className="text-text-secondary">#AIWriting #ContentCreation #Productivity</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 text-center border-t border-border-dark">
                <h2 className="text-2xl font-bold text-white mb-4">Generate LinkedIn posts with AI</h2>
                <p className="text-text-secondary mb-8">DraftMind's <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button> can generate engaging LinkedIn posts from a simple prompt.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Start Writing Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default LinkedInPost;
