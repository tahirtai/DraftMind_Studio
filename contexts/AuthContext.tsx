import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError, Provider } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    profile: { full_name: string; avatar_url: string; bio: string; plan: string; deleted_at: string | null; status: string } | null;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
    verifyOtp: (email: string, token: string) => Promise<{ error: AuthError | null }>;
    resendOtp: (email: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    updateProfile: (data: { full_name?: string; bio?: string; avatar_url?: string }) => Promise<{ error: any }>;
    updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
    signInWithOAuth: (provider: Provider) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<AuthContextType['profile']>(null);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, bio, plan, deleted_at, status')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('[Auth] Failed to fetch profile:', error.message);
            setProfile(null);
            return;
        }

        if (data) {
            if (data.deleted_at || data.status === 'deleted') {
                // Soft-deleted user — sign them out
                setProfile(null);
                await supabase.auth.signOut();
                return;
            }
            setProfile(data);
        } else {
            setProfile(null);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else setProfile(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
            },
        });
        return { error };
    };

    const verifyOtp = async (email: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        return { error };
    };

    const resendOtp = async (email: string) => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });
        return { error };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
        return { error };
    };

    const updateProfile = async (data: { full_name?: string; bio?: string; avatar_url?: string }) => {
        if (!user) return { error: { message: 'Not authenticated' } };
        const { error } = await supabase
            .from('profiles')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', user.id);
        if (!error) await fetchProfile(user.id);
        return { error };
    };

    const updatePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        return { error };
    };

    const signInWithOAuth = async (provider: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, profile, signUp, verifyOtp, resendOtp, signIn, signOut, resetPassword, updateProfile, updatePassword, signInWithOAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
