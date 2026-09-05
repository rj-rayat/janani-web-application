import React from 'react';
import { Report, TestTemplate } from '../../types';
import { FileText } from 'lucide-react';
import { ReportSignatures } from './ReportSignatures';

interface EchocardiographyReportLayoutProps {
  report: Report;
  template?: TestTemplate;
  isCompact?: boolean;
}

/**
 * Authentic 17-segment Myocardial Polar Bullseye Diagram
 */
const WallMotionBullseye: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Ring - Basal Segments (6 sectors) */}
    <circle cx="80" cy="80" r="70" stroke="#043228" strokeWidth="2.5" fill="#ecfdf5" />
    <circle cx="80" cy="80" r="48" stroke="#043228" strokeWidth="2" fill="#d1fae5" />
    <circle cx="80" cy="80" r="26" stroke="#043228" strokeWidth="2" fill="#a7f3d0" />
    <circle cx="80" cy="80" r="10" stroke="#043228" strokeWidth="1.5" fill="#043228" />

    {/* Sector Dividers for Outer Ring */}
    <line x1="80" y1="10" x2="80" y2="32" stroke="#043228" strokeWidth="1.5" />
    <line x1="80" y1="128" x2="80" y2="150" stroke="#043228" strokeWidth="1.5" />
    <line x1="19" y1="45" x2="38" y2="56" stroke="#043228" strokeWidth="1.5" />
    <line x1="141" y1="45" x2="122" y2="56" stroke="#043228" strokeWidth="1.5" />
    <line x1="19" y1="115" x2="38" y2="104" stroke="#043228" strokeWidth="1.5" />
    <line x1="141" y1="115" x2="122" y2="104" stroke="#043228" strokeWidth="1.5" />

    {/* Mid Ring Dividers (6 sectors) */}
    <line x1="80" y1="32" x2="80" y2="54" stroke="#043228" strokeWidth="1.5" />
    <line x1="80" y1="106" x2="80" y2="128" stroke="#043228" strokeWidth="1.5" />
    <line x1="38" y1="56" x2="57" y2="67" stroke="#043228" strokeWidth="1.5" />
    <line x1="122" y1="56" x2="103" y2="67" stroke="#043228" strokeWidth="1.5" />
    <line x1="38" y1="104" x2="57" y2="93" stroke="#043228" strokeWidth="1.5" />
    <line x1="122" y1="104" x2="103" y2="93" stroke="#043228" strokeWidth="1.5" />

    {/* Apical Ring Dividers (4 sectors) */}
    <line x1="80" y1="54" x2="80" y2="70" stroke="#043228" strokeWidth="1.5" />
    <line x1="80" y1="90" x2="80" y2="106" stroke="#043228" strokeWidth="1.5" />
    <line x1="54" y1="80" x2="70" y2="80" stroke="#043228" strokeWidth="1.5" />
    <line x1="90" y1="80" x2="106" y2="80" stroke="#043228" strokeWidth="1.5" />
  </svg>
);

