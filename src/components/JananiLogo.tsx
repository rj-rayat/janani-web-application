import React from 'react';
import { JANANI_INFO } from '../constants/branding';

interface JananiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'badge' | 'white' | 'dark' | 'print' | 'official-card';
  className?: string;
}

/**
 * Official Logo Image Component using the actual provided image (fj.png) directly.
 * No HTML/CSS or SVG vector simulation.
 */
export const JananiEmblem: React.FC<{
  fillColor?: string;
  className?: string;
  showPulse?: boolean;
}> = ({ className = 'w-full h-full' }) => {
  return (
    <img
      src="/fj.png"
      alt="Janani Diagnostic Center Emblem"
      className={`object-contain rounded-lg select-none bg-[#0d1f16] ${className}`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    />
  );
};

export const JananiLogo: React.FC<JananiLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  const titleSizes = {
    sm: 'text-xs sm:text-sm font-bold tracking-tight',
    md: 'text-sm sm:text-base font-black tracking-tight',
    lg: 'text-lg sm:text-xl font-black tracking-tight',
    xl: 'text-2xl sm:text-3xl font-black tracking-tight',
  }[size];

  const subtitleSizes = {
    sm: 'text-[9px] tracking-tight',
    md: 'text-[10px] sm:text-[11px] tracking-normal',
    lg: 'text-xs tracking-wide',
    xl: 'text-xs sm:text-sm tracking-wide',
  }[size];

  const isLightOnDark = variant === 'white';

  // Badge Variant / Official Card: display the complete authentic image
  if (variant === 'badge' || variant === 'official-card') {
    return (
      <div
        className={`bg-[#0d1f16] rounded-2xl p-4 text-center text-white flex flex-col items-center justify-center shadow-xl border border-teal-900/50 select-none ${className}`}
      >
        <img
          src="/fj.png"
          alt="Janani Diagnostic Center Official Logo"
          className="w-full max-w-[260px] h-auto object-contain rounded-xl shadow-md"
        />
      </div>
    );
  }

  // Icon only
  if (variant === 'icon-only') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions} ${className}`}>
        <img
          src="/fj.png"
          alt="Janani Diagnostic Center Logo"
          className="w-full h-full object-contain rounded-lg shadow-2xs bg-[#0d1f16]"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Provided Logo Image */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <img
          src="/fj.png"
          alt="Janani Diagnostic Center Official Logo"
          className="w-full h-full object-contain rounded-lg shadow-2xs bg-[#0d1f16]"
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        />
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-tight">
          <span
            className={`${titleSizes} ${
              isLightOnDark
                ? 'text-white'
                : variant === 'print'
                ? 'text-[#043228]'
                : 'text-slate-900'
            }`}
          >
            <span className={isLightOnDark ? 'text-white' : 'text-[#043228]'}>JANANI</span>{' '}
            <span className={isLightOnDark ? 'text-emerald-300' : 'text-teal-700'}>DIAGNOSTIC</span>{' '}
            <span className={isLightOnDark ? 'text-white' : 'text-slate-800'}>CENTER</span>
          </span>
          <span
            className={`font-semibold ${subtitleSizes} ${
              isLightOnDark ? 'text-emerald-200/90' : 'text-teal-800'
            } mt-0.5`}
          >
            {JANANI_INFO.tagline}
          </span>
        </div>
      )}
    </div>
  );
};

