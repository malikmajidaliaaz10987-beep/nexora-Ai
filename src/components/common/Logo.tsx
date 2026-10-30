/**
 * NEXORA AI — Abstract Futuristic "N" Logo Mark & Typography
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract Futuristic "N" Symbol */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6] via-[#6366F1] to-[#06B6D4] rounded-xl blur-[5px] opacity-75 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-full h-full bg-[#101625] border border-[#8B5CF6]/40 rounded-xl p-1.5 flex items-center justify-center shadow-inner overflow-hidden">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="nexoraGrad1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="0.5" stopColor="#A855F7" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="nexoraGrad2" x1="40" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {/* Futuristic Segmented 'N' Architecture */}
            <path d="M8 32V8L18 20V32H8Z" fill="url(#nexoraGrad1)" />
            <path d="M32 8V32L22 20V8H32Z" fill="url(#nexoraGrad2)" />
            <circle cx="20" cy="20" r="3" fill="#F8FAFC" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`tracking-wider ${textSizes[size]} text-white`}>
            NEXORA
          </span>
          <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-widest text-[#94A3B8] uppercase mt-0.5 font-medium">
            One Platform. Limitless Possibilities.
          </span>
        )}
      </div>
    </div>
  );
};
