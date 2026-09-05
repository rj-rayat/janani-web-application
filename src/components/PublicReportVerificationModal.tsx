import React from 'react';
import { Report } from '../types';
import { JANANI_INFO } from '../constants/branding';
import { JananiLogo } from './JananiLogo';
import { QRCodeDisplay } from './QRCodeDisplay';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  Stethoscope,
  X,
  Lock,
} from 'lucide-react';
import OfficialLogo from './OfficialLogo';

interface PublicReportVerificationModalProps {
  report: Report;
  onClose: () => void;
}

export const PublicReportVerificationModal: React.FC<PublicReportVerificationModalProps> = ({
  report,
  onClose,
}) => {
  const isFinal = report.status === 'verified_final' || report.status === 'authorized_by_doctor';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-teal-800/30 max-w-xl w-full p-6 sm:p-8 relative overflow-hidden text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <OfficialLogo/>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-teal-700" />
            Official Clinical Verification Gateway
          </div>
        </div>

        {/* Verification Status Card */}
        {isFinal ? (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">
              AUTHENTIC CLINICAL REPORT VERIFIED
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              This diagnostic report was officially generated, reviewed, and authorized by the clinical laboratory at {JANANI_INFO.fullName}.
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-5 text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-600 text-white mx-auto flex items-center justify-center shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-amber-950 uppercase tracking-tight">
              INTERIM / DRAFT STATUS
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              This report is currently undergoing specimen analysis or pending final consultant pathologist authorization.
            </p>
          </div>
        )}

        {/* Verified Data Grid */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Report Identifier</span>
              <strong className="text-slate-900 font-mono text-sm">{report.reportNo}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Patient UHID</span>
              <strong className="text-teal-900 font-mono text-sm">{report.uhid}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Patient Name</span>
              <strong className="text-slate-900 uppercase">{report.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Age &amp; Gender</span>
              <span className="text-slate-800 font-semibold">
                {report.patientAge} {report.patientAgeUnit}, {report.patientGender.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Investigation / Test</span>
              <strong className="text-slate-900">{report.testName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Department</span>
              <span className="text-teal-800 font-bold">{report.category}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-1">
            <span className="text-slate-500 block text-[11px]">Authorizing Consultant Doctor</span>
            <div className="flex items-center justify-between">
              <strong className="text-slate-900">
                {report.authorizedByDoctorName || 'Authorized Consultant Pathologist'}
              </strong>
              <span className="text-slate-600 font-mono text-[11px]">
                BMDC: {report.authorizedDoctorBmdc || 'Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Facility Info */}
        <div className="mt-5 text-center text-[11px] text-slate-500 space-y-1">
          <p>
            {JANANI_INFO.address.line1}, {JANANI_INFO.address.city}, Bangladesh • Hotline: {JANANI_INFO.contacts.phone}
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            DGHS Reg No: {JANANI_INFO.licenseNo} • Security Hash: SHA256-{(report.id + report.reportNo).slice(0, 16)}
          </p>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Close Verification Window
          </button>
        </div>
      </div>
    </div>
  );
};
