import React, { useRef } from 'react';
import { Report } from '../types';
import { dbService } from '../services/db';
import { JananiEmblem } from './JananiLogo';
import {
  Printer,
  X,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  FlaskConical,
  Building2,
} from 'lucide-react';

interface DailySummaryModalProps {
  reports: Report[];
  selectedDate: string;
  onClose: () => void;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  reports,
  selectedDate,
  onClose,
}) => {
  const labConfig = dbService.getLabConfig();

  // Filter reports specifically for this selected date
  const dayReports = reports.filter((rep) => {
    const repDate = (rep.reportedAt || rep.specimenReceivedAt || '').slice(0, 10);
    return repDate === selectedDate;
  });

  // Unique patients count
  const uniquePatients = Array.from(new Set(dayReports.map((r) => r.uhid)));

  // Critical alerts count
  const criticalCount = dayReports.filter((r) =>
    Object.values(r.results).some((res: any) => res?.abnormalFlag === 'CRITICAL')
  ).length;

  // Finalized count
  const finalizedCount = dayReports.filter(
    (r) => r.status === 'verified_final' || r.status === 'authorized_by_doctor'
  ).length;

  // Group by department/category
  const categoryBreakdown = dayReports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-sm">Daily Patient Investigation &amp; Results Summary</h3>
              <p className="text-xs text-slate-400">Date: {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Daily Summary
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto print:overflow-visible print:p-0 print:m-0 text-slate-900">
          {/* Header Banner */}
          <div className="border-b-2 border-teal-900 pb-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                  <img
                    src="/fj.png"
                    alt="Janani Diagnostic Center"
                    className="w-full h-full object-contain rounded-md bg-[#0d1f16]"
                    style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-teal-950 uppercase">
                    {labConfig.labName || 'JANANI DIAGNOSTIC CENTER'}
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold">{labConfig.tagline || '(Digital Diagnostic and Consultation Center)'}</p>
                  <p className="text-[11px] text-slate-500">{labConfig.address} • Hotline: {labConfig.hotline || labConfig.phone}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg inline-block">
                  <span className="text-[11px] font-bold uppercase text-teal-900 block">DAILY LOG &amp; RESULT SUMMARY</span>
                  <span className="text-xs font-mono font-extrabold text-slate-900">
                    {new Date(selectedDate).toLocaleDateString(undefined, { dateStyle: 'full' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Patients</span>
                <strong className="text-base text-slate-900">{uniquePatients.length}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Investigations</span>
                <strong className="text-base text-teal-900">{dayReports.length}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Finalized / Authorized</span>
                <strong className="text-base text-emerald-800">{finalizedCount}</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Critical Values</span>
                <strong className="text-base text-red-700">{criticalCount}</strong>
              </div>
            </div>
          </div>

          {/* Patient and Reports Summary Table */}
          {dayReports.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
              No diagnostic investigations recorded for {selectedDate}.
            </div>
          ) : (
            <div className="space-y-6">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">#</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-44">Patient &amp; UHID</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-48">Investigation / Dept</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Key Results &amp; Findings</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-36">Impression / NID</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 w-32">Ref Doctor</th>
                    <th className="py-2.5 px-3 w-24 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dayReports.map((rep, idx) => {
                    const criticalItems = Object.entries(rep.results).filter(
                      ([_, v]: any) => v?.abnormalFlag === 'CRITICAL'
                    );
                    const abnormalItems = Object.entries(rep.results).filter(
                      ([_, v]: any) => v?.abnormalFlag === 'HIGH' || v?.abnormalFlag === 'LOW'
                    );

                    return (
                      <tr key={rep.id} className="align-top hover:bg-slate-50">
                        {/* Index */}
                        <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono text-slate-500 text-[11px]">
                          {idx + 1}
                        </td>

                        {/* Patient info */}
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <strong className="text-slate-900 block text-xs">{rep.patientName}</strong>
                          <div className="text-[10px] text-slate-500 font-mono">
                            UHID: {rep.uhid}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {rep.patientAge} {rep.patientAgeUnit}, {rep.patientGender}
                          </div>
                          <div className="text-[9px] text-teal-800 font-mono">
                            Rep: {rep.reportNo}
                          </div>
                        </td>

                        {/* Test & Dept */}
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <span className="font-bold text-slate-900 block text-xs">{rep.testName}</span>
                          <span className="text-[10px] text-teal-800 font-medium">
                            {rep.category}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">
                            Acc: {rep.accessionNo}
                          </span>
                        </td>

                        {/* Results / Parameters Summary */}
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          {Object.keys(rep.results || {}).length > 0 ? (
                            <div className="space-y-1">
                              {Object.entries(rep.results).slice(0, 4).map(([key, val]: [string, any]) => (
                                <div key={key} className="flex items-center justify-between text-[11px] gap-2">
                                  <span className="text-slate-600 truncate max-w-[140px]">{val.name || key}:</span>
                                  <div className="flex items-center gap-1 font-mono">
                                    <span className="font-bold text-slate-900">{val.value || '—'} {val.unit}</span>
                                    {val.abnormalFlag === 'CRITICAL' && (
                                      <span className="text-[9px] bg-red-600 text-white font-extrabold px-1 rounded">CRIT</span>
                                    )}
                                    {val.abnormalFlag === 'HIGH' && (
                                      <span className="text-[9px] text-amber-800 bg-amber-100 px-1 rounded font-bold">H</span>
                                    )}
                                    {val.abnormalFlag === 'LOW' && (
                                      <span className="text-[9px] text-blue-800 bg-blue-100 px-1 rounded font-bold">L</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {Object.keys(rep.results).length > 4 && (
                                <span className="text-[10px] text-slate-400 italic">
                                  +{Object.keys(rep.results).length - 4} more parameters...
                                </span>
                              )}
                            </div>
                          ) : rep.findingsNarrative ? (
                            <div className="text-[10px] text-slate-700 italic line-clamp-3">
                              {rep.findingsNarrative}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Draft / In Progress</span>
                          )}
                        </td>

                        {/* Condition / Impression */}
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <span className="text-[11px] font-semibold text-slate-800 block">
                            {rep.conditionDiagnosis || rep.clinicalInterpretation || (rep.isUltrasoundNormalId ? 'NORMAL STUDY (NID)' : 'Normal limits')}
                          </span>
                          {rep.recommendations && (
                            <span className="text-[10px] text-slate-500 block mt-0.5 italic">
                              Rec: {rep.recommendations}
                            </span>
                          )}
                        </td>

                        {/* Doctor */}
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[11px] text-slate-700">
                          <span className="font-medium block truncate max-w-[120px]">
                            {rep.referringDoctorName || 'Self Referral'}
                          </span>
                          {rep.authorizedByDoctorName && (
                            <span className="text-[9px] text-slate-400 block truncate max-w-[120px]">
                              Auth: {rep.authorizedByDoctorName}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 text-center">
                          {rep.status === 'verified_final' ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                              Final
                            </span>
                          ) : rep.status === 'authorized_by_doctor' ? (
                            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                              Authorized
                            </span>
                          ) : rep.status === 'reviewed_by_tech' ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                              Tech Ok
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block">
                              Draft
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Printable Footer with Sign-Offs */}
              <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 w-48 mx-auto font-bold text-slate-700">
                    Laboratory In-Charge
                  </div>
                  <span className="text-[10px] text-slate-400">Janani Diagnostic Centre</span>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 w-48 mx-auto font-bold text-slate-700">
                    Quality Manager
                  </div>
                  <span className="text-[10px] text-slate-400">Audit &amp; Compliance Verified</span>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 w-48 mx-auto font-bold text-slate-700">
                    Director / Consultant Pathologist
                  </div>
                  <span className="text-[10px] text-slate-400">Medical Signature Authority</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
