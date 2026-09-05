import React, { useState, useEffect } from 'react';
import {
  Report,
  TestTemplate,
  Doctor,
  LabTechnician,
  ParameterResult,
  TestParameter,
} from '../types';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { evaluateParameterResult } from '../utils/abnormalEvaluator';
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Trash2,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  History,
  FileCheck2,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

interface ReportEditorProps {
  report: Report;
  onSaveSuccess: (updatedReport: Report) => void;
  onOpenPrintPreview: (report: Report) => void;
  onCancel: () => void;
}

export const ReportEditor: React.FC<ReportEditorProps> = ({
  report,
  onSaveSuccess,
  onOpenPrintPreview,
  onCancel,
}) => {
  const { currentUser, canEnterResults, canReviewTech, canAuthorizeDoctor } = useAuth();

  // Test Template & Staff Lists
  const [template, setTemplate] = useState<TestTemplate | undefined>(() =>
    dbService.getTemplateById(report.testTemplateId)
  );
  const [doctors] = useState<Doctor[]>(dbService.getActiveDoctors());
  const [technicians] = useState<LabTechnician[]>(dbService.getActiveTechnicians());

  // Sibling reports for this order (Multi-test switcher)
  const [orderReports, setOrderReports] = useState<Report[]>(() =>
    report.orderId ? dbService.getReportsByOrderId(report.orderId) : []
  );

  // Form State
  const [results, setResults] = useState<Record<string, ParameterResult>>(report.results || {});
  const [narrativeContent, setNarrativeContent] = useState(
    report.narrativeContent || template?.defaultNarrative || ''
  );
  const [conditionDiagnosis, setConditionDiagnosis] = useState(
    report.conditionDiagnosis || template?.defaultConditionDiagnosis || ''
  );
  const [recommendations, setRecommendations] = useState(
    report.recommendations || template?.defaultRecommendations || ''
  );
  const [clinicalInterpretation, setClinicalInterpretation] = useState(
    report.clinicalInterpretation || ''
  );

  // Selected Authorizers
  const [selectedTechId, setSelectedTechId] = useState<string>(
    report.verifierTech1Id ||
      report.reviewedByTechnicianId ||
      report.preparedByTechnicianId ||
      (report.designatedVerifierType === 'technician' && report.designatedVerifierId) ||
      technicians[0]?.id ||
      ''
  );
  const [selectedTech2Id, setSelectedTech2Id] = useState<string>(
    report.verifierTech2Id ||
      technicians.find((t) => t.id !== selectedTechId)?.id ||
      technicians[1]?.id ||
      technicians[0]?.id ||
      ''
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    report.verifierDoctorId ||
      report.authorizedByDoctorId ||
      (report.designatedVerifierType === 'doctor' && report.designatedVerifierId) ||
      doctors[0]?.id ||
      ''
  );
  const [signatoryCount, setSignatoryCount] = useState<1 | 2 | 3>(
    report.signatoryCount || 3
  );

  // Revisions & Feedback
  const [revisionReason, setRevisionReason] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteReport = () => {
    dbService.deleteReport(report.id, currentUser || undefined);
    onCancel();
  };

  const isFinalized = report.status === 'verified_final' || report.status === 'authorized_by_doctor';
  const isRevisionMode = isFinalized;

  const isUltrasoundOrImaging =
    report.category === 'Ultrasonography' ||
    report.category === 'Digital Radiology' ||
    report.testName.toLowerCase().includes('usg') ||
    report.testName.toLowerCase().includes('ultrasound') ||
    report.testName.toLowerCase().includes('sonogram') ||
    report.testName.toLowerCase().includes('x-ray') ||
    report.testName.toLowerCase().includes('ecg');

  // Refresh when report prop changes
  useEffect(() => {
    setTemplate(dbService.getTemplateById(report.testTemplateId));
    setResults(report.results || {});
    setNarrativeContent(report.narrativeContent || '');
    setConditionDiagnosis(report.conditionDiagnosis || '');
    setRecommendations(report.recommendations || '');
    setClinicalInterpretation(report.clinicalInterpretation || '');
    if (report.orderId) {
      setOrderReports(dbService.getReportsByOrderId(report.orderId));
    }
  }, [report.id]);

  // Initialize missing parameters from template
  useEffect(() => {
    if (template && template.parameters) {
      const initialResults: Record<string, ParameterResult> = { ...results };
      template.parameters.forEach((param) => {
        if (!param.isHeading && !initialResults[param.id]) {
          const evalRes = evaluateParameterResult(
            param,
            param.defaultValue || '',
            report.patientGender,
            report.patientAge,
            report.patientAgeUnit
          );
          initialResults[param.id] = {
            value: param.defaultValue || '',
            abnormalFlag: evalRes.flag,
          };
        }
      });
      setResults(initialResults);
    }
  }, [template, report]);

  // Handle parameter value change & evaluate abnormality in real time
  const handleValueChange = (paramId: string, newValue: string) => {
    if (!template) return;
    const param = template.parameters.find((p) => p.id === paramId);
    if (!param) return;

    const evalRes = evaluateParameterResult(
      param,
      newValue,
      report.patientGender,
      report.patientAge,
      report.patientAgeUnit
    );

    setResults((prev) => ({
      ...prev,
      [paramId]: {
        value: newValue,
        abnormalFlag: evalRes.flag,
      },
    }));
  };

  // Quick normal presets for lab tests
  const handleApplyNormalDefaults = () => {
    if (!template) return;
    const newRes: Record<string, ParameterResult> = {};
    template.parameters.forEach((p) => {
      if (!p.isHeading) {
        let defaultVal = p.defaultValue || '';
        if (!defaultVal) {
          if (p.unit === 'mg/dL' || p.unit === 'g/dL') defaultVal = 'Normal';
          if (p.resultType === 'options' && p.options && p.options.length > 0) defaultVal = p.options[0];
        }
        const evalRes = evaluateParameterResult(
          p,
          defaultVal,
          report.patientGender,
          report.patientAge,
          report.patientAgeUnit
        );
        newRes[p.id] = {
          value: defaultVal,
          abnormalFlag: evalRes.flag,
        };
      }
    });
    setResults(newRes);
    setMessage({
      type: 'success',
      text: 'Normal reference values applied across all parameters.',
    });
  };

  // Ultrasound 'NID' (Normal ID) Generator for Public-Friendly Normal Reports
  const handleApplyUltrasoundNID = (presetType: 'whole_abdomen' | 'kub' | 'pregnancy' | 'pelvic' | 'hbs' = 'whole_abdomen') => {
    let narrative = '';
    let diagnosis = '';
    let advice = '';

    if (presetType === 'pregnancy') {
      narrative = `OBSTETRIC ULTRASONOGRAPHY (NID - NORMAL PREGNANCY STUDY)

Clinical Indication: Routine Antenatal Care / Gestational Dating.

FINDINGS:
• UTERUS: Gravid uterus containing a single live intrauterine fetus.
• FETAL CARDIAC ACTIVITY: Good fetal cardiac motion observed. FHR: 142 bpm (regular rhythm).
• FETAL MOVEMENT: Active fetal body and limb movements present during scanning.
• PRESENTATION: Cephalic presentation (well adapted to maternal pelvis).
• BIOMETRIC MEASUREMENTS:
  - Biparietal Diameter (BPD): Normal for gestational age.
  - Femur Length (FL): Normal for gestational age.
  - Abdominal Circumference (AC): Normal for gestational age.
  - Estimated Gestational Age (EGA): Corresponding appropriately with clinical dates.
• PLACENTA: Posterior in location, Grade-I maturity, well clear of internal cervical os. No retroplacental clot.
• AMNIOTIC FLUID: Adequate amniotic fluid index (AFI: 13.5 cm). No oligohydramnios or polyhydramnios.
• FETAL ANATOMY: Visualized intracranial structures, spine, four-chamber heart, stomach bubble, kidneys, and urinary bladder appear sonographically intact.`;
      diagnosis = `SINGLE LIVE INTRAUTERINE GESTATION (NID) — Normal fetal cardiac activity and appropriate somatic growth for gestational age.`;
      advice = `Routine antenatal follow-up, balanced nutrition, and serial obstetric ultrasound scan as scheduled by obstetrician.`;
    } else if (presetType === 'kub') {
      narrative = `ULTRASONOGRAPHY OF KIDNEYS, URETERS & URINARY BLADDER (KUB) (NID)

Clinical Indication: Routine renal and urinary tract evaluation.

FINDINGS:
• RIGHT KIDNEY: Normal in size (10.2 cm x 4.4 cm), shape, position, and contour. Cortical echogenicity is normal with clear corticomedullary differentiation. No calculus (stone), solid mass, or pelvicalyceal dilatation (hydronephrosis) seen.
• LEFT KIDNEY: Normal in size (10.6 cm x 4.7 cm) and normal acoustic texture. Corticomedullary boundary is well preserved. No calculus, mass lesion, or hydronephrosis.
• URETERS: Non-dilated bilaterally. No obstructing calculus noted along the course of visualized ureters.
• URINARY BLADDER: Adequately distended with uniform, thin, smooth mucosal wall (2.2 mm). Lumen is clear without calculus, mass, or debris. Pre-void volume: ~290 ml. Post-void residual urine volume is insignificant (< 15 ml).
• PROSTATE / PELVIC: Normal baseline anatomical architecture with smooth capsule.`;
      diagnosis = `NORMAL KUB ULTRASOUND STUDY (NID) — Normal bilateral kidneys and urinary bladder with no calculus or hydronephrosis.`;
      advice = `Adequate daily hydration and clinical correlation with consulting physician.`;
    } else if (presetType === 'pelvic') {
      narrative = `ULTRASONOGRAPHY OF FEMALE PELVIC ORGANS (NID)

Clinical Indication: Routine gynaecological assessment.

FINDINGS:
• UTERUS: Anteverted, normal in size (7.4 cm x 3.8 cm x 4.5 cm), shape, and outline. Myometrium exhibits homogeneous acoustic texture. No focal leiomyoma (fibroid) or adenomyosis.
• ENDOMETRIUM: Central, regular, and uniform with normal thickness (7.2 mm). Cavity is clear.
• RIGHT OVARY: Normal in size (2.8 cm x 1.8 cm) and parenchymal echotexture with physiological follicles. No solid or complex adnexal mass.
• LEFT OVARY: Normal in size (2.7 cm x 1.7 cm) and acoustic pattern. No mass or ovarian cyst.
• POUCH OF DOUGLAS: Clear with no fluid collection or localized mass.`;
      diagnosis = `NORMAL PELVIC ULTRASONOGRAM (NID) — Normal pelvic study with normal uterus, endometrium, and bilateral ovaries.`;
      advice = `Routine clinical follow-up as advised by consulting gynaecologist.`;
    } else {
      // Standard Whole Abdomen (Default NID)
      narrative = `ULTRASONOGRAPHY OF WHOLE ABDOMEN & PELVIS (NID - NORMAL STUDY)

Clinical Indication: Routine medical checkup / abdominal screening.

FINDINGS:
• LIVER: Normal in size (13.4 cm), contour, and parenchymal echotexture. No focal intrahepatic solid or cystic space-occupying lesion (SOL) detected. Intrahepatic biliary radicles (IHBR) and common bile duct (CBD) are not dilated. Portal vein caliber is normal (10 mm).
• GALLBLADDER: Well-distended with smooth, thin, uniform wall (2.0 mm). Lumen is completely sonolucent with no evidence of calculus (gallstone), sludge, or polyp.
• PANCREAS: Normal in size, parenchymal echogenicity, and outline. Main pancreatic duct (MPD) is not dilated. No mass lesion identified.
• SPLEEN: Normal in size (9.2 cm) and acoustic architecture. Splenic vein is normal. No splenomegaly.
• KIDNEYS:
  - Right Kidney: Measures 10.3 cm x 4.4 cm. Normal cortical thickness and clear corticomedullary differentiation. No calculus, hydronephrosis, or SOL.
  - Left Kidney: Measures 10.6 cm x 4.6 cm. Parenchymal thickness is preserved. No calculus, mass lesion, or pelvicalyceal dilatation.
• URINARY BLADDER: Adequately distended with thin, smooth regular wall. Lumen is clear without calculus, mass, or intraluminal echoes. Pre-void volume ~280 ml, post-void residual urine volume is insignificant (< 15 ml).
• PROSTATE / PELVIC: Normal baseline anatomical architecture with smooth capsule.
• PERITONEAL CAVITY: No evidence of free fluid (ascites) or retroperitoneal lymphadenopathy.`;
      diagnosis = `NORMAL ULTRASONOGRAM OF WHOLE ABDOMEN (NID) — Normal study with no significant sonographic abnormality detected.`;
      advice = `Routine clinical correlation with patient's baseline symptoms and follow-up as advised by attending physician.`;
    }

    setNarrativeContent(narrative);
    setConditionDiagnosis(diagnosis);
    setRecommendations(advice);
    setMessage({
      type: 'success',
      text: `Ultrasound 'NID' (Normal ID - ${presetType.replace('_', ' ').toUpperCase()}) standard normal report populated successfully.`,
    });
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const updated: Report = {
      ...report,
      results,
      narrativeContent,
      conditionDiagnosis,
      recommendations,
      clinicalInterpretation,
      status: report.status === 'verified_final' ? report.status : 'draft',
      reportedAt: new Date().toISOString(),
    };

    dbService.saveReport(
      updated,
      currentUser || undefined,
      isRevisionMode ? revisionReason || 'Routine draft update' : undefined
    );
    setMessage({ type: 'success', text: 'Diagnostic results draft saved successfully.' });
    onSaveSuccess(updated);
  };

  // Step 1: Technologist Review
  const handleReviewByTechnician = () => {
    const selectedTech1 = technicians.find((t) => t.id === selectedTechId) || technicians[0];
    const selectedTech2 = technicians.find((t) => t.id === selectedTech2Id) || technicians[1] || selectedTech1;
    const nowIso = new Date().toISOString();

    const existingSignatories = report.signatories || [];
    const updatedSignatories = [...existingSignatories];
    if (updatedSignatories.length > 0) {
      updatedSignatories[0] = {
        ...updatedSignatories[0],
        id: selectedTech1?.id,
        type: 'technician',
        name: selectedTech1?.name || 'Medical Technologist',
        designation: selectedTech1?.designation || 'Medical Technologist',
        degrees: 'B.Sc in Health Technology',
        registrationNo: selectedTech1?.employeeId ? `Employee ID: ${selectedTech1.employeeId}` : '',
        department: selectedTech1?.department || 'Diagnostic Laboratory',
      };
    }
    if (updatedSignatories.length > 1) {
      updatedSignatories[1] = {
        ...updatedSignatories[1],
        id: selectedTech2?.id,
        type: 'technician',
        name: selectedTech2?.name || 'Medical Technologist',
        designation: selectedTech2?.designation || 'Medical Technologist',
        degrees: 'BMLT, M.Sc (Clinical Biochemistry)',
        registrationNo: selectedTech2?.employeeId ? `Employee ID: ${selectedTech2.employeeId}` : '',
        department: selectedTech2?.department || 'Diagnostic Laboratory',
      };
    }

    const updated: Report = {
      ...report,
      results,
      narrativeContent,
      conditionDiagnosis,
      recommendations,
      clinicalInterpretation,
      status: 'reviewed_by_tech',
      preparedByTechnicianId: selectedTech1?.id,
      preparedByTechnicianName: selectedTech1?.name,
      verifierTech1Id: selectedTech1?.id,
      verifierTech1Name: selectedTech1?.name,
      verifierTech2Id: selectedTech2?.id,
      verifierTech2Name: selectedTech2?.name,
      signatoryCount,
      preparedAt: report.preparedAt || nowIso,
      reviewedByTechnicianId: selectedTech1?.id,
      reviewedByTechnicianName: selectedTech1?.name,
      reviewedAt: nowIso,
      techReviewRemarks: `Reviewed by ${selectedTech1?.name} (${selectedTech1?.designation}) & ${selectedTech2?.name}`,
      reportedAt: nowIso,
      signatories: updatedSignatories.length > 0 ? updatedSignatories : undefined,
    };

    dbService.saveReport(updated, currentUser || undefined);
    setMessage({
      type: 'success',
      text: `Technical review confirmed by ${selectedTech1?.name} & ${selectedTech2?.name}. Status updated to Awaiting Doctor Authorization.`,
    });
    onSaveSuccess(updated);
  };

  // Step 2: Doctor / Pathologist Authorization
  const handleAuthorizeDoctor = (finalize = true) => {
    const selectedDoc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    const selectedTech1 = technicians.find((t) => t.id === selectedTechId) || technicians[0];
    const selectedTech2 = technicians.find((t) => t.id === selectedTech2Id) || technicians[1] || selectedTech1;
    const nowIso = new Date().toISOString();

    if (isRevisionMode && !revisionReason.trim()) {
      setMessage({
        type: 'error',
        text: 'Please specify the revision reason before authorizing amended report.',
      });
      return;
    }

    const newStatus = finalize ? 'verified_final' : 'authorized_by_doctor';

    const existingSignatories = report.signatories || [];
    const updatedSignatories = [...existingSignatories];
    if (updatedSignatories.length >= 3) {
      updatedSignatories[0] = {
        ...updatedSignatories[0],
        id: selectedTech1?.id,
        type: 'technician',
        name: selectedTech1?.name || 'Medical Technologist',
        designation: selectedTech1?.designation || 'Medical Technologist',
        degrees: 'B.Sc in Health Technology',
        registrationNo: selectedTech1?.employeeId ? `Employee ID: ${selectedTech1.employeeId}` : '',
        department: selectedTech1?.department || 'Diagnostic Laboratory',
      };
      updatedSignatories[1] = {
        ...updatedSignatories[1],
        id: selectedTech2?.id,
        type: 'technician',
        name: selectedTech2?.name || 'Medical Technologist',
        designation: selectedTech2?.designation || 'Medical Technologist',
        degrees: 'BMLT, M.Sc (Clinical Biochemistry)',
        registrationNo: selectedTech2?.employeeId ? `Employee ID: ${selectedTech2.employeeId}` : '',
        department: selectedTech2?.department || 'Diagnostic Laboratory',
      };
      updatedSignatories[2] = {
        ...updatedSignatories[2],
        id: selectedDoc?.id,
        type: 'doctor',
        name: selectedDoc?.name || 'Authorized Doctor',
        designation: selectedDoc?.designation || selectedDoc?.specialty || 'Consultant',
        degrees: selectedDoc?.degrees || 'MBBS',
        registrationNo: selectedDoc?.bmdcNo ? `BMDC Reg No: ${selectedDoc.bmdcNo}` : '',
        department: selectedDoc?.department || 'Diagnostic Pathology',
      };
    }

    const updated: Report = {
      ...report,
      results,
      narrativeContent,
      conditionDiagnosis,
      recommendations,
      clinicalInterpretation,
      status: newStatus,
      verifierTech1Id: selectedTech1?.id,
      verifierTech1Name: selectedTech1?.name,
      verifierTech2Id: selectedTech2?.id,
      verifierTech2Name: selectedTech2?.name,
      verifierDoctorId: selectedDoc?.id,
      verifierDoctorName: selectedDoc?.name,
      signatoryCount,
      authorizedByDoctorId: selectedDoc?.id,
      authorizedByDoctorName: selectedDoc?.name,
      authorizedDoctorDesignation: selectedDoc?.designation || selectedDoc?.specialty,
      authorizedDoctorBmdc: selectedDoc?.bmdcNo,
      authorizedAt: nowIso,
      verifiedAt: finalize ? nowIso : report.verifiedAt,
      doctorRemarks: `Authorized by ${selectedDoc?.name} (BMDC: ${selectedDoc?.bmdcNo})`,
      reportedAt: nowIso,
      signatories: updatedSignatories.length > 0 ? updatedSignatories : undefined,
    };

    if (isRevisionMode && revisionReason.trim()) {
      const nextRevNo = (report.revisions?.length || 0) + 1;
      updated.revisions = [
        ...(report.revisions || []),
        {
          revisionNo: nextRevNo,
          modifiedAt: nowIso,
          resultsSnapshot: { ...report.results },
          modifiedBy: currentUser?.name || selectedDoc?.name || 'Authorized Doctor',
          reason: revisionReason.trim(),
        },
      ];
    }

    dbService.saveReport(updated, currentUser || undefined);
    setMessage({
      type: 'success',
      text: `Report authorized by ${selectedDoc?.name} (BMDC: ${selectedDoc?.bmdcNo}). Ready for patient release.`,
    });
    onSaveSuccess(updated);
  };

  const handleOpenPrintWithCurrentState = () => {
    const updated: Report = {
      ...report,
      results,
      narrativeContent,
      conditionDiagnosis,
      recommendations,
      clinicalInterpretation,
      reportedAt: new Date().toISOString(),
    };
    dbService.saveReport(updated, currentUser || undefined);
    onOpenPrintPreview(updated);
  };

  const hasAnyCritical = Object.values(results).some((r: any) => r?.abnormalFlag === 'CRITICAL');

  return (
    <div className="space-y-6">
      {/* Top Multi-Test Switcher if part of an order with multiple tests */}
      {orderReports.length > 1 && (
        <div className="bg-teal-900 text-white p-3 rounded-2xl shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs shrink-0 font-bold">
            <Layers className="w-4 h-4 text-teal-300" />
            <span>Order #{report.orderNo} Tests ({orderReports.length}):</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {orderReports.map((r, idx) => {
              const isCurrent = r.id === report.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSaveSuccess(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white text-teal-950 shadow-sm'
                      : 'bg-teal-800/80 hover:bg-teal-700 text-teal-100'
                  }`}
                >
                  <span className="opacity-70">#{idx + 1}</span>
                  <span>{r.testName}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      r.status === 'verified_final'
                        ? 'bg-emerald-400'
                        : r.status === 'reviewed_by_tech'
                        ? 'bg-blue-400'
                        : 'bg-amber-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Banner with Patient Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              {report.reportNo}
            </span>
            <span className="text-xs text-slate-500 font-mono">Accession: {report.accessionNo}</span>
            <span className="text-xs text-slate-500 font-mono">UHID: {report.uhid}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {report.testName} <span className="text-slate-400 font-normal text-sm">({report.category})</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
            <span>
              Patient: <strong className="text-slate-900">{report.patientName}</strong>
            </span>
            <span>•</span>
            <span>
              {report.patientAge} {report.patientAgeUnit}, {report.patientGender.toUpperCase()}
            </span>
            <span>•</span>
            <span>
              Ref: <strong className="text-slate-800">{report.referringDoctorName || 'Self / Direct'}</strong>
            </span>
            <span>•</span>
            <span>Sample: {report.sampleType}</span>
            {report.designatedVerifierName && (
              <>
                <span>•</span>
                <span className="text-teal-800 font-medium">
                  Verifier: {report.designatedVerifierName}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPrintPreview(report)}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-teal-700" />
            Print Preview
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Critical Panic Value Alert */}
      {hasAnyCritical && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 flex items-start gap-3 text-red-950 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm uppercase tracking-wide">
              PANIC / CRITICAL VALUE DETECTED IN TEST PARAMETERS
            </h4>
            <p className="text-xs text-red-800">
              One or more parameters exceed clinical danger limits. Immediate laboratory supervisor notification and clinical alert are advised.
            </p>
          </div>
        </div>
      )}

      {/* ULTRASOUND 'NID' (NORMAL ID) QUICK PRESET TOOLBAR */}
      {isUltrasoundOrImaging && (
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                NID Option
              </span>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Normal ID (NID) Auto-Generator
              </h3>
            </div>
            <p className="text-xs text-teal-200">
              Generate a comprehensive, general-public-friendly standard Normal ultrasound/imaging report in one click.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleApplyUltrasoundNID('whole_abdomen')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-3 py-2 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1"
            >
              🔘 NID: Whole Abdomen
            </button>
            <button
              type="button"
              onClick={() => handleApplyUltrasoundNID('pregnancy')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              NID: Pregnancy (Obs)
            </button>
            <button
              type="button"
              onClick={() => handleApplyUltrasoundNID('kub')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              NID: KUB Tract
            </button>
            <button
              type="button"
              onClick={() => handleApplyUltrasoundNID('pelvic')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              NID: Pelvic / Gynae
            </button>
          </div>
        </div>
      )}

      {/* Main Results Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
        {/* Tabulated Numeric/Options Results (e.g. CBC, Lipid Profile, LFT, KFT, Urine R/M/E) */}
        {template && template.parameters && template.parameters.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-700" />
                Laboratory Test Parameters &amp; Numerical Readings
              </h3>
              <button
                type="button"
                onClick={handleApplyNormalDefaults}
                className="text-xs text-teal-800 hover:text-teal-950 font-semibold bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg cursor-pointer transition"
              >
                Apply Normal Baseline Values
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4 w-1/3">Investigation Parameter</th>
                    <th className="py-3 px-4 w-1/4">Observed Value</th>
                    <th className="py-3 px-3 text-center">Status Flag</th>
                    <th className="py-3 px-3">Unit</th>
                    <th className="py-3 px-4">Reference Interval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {template.parameters.map((param) => {
                    if (param.isHeading) {
                      return (
                        <tr key={param.id} className="bg-slate-100 font-bold text-slate-800">
                          <td colSpan={5} className="py-2 px-4 text-xs uppercase tracking-wider text-teal-950">
                            {param.name}
                          </td>
                        </tr>
                      );
                    }

                    const paramResult = results[param.id] || {
                      value: '',
                      abnormalFlag: 'NORMAL',
                    };

                    const isHigh = paramResult.abnormalFlag === 'HIGH';
                    const isLow = paramResult.abnormalFlag === 'LOW';
                    const isCrit = paramResult.abnormalFlag === 'CRITICAL';

                    return (
                      <tr
                        key={param.id}
                        className={`transition ${
                          isCrit
                            ? 'bg-red-50/70'
                            : isHigh
                            ? 'bg-amber-50/60'
                            : isLow
                            ? 'bg-blue-50/50'
                            : 'hover:bg-slate-50/40'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          {param.name}
                        </td>

                        {/* Input Cell */}
                        <td className="py-2.5 px-4">
                          {param.resultType === 'options' && param.options ? (
                            <select
                              value={paramResult.value}
                              onChange={(e) => handleValueChange(param.id, e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option value="">-- Select --</option>
                              {param.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={paramResult.value}
                              onChange={(e) => handleValueChange(param.id, e.target.value)}
                              placeholder={`Enter ${param.name}`}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          )}
                        </td>

                        {/* Flag Indicator */}
                        <td className="py-2.5 px-3 text-center">
                          {isCrit && (
                            <span className="bg-red-700 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm">
                              CRITICAL
                            </span>
                          )}
                          {isHigh && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                              HIGH
                            </span>
                          )}
                          {isLow && (
                            <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px] px-2 py-0.5 rounded">
                              LOW
                            </span>
                          )}
                          {!isCrit && !isHigh && !isLow && (
                            <span className="text-slate-400 text-[10px]">Normal</span>
                          )}
                        </td>

                        {/* Unit */}
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{param.unit || '—'}</td>

                        {/* Biological Reference Interval */}
                        <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                          {param.refRange || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Narrative / Free-text Findings for Imaging, Ultrasound, & Pathology */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            Clinical Examination Findings &amp; Structured Protocol
          </h3>
          <textarea
            rows={10}
            value={narrativeContent}
            onChange={(e) => setNarrativeContent(e.target.value)}
            placeholder="Enter structured imaging findings, measurements, organ descriptions, impressions, and conclusions..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Condition Name / Diagnostic Impression */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-700" />
            Condition Name / Diagnostic Impression / Conclusion
          </label>
          <input
            type="text"
            value={conditionDiagnosis}
            onChange={(e) => setConditionDiagnosis(e.target.value)}
            placeholder="e.g. NORMAL ULTRASOUND STUDY (NID) / Mild Hepatomegaly / Sinus Rhythm"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Clinical Recommendations & Advice */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Clinical Recommendations / Patient Advice / Follow-up Notes
          </label>
          <textarea
            rows={2}
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="e.g. Advised routine correlation with LFT or follow-up scan in 6 months..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Clinical Interpretation & Consultant Remarks */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Consultant Remarks / Methodological Notes
          </label>
          <textarea
            rows={2}
            value={clinicalInterpretation}
            onChange={(e) => setClinicalInterpretation(e.target.value)}
            placeholder="Add additional remarks for the referring doctor or lab quality notes..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Revision Reason (If modifying finalized/authorized report) */}
        {isRevisionMode && (
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-2">
            <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-700" />
              Report Amendment / Revision Reason (Audit Requirement)
            </label>
            <input
              type="text"
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="Explain amendment reason (e.g. Specimen re-run confirmation, typographical correction)..."
              className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}

        {/* TWO-STAGE MANUAL AUTHORIZATION WORKFLOW (2 TECHS + 1 DOCTOR) */}
        <div className="pt-6 border-t-2 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                Verifier Personnel &amp; Quality Sign-Off Selection
              </h4>
              <p className="text-xs text-slate-500">
                Select 2 registered Medical Technologists and 1 Consulting Pathologist / Doctor for physical signature blocks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Signatory Slots:</label>
              <select
                value={signatoryCount}
                onChange={(e) => setSignatoryCount(Number(e.target.value) as 1 | 2 | 3)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                <option value={3}>3 Signatories (Tech 1, Tech 2, Doctor)</option>
                <option value={2}>2 Signatories (Tech 1 & Doctor)</option>
                <option value={1}>1 Signatory (Doctor Only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1A: Lab Technologist 1 (Prepared / Reported By) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                  1. Tech 1 (Prepared By)
                </span>
                {report.status === 'reviewed_by_tech' ||
                report.status === 'authorized_by_doctor' ||
                report.status === 'verified_final' ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ✓ Reviewed
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-medium">Pending</span>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Primary Medical Technologist</label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.designation})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleReviewByTechnician}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold py-1.5 rounded-lg transition cursor-pointer"
              >
                Sign as Tech 1
              </button>
            </div>

            {/* Step 1B: Lab Technologist 2 (Checked / Examined By) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-teal-700" />
                  2. Tech 2 (Examined By)
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Quality Check</span>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Secondary Medical Technologist</label>
                <select
                  value={selectedTech2Id}
                  onChange={(e) => setSelectedTech2Id(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.designation})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleReviewByTechnician}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white text-[11px] font-bold py-1.5 rounded-lg transition cursor-pointer"
              >
                Confirm Tech 2 Check
              </button>
            </div>

            {/* Step 2: Doctor / Pathologist Authorization */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  3. Doctor (Verified By)
                </span>
                {report.status === 'verified_final' ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ✓ Final
                  </span>
                ) : report.status === 'authorized_by_doctor' ? (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    ✓ Authorized
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium">Pending</span>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Consulting Pathologist / Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} • BMDC: {d.bmdcNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAuthorizeDoctor(false)}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold py-1.5 rounded-lg transition cursor-pointer"
                >
                  Authorize
                </button>
                <button
                  type="button"
                  onClick={() => handleAuthorizeDoctor(true)}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold py-1.5 rounded-lg transition cursor-pointer"
                >
                  Finalize
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-600" />
              Save Progress Draft
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold px-3 py-2.5 rounded-xl border border-rose-200 transition cursor-pointer"
              title="Permanently remove this report"
            >
              <Trash2 className="w-4 h-4" />
              Delete Report
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenPrintWithCurrentState}
              className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-teal-700" />
              Preview Printable A4 Report
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Close Editor
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-md w-full p-6 relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Delete Diagnostic Report?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to permanently delete report <strong className="text-slate-900">{report.reportNo}</strong> ({report.testName}) for patient <strong className="text-slate-900">{report.patientName}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReport}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
