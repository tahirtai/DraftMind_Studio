import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SYSTEM_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Dweeb',
];

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, updateProfile } = useAuth();

    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setBio(profile.bio || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        setSaveMsg('');

        const { error } = await updateProfile({
            full_name: fullName,
            bio,
            avatar_url: avatarUrl
        });

        setSaving(false);
        setSaveMsg(error ? 'Failed to save.' : 'Profile updated!');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user!.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const initials = fullName ? fullName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) : '?';

    return (
        <div className="flex-1 overflow-y-auto bg-background-dark">
            <div className="mx-auto max-w-4xl px-4 md:px-8 py-10">
                <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
                    <button onClick={() => navigate('/dashboard')} className="hover:text-text-primary transition-colors">Home</button>
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                    <span className="font-medium text-text-primary">Profile</span>
                </nav>
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Your Profile</h1>
                    <p className="mt-2 text-base text-text-secondary">Manage your public presence and personal details.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Avatar Section */}
                    <section className="flex-1 lg:max-w-xs space-y-6">
                        <div className="rounded-xl border border-border-dark bg-sidebar-dark p-6 shadow-sm flex flex-col items-center">
                            <div className="relative group h-32 w-32 mb-4">
                                <div className="h-full w-full overflow-hidden rounded-full ring-4 ring-border-dark bg-surface-dark flex items-center justify-center relative">
                                    {avatarUrl ? (
                                        <img alt="Profile avatar" className="h-full w-full object-cover" src={avatarUrl} />
                                    ) : (
                                        <span className="text-4xl font-bold text-text-secondary">{initials}</span>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-orange-600 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <h3 className="text-base font-semibold text-text-primary mb-3">Choose System Avatar</h3>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {SYSTEM_AVATARS.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setAvatarUrl(url)}
                                        className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${avatarUrl === url ? 'border-primary scale-110' : 'border-transparent hover:border-gray-500'}`}
                                    >
                                        <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Details Section */}
                    <section className="flex-[2] rounded-xl border border-border-dark bg-sidebar-dark p-6 md:p-8 shadow-sm h-fit">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-text-primary">Personal Details</h2>
                        </div>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                    <input
                                        className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        type="text"
                                        placeholder="Display Name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-secondary">Email</label>
                                    <input
                                        className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-secondary placeholder-zinc-600 cursor-not-allowed"
                                        value={user?.email || ''}
                                        disabled
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-secondary">Bio</label>
                                <textarea
                                    className="w-full rounded-lg border-border-dark bg-background-dark px-3 py-2 text-text-primary placeholder-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary transition-shadow min-h-[100px]"
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us a bit about yourself..."
                                />
                                <p className="text-xs text-text-secondary text-right">{bio.length}/200</p>
                            </div>

                            <div className="pt-4 flex items-center gap-3 border-t border-border-dark">
                                <button onClick={handleSaveProfile} disabled={saving} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-dark transition-colors disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                                {saveMsg && <span className={`text-sm animate-in fade-in slide-in-from-left-2 ${saveMsg.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{saveMsg}</span>}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
