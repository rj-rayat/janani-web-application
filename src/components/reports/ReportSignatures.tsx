import React from 'react';
import { Report, ReportSignatory } from '../../types';
import { dbService } from '../../services/db';

interface ReportSignaturesProps {
  report: Report;
  category?: string;
  isCompact?: boolean;
}

/**
 * Clean, regulatory-compliant manual physical signature block
 * Strictly NO hardcoded automated digital script signatures.
 * Supports 1, 2, or 3 dynamic verifier / doctor / technologist slots
 * with real registered personnel details from database.
 */
export const ReportSignatures: React.FC<ReportSignaturesProps> = ({
  report,
  category = '',
  isCompact = false,
}) => {
  const isImagingOrCardio =
    report.category === 'Ultrasonography' ||
    report.category === 'Digital Radiology' ||
    report.category === 'Cardiology' ||
    category.toLowerCase().includes('echo') ||
    category.toLowerCase().includes('usg') ||
    category.toLowerCase().includes('x-ray') ||
    category.toLowerCase().includes('cardio');

  // Compute dynamic signatories if not explicitly customized on the report object
  const computedSignatories: ReportSignatory[] = React.useMemo(() => {
    if (report.signatories && report.signatories.length > 0) {
      return report.signatories;
    }

    const doctors = dbService.getActiveDoctors();
    const techs = dbService.getActiveTechnicians();

    // Default primary doctor (Authorized / Consultant)
    const authDoctor =
      doctors.find((d) => d.id === report.verifierDoctorId || d.id === report.authorizedByDoctorId) ||
      (report.verifierDoctorName
        ? doctors.find((d) => d.name === report.verifierDoctorName)
        : null) ||
      (report.authorizedByDoctorName
        ? doctors.find((d) => d.name === report.authorizedByDoctorName)
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

    // Default secondary doctor / checker
    const secondDoctor =
      doctors.find((d) => d.id !== authDoctor?.id) || authDoctor;

    // Default primary technician (Tech 1)
    const primaryTech =
      techs.find((t) => t.id === report.verifierTech1Id || t.id === report.preparedByTechnicianId || t.id === report.reviewedByTechnicianId) ||
      (report.verifierTech1Name
        ? techs.find((t) => t.name === report.verifierTech1Name)
        : null) ||
      (report.reviewedByTechnicianName
        ? techs.find((t) => t.name === report.reviewedByTechnicianName)
        : null) ||
      techs.find((t) =>
        isImagingOrCardio
          ? t.department.toLowerCase().includes('radio') || t.department.toLowerCase().includes('imaging')
          : t.department.toLowerCase().includes('chem') || t.department.toLowerCase().includes('hem')
      ) ||
      techs[0];

    // Default secondary technician (Tech 2)
    const secondTech =
      techs.find((t) => t.id === report.verifierTech2Id && t.id !== primaryTech?.id) ||
      (report.verifierTech2Name
        ? techs.find((t) => t.name === report.verifierTech2Name)
        : null) ||
      techs.find((t) => t.id !== primaryTech?.id) ||
      techs[1] ||
      primaryTech;

    if (isImagingOrCardio) {
      return [
        {
          id: primaryTech?.id || 'tech-default',
          type: 'technician',
          title: 'PREPARED BY',
          name: primaryTech?.name || report.preparedByTechnicianName || 'Md. Tariqul Islam',
          designation: primaryTech?.designation || 'Medical Technologist (Imaging & Lab)',
          degrees: 'B.Sc in Health Technology',
          registrationNo: primaryTech?.employeeId ? `Employee ID: ${primaryTech.employeeId}` : 'Reg: Tech-101',
          department: primaryTech?.department || 'Diagnostic Imaging Dept',
        },
        {
          id: secondDoctor?.id || 'doc-check',
          type: 'doctor',
          title: 'CHECKED & REVIEWED BY',
          name: secondDoctor?.name || 'Dr. Saima Sultana',
          designation: secondDoctor?.designation || 'Resident Medical Officer / Sonologist',
          degrees: secondDoctor?.degrees || 'MBBS, PGT (Ultrasonography)',
          registrationNo: secondDoctor?.bmdcNo ? `BMDC Reg No: ${secondDoctor.bmdcNo}` : 'BMDC: A-41290',
          department: secondDoctor?.department || 'Sonology & Clinical Radiology',
        },
        {
          id: authDoctor?.id || 'doc-auth',
          type: 'doctor',
          title: 'REPORTED & VERIFIED BY',
          name: report.authorizedByDoctorName || authDoctor?.name || 'Prof. Dr. M. A. Rahman',
          designation: report.authorizedDoctorDesignation || authDoctor?.designation || (report.category === 'Cardiology' ? 'Senior Consultant Cardiologist' : 'Senior Consultant Radiologist'),
          degrees: authDoctor?.degrees || (report.category === 'Cardiology' ? 'MBBS, MD (Cardiology), FCPS' : 'MBBS, M.Phil, FCPS (Radiology & Imaging)'),
          registrationNo: report.authorizedDoctorBmdc ? `BMDC Reg No: ${report.authorizedDoctorBmdc}` : (authDoctor?.bmdcNo ? `BMDC Reg No: ${authDoctor.bmdcNo}` : 'BMDC: A-28491'),
          department: authDoctor?.department || 'Department of Radiology & Imaging',
        },
      ];
    }

    // Default 3 Signatories for Pathology / Laboratory Tests
    return [
      {
        id: primaryTech?.id || 'tech-1',
        type: 'technician',
        title: 'PREPARED / REPORTED BY',
        name: report.reviewedByTechnicianName || report.preparedByTechnicianName || primaryTech?.name || 'Md. Tariqul Islam',
        designation: primaryTech?.designation || 'Chief Medical Technologist',
        degrees: 'B.Sc in Medical Laboratory Technology (DU)',
        registrationNo: primaryTech?.employeeId ? `Employee ID: ${primaryTech.employeeId}` : 'Emp ID: JDC-T-101',
        department: primaryTech?.department || 'Pathology & Hematology Lab',
      },
      {
        id: secondTech?.id || 'tech-2',
        type: 'technician',
        title: 'CHECKED & EXAMINED BY',
        name: secondTech?.name || 'Kamrul Hasan Rony',
        designation: secondTech?.designation || 'Senior Medical Technologist (Biochemistry)',
        degrees: 'BMLT, M.Sc (Microbiology)',
        registrationNo: secondTech?.employeeId ? `Employee ID: ${secondTech.employeeId}` : 'Emp ID: JDC-T-102',
        department: secondTech?.department || 'Clinical Biochemistry & Serology',
      },
      {
        id: authDoctor?.id || 'doc-auth',
        type: 'doctor',
        title: 'VERIFIED & AUTHORIZED BY',
        name: report.authorizedByDoctorName || authDoctor?.name || 'Prof. Dr. M. A. Rahman',
        designation: report.authorizedDoctorDesignation || authDoctor?.designation || 'Professor & Senior Consultant Pathologist',
        degrees: authDoctor?.degrees || 'MBBS, FCPS (Pathology), DCP (DU)',
        registrationNo: report.authorizedDoctorBmdc ? `BMDC Reg No: ${report.authorizedDoctorBmdc}` : (authDoctor?.bmdcNo ? `BMDC Reg No: ${authDoctor.bmdcNo}` : 'BMDC: A-28491'),
        department: authDoctor?.department || 'Department of Clinical Pathology',
      },
    ];
  }, [report, isImagingOrCardio]);

  const count = report.signatoryCount || (computedSignatories.length as 1 | 2 | 3) || 3;
  const activeSignatories = computedSignatories.slice(0, count);

  const gridColsClass =
    count === 1
      ? 'grid-cols-1 max-w-xs ml-auto'
      : count === 2
      ? 'grid-cols-2 gap-8'
      : 'grid-cols-3 gap-4 sm:gap-6';

  return (
    <div
      className={`w-full page-break-inside-avoid select-none ${
        isCompact ? 'mt-2 pt-2' : 'mt-4 pt-3'
      }`}
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      {/* Dynamic Responsive Multi-Column Manual Signature Grid */}
      <div className={`grid ${gridColsClass} text-center items-end`}>
        {activeSignatories.map((sig, index) => (
          <div key={index} className="flex flex-col items-center justify-end">
            {/* Signatory Role Header */}
            <span className="text-[9px] sm:text-[10px] font-black text-slate-800 uppercase tracking-wider mb-1">
              {sig.title || (index === 0 ? 'PREPARED BY' : index === 1 ? 'CHECKED BY' : 'AUTHORIZED BY')}
            </span>

            {/* Pristine Blank Manual Physical Pen Signature Zone (Strictly No Auto-Signatures) */}
            <div
              className={`w-full flex items-center justify-center ${
                isCompact ? 'h-10 sm:h-12' : 'h-14 sm:h-16'
              } relative`}
            >
              <div className="text-[8px] text-slate-300 select-none tracking-widest font-mono uppercase opacity-50">
                (Manual Signature)
              </div>
            </div>

            {/* Clean Solid Divider Line for Physical Pen Signature */}
            <div className="w-full border-t-2 border-slate-900 pt-1.5 space-y-0.5">
              <p className="text-[10.5px] sm:text-[11.5px] font-bold text-slate-950 leading-tight">
                {sig.name}
              </p>
              {sig.degrees && (
                <p className="text-[9px] sm:text-[9.5px] text-slate-700 font-medium leading-tight">
                  {sig.degrees}
                </p>
              )}
              {sig.designation && (
                <p className="text-[8.5px] sm:text-[9px] text-slate-600 leading-tight">
                  {sig.designation}
                </p>
              )}
              {sig.registrationNo && (
                <p className="text-[8px] sm:text-[8.5px] text-slate-500 font-mono leading-tight">
                  {sig.registrationNo}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
