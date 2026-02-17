import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Billing: React.FC = () => {
    const { profile } = useAuth();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const currentPlan = profile?.plan || 'free'; // 'free', 'pro', 'team'

    return (
        <div className="flex-1 overflow-y-auto w-full bg-background-dark text-text-primary">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Simple, transparent pricing</h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Start for free, upgrade when you need more power. No hidden fees.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center mt-8 gap-4">
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-text-secondary'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-14 h-8 rounded-full bg-surface-dark border border-border-dark flex items-center px-1 transition-colors hover:border-primary/50"
                        >
                            <div className={`w-6 h-6 rounded-full bg-primary shadow-sm transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-text-secondary'}`}>Yearly <span className="text-primary text-xs">(Save 20%)</span></span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Free Plan */}
                    <div className="relative rounded-2xl bg-surface-dark border border-border-dark p-8 flex flex-col hover:border-text-secondary/30 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                        <p className="text-text-secondary text-sm mb-6">Perfect for trying out DraftMind.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">₹0</span>
                            <span className="text-text-secondary">/month</span>
                        </div>
                        <button className={`w-full py-3 rounded-lg font-bold text-sm mb-8 transition-all ${currentPlan === 'free' ? 'bg-white/10 text-white cursor-default' : 'bg-transparent border border-border-dark text-text-primary hover:bg-white/5'}`}>
                            {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                        </button>
                        <ul className="space-y-4 text-sm text-text-secondary flex-1">
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> 5 Projects</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Basic AI Generation</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-[20px]">check</span> Community Support</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-gray-600 text-[20px]">check</span> Export to PDF only</li>
                        </ul>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative rounded-2xl bg-[#161b22] border-2 border-primary p-8 flex flex-col shadow-2xl shadow-primary/10 transform scale-105 z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                        <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                        <p className="text-orange-200/70 text-sm mb-6">For professional content creators.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">{billingCycle === 'monthly' ? '₹2499' : '₹1999'}</span>
                            <span className="text-text-secondary">/month</span>
                        </div>
                        <button className={`w-full py-3 rounded-lg font-bold text-sm mb-8 transition-all shadow-lg shadow-primary/25 ${currentPlan === 'pro' ? 'bg-primary/20 text-primary border border-primary cursor-default' : 'bg-primary text-white hover:bg-orange-600 hover:scale-[1.02]'}`}>
                            {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                        </button>
                        <ul className="space-y-4 text-sm text-gray-300 flex-1">
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Unlimited Projects</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Advanced GPT-4 AI Models</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Priority Email Support</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> Analytics Dashboard</li>
                            <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary text-[20px]">check</span> All Export Formats (PDF, DOCX, MD)</li>
                        </ul>
                    </div>

                    {/* Team Plan */}
                    <div className="relative rounded-2xl bg-surface-dark border border-border-dark p-8 flex flex-col hover:border-text-secondary/30 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">Team</h3>
                        <p className="text-text-secondary text-sm mb-6">Collaboration tools for agencies.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-white">₹7999</span>
                            <span className="text-text-secondary">/month</span>
                        </div>
                        <button className="w-full py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-bold mb-8">
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

                {/* Subscription Details (Only if logged in and has a plan) */}
                {profile && profile.plan !== 'free' && (
                    <div className="mt-16 max-w-4xl mx-auto bg-surface-dark rounded-xl border border-border-dark p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4">Current Subscription</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">Plan</p>
                                <p className="text-white font-medium capitalize">{profile.plan} Plan</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Billing Cycle</p>
                                <p className="text-white font-medium">Monthly</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Next Billing Date</p>
                                <p className="text-white font-medium">Oct 24, 2026</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:underline">Manage Payment Method</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Billing;