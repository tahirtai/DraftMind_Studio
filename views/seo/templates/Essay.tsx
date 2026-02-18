import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const Essay: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="Essay Template — Free AI Writing Template | DraftMind"
                description="Use DraftMind's free essay template to structure academic essays. AI generates thesis statements, body paragraphs, and conclusions — perfect for students."
                canonical="https://draft-mind-studio.vercel.app/essay-template"
            />

            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">history_edu</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Template</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Essay Template</h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">A structured academic essay template with thesis, evidence blocks, and conclusion. Let AI help you write better essays, faster.</p>
                </div>
            </section>

            <section className="pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6">Example: Five-Paragraph Essay</h2>
                    <div className="p-8 rounded-2xl bg-surface-dark border border-border-dark space-y-6 font-mono text-sm">
                        <div>
                            <p className="text-primary font-bold mb-1">Title</p>
                            <p className="text-text-secondary">[Essay Title]</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Introduction</p>
                            <p className="text-text-secondary">• Hook / Opening statement</p>
                            <p className="text-text-secondary">• Background context (2-3 sentences)</p>
                            <p className="text-text-secondary">• Thesis statement: [Your central argument]</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Body Paragraph 1: [First Supporting Argument]</p>
                            <p className="text-text-secondary">• Topic sentence</p>
                            <p className="text-text-secondary">• Evidence: quote, data, or example</p>
                            <p className="text-text-secondary">• Analysis: explain how evidence supports thesis</p>
                            <p className="text-text-secondary">• Transition sentence</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Body Paragraph 2: [Second Supporting Argument]</p>
                            <p className="text-text-secondary">• Topic sentence</p>
                            <p className="text-text-secondary">• Evidence: quote, data, or example</p>
                            <p className="text-text-secondary">• Analysis: explain how evidence supports thesis</p>
                            <p className="text-text-secondary">• Transition sentence</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Body Paragraph 3: [Third Supporting Argument / Counter-argument]</p>
                            <p className="text-text-secondary">• Topic sentence</p>
                            <p className="text-text-secondary">• Evidence or counter-argument acknowledgment</p>
                            <p className="text-text-secondary">• Analysis and rebuttal</p>
                        </div>
                        <div>
                            <p className="text-primary font-bold mb-1">Conclusion</p>
                            <p className="text-text-secondary">• Restate thesis (different wording)</p>
                            <p className="text-text-secondary">• Summarize key points</p>
                            <p className="text-text-secondary">• Broader implication or call to action</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 text-center border-t border-border-dark">
                <h2 className="text-2xl font-bold text-white mb-4">Write better essays with AI</h2>
                <p className="text-text-secondary mb-8">See how <button onClick={() => navigate('/ai-writer-for-students')} className="text-primary hover:underline font-semibold">students use DraftMind</button> for essay writing, or try the <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">AI writing tool</button>.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Start Writing Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default Essay;
