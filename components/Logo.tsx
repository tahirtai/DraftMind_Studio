import React from 'react';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', iconClassName = 'size-8', textClassName = 'text-lg', showText = true }) => {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            <div className={`relative flex items-center justify-center ${iconClassName}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-orange-400 rounded-xl opacity-20 rotate-3"></div>
                <div className="relative bg-gradient-to-tr from-[#1a1d21] to-[#252932] border border-white/10 rounded-xl shadow-2xl p-1.5 flex items-center justify-center w-full h-full overflow-hidden">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
                        <path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 9C6 9 3 12 3 15C3 18 5 21 9 21C11.5 21 12 19 12 19C12 19 12.5 21 15 21C19 21 21 18 21 15C21 12 18 9 18 9" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
                        <defs>
                            <linearGradient id="paint0_linear" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#EA580C" />
                                <stop offset="1" stopColor="#FDBA74" />
                            </linearGradient>
                            <linearGradient id="paint1_linear" x1="12" y1="9" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FDBA74" />
                                <stop offset="1" stopColor="#EA580C" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            {showText && (
                <div className={`font-bold tracking-tight text-white ${textClassName}`}>
                    DraftMind <span className="text-primary">Studio</span>
                </div>
            )}
        </div>
    );
};

export default Logo;
