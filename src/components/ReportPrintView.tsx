import React, { useState, useMemo, useEffect } from 'react';
import { Report, ReportSignatory, Doctor, LabTechnician } from '../types';
import { JANANI_INFO } from '../constants/branding';
import { JananiLetterheadHeader, JananiLetterheadFooter } from './JananiLetterhead';
import { dbService } from '../services/db';
import { ReportPatientCard } from './reports/ReportPatientCard';
import { ReportTitleRibbon } from './reports/ReportTitleRibbon';
import { ReportTrustFooter } from './reports/ReportTrustFooter';
import { PathologyReportLayout } from './reports/PathologyReportLayout';
import { UltrasonographyReportLayout } from './reports/UltrasonographyReportLayout';
import { EchocardiographyReportLayout } from './reports/EchocardiographyReportLayout';
import { RadiologyReportLayout } from './reports/RadiologyReportLayout';
import {
  Printer,
  ToggleLeft,
  ToggleRight,
  Eye,
  X,
  FileText,
  Sliders,
  Maximize2,
  Minimize2,
  Layers,
  Sparkles,
  ChevronDown,
  RotateCw,
  UserCheck,
  Stethoscope,
  FlaskConical,
  CheckCircle2,
  RefreshCw,
  PenTool,
} from 'lucide-react';

interface ReportPrintViewProps {
  report: Report;
  onClose?: () => void;
  onOpenVerifyModal?: (report: Report) => void;
  onUpdateReport?: (updatedReport: Report) => void;
}

