import React from 'react';
import { Phone, Globe, Mail, MapPin } from 'lucide-react';
import { JANANI_INFO } from '../constants/branding';
import OfficialLogo from './OfficialLogo';

interface JananiLetterheadHeaderProps {
  className?: string;
  isPrint?: boolean;
}

export const JananiLetterheadHeader: React.FC<JananiLetterheadHeaderProps> = ({
  className = '',
  isPrint = false,
}) => {
  return (
    <header
      className={`w-full select-none ${className}`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      {/* Main Deep Teal Green Header Bar matching reference #043228 */}
      <div className="bg-[#043228] text-white px-5 sm:px-7 py-2.5 flex items-center justify-between gap-4">
        {/* Left Side: Actual Provided Logo Image & Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Actual Official Logo Image from provided file */}
          <div className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] shrink-0 flex items-center justify-center">
           <OfficialLogo/>
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-wider uppercase text-white font-sans leading-tight">
              {JANANI_INFO.fullName}
            </h1>
            <p className="text-[10px] sm:text-xs text-[#5eead4] font-medium tracking-normal mt-0.5 leading-tight">
              {JANANI_INFO.tagline}
            </p>
          </div>
        </div>

        {/* Right Side: Contact & Web Information (Single Hotline Number) */}
        <div className="text-right text-[10px] sm:text-[11px] text-slate-100 shrink-0 space-y-0.5 font-normal">
          <div className="flex items-center justify-end gap-1.5">
            <Phone className="w-3 h-3 text-[#5eead4] shrink-0" />
            <span className="font-mono tracking-tight font-bold">{JANANI_INFO.contacts.phone}</span>
          </div>
          {JANANI_INFO.contacts.phoneSecondary && JANANI_INFO.contacts.phoneSecondary !== JANANI_INFO.contacts.phone && (
            <div className="flex items-center justify-end gap-1.5">
              <Phone className="w-3 h-3 text-[#5eead4] shrink-0" />
              <span className="font-mono tracking-tight">{JANANI_INFO.contacts.phoneSecondary}</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-1.5">
            <Globe className="w-3 h-3 text-[#5eead4] shrink-0" />
            <span>{JANANI_INFO.contacts.website}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <Mail className="w-3 h-3 text-[#5eead4] shrink-0" />
            <span>{JANANI_INFO.contacts.email}</span>
          </div>
        </div>
      </div>

      {/* Vibrant Emerald Green Accent Line */}
      <div
        className="h-1 w-full bg-[#10b981]"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      />
    </header>
  );
};

interface JananiLetterheadFooterProps {
  className?: string;
  isPrint?: boolean;
}

export const JananiLetterheadFooter: React.FC<JananiLetterheadFooterProps> = ({
  className = '',
  isPrint = false,
}) => {
  return (
    <footer
      className={`w-full select-none ${className}`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      {/* Vibrant Accent Dividing Line */}
      <div
        className="h-1 w-full bg-[#10b981]"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      />

      {/* Main Dark Green Footer Bar */}
      <div className="bg-[#043228] text-white px-4 sm:px-6 py-2 flex items-center justify-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-[#5eead4] shrink-0" />
        <p className="text-[10px] sm:text-[11px] text-white font-medium text-center">
          {JANANI_INFO.address.line1}, {JANANI_INFO.address.line2}
        </p>
      </div>
    </footer>
  );
};


