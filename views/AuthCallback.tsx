import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase client with detectSessionInUrl: true handles 
                // the token exchange automatically from the URL hash.
                // We just need to verify a session was established.
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('[AuthCallback] Error getting session:', error.message);
                    navigate('/login', { replace: true });
                    return;
                }

                if (session) {
                    console.log('[AuthCallback] OAuth session established, redirecting to dashboard');
                    navigate('/dashboard', { replace: true });
                } else {
                    console.warn('[AuthCallback] No session found after OAuth callback');
                    navigate('/login', { replace: true });
                }
            } catch (err) {
                console.error('[AuthCallback] Unexpected error:', err);
                navigate('/login', { replace: true });
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="flex-1 flex items-center justify-center bg-background-dark h-screen gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-text-secondary text-sm animate-pulse">Completing sign in...</span>
        </div>
    );
};

export default AuthCallback;
