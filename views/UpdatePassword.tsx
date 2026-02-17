import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const UpdatePassword: React.FC = () => {
    const navigate = useNavigate();
    const { updatePassword: authUpdatePassword } = useAuth(); // Use context method
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Check if we have a session. Supabase handles the session exchange from the URL hash automatically.
        // If the user arrived here via a magic link/recovery link, the session should be active.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Determine if we should redirect or show a message.
                // For now, let's just stay here or maybe redirect to login if no hash is present
                if (!window.location.hash) {
                    navigate('/login');
                }
            }
        };
        checkSession();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Using the updatePassword from context which wraps supabase.auth.updateUser
            const { error } = await authUpdatePassword(password);
            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
            </div>

            <div className="relative w-full max-w-[480px] bg-sidebar-dark rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-border-dark overflow-hidden">
                <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
                    <div className="mb-6 inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-3xl">lock_reset</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Set New Password</h1>
                    <p className="text-text-secondary text-sm">Please enter a new password for your account.</p>
                </div>

                <div className="px-8 pb-10">
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                            Password updated successfully! Redirecting...
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">New Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#141619] border border-border-dark rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#141619] border border-border-dark rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span>Update Password</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="mt-8 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-gray-500 text-sm">bolt</span>
                <p className="text-xs font-medium text-gray-500">Powered by DraftMind</p>
            </div>
        </div>
    );
};

export default UpdatePassword;
