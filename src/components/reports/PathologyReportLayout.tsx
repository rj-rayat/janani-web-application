import React from 'react';
import { Report, TestTemplate } from '../../types';
import { FlaskConical, FileText } from 'lucide-react';
import { ReportSignatures } from './ReportSignatures';

interface PathologyReportLayoutProps {
  report: Report;
  template?: TestTemplate;
  isCompact?: boolean;
}

export const PathologyReportLayout: React.FC<PathologyReportLayoutProps> = ({
  report,
  template,
  isCompact = false,
}) => {
  // Determine subheader title e.g. "HAEMATOLOGY (CBC)" or "BIOCHEMISTRY"
  const categoryHeader = report.category.toUpperCase();
  const subTitle = report.testName ? `${categoryHeader} (${report.testName.toUpperCase()})` : categoryHeader;

  // Filter test parameters
  const parameters = template?.parameters || [];

  return (
    <div className="w-full flex flex-col flex-1" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      {/* Category Sub-header Banner */}
      <div className="flex items-center gap-2 mb-2 select-none">
        <FlaskConical className="w-4 h-4 text-[#043228]" />
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#043228]">
          {subTitle}
        </h3>
      </div>

      {/* Main Pathology Results Table */}
      <div className="border border-slate-300 rounded-lg overflow-hidden mb-3 bg-white shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#043228] text-white text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-wider">
              <th className="py-2 px-3 sm:px-4 w-[30%]">TEST NAME</th>
              <th className="py-2 px-3 text-center w-[16%]">RESULT</th>
              <th className="py-2 px-3 text-center w-[14%]">UNIT</th>
              <th className="py-2 px-3 sm:px-4 text-center w-[22%]">REFERENCE RANGE</th>
              <th className="py-2 px-3 text-left w-[18%]">INTERPRETATION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {parameters.map((param) => {
              if (param.isHeading) {
                return (
                  <tr key={param.id} className="bg-slate-100 font-black text-slate-900">
                    <td
                      colSpan={5}
                      className="py-1.5 px-3 sm:px-4 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-950 font-bold bg-slate-100"
                    >
                      {param.name.replace(/---/g, '').trim()}
                    </td>
                  </tr>
                );
              }

              const res = report.results[param.id] || { value: '', abnormalFlag: 'NORMAL' };
              const isHigh = res.abnormalFlag === 'HIGH' || res.abnormalFlag === 'CRITICAL';
              const isLow = res.abnormalFlag === 'LOW';
              const isNormal = !isHigh && !isLow;

              return (
                <tr
                  key={param.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Test Parameter Name */}
                  <td className="py-1.5 px-3 sm:px-4 font-semibold text-slate-800 text-[11px] sm:text-xs">
                    {param.name}
                  </td>

                  {/* Result Observed Value */}
                  <td className="py-1.5 px-3 text-center font-bold text-slate-950 font-mono text-[11.5px] sm:text-xs">
                    {res.value || '—'}
                  </td>

                  {/* Unit */}
                  <td className="py-1.5 px-3 text-center text-slate-600 font-mono text-[10px] sm:text-[11px]">
                    {param.unit || '—'}
                  </td>

                  {/* Reference Range */}
                  <td className="py-1.5 px-3 sm:px-4 text-center text-slate-700 font-sans text-[10.5px] sm:text-[11px]">
                    {param.refRange || '—'}
                  </td>

                  {/* Interpretation with Colored Dot */}
                  <td className="py-1.5 px-3 text-left">
                    <div className="flex items-center gap-1.5">
                      {isHigh ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                          <span className="text-red-700 font-bold text-[10px] sm:text-[11px]">
                            {res.abnormalFlag === 'CRITICAL' ? 'Critical' : 'High'}
                          </span>
                        </>
                      ) : isLow ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-amber-700 font-bold text-[10px] sm:text-[11px]">
                            Low
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                          <span className="text-slate-700 font-medium text-[10px] sm:text-[11px]">
                            Normal
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Fallback if no parameters in template */}
            {parameters.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-500 italic">
                  No discrete test parameters configured for this report.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Additional Microscopic / Morphology Observations if present */}
      {report.narrativeContent && (
        <div className="mb-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] sm:text-[11px] text-slate-800 space-y-1">
          <p className="whitespace-pre-line leading-relaxed font-sans">{report.narrativeContent}</p>
        </div>
      )}

      {/* Bottom Summary Grid: INTERPRETATION GUIDE, NOTE, and FULL-WIDTH SIGNATURES */}
      <div className="mt-auto pt-2 border-t border-slate-200 space-y-2">
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Interpretation Guide */}
          <div className="col-span-12 sm:col-span-6 bg-slate-50/80 border border-slate-200 rounded-lg p-2 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-wider">
              INTERPRETATION GUIDE:
            </span>
            <div className="flex items-center gap-3 text-[9.5px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700 font-medium">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span className="text-slate-700 font-medium">High</span>
              </div>
            </div>
          </div>

          {/* Note Box */}
          <div className="col-span-12 sm:col-span-6 bg-slate-50/80 border border-slate-200 rounded-lg p-2 flex items-center gap-2 text-[9.5px] text-slate-600">
            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Please correlate clinically with patient symptoms &amp; clinical history.</span>
          </div>
        </div>

        {/* Full-width clean signature section */}
        <ReportSignatures report={report} category="Pathology" isCompact={isCompact} />
      </div>
    </div>
  );
};
