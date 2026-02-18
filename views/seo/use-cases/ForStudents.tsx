import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageLayout from '../../../components/PublicPageLayout';
import SEOHead from '../../../components/SEOHead';

const ForStudents: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <PublicPageLayout>
            <SEOHead
                title="AI Writer for Students — Write Better Essays & Papers | DraftMind"
                description="DraftMind helps students write essays, research papers, and study notes faster with AI. Improve your grades while saving hours of writing time."
                canonical="https://draft-mind-studio.vercel.app/ai-writer-for-students"
            />

            <section className="relative overflow-hidden py-24 px-4">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px] opacity-40"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <span className="material-symbols-outlined text-primary text-[16px]">school</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">For Students</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        AI Writing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Students</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">Write essays, research papers, and study notes in a fraction of the time. DraftMind's AI helps you structure ideas, find the right words, and improve your writing — ethically.</p>
                    <button onClick={() => navigate('/signup')} className="px-8 py-3.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 hover:scale-105 transition-all">Start Writing Free →</button>
                </div>
            </section>

            <section className="py-20 px-4 bg-surface-dark/30 border-y border-border-dark">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">How Students Use DraftMind</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { icon: 'history_edu', title: 'Essay Writing', desc: 'Generate essay outlines, thesis statements, and body paragraphs. AI helps you structure arguments and find supporting evidence.' },
                            { icon: 'science', title: 'Research Papers', desc: 'Organize research notes, generate literature reviews, and create structured academic papers with proper formatting.' },
                            { icon: 'note_alt', title: 'Study Notes', desc: 'Summarize lecture notes, create study guides, and generate flashcard content. Learn more efficiently with AI.' },
                            { icon: 'spellcheck', title: 'Grammar & Style', desc: 'Improve your writing quality with AI-powered suggestions for clarity, grammar, and academic tone.' },
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
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Benefits for Students</h2>
                    <div className="space-y-4">
                        {['Save 5+ hours per week on writing assignments', 'Never face writer\'s block again', 'Improve essay structure and argumentation', 'Export directly to PDF or Word for submission', 'Cloud autosave — never lose your work', 'Free to use — no credit card required'].map((b, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-surface-dark border border-border-dark">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                <span className="text-white">{b}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 text-center bg-gradient-to-b from-background-dark to-primary/5">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to ace your writing?</h2>
                <p className="text-text-secondary mb-8">Join thousands of students using <button onClick={() => navigate('/ai-writing-tool')} className="text-primary hover:underline font-semibold">DraftMind's AI writing tool</button>.</p>
                <button onClick={() => navigate('/signup')} className="px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-orange-600 transition-all">Get Started Free →</button>
            </section>
        </PublicPageLayout>
    );
};

export default ForStudents;
