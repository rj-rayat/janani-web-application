import React from 'react';
import { Report, TestTemplate } from '../../types';
import { ReportSignatures } from './ReportSignatures';

interface RadiologyReportLayoutProps {
  report: Report;
  template?: TestTemplate;
  isCompact?: boolean;
}

export const RadiologyReportLayout: React.FC<RadiologyReportLayoutProps> = ({
  report,
  template,
  isCompact = false,
}) => {
  const isEcg =
    report.category === 'Cardiology' ||
    report.testName.toLowerCase().includes('ecg') ||
    report.testName.toLowerCase().includes('ekg');

  const isHistopath =
    report.category === 'Histopathology & Cytology' ||
    report.testName.toLowerCase().includes('histopath') ||
    report.testName.toLowerCase().includes('biopsy') ||
    report.testName.toLowerCase().includes('fnac');

  const content = report.narrativeContent || template?.defaultNarrative || '';
  const diagnosis = report.conditionDiagnosis || '';
  const advice = report.recommendations || '';

  return (
    <div className="w-full flex flex-col flex-1" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      {/* 1. Clinical Examination / Indication Header */}
      <div className="mb-3 select-none">
        <div className="inline-block bg-[#043228] text-white text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-sm mb-1">
          {isHistopath ? 'SPECIMEN & CLINICAL HISTORY' : isEcg ? 'RECORDING SPECIFICATIONS' : 'EXAMINATION & CLINICAL INDICATION'}
        </div>
        <div className="border border-slate-200 rounded-lg p-2.5 bg-white text-xs text-slate-800 font-sans">
          {report.notes || (isEcg ? '12-Lead Standard Surface Electrocardiogram • Paper speed: 25 mm/s • Voltage: 10 mm/mV' : 'Routine clinical investigation.')}
        </div>
      </div>

      {/* 2. Structured Findings Section */}
      <div className="border border-slate-300 rounded-lg overflow-hidden mb-3 bg-white shadow-2xs">
        <div className="bg-[#043228] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 sm:px-4">
          {isHistopath ? 'GROSS & MICROSCOPIC EXAMINATION' : isEcg ? 'ELECTROPHYSIOLOGICAL MEASUREMENTS & FINDINGS' : 'RADIOLOGICAL FINDINGS'}
        </div>
        <div className="p-3 sm:p-4 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
          {content || 'Detailed examination report recorded.'}
        </div>
      </div>

      {/* 3. Diagnostic Impression / Diagnosis Section */}
      <div className="mb-3 select-none">
        <div className="inline-block bg-[#043228] text-white text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-sm mb-1">
          {isHistopath ? 'HISTOPATHOLOGICAL DIAGNOSIS' : 'DIAGNOSTIC IMPRESSION'}
        </div>
        <div className="border border-slate-200 rounded-lg p-2.5 bg-white text-xs text-slate-900 font-sans leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
            <p className="font-bold text-slate-950 text-[11px] sm:text-xs leading-relaxed uppercase">
              {diagnosis || 'NORMAL EXAMINATION. NO SIGNIFICANT ABNORMALITY DETECTED.'}
            </p>
          </div>
          {advice && (
            <p className="text-[10px] text-slate-600 italic mt-1.5 pl-4 border-t border-slate-100 pt-1">
              Clinical Advice: {advice}
            </p>
          )}
        </div>
      </div>

      {/* 4. Signatures Block */}
      <div className="mt-auto pt-2 border-t border-slate-200">
        <ReportSignatures
          report={report}
          category={isEcg ? 'Cardiology' : isHistopath ? 'Histopathology' : 'Radiology'}
          isCompact={isCompact}
        />
      </div>
    </div>
  );
};
