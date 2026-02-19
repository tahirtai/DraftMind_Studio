import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const RecoverAccount: React.FC = () => {
    const { user, loading: authLoading, profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [recovering, setRecovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Wait for auth to initialize
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 animate-pulse">
                    <span className="material-symbols-outlined">auto_awesome</span>
                </div>
            </div>
        );
    }

    // Not authenticated — go to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Profile not deleted — go to dashboard
    if (profile && !profile.deleted_at && profile.status !== 'deleted') {
        return <Navigate to="/dashboard" replace />;
    }

    // Still loading profile
    if (!profile) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 animate-pulse">
                    <span className="material-symbols-outlined">auto_awesome</span>
                </div>
            </div>
        );
    }

    const deletedDate = profile.deleted_at
        ? new Date(profile.deleted_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'Unknown date';

    const handleRecover = async () => {
        setRecovering(true);
        setError(null);
        try {
            const { error: rpcError } = await supabase.rpc('recover_user');
            if (rpcError) throw rpcError;

            // Refetch profile to clear deleted state
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, bio, plan, deleted_at, status')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;

            if (data && !data.deleted_at && data.status !== 'deleted') {
                // Force a page reload to re-initialize AuthContext with clean profile
                window.location.href = '/dashboard';
            } else {
                setError('Recovery did not complete. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to recover account. Please try again.');
        } finally {
            setRecovering(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                        <span className="text-xl font-bold text-text-primary">DraftMind Studio</span>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/[0.06] bg-surface-dark p-8">
                    {/* Warning icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-amber-400">warning</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
                        Account Scheduled for Deletion
                    </h1>
                    <p className="text-text-secondary text-center text-sm mb-6">
                        Your account was scheduled for deletion on <strong className="text-text-primary">{deletedDate}</strong>.
                        You can restore it now to keep all your data.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* Restore button */}
                    <button
                        onClick={handleRecover}
                        disabled={recovering}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {recovering ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                                Restoring...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-base">restore</span>
                                Restore My Account
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/[0.06]"></div>
                        <span className="text-xs text-text-secondary">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]"></div>
                    </div>

                    {/* Sign out */}
                    <button
                        onClick={handleSignOut}
                        className="w-full py-3 px-4 rounded-xl border border-white/[0.06] bg-white/[0.03] text-text-secondary hover:text-text-primary hover:border-white/[0.12] transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Sign Out Instead
                    </button>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-text-secondary mt-6 leading-relaxed">
                    If you don't restore your account, it will be permanently deleted
                    after the recovery period ends.
                </p>
            </div>
        </div>
    );
};

export default RecoverAccount;
