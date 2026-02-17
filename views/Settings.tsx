import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setBio(profile.bio || '');
        }
        if (user) {
            setEmail(user.email || '');
        }
    }, [profile, user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        setSaveMsg('');
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, bio, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        setSaving(false);
        setSaveMsg(error ? 'Failed to save.' : 'Profile updated!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const handleChangePassword = async () => {
        if (!newPassword) return;
        if (newPassword !== confirmPassword) {
            setPasswordMsg('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg('Password must be at least 6 characters.');
            return;
        }
        setChangingPassword(true);
        setPasswordMsg('');
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setChangingPassword(false);
        if (error) {
            setPasswordMsg(error.message);
        } else {
            setPasswordMsg('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        }
        setTimeout(() => setPasswordMsg(''), 4000);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const initials = fullName ? fullName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) : '?';

    return (
        <div className="flex-1 overflow-y-auto bg-background-dark">
            <div className="mx-auto max-w-4xl px-8 py-10">
                <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-text-primary transition-colors">Home</button>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                    <span className="font-medium text-text-primary">Account Settings</span>
                </nav>
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Account Settings</h1>
                    <p className="mt-2 text-base text-text-secondary">Manage your profile details, security preferences, and account data.</p>
                </div>

                {/* Profile Section */}
                <section className="mb-12 rounded-xl border border-border-dark bg-sidebar-dark p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-text-primary">Profile Information</h2>
                    </div>
                    <div className="flex flex-col gap-8 md:flex-row">
                        <div className="flex flex-col items-center gap-4 md:w-1/3">
                            <div className="relative group h-32 w-32 cursor-pointer">
                                <div className="h-full w-full overflow-hidden rounded-full ring-4 ring-border-dark bg-surface-dark flex items-center justify-center">
                                    {profile?.avatar_url ? (
                                        <img alt="Profile avatar" className="h-full w-full object-cover" src={profile.avatar_url} />
                                    ) : (
                                        <span className="text-4xl font-bold text-text-secondary">{initials}</span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-text-secondary capitalize">{profile?.plan || 'Free'} Plan</span>
                        </div>
                        <div className="flex-1 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                <input
                                    className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Email Address</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="material-symbols-outlined text-text-secondary text-lg">mail</span>
                                    </div>
                                    <input
                                        className="w-full rounded-lg border-border-dark bg-background-dark pl-10 pr-3 py-2 text-text-secondary placeholder-zinc-600 cursor-not-allowed"
                                        value={email}
                                        disabled
                                        type="email"
                                    />
                                </div>
                                <p className="text-xs text-text-secondary">Email cannot be changed here.</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Bio</label>
                                <textarea
                                    className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            <div className="pt-2 flex items-center gap-3">
                                <button onClick={handleSaveProfile} disabled={saving} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-dark transition-colors disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                {saveMsg && <span className={`text-sm ${saveMsg.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{saveMsg}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="mb-12">
                    <div className="mb-6 border-b border-border-dark pb-2">
                        <h2 className="text-xl font-semibold text-text-primary">Security</h2>
                    </div>
                    <div className="rounded-xl border border-border-dark bg-sidebar-dark p-8 shadow-sm">
                        <h3 className="mb-4 text-base font-medium text-text-primary">Change Password</h3>
                        <div className="max-w-md space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">New Password</label>
                                <input
                                    className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Confirm New Password</label>
                                <input
                                    className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="pt-2 flex items-center gap-3">
                                <button onClick={handleChangePassword} disabled={changingPassword} className="rounded-lg border border-border-dark bg-transparent px-4 py-2 text-sm font-semibold text-text-primary hover:bg-white/5 transition-colors disabled:opacity-50">
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                                {passwordMsg && <span className={`text-sm ${passwordMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{passwordMsg}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sign Out & Danger Zone  */}
                <section className="mb-8">
                    <div className="mb-6 border-b border-border-dark pb-2">
                        <h2 className="text-xl font-semibold text-text-primary">Account</h2>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border-dark bg-sidebar-dark p-6">
                        <div className="space-y-1">
                            <h3 className="text-base font-medium text-text-primary">Sign Out</h3>
                            <p className="text-sm text-text-secondary">Sign out of your account on this device.</p>
                        </div>
                        <button onClick={handleSignOut} className="rounded-lg border border-border-dark bg-transparent px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/5 transition-colors">
                            Sign Out
                        </button>
                    </div>
                </section>

                <section>
                    <div className="mb-6 border-b border-border-dark pb-2">
                        <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
                    </div>
                    <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-8">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-text-primary">Delete Account</h3>
                                <p className="text-sm text-text-secondary">Once you delete your account, there is no going back. Please be certain.</p>
                            </div>
                            <button className="whitespace-nowrap rounded-lg border border-red-900/50 bg-background-dark px-5 py-2.5 text-sm font-bold text-red-500 shadow-sm hover:bg-red-900/20 transition-colors">
                                Delete Personal Account
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;