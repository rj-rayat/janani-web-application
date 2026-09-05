import React from 'react';
import { TestCategory } from '../../types';
import {
  FlaskConical,
  Activity,
  Heart,
  Radio,
  FileSpreadsheet,
  Microscope,
  Stethoscope,
  Scan,
} from 'lucide-react';

interface ReportTitleRibbonProps {
  title: string;
  category?: TestCategory | string;
  className?: string;
  isCompact?: boolean;
}

export const ReportTitleRibbon: React.FC<ReportTitleRibbonProps> = ({
  title,
  category = '',
  className = '',
  isCompact = false,
}) => {
  // Select matching medical emblem icon based on category and title
  const getIcon = () => {
    const titleLower = title.toLowerCase();
    const catLower = (category || '').toLowerCase();

    if (titleLower.includes('echo') || titleLower.includes('cardio') || catLower.includes('cardiology')) {
      return <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/20" />;
    }
    if (titleLower.includes('usg') || titleLower.includes('ultra') || titleLower.includes('sonogram') || catLower.includes('ultrasonography')) {
      return <Scan className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    }
    if (titleLower.includes('x-ray') || titleLower.includes('radiology') || catLower.includes('radiology')) {
      return <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    }
    if (titleLower.includes('ecg') || titleLower.includes('ekg')) {
      return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    }
    if (titleLower.includes('histo') || titleLower.includes('fnac') || titleLower.includes('biopsy') || catLower.includes('histopathology')) {
      return <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    }
    return <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-2 sm:my-3 select-none ${className}`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      {/* Centered Circular Green Medical Emblem with double horizontal lines on sides */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-4 max-w-2xl">
        {/* Left Double Line with Accent Dot */}
        <div className="flex-1 flex items-center gap-1.5">
          <div className="h-0.5 w-full bg-slate-300 relative">
            <div className="absolute -top-1 right-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Circular Emblem Icon Badge */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#043228] border-2 border-[#10b981] flex items-center justify-center shadow-xs shrink-0">
          {getIcon()}
        </div>

        {/* Right Double Line with Accent Dot */}
        <div className="flex-1 flex items-center gap-1.5">
          <div className="h-0.5 w-full bg-slate-300 relative">
            <div className="absolute -top-1 left-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Title Heading */}
      <div className="flex items-center gap-2 mt-1">
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <h2
          className={`font-black tracking-wider uppercase text-slate-950 font-sans text-center ${
            isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg md:text-xl'
          }`}
        >
          {title}
        </h2>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
      </div>
    </div>
  );
};
