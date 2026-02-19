import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const { theme, setTheme } = useTheme();

    const [saving, setSaving] = useState(false);
    const [emailDigests, setEmailDigests] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Delete Account Modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const storedDigest = localStorage.getItem('draftmind_email_digest');
        if (storedDigest !== null) {
            setEmailDigests(storedDigest === 'true');
        }
    }, []);

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
    };

    const handleEmailDigestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setEmailDigests(checked);
        localStorage.setItem('draftmind_email_digest', String(checked));
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        const isEmailProvider = user?.app_metadata?.providers?.includes('email');

        if (isEmailProvider && !currentPassword) {
            setPasswordError('Please enter your current password');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setSaving(true);
        try {
            // Check if user is signed in via Email/Password provider
            const isEmailProvider = user?.app_metadata?.providers?.includes('email');

            // Only verify current password if the user actually has one (Email provider)
            if (isEmailProvider && user?.email) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: currentPassword,
                });

                if (signInError) {
                    // This causes the 400 error in console, which is expected for wrong passwords
                    throw new Error('The current password you entered is incorrect.');
                }
            } else if (!isEmailProvider && currentPassword) {
                // If user is OAuth (Google etc) but entered a current password, we can't verify it against a password hash
                // But typically OAuth users don't have a password. 
                // If they are setting one for the first time, we technically don't need to verify "current".
                // However, to follow the UI instruction, if they typed something, we might want to warn them.
                // For now, let's assume if they are NOT email provider, they are setting it for the first time 
                // and we shouldn't have forced them to enter `currentPassword` in the UI validation.
                // We will handle this by making `currentPassword` optional in UI for non-email users.
            }

            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setPasswordSuccess('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const { error } = await supabase.rpc('soft_delete_user');
            if (error) throw error;

            setDeleteSuccess(true);
            setDeleteModalOpen(false);

            // Sign out after a short delay so user can read the message
            setTimeout(async () => {
                await signOut();
                navigate('/');
            }, 4500);
        } catch (err: any) {
            alert('Failed to delete account: ' + (err.message || 'Unknown error'));
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background-dark">
            <div className="mx-auto max-w-4xl px-4 md:px-8 py-10">
                <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-text-primary transition-colors">Home</button>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                    <span className="text-text-primary font-medium">Settings</span>
                </nav>

                <h1 className="text-3xl font-bold text-text-primary mb-8 tracking-tight">Settings</h1>

                <div className="flex flex-col gap-8">

                    {/* Appearance */}
                    <section className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                                <span className="material-symbols-outlined text-[24px]">palette</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">Appearance</h2>
                                <p className="text-sm text-text-secondary">Customize your workspace look and feel.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`group relative p-4 rounded-xl border transition-all ${theme === 'light' ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary' : 'bg-background-dark border-border-dark hover:border-text-secondary/50'}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`material-symbols-outlined ${theme === 'light' ? 'text-primary' : 'text-text-secondary'}`}>light_mode</span>
                                    <span className={`font-semibold ${theme === 'light' ? 'text-primary' : 'text-text-primary'}`}>Light</span>
                                </div>
                                <div className="h-16 rounded-lg bg-gray-100 border border-gray-200"></div>
                                {theme === 'light' && <div className="absolute top-4 right-4 text-primary"><span className="material-symbols-outlined">check_circle</span></div>}
                            </button>

                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`group relative p-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary' : 'bg-background-dark border-border-dark hover:border-text-secondary/50'}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`material-symbols-outlined ${theme === 'dark' ? 'text-primary' : 'text-text-secondary'}`}>dark_mode</span>
                                    <span className={`font-semibold ${theme === 'dark' ? 'text-primary' : 'text-text-primary'}`}>Dark</span>
                                </div>
                                <div className="h-16 rounded-lg bg-[#111827] border border-gray-700"></div>
                                {theme === 'dark' && <div className="absolute top-4 right-4 text-primary"><span className="material-symbols-outlined">check_circle</span></div>}
                            </button>

                            <button
                                onClick={() => handleThemeChange('system')}
                                className={`group relative p-4 rounded-xl border transition-all ${theme === 'system' ? 'bg-primary/10 border-primary shadow-sm ring-1 ring-primary' : 'bg-background-dark border-border-dark hover:border-text-secondary/50'}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`material-symbols-outlined ${theme === 'system' ? 'text-primary' : 'text-text-secondary'}`}>settings_brightness</span>
                                    <span className={`font-semibold ${theme === 'system' ? 'text-primary' : 'text-text-primary'}`}>System</span>
                                </div>
                                <div className="h-16 rounded-lg bg-gradient-to-r from-gray-100 to-[#111827] border border-gray-400"></div>
                                {theme === 'system' && <div className="absolute top-4 right-4 text-primary"><span className="material-symbols-outlined">check_circle</span></div>}
                            </button>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
                                <span className="material-symbols-outlined text-[24px]">notifications</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                                <p className="text-sm text-text-secondary">Manage how we communicate with you.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-background-dark border border-border-dark">
                                <div>
                                    <h3 className="text-text-primary font-medium">Email Digests</h3>
                                    <p className="text-sm text-text-secondary">Receive a weekly summary of your project activity.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={emailDigests} onChange={handleEmailDigestChange} />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-900/20 rounded-lg text-green-400">
                                <span className="material-symbols-outlined text-[24px]">security</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">Security</h2>
                                <p className="text-sm text-text-secondary">Update your password and security settings.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                            {passwordError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder={user?.app_metadata?.providers?.includes('email') ? '••••••••' : 'Not required for social logins'}
                                    disabled={!user?.app_metadata?.providers?.includes('email')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Verifying & Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </section>

                    {/* Danger Zone */}
                    <section className="rounded-xl border border-red-900/30 p-6 bg-red-900/5">
                        <h2 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h2>
                        <p className="text-sm text-text-secondary mb-6">Critical actions for your account.</p>

                        {deleteSuccess && (
                            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex items-center gap-3">
                                <span className="material-symbols-outlined">check_circle</span>
                                <p>Your account has been scheduled for deletion. You can recover it by signing in again within the recovery period. Signing you out...</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 border border-red-900/20 rounded-lg bg-background-dark">
                            <div>
                                <h3 className="text-text-primary font-medium">Delete Account</h3>
                                <p className="text-sm text-text-secondary">Schedule your account and data for deletion.</p>
                            </div>
                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                disabled={deleteSuccess}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                itemName="your account"
                itemType="account"
                title="Delete Account?"
                description="Your account will be scheduled for deletion. Your data will be retained during a recovery period, after which it will be permanently removed."
                confirmText="Schedule Deletion"
            />
        </div>
    );
};

export default Settings;