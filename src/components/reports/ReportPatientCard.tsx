import React from 'react';
import { Report } from '../../types';
import { JANANI_INFO } from '../../constants/branding';
import { QRCodeDisplay } from '../QRCodeDisplay';
import { BarcodeDisplay } from '../BarcodeDisplay';
import {
  User,
  CreditCard,
  FileText,
  Users,
  Stethoscope,
  FlaskConical,
  Calendar,
  Clock,
  Activity,
} from 'lucide-react';

interface ReportPatientCardProps {
  report: Report;
  isCompact?: boolean;
  onOpenVerifyModal?: (report: Report) => void;
}

export const ReportPatientCard: React.FC<ReportPatientCardProps> = ({
  report,
  isCompact = false,
  onOpenVerifyModal,
}) => {
  // Format active, scannable verification URL for real online verification by smartphone camera or browser
  const baseUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://www.jananidc.com';
  const cleanBase = baseUrl.replace(/\/$/, '');
  const verificationUrl = `${cleanBase}/?verify=${encodeURIComponent(
    report.reportNo
  )}&uhid=${encodeURIComponent(report.uhid)}&name=${encodeURIComponent(
    report.patientName
  )}&test=${encodeURIComponent(report.testName)}&doctor=${encodeURIComponent(
    report.authorizedByDoctorName || ''
  )}&auth=${encodeURIComponent(
    report.status === 'verified_final' || report.status === 'authorized_by_doctor'
      ? 'VERIFIED'
      : 'PENDING'
  )}`;

  // Parse Dates and Times safely
  const reportDateObj = report.reportedAt ? new Date(report.reportedAt) : new Date();
  const sampleDateObj = report.specimenReceivedAt ? new Date(report.specimenReceivedAt) : reportDateObj;

  const formattedSampleDate = sampleDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedSampleTime = sampleDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedReportDate = reportDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedReportTime = reportDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Extract or generate clean ID numbers matching sample: JDC2505200123 / REG-250520-0456
  const cleanId = report.uhid.replace(/[^a-zA-Z0-9]/g, '');
  const displayBarcodeId = cleanId ? `*${cleanId}*` : `*${report.reportNo}*`;

  // Determine whether this is a sample-based test or an imaging examination
  const isImaging =
    report.category === 'Ultrasonography' ||
    report.category === 'Digital Radiology' ||
    report.category === 'Cardiology' ||
    report.testName.toLowerCase().includes('echo') ||
    report.testName.toLowerCase().includes('usg') ||
    report.testName.toLowerCase().includes('x-ray');

  return (
    <div
      className={`bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden select-none mb-3 ${
        isCompact ? 'p-2 sm:p-2.5' : 'p-3 sm:p-3.5'
      }`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Left 9 Columns: 3 Rows of Patient Demographics */}
        <div className="col-span-12 sm:col-span-9 grid grid-cols-3 gap-x-2 sm:gap-x-3 gap-y-2.5 sm:gap-y-3">
          {/* ROW 1 */}
          {/* Patient Name */}
          <div className="flex items-start gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Patient Name
              </span>
              <span className="block text-xs sm:text-[13px] font-bold text-slate-900 uppercase truncate">
                {report.patientName}
              </span>
            </div>
          </div>

          {/* Patient ID */}
          <div className="flex items-start gap-1.5 min-w-0">
            <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Patient ID
              </span>
              <span className="block text-xs sm:text-[13px] font-bold text-slate-900 font-mono truncate">
                {report.uhid}
              </span>
            </div>
          </div>

          {/* Registration No. */}
          <div className="flex items-start gap-1.5 min-w-0">
            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Registration No.
              </span>
              <span className="block text-xs sm:text-[13px] font-bold text-slate-900 font-mono truncate">
                {report.orderNo || `REG-${report.uhid.slice(-6)}`}
              </span>
            </div>
          </div>

          {/* ROW 2 */}
          {/* Age / Gender */}
          <div className="flex items-start gap-1.5 min-w-0">
            <Users className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Age / Gender
              </span>
              <span className="block text-xs sm:text-[12px] font-semibold text-slate-900 truncate">
                {report.patientAge} {report.patientAgeUnit === 'years' ? 'Y' : report.patientAgeUnit === 'months' ? 'M' : 'D'} /{' '}
                {report.patientGender === 'male' ? 'Male' : report.patientGender === 'female' ? 'Female' : 'Other'}
              </span>
            </div>
          </div>

          {/* Ref. By */}
          <div className="flex items-start gap-1.5 min-w-0">
            <Stethoscope className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Ref. By
              </span>
              <span className="block text-xs sm:text-[12px] font-semibold text-slate-900 truncate" title={report.referringDoctorName}>
                {report.referringDoctorName || 'Self / Direct'}
              </span>
            </div>
          </div>

          {/* Sample Type or Examination */}
          <div className="flex items-start gap-1.5 min-w-0">
            {isImaging ? (
              <Activity className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            ) : (
              <FlaskConical className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                {isImaging ? 'Examination' : 'Sample Type'}
              </span>
              <span className="block text-xs sm:text-[12px] font-semibold text-slate-900 truncate" title={isImaging ? report.testName : report.sampleType}>
                {isImaging ? report.testName : report.sampleType || 'Whole Blood'}
              </span>
            </div>
          </div>

          {/* ROW 3 */}
          {/* Collection / Examination Date */}
          <div className="flex items-start gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                {isImaging ? 'Examination Date' : 'Collection Date'}
              </span>
              <span className="block text-xs sm:text-[12px] font-semibold text-slate-900 font-mono truncate">
                {formattedSampleDate} <span className="text-[10px] text-slate-500">{formattedSampleTime}</span>
              </span>
            </div>
          </div>

          {/* Date of Report */}
          <div className="flex items-start gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Date of Report
              </span>
              <span className="block text-xs sm:text-[12px] font-semibold text-slate-900 font-mono truncate">
                {formattedReportDate}
              </span>
            </div>
          </div>

          {/* Reporting Time */}
          <div className="flex items-start gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                Reporting Time
              </span>
              <span className="block text-xs sm:text-[12px] font-semibold text-slate-900 font-mono truncate">
                {formattedReportTime}
              </span>
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Report ID, QR Code, Barcode & Scan to Verify Badge */}
        <div className="col-span-12 sm:col-span-3 sm:border-l border-slate-200 sm:pl-3 flex flex-col items-center justify-center text-center">
          <div className="mb-1 text-center">
            <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              REPORT ID
            </span>
            <span className="block text-[11px] sm:text-xs font-mono font-extrabold text-slate-900">
              {report.reportNo}
            </span>
          </div>

          {/* Dynamic Real QR Code for Online Verification */}
          <div className="my-0.5 flex items-center justify-center bg-white p-1 rounded-md shadow-2xs border border-slate-100">
            <QRCodeDisplay
              value={verificationUrl}
              size={isCompact ? 52 : 62}
              onScanClick={() => onOpenVerifyModal?.(report)}
            />
          </div>

          {/* Real Barcode with Asterisks */}
          <div className="w-full flex flex-col items-center justify-center mt-1">
            <BarcodeDisplay
              value={report.accessionNo || report.uhid}
              width={0.85}
              height={16}
              displayValue={false}
            />
            <span className="text-[9px] font-mono text-slate-700 font-semibold tracking-tighter mt-0.5">
              {displayBarcodeId}
            </span>
          </div>

          {/* SCAN TO VERIFY Dark Teal Pill Badge */}
          <button
            type="button"
            onClick={() => onOpenVerifyModal?.(report)}
            className="mt-1 bg-[#043228] hover:bg-[#06483b] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-sm transition cursor-pointer shadow-2xs"
          >
            SCAN TO VERIFY
          </button>
        </div>
      </div>
    </div>
  );
};
