import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

interface AuthProps {
    view: 'LOGIN' | 'SIGNUP';
}

const Auth: React.FC<AuthProps> = ({ view }) => {
    const navigate = useNavigate();
    const { user, signIn, signUp, verifyOtp, resendOtp, resetPassword } = useAuth();
    const isLogin = view === 'LOGIN';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    // OTP verification state
    const [awaitingOtp, setAwaitingOtp] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/dashboard', { replace: true });
    }, [user, navigate]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    navigate('/dashboard');
                }
            } else {
                if (!fullName.trim()) {
                    setError('Please enter your full name');
                    setLoading(false);
                    return;
                }
                const { error } = await signUp(email, password, fullName);
                if (error) {
                    setError(error.message);
                } else {
                    // Show OTP input screen
                    setAwaitingOtp(true);
                    setResendCooldown(60);
                    setError('');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode.trim()) {
            setError('Please enter the verification code');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { error } = await verifyOtp(email, otpCode.trim());
            if (error) {
                setError(error.message);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setError('');
        setLoading(true);
        const { error } = await resendOtp(email);
        if (error) {
            setError(error.message);
        } else {
            setResendCooldown(60);
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setError('Please enter your email address first');
            return;
        }
        setLoading(true);
        const { error } = await resetPassword(email);
        if (error) {
            setError(error.message);
        } else {
            setResetSent(true);
            setError('');
        }
        setLoading(false);
    };

    // ─── OTP Verification Screen ────────────────────────────────
    if (awaitingOtp) {
        return (
            <div className="bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-4 text-white relative overflow-hidden">
                {/* Background Effects */}
                <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
                    <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
                </div>

                <div className="relative w-full max-w-[480px] mx-4 bg-sidebar-dark rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-border-dark overflow-hidden">
                    <div className="px-4 pt-8 pb-6 sm:px-8 sm:pt-10 flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex items-center justify-center size-12 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
                            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Verify Your Email</h1>
                        <p className="text-text-secondary text-sm">
                            We sent an 8-digit code to <span className="text-white font-medium">{email}</span>. Enter it below to confirm your account.
                        </p>
                    </div>

                    <div className="px-4 pb-8 sm:px-8 sm:pb-10">
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form className="flex flex-col gap-5" onSubmit={handleVerifyOtp}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-300">Verification Code</label>
                                <input
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    className="w-full px-4 py-4 bg-[#141619] border border-border-dark rounded-lg text-white text-center text-2xl font-bold tracking-[0.5em] placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter 8-digit code"
                                    maxLength={8}
                                    autoFocus
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || otpCode.length < 8}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Verify & Continue</span>
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Didn't receive the code?{' '}
                                {resendCooldown > 0 ? (
                                    <span className="text-gray-400">Resend in {resendCooldown}s</span>
                                ) : (
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="px-8 py-5 bg-[#141619] border-t border-border-dark text-center">
                        <p className="text-sm text-gray-500">
                            Wrong email?{' '}
                            <button onClick={() => { setAwaitingOtp(false); setOtpCode(''); setError(''); }} className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
                                Go back
                            </button>
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-gray-500 text-sm">bolt</span>
                    <p className="text-xs font-medium text-gray-500">Powered by DraftMind</p>
                </div>
            </div>
        );
    }

    // ─── Login / Signup Form ────────────────────────────────────
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark p-4 gap-8">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-300 bg-sidebar-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden">
                <div className="pt-8 pb-6 px-4 sm:px-8 text-center flex flex-col items-center">
                    <Logo className="mb-6 scale-110" iconClassName="size-12" textClassName="text-2xl" />
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight">{isLogin ? 'DraftMind Studio' : 'Join DraftMind'}</h1>
                    <p className="text-text-secondary text-sm">{isLogin ? 'Enter your details to access your AI workspace.' : 'Start writing smarter with your DraftMind today.'}</p>
                </div>

                <div className="px-4 pb-8 sm:px-8 sm:pb-10">
                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {resetSent && (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                            Password reset link sent! Check your email.
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-300">Full Name</label>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#141619] border border-border-dark rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">mail</span>
                                </div>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#141619] border border-border-dark rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                {isLogin && <button type="button" onClick={handleResetPassword} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">Forgot password?</button>}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-500 text-[20px]">lock</span>
                                </div>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#141619] border border-border-dark rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="relative my-8">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-dark"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-sidebar-dark px-3 text-xs text-gray-500 uppercase tracking-wider font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-dark rounded-lg bg-[#141619] hover:bg-[#1E2126] transition-colors group">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            <span className="text-sm font-medium text-gray-200">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-dark rounded-lg bg-[#141619] hover:bg-[#1E2126] transition-colors group">
                            <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                            <span className="text-sm font-medium text-gray-200">GitHub</span>
                        </button>
                    </div>
                </div>
                <div className="px-8 py-5 bg-[#141619] border-t border-border-dark text-center">
                    <p className="text-sm text-gray-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => navigate(isLogin ? '/signup' : '/login')} className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </div>
            </div>
            <div className="mt-8 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-gray-500 text-sm">bolt</span>
                <p className="text-xs font-medium text-gray-500">Powered by DraftMind</p>
            </div>
        </div>
    );
};

export default Auth;