type PaperSizePreset = 'a4' | 'a5' | 'letter' | 'legal' | 'b5' | 'custom';
type Orientation = 'portrait' | 'landscape';
type MarginPreset = 'standard' | 'narrow' | 'minimal' | 'custom';
type DensityPreset = 'normal' | 'compact' | 'ultra_compact';

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({
  report: initialReport,
  onClose,
  onOpenVerifyModal,
  onUpdateReport,
}) => {
  // Local mutable report copy for live signatory customization and print adjustments
  const [currentReport, setCurrentReport] = useState<Report>(initialReport);

  useEffect(() => {
    setCurrentReport(initialReport);
  }, [initialReport]);

  const doctors = useMemo(() => dbService.getActiveDoctors(), []);
  const technicians = useMemo(() => dbService.getActiveTechnicians(), []);

  // Format & Element Toggles
  const [withLetterhead, setWithLetterhead] = useState(
    currentReport.printConfig?.withLetterhead ?? true
  );
  const [showQrCode, setShowQrCode] = useState(
    currentReport.printConfig?.showQrCode ?? true
  );
  const [showBarcode, setShowBarcode] = useState(
    currentReport.printConfig?.showBarcode ?? true
  );
  const [showWatermark, setShowWatermark] = useState(true);

  // Paper & Layout Configurations
  const [paperSize, setPaperSize] = useState<PaperSizePreset>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [unit, setUnit] = useState<'mm' | 'in' | 'cm'>('mm');
  const [customWidth, setCustomWidth] = useState<number>(210);
  const [customHeight, setCustomHeight] = useState<number>(297);
  const [marginPreset, setMarginPreset] = useState<MarginPreset>('standard');
  const [customMarginMm, setCustomMarginMm] = useState<number>(6);
  const [density, setDensity] = useState<DensityPreset>('normal');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showSignatorySettings, setShowSignatorySettings] = useState(false);

  const template = dbService.getTemplateById(currentReport.testTemplateId);

  // Initialize or compute current active signatories
  const activeSignatories: ReportSignatory[] = useMemo(() => {
    if (currentReport.signatories && currentReport.signatories.length > 0) {
      return currentReport.signatories;
    }

    const isImagingOrCardio =
      currentReport.category === 'Ultrasonography' ||
      currentReport.category === 'Digital Radiology' ||
      currentReport.category === 'Cardiology' ||
      currentReport.testName.toLowerCase().includes('echo') ||
      currentReport.testName.toLowerCase().includes('usg') ||
      currentReport.testName.toLowerCase().includes('x-ray') ||
      currentReport.testName.toLowerCase().includes('cardio');

    const authDoctor =
      doctors.find(
        (d) =>
          d.id === currentReport.verifierDoctorId ||
          d.id === currentReport.authorizedByDoctorId
      ) ||
      (currentReport.verifierDoctorName
        ? doctors.find((d) => d.name === currentReport.verifierDoctorName)
        : null) ||
      (currentReport.authorizedByDoctorName
        ? doctors.find((d) => d.name === currentReport.authorizedByDoctorName)
        : null) ||
      doctors.find((d) =>
        isImagingOrCardio
          ? d.specialty.toLowerCase().includes('radio') ||
            d.specialty.toLowerCase().includes('sono') ||
            d.specialty.toLowerCase().includes('cardio')
          : d.specialty.toLowerCase().includes('patho') ||
            d.specialty.toLowerCase().includes('biochem')
      ) ||
      doctors[0];

    const secondDoctor =
      doctors.find((d) => d.id !== authDoctor?.id) || authDoctor;

    const primaryTech =
      technicians.find(
        (t) =>
          t.id === currentReport.verifierTech1Id ||
          t.id === currentReport.preparedByTechnicianId ||
          t.id === currentReport.reviewedByTechnicianId
      ) ||
      (currentReport.verifierTech1Name
        ? technicians.find((t) => t.name === currentReport.verifierTech1Name)
        : null) ||
      (currentReport.reviewedByTechnicianName
        ? technicians.find((t) => t.name === currentReport.reviewedByTechnicianName)
        : null) ||
      technicians.find((t) =>
        isImagingOrCardio
          ? t.department.toLowerCase().includes('radio') ||
            t.department.toLowerCase().includes('imaging')
          : t.department.toLowerCase().includes('chem') ||
            t.department.toLowerCase().includes('hem')
      ) ||
      technicians[0];

    const secondTech =
      technicians.find(
        (t) =>
          t.id === currentReport.verifierTech2Id && t.id !== primaryTech?.id
      ) ||
      (currentReport.verifierTech2Name
        ? technicians.find((t) => t.name === currentReport.verifierTech2Name)
        : null) ||
      technicians.find((t) => t.id !== primaryTech?.id) ||
      technicians[1] ||
      primaryTech;

    if (isImagingOrCardio) {
      return [
        {
          id: primaryTech?.id || 'tech-1',
          type: 'technician',
          title: 'PREPARED BY',
          name: primaryTech?.name || currentReport.preparedByTechnicianName || 'Md. Tariqul Islam',
          designation: primaryTech?.designation || 'Medical Technologist (Imaging & Lab)',
          degrees: 'B.Sc in Health Technology',
          registrationNo: primaryTech?.employeeId
            ? `Employee ID: ${primaryTech.employeeId}`
            : 'Reg: Tech-101',
          department: primaryTech?.department || 'Diagnostic Imaging Dept',
        },
        {
          id: secondDoctor?.id || 'doc-check',
          type: 'doctor',
          title: 'CHECKED & REVIEWED BY',
          name: secondDoctor?.name || 'Dr. Saima Sultana',
          designation: secondDoctor?.designation || 'Resident Medical Officer / Sonologist',
          degrees: secondDoctor?.degrees || 'MBBS, PGT (Ultrasonography)',
          registrationNo: secondDoctor?.bmdcNo
            ? `BMDC Reg No: ${secondDoctor.bmdcNo}`
            : 'BMDC: A-41290',
          department: secondDoctor?.department || 'Sonology & Clinical Radiology',
        },
        {
          id: authDoctor?.id || 'doc-auth',
          type: 'doctor',
          title: 'REPORTED & VERIFIED BY',
          name:
            currentReport.authorizedByDoctorName ||
            authDoctor?.name ||
            'Prof. Dr. M. A. Rahman',
          designation:
            currentReport.authorizedDoctorDesignation ||
            authDoctor?.designation ||
            (currentReport.category === 'Cardiology'
              ? 'Senior Consultant Cardiologist'
              : 'Senior Consultant Radiologist'),
          degrees:
            authDoctor?.degrees ||
            (currentReport.category === 'Cardiology'
              ? 'MBBS, MD (Cardiology), FCPS'
              : 'MBBS, M.Phil, FCPS (Radiology & Imaging)'),
          registrationNo: currentReport.authorizedDoctorBmdc
            ? `BMDC Reg No: ${currentReport.authorizedDoctorBmdc}`
            : authDoctor?.bmdcNo
            ? `BMDC Reg No: ${authDoctor.bmdcNo}`
            : 'BMDC: A-28491',
          department: authDoctor?.department || 'Department of Radiology & Imaging',
        },
      ];
    }

    return [
      {
        id: primaryTech?.id || 'tech-1',
        type: 'technician',
        title: 'PREPARED / REPORTED BY',
        name:
          currentReport.reviewedByTechnicianName ||
          currentReport.preparedByTechnicianName ||
          primaryTech?.name ||
          'Md. Tariqul Islam',
        designation: primaryTech?.designation || 'Chief Medical Technologist',
        degrees: 'B.Sc in Medical Laboratory Technology (DU)',
        registrationNo: primaryTech?.employeeId
          ? `Employee ID: ${primaryTech.employeeId}`
          : 'Emp ID: JDC-T-101',
        department: primaryTech?.department || 'Pathology & Hematology Lab',
      },
      {
        id: secondTech?.id || 'tech-2',
        type: 'technician',
        title: 'CHECKED & EXAMINED BY',
        name: secondTech?.name || 'Kamrul Hasan Rony',
        designation: secondTech?.designation || 'Senior Medical Technologist (Biochemistry)',
        degrees: 'BMLT, M.Sc (Microbiology)',
        registrationNo: secondTech?.employeeId
          ? `Employee ID: ${secondTech.employeeId}`
          : 'Emp ID: JDC-T-102',
        department: secondTech?.department || 'Clinical Biochemistry & Serology',
      },
      {
        id: authDoctor?.id || 'doc-auth',
        type: 'doctor',
        title: 'VERIFIED & AUTHORIZED BY',
        name:
          currentReport.authorizedByDoctorName ||
          authDoctor?.name ||
          'Prof. Dr. M. A. Rahman',
        designation:
          currentReport.authorizedDoctorDesignation ||
          authDoctor?.designation ||
          'Professor & Senior Consultant Pathologist',
        degrees: authDoctor?.degrees || 'MBBS, FCPS (Pathology), DCP (DU)',
        registrationNo: currentReport.authorizedDoctorBmdc
          ? `BMDC Reg No: ${currentReport.authorizedDoctorBmdc}`
          : authDoctor?.bmdcNo
          ? `BMDC Reg No: ${authDoctor.bmdcNo}`
          : 'BMDC: A-28491',
        department: authDoctor?.department || 'Department of Clinical Pathology',
      },
    ];
  }, [currentReport, doctors, technicians]);

  const signatoryCount = currentReport.signatoryCount || 3;

  // Update a signatory slot freely
  const handleUpdateSignatory = (
    index: number,
    updatedField: Partial<ReportSignatory>
  ) => {
    const list = [...activeSignatories];
    while (list.length <= index) {
      list.push({
        type: 'doctor',
        title: 'VERIFIED BY',
        name: 'Authorized Signatory',
        designation: 'Medical Officer',
      });
    }
    list[index] = { ...list[index], ...updatedField };

    const updated: Report = {
      ...currentReport,
      signatories: list,
      signatoryCount: signatoryCount,
    };
    setCurrentReport(updated);
    dbService.saveReport(updated);
    if (onUpdateReport) onUpdateReport(updated);
  };

  // Select a person from staff directory for a specific slot
  const handleSelectStaffForSlot = (index: number, staffId: string) => {
    const doc = doctors.find((d) => d.id === staffId);
    const tech = technicians.find((t) => t.id === staffId);

    if (doc) {
      handleUpdateSignatory(index, {
        id: doc.id,
        type: 'doctor',
        name: doc.name,
        degrees: doc.degrees || 'MBBS',
        designation: doc.designation || doc.specialty,
        registrationNo: doc.bmdcNo ? `BMDC Reg No: ${doc.bmdcNo}` : '',
        department: doc.department || 'Clinical Medicine',
      });
    } else if (tech) {
      handleUpdateSignatory(index, {
        id: tech.id,
        type: 'technician',
        name: tech.name,
        degrees: 'B.Sc in Health Technology',
        designation: tech.designation,
        registrationNo: tech.employeeId ? `Employee ID: ${tech.employeeId}` : '',
        department: tech.department,
      });
    }
  };

  // Change number of signatories to show (1, 2, or 3)
  const handleChangeSignatoryCount = (newCount: 1 | 2 | 3) => {
    const updated: Report = {
      ...currentReport,
      signatories: activeSignatories,
      signatoryCount: newCount,
    };
    setCurrentReport(updated);
    dbService.saveReport(updated);
    if (onUpdateReport) onUpdateReport(updated);
  };

  // Reset signatories to system default
  const handleResetSignatories = () => {
    const updated: Report = {
      ...currentReport,
      signatories: undefined,
      signatoryCount: 3,
    };
    setCurrentReport(updated);
    dbService.saveReport(updated);
    if (onUpdateReport) onUpdateReport(updated);
  };

  // Compute Base Dimensions (in mm)
  const baseDimensions = useMemo(() => {
    let widthMm = 210;
    let heightMm = 297;

    switch (paperSize) {
      case 'a4':
        widthMm = 210;
        heightMm = 297;
        break;
      case 'a5':
        widthMm = 148;
        heightMm = 210;
        break;
      case 'letter':
        widthMm = 215.9;
        heightMm = 279.4;
        break;
      case 'legal':
        widthMm = 215.9;
        heightMm = 355.6;
        break;
      case 'b5':
        widthMm = 176;
        heightMm = 250;
        break;
      case 'custom':
        if (unit === 'in') {
          widthMm = customWidth * 25.4;
          heightMm = customHeight * 25.4;
        } else if (unit === 'cm') {
          widthMm = customWidth * 10;
          heightMm = customHeight * 10;
        } else {
          widthMm = customWidth;
          heightMm = customHeight;
        }
        break;
    }

    if (orientation === 'landscape') {
      return { width: heightMm, height: widthMm };
    }
    return { width: widthMm, height: heightMm };
  }, [paperSize, orientation, unit, customWidth, customHeight]);

  // Compute Print Margin (in mm)
  const marginMm = useMemo(() => {
    switch (marginPreset) {
      case 'standard':
        return 6;
      case 'narrow':
        return 3;
      case 'minimal':
        return 0;
      case 'custom':
        return Math.max(0, customMarginMm);
    }
  }, [marginPreset, customMarginMm]);

  // Calculate dynamic CSS @page size string
  const pageSizeCss = useMemo(() => {
    if (paperSize === 'custom') {
      return `${baseDimensions.width.toFixed(1)}mm ${baseDimensions.height.toFixed(1)}mm`;
    }
    const standardName =
      paperSize === 'letter'
        ? 'letter'
        : paperSize === 'legal'
        ? 'legal'
        : paperSize.toUpperCase();
    return `${standardName} ${orientation}`;
  }, [paperSize, orientation, baseDimensions]);

  // Handle Preset Selection with intelligent density recommendations
  const handlePaperSizeChange = (size: PaperSizePreset) => {
    setPaperSize(size);
    if (size === 'a5') {
      setDensity('compact');
      setMarginPreset('narrow');
    } else if (size === 'a4' || size === 'letter') {
      setDensity('normal');
      setMarginPreset('standard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Classification helpers for category-specific layout rendering
  const isEcho = useMemo(() => {
    const t = (currentReport.testName || '').toLowerCase();
    const c = (currentReport.category || '').toLowerCase();
    return t.includes('echo') || (c.includes('cardio') && t.includes('echo'));
  }, [currentReport.testName, currentReport.category]);

  const isUSG = useMemo(() => {
    const t = (currentReport.testName || '').toLowerCase();
    const c = (currentReport.category || '').toLowerCase();
    return (
      t.includes('usg') ||
      t.includes('ultra') ||
      t.includes('sonogram') ||
      c.includes('ultrasonography')
    );
  }, [currentReport.testName, currentReport.category]);

  const isPathology = useMemo(() => {
    return !!(template && template.parameters && template.parameters.length > 0);
  }, [template]);

  const reportTitle = useMemo(() => {
    if (isEcho) return 'ECHOCARDIOGRAPHY (ECHO) REPORT';
    if (isUSG) return 'ULTRASONOGRAPHY REPORT';
    if (
      currentReport.category === 'Digital Radiology' ||
      currentReport.testName.toLowerCase().includes('x-ray')
    )
      return 'DIGITAL RADIOLOGY REPORT';
    if (
      currentReport.testName.toLowerCase().includes('ecg') ||
      currentReport.testName.toLowerCase().includes('ekg')
    )
      return 'CARDIOLOGY (ECG) REPORT';
    if (currentReport.category === 'Histopathology & Cytology')
      return 'HISTOPATHOLOGY REPORT';
    return 'PATHOLOGY REPORT';
  }, [isEcho, isUSG, currentReport.category, currentReport.testName]);

  // Density-based CSS classes
  const isCompact =
    density === 'compact' || density === 'ultra_compact' || paperSize === 'a5';
  const isUltraCompact = density === 'ultra_compact';

  return (
    <div className="space-y-5">
      {/* Dynamic Print CSS Injection */}
      <style>
        {`
          @media print {
            @page {
              size: ${pageSizeCss};
              margin: ${marginMm}mm;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            #report-print-sheet {
              width: ${baseDimensions.width.toFixed(1)}mm !important;
              max-width: ${baseDimensions.width.toFixed(1)}mm !important;
              min-height: ${baseDimensions.height.toFixed(1)}mm !important;
              margin: 0 auto !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              background: #ffffff !important;
            }
            .page-break-inside-avoid {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}
      </style>

      {/* Main Print Configuration Toolbar (Hidden during Print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Top Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                Print &amp; Diagnostic Output Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Custom Paper Dimensions:{' '}
                <strong className="text-teal-900 font-mono">
                  {baseDimensions.width.toFixed(1)} × {baseDimensions.height.toFixed(1)} mm
                </strong>{' '}
                ({orientation.toUpperCase()}) • Signatories: {signatoryCount} of 3 active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenVerifyModal && (
              <button
                onClick={() => onOpenVerifyModal(currentReport)}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <Eye className="w-4 h-4 text-teal-700" />
                Verify QR
              </button>
            )}

            {/* Verifiers & Signatories Drawer Toggle Button */}
            <button
              onClick={() => {
                setShowSignatorySettings(!showSignatorySettings);
                if (!showSignatorySettings) setShowAdvancedSettings(false);
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border ${
                showSignatorySettings
                  ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Verifiers &amp; Signatories</span>
              <span className="bg-teal-100 text-teal-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {signatoryCount} Signers
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showSignatorySettings ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Paper Layout Drawer Toggle Button */}
            <button
              onClick={() => {
                setShowAdvancedSettings(!showAdvancedSettings);
                if (!showAdvancedSettings) setShowSignatorySettings(false);
              }}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer border ${
                showAdvancedSettings
                  ? 'bg-teal-50 border-teal-300 text-teal-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4 text-teal-700" />
              <span>Paper &amp; Margins</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showAdvancedSettings ? 'rotate-180' : ''
                }`}
              />
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF ({paperSize.toUpperCase()})
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                title="Close Print Preview"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Paper Size & Quick Layout Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Paper Size Quick Buttons */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider text-[11px]">
              Paper Size:
            </span>
            {(
              [
                { id: 'a4', label: 'A4 (210×297mm)', desc: 'Standard Report' },
                { id: 'a5', label: 'A5 (148×210mm)', desc: 'Compact Half Page' },
                { id: 'letter', label: 'Letter (8.5×11")', desc: 'US Letter' },
                { id: 'legal', label: 'Legal (8.5×14")', desc: 'US Legal' },
                { id: 'b5', label: 'B5 (176×250mm)', desc: 'Medium' },
                { id: 'custom', label: '⚙️ Custom Size', desc: 'User Specified' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => handlePaperSizeChange(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  paperSize === p.id
                    ? 'bg-teal-800 text-white shadow-sm ring-2 ring-teal-700/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={p.desc}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Orientation & Format Toggles */}
          <div className="md:col-span-5 flex flex-wrap items-center justify-start md:justify-end gap-2">
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setOrientation('portrait')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  orientation === 'portrait'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => setOrientation('landscape')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  orientation === 'landscape'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCw className="w-3 h-3 text-teal-700" />
                Landscape
              </button>
            </div>

            <button
              onClick={() => setWithLetterhead(!withLetterhead)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                withLetterhead
                  ? 'bg-teal-50 border-teal-300 text-teal-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
              title="Toggle between printing full letterhead graphics or reserving space for pre-printed stationary"
            >
              {withLetterhead ? (
                <ToggleRight className="w-4 h-4 text-teal-700" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
              <span>{withLetterhead ? 'Letterhead' : 'Pre-printed Pad'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Verifiers & Signatories Customization Drawer */}
        {showSignatorySettings && (
          <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-200/80 pb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-teal-950 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-700" />
                  Custom Verifiers &amp; Printed Signatories for Report #{currentReport.reportNo}
                </h4>
                <p className="text-[11px] text-teal-800 mt-0.5">
                  Freely select ANY registered Doctor or Lab Technician for each signature position. Manual signature lines are provided for ink signing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Display Count:</span>
                <div className="inline-flex bg-white p-0.5 rounded-xl border border-teal-200 shadow-xs">
                  {([1, 2, 3] as const).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleChangeSignatoryCount(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        signatoryCount === num
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {num} {num === 1 ? 'Signer' : 'Signers'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleResetSignatories}
                  className="px-2.5 py-1 text-xs font-bold text-teal-800 hover:text-teal-950 hover:bg-teal-100 rounded-lg transition cursor-pointer flex items-center gap-1"
                  title="Reset to category standard staff"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* 3 Interactive Signatory Slot Configuration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[0, 1, 2].slice(0, signatoryCount).map((idx) => {
                const sig = activeSignatories[idx] || {
                  type: idx === 2 ? 'doctor' : 'technician',
                  title: idx === 0 ? 'PREPARED BY' : idx === 1 ? 'CHECKED BY' : 'VERIFIED BY',
                  name: '',
                  designation: '',
                };

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3.5 border border-teal-200 shadow-xs space-y-3 relative"
                  >
                    {/* Header with Slot Badge */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-black text-teal-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-900 text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        {idx === 0
                          ? 'First Signatory (Left)'
                          : idx === 1
                          ? 'Second Signatory (Center)'
                          : 'Third Signatory (Right)'}
                      </span>
                    </div>

                    {/* Step 1: Choose from registered staff */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Select Registered Doctor / Technician:
                      </label>
                      <select
                        value={sig.id || ''}
                        onChange={(e) => handleSelectStaffForSlot(idx, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-teal-600 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Choose from Directory --</option>
                        <optgroup label="🩺 Registered Doctors / Consultants">
                          {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.specialty || d.designation})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🔬 Registered Lab Technicians">
                          {technicians.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.designation} - {t.employeeId})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* Step 2: Custom Role / Column Title */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Role Title on Report:
                      </label>
                      <input
                        type="text"
                        value={sig.title || ''}
                        onChange={(e) => handleUpdateSignatory(idx, { title: e.target.value })}
                        placeholder="e.g. PREPARED BY, CHECKED BY, VERIFIED BY"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold uppercase focus:bg-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* Step 3: Signatory Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Signatory Full Name:
                      </label>
                      <input
                        type="text"
                        value={sig.name || ''}
                        onChange={(e) => handleUpdateSignatory(idx, { name: e.target.value })}
                        placeholder="e.g. Prof. Dr. M. A. Rahman"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold focus:bg-white focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* Step 4: Degrees & BMDC/Reg */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          Degrees / Qualifications:
                        </label>
                        <input
                          type="text"
                          value={sig.degrees || ''}
                          onChange={(e) => handleUpdateSignatory(idx, { degrees: e.target.value })}
                          placeholder="e.g. MBBS, FCPS"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-800 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          BMDC / Reg / Emp ID:
                        </label>
                        <input
                          type="text"
                          value={sig.registrationNo || ''}
                          onChange={(e) =>
                            handleUpdateSignatory(idx, { registrationNo: e.target.value })
                          }
                          placeholder="e.g. BMDC: A-28491"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-800 font-mono focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Step 5: Designation & Department */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Designation &amp; Department:
                      </label>
                      <input
                        type="text"
                        value={sig.designation || ''}
                        onChange={(e) =>
                          handleUpdateSignatory(idx, { designation: e.target.value })
                        }
                        placeholder="e.g. Consultant Pathologist"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-800 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expandable Advanced Layout, Margins & Custom Dimensions Drawer */}
        {showAdvancedSettings && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            {/* Custom Dimensions Input (Only visible when Custom is active) */}
            {paperSize === 'custom' && (
              <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-teal-700" />
                    Custom Paper Dimensions
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    {(['mm', 'in', 'cm'] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-2 py-0.5 rounded ${
                          unit === u
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Paper Width ({unit})
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1000}
                      step={unit === 'in' ? 0.1 : 1}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 210)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Paper Height ({unit})
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1500}
                      step={unit === 'in' ? 0.1 : 1}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 297)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-teal-600 focus:outline-none"
                    />
                  </div>

                  {/* Quick Custom Dimension Presets */}
                  <div className="col-span-2 flex flex-col justify-end">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Quick Dimension Presets
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => {
                          setUnit('mm');
                          setCustomWidth(150);
                          setCustomHeight(220);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
                      >
                        Pad (150×220mm)
                      </button>
                      <button
                        onClick={() => {
                          setUnit('mm');
                          setCustomWidth(105);
                          setCustomHeight(148);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
                      >
                        Slip A6 (105×148mm)
                      </button>
                      <button
                        onClick={() => {
                          setUnit('mm');
                          setCustomWidth(250);
                          setCustomHeight(200);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
                      >
                        Wide USG (250×200mm)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Layout Density & Print Margins Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Density Preset */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Typography &amp; Row Density
                </label>
                <select
                  value={density}
                  onChange={(e) => setDensity(e.target.value as DensityPreset)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="normal">Standard (Normal Spacing)</option>
                  <option value="compact">Compact (Fit for A5 / Dense Tests)</option>
                  <option value="ultra_compact">Ultra-Compact (Multi-Panel)</option>
                </select>
              </div>

              {/* Margin Preset */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Print Margins (Page Edge)
                </label>
                <select
                  value={marginPreset}
                  onChange={(e) => setMarginPreset(e.target.value as MarginPreset)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="standard">Standard (6 mm)</option>
                  <option value="narrow">Narrow (3 mm)</option>
                  <option value="minimal">Minimal / Borderless (0 mm)</option>
                  <option value="custom">Custom Margin (mm)</option>
                </select>
              </div>

              {/* Elements Toggles */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Verification &amp; Security Elements
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQrCode(!showQrCode)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                      showQrCode
                        ? 'bg-teal-100 border-teal-300 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    QR Code
                  </button>
                  <button
                    onClick={() => setShowBarcode(!showBarcode)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                      showBarcode
                        ? 'bg-teal-100 border-teal-300 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    Barcode
                  </button>
                  <button
                    onClick={() => setShowWatermark(!showWatermark)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                      showWatermark
                        ? 'bg-teal-100 border-teal-300 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    Watermark
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Margin Input */}
            {marginPreset === 'custom' && (
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-600">Custom Margin (mm):</span>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={customMarginMm}
                  onChange={(e) => setCustomMarginMm(parseInt(e.target.value) || 0)}
                  className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Screen Preview Container Wrapper */}
      <div className="overflow-x-auto pb-8 pt-2 flex justify-center bg-slate-100/70 p-2 sm:p-4 rounded-3xl border border-slate-200">
        {/* Printable Sheet Container */}
        <div
          id="report-print-sheet"
          style={{
            width: `${baseDimensions.width}mm`,
            maxWidth: `${baseDimensions.width}mm`,
            minHeight: `${baseDimensions.height}mm`,
          }}
          className={`bg-white text-slate-900 mx-auto border border-slate-300 shadow-2xl rounded-xl relative flex flex-col justify-between font-sans leading-normal overflow-hidden print:border-none print:shadow-none print:rounded-none print:m-0 print:w-full print:min-h-0 ${
            isUltraCompact ? 'text-[10px]' : isCompact ? 'text-[11px]' : 'text-xs'
          }`}
        >
          {/* Subtle Security Watermark Background */}
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none z-0">
              <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-widest text-teal-950 uppercase rotate-[-30deg]">
                JANANI LAB
              </span>
            </div>
          )}

          {/* TOP SECTION */}
          <div className="flex-1 flex flex-col relative z-10">
            {/* Official Letterhead Header */}
            {withLetterhead ? (
              <div className={`${isCompact ? 'mb-2 print:mb-1.5' : 'mb-3.5 print:mb-2.5'}`}>
                <JananiLetterheadHeader isPrint={true} />
              </div>
            ) : (
              <div
                style={{ height: isCompact ? '26mm' : '36mm' }}
                className="mb-3 mx-6 sm:mx-8 border-b border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest no-print"
              >
                [ Reserved Space ({isCompact ? '26mm' : '36mm'}) for Pre-Printed Janani Stationary Pad ]
              </div>
            )}

            <div
              className={`${
                isCompact ? 'px-3 sm:px-4 print:px-3' : 'px-5 sm:px-6 print:px-5'
              } flex-1 flex flex-col`}
            >
              {/* Modern Patient Demographics & Verification Info Card */}
              <ReportPatientCard
                report={currentReport}
                isCompact={isCompact}
                onOpenVerifyModal={onOpenVerifyModal}
              />

              {/* Centered Medical Emblem Title Ribbon */}
              <ReportTitleRibbon
                title={reportTitle}
                category={currentReport.category}
                isCompact={isCompact}
              />

              {/* Dynamic Category Specific Medical Report Layout */}
              {isEcho ? (
                <EchocardiographyReportLayout
                  report={currentReport}
                  template={template}
                  isCompact={isCompact}
                />
              ) : isUSG ? (
                <UltrasonographyReportLayout
                  report={currentReport}
                  template={template}
                  isCompact={isCompact}
                />
              ) : isPathology ? (
                <PathologyReportLayout
                  report={currentReport}
                  template={template}
                  isCompact={isCompact}
                />
              ) : (
                <RadiologyReportLayout
                  report={currentReport}
                  template={template}
                  isCompact={isCompact}
                />
              )}
            </div>

            {/* Trust Badges */}
            <ReportTrustFooter isCompact={isCompact} className="mt-auto" />
          </div>

          {/* Official Letterhead Footer */}
          {withLetterhead && (
            <div className="mt-auto relative z-10">
              <JananiLetterheadFooter isPrint={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