export const EchocardiographyReportLayout: React.FC<EchocardiographyReportLayoutProps> = ({
  report,
  template,
  isCompact = false,
}) => {
  // Clinical Indication
  const clinicalIndication = report.notes || 'Routine evaluation.';

  // Default measurements or extracted from results object if present
  const r = report.results || {};

  const chamberData = [
    { name: 'Aorta', value: r['p_ao']?.value || '2.8 cm' },
    { name: 'Left Atrium (LA)', value: r['p_la']?.value || '3.4 cm' },
    { name: 'Interventricular Septum (IVS)', value: r['p_ivs']?.value || '0.9 cm' },
    { name: 'Left Ventricular End Diastole (LVEDD)', value: r['p_lvedd']?.value || '4.8 cm' },
    { name: 'Left Ventricular End Systole (LVESD)', value: r['p_lvesd']?.value || '3.1 cm' },
    { name: 'Posterior Wall (PW)', value: r['p_pw']?.value || '0.9 cm' },
    { name: 'Right Atrium (RA)', value: r['p_ra']?.value || '3.2 cm' },
    { name: 'Right Ventricle (RV)', value: r['p_rv']?.value || '2.4 cm' },
  ];

  const lvFunctionData = [
    { name: 'LVEF (Teichholz)', value: r['p_lvef']?.value || '62 %' },
    { name: 'Fractional Shortening', value: r['p_fs']?.value || '36 %' },
    { name: 'E/A Ratio', value: r['p_ea']?.value || '1.25' },
    { name: 'Deceleration Time', value: r['p_dt']?.value || '180 msec' },
    { name: 'IVRT', value: r['p_ivrt']?.value || '88 msec' },
    { name: "E' (Septal)", value: r['p_eprime']?.value || '10 cm/s' },
    { name: "E/E' (Septal)", value: r['p_eeprime']?.value || '6.1' },
    { name: 'LV SYSTOLIC FUNCTION', value: r['p_lvsys']?.value || 'Normal', isBold: true },
  ];

  const valveData = [
    { valve: 'Mitral Valve', findings: r['p_mv']?.value || 'Normal' },
    { valve: 'Aortic Valve', findings: r['p_av']?.value || 'Normal' },
    { valve: 'Tricuspid Valve', findings: r['p_tv']?.value || 'Normal' },
    { valve: 'Pulmonary Valve', findings: r['p_pv']?.value || 'Normal' },
  ];

  const dopplerData = [
    { param: 'Mitral Inflow (E/A)', finding: '1.25', gradient: '—' },
    { param: 'Mitral Regurgitation (MR)', finding: 'Trace', gradient: '—' },
    { param: 'Aortic Regurgitation (AR)', finding: 'None', gradient: '—' },
    { param: 'Tricuspid Regurgitation (TR)', finding: 'Mild', gradient: 'RVSP ≈ 28 mmHg' },
    { param: 'Pulmonary Regurgitation (PR)', finding: 'None', gradient: '—' },
  ];

  const summaryBullets = [
    'Normal cardiac chamber sizes.',
    'Global LV systolic function is normal. LVEF ≈ 62%.',
    'No significant valvular abnormality.',
    'Mild tricuspid regurgitation.',
    'No pericardial effusion.',
    'Overall study is within normal limits.',
  ];

  return (
    <div className="w-full flex flex-col flex-1" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      {/* 1. Clinical Indication Badge */}
      <div className="flex items-center gap-2 mb-2.5 select-none">
        <div className="bg-[#043228] text-white text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-sm">
          CLINICAL INDICATION
        </div>
        <span className="text-xs text-slate-800 font-semibold font-sans">
          {clinicalIndication}
        </span>
      </div>

      {/* 2. 3-Column Structured Measurements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-2.5">
        {/* Box 1: CHAMBER MEASUREMENTS */}
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
          <div className="bg-[#043228] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider py-1 px-2.5">
            CHAMBER MEASUREMENTS
          </div>
          <table className="w-full text-[10px] sm:text-[10.5px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-1 px-2 text-left">PARAMETER</th>
                <th className="py-1 px-2 text-right">MEASUREMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chamberData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-0.5 px-2 text-slate-700 font-medium">{item.name}</td>
                  <td className="py-0.5 px-2 text-right font-bold text-slate-900 font-mono">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Box 2: LEFT VENTRICULAR FUNCTION */}
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
          <div className="bg-[#043228] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider py-1 px-2.5">
            LEFT VENTRICULAR FUNCTION
          </div>
          <table className="w-full text-[10px] sm:text-[10.5px]">
            <tbody className="divide-y divide-slate-100">
              {lvFunctionData.map((item, idx) => (
                <tr key={idx} className={`hover:bg-slate-50/50 ${item.isBold ? 'bg-emerald-50/40 font-bold' : ''}`}>
                  <td className={`py-1 px-2 text-slate-700 ${item.isBold ? 'font-bold text-[#043228]' : 'font-medium'}`}>
                    {item.name}
                  </td>
                  <td className={`py-1 px-2 text-right font-mono ${item.isBold ? 'font-bold text-[#043228]' : 'font-bold text-slate-900'}`}>
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Box 3: VALVULAR ASSESSMENT & PERICARDIUM */}
        <div className="flex flex-col gap-2">
          <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs flex-1">
            <div className="bg-[#043228] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider py-1 px-2.5">
              VALVULAR ASSESSMENT
            </div>
            <table className="w-full text-[10px] sm:text-[10.5px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-1 px-2 text-left">VALVE</th>
                  <th className="py-1 px-2 text-right">FINDINGS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {valveData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-1 px-2 text-slate-700 font-medium">{item.valve}</td>
                    <td className="py-1 px-2 text-right font-bold text-slate-900">{item.findings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
            <div className="bg-[#043228] text-white text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider py-0.5 px-2.5">
              PERICARDIUM
            </div>
            <div className="p-1.5 text-[10px] text-slate-800 font-medium">
              No pericardial effusion seen.
            </div>
          </div>
        </div>
      </div>

      {/* 3. 2-Column Doppler Study & Wall Motion Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 mb-2.5">
        {/* Doppler Study Table (7 cols) */}
        <div className="md:col-span-7 border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
          <div className="bg-[#043228] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider py-1 px-2.5">
            DOPPLER STUDY
          </div>
          <table className="w-full text-[10px] sm:text-[10.5px]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-1 px-2 text-left">PARAMETER</th>
                <th className="py-1 px-2 text-center">FINDING</th>
                <th className="py-1 px-2 text-right">GRADIENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dopplerData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-1 px-2 text-slate-700 font-medium">{item.param}</td>
                  <td className="py-1 px-2 text-center font-bold text-slate-900">{item.finding}</td>
                  <td className="py-1 px-2 text-right font-mono text-slate-700">{item.gradient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Wall Motion Analysis Bullseye Polar Map (5 cols) */}
        <div className="md:col-span-5 border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs flex flex-col">
          <div className="bg-[#043228] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider py-1 px-2.5">
            WALL MOTION ANALYSIS
          </div>
          <div className="p-2 flex items-center justify-between gap-2 flex-1">
            <div className="shrink-0 flex items-center justify-center">
              <WallMotionBullseye className="w-18 h-18 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-0.5 text-[9px] sm:text-[9.5px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-slate-700">Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700">Hypokinetic</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span className="text-slate-700">Akinetic</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-700 shrink-0" />
                <span className="text-slate-700">Dyskinetic</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 py-1 px-2 text-center text-[9.5px] font-bold text-slate-800">
            Overall LV wall motion is normal.
          </div>
        </div>
      </div>

      {/* 4. SUMMARY / IMPRESSION & NOTE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 mb-2.5">
        {/* Impression Bullets */}
        <div className="md:col-span-8 border border-slate-300 rounded-lg p-2.5 bg-white shadow-2xs">
          <span className="block text-[9.5px] font-bold uppercase text-slate-900 tracking-wider mb-1">
            SUMMARY / IMPRESSION
          </span>
          <div className="space-y-0.5">
            {summaryBullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-[10.5px] text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <span className="leading-tight">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note Box */}
        <div className="md:col-span-4 bg-slate-50/80 border border-slate-300 rounded-lg p-2.5 flex items-start gap-2">
          <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-3 h-3 text-slate-700" />
          </div>
          <div>
            <span className="block text-[9px] font-bold uppercase text-slate-900 tracking-wider">
              NOTE
            </span>
            <p className="text-[8.5px] sm:text-[9px] text-slate-600 leading-tight mt-0.5">
              Clinical correlation is advised. This is a professional opinion based on echocardiographic study and should be interpreted in light of clinical findings.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Signatures Block */}
      <div className="mt-auto pt-2 border-t border-slate-200">
        <ReportSignatures report={report} category="Cardiology" isCompact={isCompact} />
      </div>
    </div>
  );
};
