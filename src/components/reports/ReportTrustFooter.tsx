import React from 'react';
import { ShieldCheck, Clock, HeartHandshake } from 'lucide-react';

interface ReportTrustFooterProps {
  className?: string;
  isCompact?: boolean;
}

export const ReportTrustFooter: React.FC<ReportTrustFooterProps> = ({
  className = '',
  isCompact = false,
}) => {
  return (
    <div
      className={`w-full border-t border-slate-200 py-2.5 px-4 bg-white select-none ${className}`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
        {/* Badge 1: Accurate Result */}
        <div className="flex items-center justify-center gap-2 text-left">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
          </div>
          <div>
            <span className="block text-[9px] sm:text-[10px] font-black uppercase text-slate-900 leading-tight">
              ACCURATE RESULT
            </span>
            <span className="block text-[8px] sm:text-[9px] text-slate-500 leading-tight">
              You Can Trust
            </span>
          </div>
        </div>

        {/* Badge 2: Timely Report */}
        <div className="flex items-center justify-center gap-2 text-left">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
          </div>
          <div>
            <span className="block text-[9px] sm:text-[10px] font-black uppercase text-slate-900 leading-tight">
              TIMELY REPORT
            </span>
            <span className="block text-[8px] sm:text-[9px] text-slate-500 leading-tight">
              You Can Rely On
            </span>
          </div>
        </div>

        {/* Badge 3: Care That You Deserve */}
        <div className="flex items-center justify-center gap-2 text-left">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
          </div>
          <div>
            <span className="block text-[9px] sm:text-[10px] font-black uppercase text-slate-900 leading-tight">
              CARE THAT
            </span>
            <span className="block text-[8px] sm:text-[9px] text-slate-500 leading-tight">
              You Deserve
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
