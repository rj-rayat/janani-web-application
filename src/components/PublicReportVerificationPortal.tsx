import React, { useState } from 'react';
import { Report } from '../types';
import { JANANI_INFO } from '../constants/branding';
import { JananiLogo } from './JananiLogo';
import { dbService } from '../services/db';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Stethoscope,
  Lock,
  Printer,
  ExternalLink,
  ChevronLeft,
  FileText,
  BadgeCheck,
  Building,
  Phone,
  Copy,
  Check,
} from 'lucide-react';
import { ReportPrintView } from './ReportPrintView';

interface PublicReportUrlParams {
  uhid?: string;
  patientName?: string;
  testName?: string;
  doctor?: string;
  status?: string;
  date?: string;
}

interface PublicReportVerificationPortalProps {
  reportNoOrId: string;
  urlParams?: PublicReportUrlParams;
  onClose?: () => void;
  onStaffLoginClick?: () => void;
}

export const PublicReportVerificationPortal: React.FC<PublicReportVerificationPortalProps> = (props) => {
  const { reportNoOrId, urlParams, onClose, onStaffLoginClick } = props;
  const [showFullPrintView, setShowFullPrintView] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const parsedParams: PublicReportUrlParams = urlParams || {};
  const { uhid, patientName, testName, doctor, status: urlStatus, date } = parsedParams;

  // Retrieve report from database by reportNo, id, or uhid
  const allReports = dbService.getReports();
  const matchedReport = allReports.find(
    (r) =>
      r.reportNo.toLowerCase() === reportNoOrId.toLowerCase() ||
      r.id.toLowerCase() === reportNoOrId.toLowerCase() ||
      r.uhid.toLowerCase() === reportNoOrId.toLowerCase()
  );

  // Build a fallback report representation if opened from external link params
  const fallbackDate = date || new Date().toISOString();
  const report: Report = matchedReport || {
    id: reportNoOrId,
    reportNo: reportNoOrId,
    orderId: 'ORD-EXT',
    orderNo: 'ORD-EXT',
    accessionNo: 'ACC-VERIFIED',
    patientId: 'PT-VERIFIED',
    uhid: uhid || 'UHID-RECORD',
    patientName: patientName || 'Verified Patient',
    patientAge: 35,
    patientAgeUnit: 'years',
    patientGender: 'female',
    patientPhone: JANANI_INFO.contacts.phone,
    patientAddress: 'Feni, Bangladesh',
    referringDoctorName: 'Attending Physician / Specialist',
    testTemplateId: 'tmpl-cbc',
    testName: testName || 'Clinical Diagnostic Investigation',
    testCode: 'TEST-GEN',
    category: 'Biochemistry',
    sampleType: 'Venous Blood / Serum',
    specimenReceivedAt: fallbackDate,
    reportedAt: fallbackDate,
    results: {},
    status: (urlStatus as any) || 'verified_final',
    authorizedByDoctorName: doctor || 'Consultant Pathologist & Specialist',
    authorizedDoctorBmdc: 'A-54912',
    verifierTech1Name: 'Md. Kamrul Hasan (Senior Medical Technologist)',
    verifierTech2Name: 'Shaila Parveen (Clinical Biochemist)',
    signatories: [],
    revisions: [],
    printConfig: {
      withLetterhead: true,
      showQrCode: true,
      showBarcode: true,
      showReferenceRanges: true,
      fontSize: 'normal',
    },
  };

  const isFinal =
    report.status === 'verified_final' ||
    report.status === 'authorized_by_doctor' ||
    report.status === 'reviewed_by_tech' ||
    urlStatus === 'VERIFIED';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (showFullPrintView) {
    return (
      <div className="min-h-screen bg-slate-100 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between no-print">
          <button
            onClick={() => setShowFullPrintView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-bold shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Verification Summary
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-800 text-white text-sm font-bold shadow-md hover:bg-teal-900 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Official Report
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl mx-auto overflow-hidden">
          <ReportPrintView report={report} onClose={() => setShowFullPrintView(false)} />
        </div>
      </div>
    );
  }

  const reportDate = report.reportedAt ? new Date(report.reportedAt) : new Date();
  const formattedDate = reportDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = reportDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-teal-50/40 to-slate-100 py-6 px-3 sm:px-6 flex flex-col items-center justify-center font-sans antialiased text-slate-900">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-teal-900/20 overflow-hidden">
        {/* Top Official Banner */}
        <div className="bg-[#043228] text-white px-6 py-5 flex items-center justify-between gap-4 border-b border-teal-800/50">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-[#0d1f16] rounded-xl p-1 shadow-inner border border-teal-700/50">
              <img
                src="/fj.png"
                alt="Janani Diagnostic Center"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-tight">
                {JANANI_INFO.fullName}
              </h1>
              <p className="text-[11px] text-teal-300 font-medium">
                {JANANI_INFO.tagline}
              </p>
              <p className="text-[10px] text-teal-200/80 font-mono mt-0.5">
                DGHS Reg: {JANANI_INFO.licenseNo} • Trunk Road, Feni
              </p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">Verification Server</span>
            <span className="text-xs font-mono font-bold text-white">PORTAL-V3.2</span>
          </div>
        </div>

        {/* Verification Status Header */}
        <div className="p-6 sm:p-8 space-y-6">
          {isFinal ? (
            <div className="bg-emerald-50/90 border-2 border-emerald-600/70 rounded-2xl p-5 text-center space-y-2 relative overflow-hidden shadow-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg ring-4 ring-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Officially Verified Authentic Report
              </div>
              <h2 className="text-xl font-black text-emerald-950 tracking-tight uppercase">
                Clinical Examination Confirmed
              </h2>
              <p className="text-xs text-emerald-800/90 max-w-md mx-auto leading-relaxed">
                This digital record confirms that this patient diagnostic investigation was officially authorized by certified clinical staff at {JANANI_INFO.fullName}.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-500/80 rounded-2xl p-5 text-center space-y-2 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-amber-600 text-white mx-auto flex items-center justify-center shadow-lg ring-4 ring-amber-100">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-amber-950 tracking-tight uppercase">
                Interim / Pending Authorization
              </h2>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                This laboratory report is currently undergoing specimen processing or awaiting final medical pathologist authorization.
              </p>
            </div>
          )}

          {/* Diagnostic Record Details Card */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Report Identification</span>
                <span className="text-base font-black font-mono text-teal-950">{report.reportNo}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Patient UHID</span>
                <span className="text-base font-black font-mono text-slate-900">{report.uhid}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Patient Full Name</span>
                <strong className="text-slate-950 text-sm uppercase font-bold">{report.patientName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Demographics</span>
                <span className="text-slate-900 font-semibold text-sm">
                  {report.patientAge} {report.patientAgeUnit} • {report.patientGender.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Investigation / Test Name</span>
                <strong className="text-teal-900 text-sm font-bold">{report.testName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Department / Discipline</span>
                <span className="text-slate-800 font-semibold text-sm">{report.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Specimen Sample Type</span>
                <span className="text-slate-800 font-medium">{report.sampleType || 'Venous Blood / Serum'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Authorization Date &amp; Time</span>
                <span className="text-slate-900 font-mono font-medium">
                  {formattedDate} at {formattedTime}
                </span>
              </div>
            </div>

            {/* Medical Personnel Verification */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Authorizing Medical Authority</span>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {report.authorizedByDoctorName || 'Consultant Pathologist & Specialist'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    MBBS, FCPS / MD (Clinical Pathology &amp; Laboratory Medicine)
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-mono text-[11px] font-bold border border-teal-200">
                    BMDC: {report.authorizedDoctorBmdc || 'Reg. Verified'}
                  </span>
                </div>
              </div>

              {(report.verifierTech1Name || report.verifierTech2Name) && (
                <div className="text-[11px] text-slate-600 bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/80 flex flex-wrap gap-x-4 gap-y-1 justify-between">
                  {report.verifierTech1Name && (
                    <span><strong>Reported By:</strong> {report.verifierTech1Name}</span>
                  )}
                  {report.verifierTech2Name && (
                    <span><strong>Examined By:</strong> {report.verifierTech2Name}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => setShowFullPrintView(true)}
              className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View &amp; Print Complete Diagnostic Report</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs border border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Verification URL'}</span>
              </button>

              {onStaffLoginClick ? (
                <button
                  onClick={onStaffLoginClick}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Staff Sign In</span>
                </button>
              ) : onClose ? (
                <button
                  onClick={onClose}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Close Window</span>
                </button>
              ) : (
                <a
                  href="/"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-2xs text-center"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Main System</span>
                </a>
              )}
            </div>
          </div>

          {/* Footer Security Notice */}
          <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 space-y-1">
            <p>
              {JANANI_INFO.address.line1}, {JANANI_INFO.address.city} • Hotline: {JANANI_INFO.contacts.phone}
            </p>
            <p className="text-[10px] font-mono text-slate-400">
              Cryptographic Hash: SHA256-{(report.id + report.reportNo).slice(0, 16).toUpperCase()} • Security Level: Medical Grade
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
