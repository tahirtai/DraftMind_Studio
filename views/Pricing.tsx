import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background-dark text-text-primary font-sans selection:bg-primary/30">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-background-dark/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="cursor-pointer" onClick={() => navigate('/')}>
                        <Logo />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => navigate('/')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Home</button>
                        <button onClick={() => navigate('/about')} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">About</button>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-medium text-white hover:text-primary transition-colors">Login</button>
                        <button onClick={() => navigate('/signup')} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-orange-600 hover:scale-105 active:scale-95">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-white hover:text-primary transition-colors">
                            Login
                        </button>
                        <button
                            className="p-2 text-text-secondary hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-surface-dark border-b border-border-dark p-4 flex flex-col gap-4 md:hidden shadow-2xl animate-in slide-in-from-top-2 duration-200">
                        <button onClick={() => navigate('/')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Home</button>
                        <button onClick={() => navigate('/about')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">About</button>
                        <hr className="border-border-dark" />
                        <button onClick={() => navigate('/login')} className="text-left px-4 py-3 rounded-lg hover:bg-white/5 text-text-primary font-medium">Login</button>
                        <button onClick={() => navigate('/signup')} className="text-center w-full py-3 rounded-lg bg-primary text-white font-bold shadow-lg">Get Started</button>
                    </div>
                )}
            </header>

            <main className="py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Header */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">pricing</span>
                        </h1>
                        <p className="text-text-secondary text-xl max-w-2xl mx-auto">
                            Start for free, upgrade when you need more power. No hidden fees.
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center mt-8 gap-4">
                            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-text-secondary'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative w-14 h-8 rounded-full bg-surface-dark border border-border-dark flex items-center px-1 transition-colors hover:border-primary/50 cursor-pointer"
                            >
                                <div className={`w-6 h-6 rounded-full bg-primary shadow-sm transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-text-secondary'}`}>Yearly <span className="text-primary text-xs">(Save 20%)</span></span>
                        </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                        {/* Free Plan */}
                        <div className="relative rounded-2xl bg-surface-dark border border-border-dark p-8 flex flex-col hover:border-text-secondary/30 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <p className="text-text-secondary text-sm mb-6">Perfect for trying out DraftMind.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">₹0</span>
                                <span className="text-text-secondary">/month</span>
                            </div>
                            <button onClick={() => navigate('/signup')} className="w-full py-3 rounded-lg border border-border-dark text-text-primary hover:bg-white/5 transition-colors font-bold text-sm mb-8">
                                Start for Free
                            </button>
                            <ul className="space-y-4 text-sm text-text-secondary flex-1">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> 5 Projects</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Basic AI Generation</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Community Support</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-gray-600 text-[20px]">check</span> Export to PDF only</li>
                            </ul>
                        </div>

                        {/* Pro Plan */}
                        <div className="relative rounded-2xl bg-[#161b22] border-2 border-primary p-8 flex flex-col shadow-2xl shadow-primary/10 transform md:-translate-y-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg shadow-primary/20">Most Popular</div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <p className="text-orange-200/70 text-sm mb-6">For professional content creators.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">{billingCycle === 'monthly' ? '₹2499' : '₹1999'}</span>
                                <span className="text-text-secondary">/month</span>
                            </div>
                            <button onClick={() => navigate('/signup')} className="w-full py-3 rounded-lg bg-primary text-white hover:bg-orange-600 hover:scale-[1.02] transition-all shadow-lg shadow-primary/25 font-bold text-sm mb-8">
                                Get Started
                            </button>
                            <ul className="space-y-4 text-sm text-gray-300 flex-1">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Unlimited Projects</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Advanced GPT-4 AI Models</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Priority Email Support</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Analytics Dashboard</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> All Export Formats</li>
                            </ul>
                        </div>

                        {/* Team Plan */}
                        <div className="relative rounded-2xl bg-surface-dark border border-border-dark p-8 flex flex-col hover:border-text-secondary/30 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <h3 className="text-xl font-bold text-white mb-2">Team</h3>
                            <p className="text-text-secondary text-sm mb-6">Collaboration tools for agencies.</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">₹7999</span>
                                <span className="text-text-secondary">/month</span>
                            </div>
                            <button onClick={() => navigate('/signup')} className="w-full py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-bold mb-8">
                                Contact Sales
                            </button>
                            <ul className="space-y-4 text-sm text-text-secondary flex-1">
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Everything in Pro</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Unlimited Team Members</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Dedicated Account Manager</li>
                                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> SSO Integration</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-border-dark bg-surface-dark px-4 py-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-text-secondary">
                        <button onClick={() => navigate('/about')} className="hover:text-primary transition-colors">About</button>
                        <button onClick={() => navigate('/pricing')} className="hover:text-primary transition-colors">Pricing</button>
                        <a className="hover:text-primary transition-colors" href="#">Twitter</a>
                        <a className="hover:text-primary transition-colors" href="#">LinkedIn</a>
                    </div>
                    <p className="text-sm text-text-secondary">
                        © 2023 DraftMind Studio Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Pricing;
