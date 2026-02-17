import React from 'react';

const Billing: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto p-8 pt-2">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border-dark">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-text-primary tracking-tight">Billing & Subscription</h2>
                        <p className="text-text-secondary">Manage your plan, billing history, and payment methods.</p>
                    </div>
                </div>

                <section className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-text-primary">Pro Plan</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">Active</span>
                        </div>
                        <p className="text-text-secondary text-sm max-w-lg">
                            Your next billing date is <span className="text-text-primary font-medium">November 24, 2023</span>. You will be charged $29.00 for the upcoming month.
                        </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-border-dark bg-background-dark text-text-primary hover:bg-gray-800 transition-colors text-sm font-medium">
                        Manage Subscription
                    </button>
                </section>

                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col">
                            <h4 className="text-lg font-bold text-text-primary mb-1">Free</h4>
                            <div className="mb-6"><span className="text-3xl font-bold text-text-primary">$0</span><span className="text-text-secondary text-sm">/month</span></div>
                            <button className="w-full py-2 rounded-lg border border-border-dark text-text-primary hover:bg-gray-800 transition-colors text-sm font-medium mt-auto">Downgrade</button>
                        </div>
                        <div className="bg-surface-dark rounded-xl p-6 border-2 border-primary relative flex flex-col shadow-lg shadow-primary/5">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Current Plan</div>
                            <h4 className="text-lg font-bold text-text-primary mb-1 mt-2">Pro</h4>
                            <div className="mb-6"><span className="text-3xl font-bold text-text-primary">$29</span><span className="text-text-secondary text-sm">/month</span></div>
                            <button className="w-full py-2 rounded-lg bg-primary text-white cursor-default text-sm font-medium mt-auto">Current Plan</button>
                        </div>
                        <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col">
                            <h4 className="text-lg font-bold text-text-primary mb-1">Team</h4>
                            <div className="mb-6"><span className="text-3xl font-bold text-text-primary">$99</span><span className="text-text-secondary text-sm">/month</span></div>
                            <button className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium mt-auto">Upgrade to Team</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Billing;