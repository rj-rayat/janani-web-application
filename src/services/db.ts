import {
  AuditLog,
  Doctor,
  LabTechnician,
  Order,
  Patient,
  Report,
  TestTemplate,
  User,
} from '../types';
import { OFFICIAL_TEST_TEMPLATES } from '../data/testTemplates';

const STORAGE_KEYS = {
  USERS: 'janani_db_users_v2',
  DOCTORS: 'janani_db_doctors_v2',
  TECHNICIANS: 'janani_db_technicians_v2',
  PATIENTS: 'janani_db_patients_v2',
  TEMPLATES: 'janani_db_templates_v2',
  ORDERS: 'janani_db_orders_v2',
  REPORTS: 'janani_db_reports_v2',
  AUDIT_LOGS: 'janani_db_audit_logs_v2',
  CURRENT_USER: 'janani_auth_session_v2',
};

// Initial Doctors list
const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Prof. Dr. M. A. Rahman',
    designation: 'Professor & Senior Consultant',
    specialty: 'Clinical Pathology & Hematology',
    bmdcNo: 'A-28491',
    department: 'Pathology & Hematology',
    phone: '01711-307064',
    email: 'dr.rahman@jananidc.com',
    roomNo: 'Room 201',
    hospitalAffiliation: 'Janani Diagnostic Centre & Medical Services',
    active: true,
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'doc-002',
    name: 'Dr. Nusrat Jahan Chowdhury',
    designation: 'Associate Professor & Consultant',
    specialty: 'Clinical Biochemistry & Endocrinology',
    bmdcNo: 'A-39104',
    department: 'Biochemistry & Hormones',
    phone: '01818-605760',
    email: 'dr.nusrat@jananidc.com',
    roomNo: 'Room 204',
    hospitalAffiliation: 'Janani Diagnostic Centre',
    active: true,
    createdAt: '2024-02-10T09:30:00.000Z',
  },
  {
    id: 'doc-003',
    name: 'Dr. Kazi Farhan Ahmed',
    designation: 'Consultant Radiologist & Sonologist',
    specialty: 'Radiology, Imaging & 4D Color Doppler',
    bmdcNo: 'A-45892',
    department: 'Radiology & Imaging',
    phone: '01819-887766',
    email: 'dr.farhan@jananidc.com',
    roomNo: 'Room 102',
    hospitalAffiliation: 'Janani Diagnostic Centre',
    active: true,
    createdAt: '2024-03-01T10:00:00.000Z',
  },
  {
    id: 'doc-004',
    name: 'Dr. Shahadat Hossain',
    designation: 'Consultant Cardiologist',
    specialty: 'Cardiology & Internal Medicine',
    bmdcNo: 'A-32115',
    department: 'Cardiology',
    phone: '01912-334455',
    email: 'dr.shahadat@jananidc.com',
    roomNo: 'Room 305',
    hospitalAffiliation: 'Janani Diagnostic Centre',
    active: true,
    createdAt: '2024-04-12T11:00:00.000Z',
  },
  {
    id: 'doc-005',
    name: 'Dr. Saima Sultana',
    designation: 'Consultant Microbiologist & Histopathologist',
    specialty: 'Microbiology & Histopathology',
    bmdcNo: 'A-51203',
    department: 'Microbiology & Pathology',
    phone: '01712-998877',
    email: 'dr.saima@jananidc.com',
    roomNo: 'Room 208',
    hospitalAffiliation: 'Janani Diagnostic Centre',
    active: true,
    createdAt: '2024-05-18T09:00:00.000Z',
  },
];

// Initial Lab Technicians list
const INITIAL_TECHNICIANS: LabTechnician[] = [
  {
    id: 'tech-001',
    name: 'Md. Tariqul Islam',
    designation: 'Chief Medical Technologist (Lab)',
    department: 'Hematology & Clinical Chemistry',
    employeeId: 'JDC-T-101',
    phone: '01811-223344',
    email: 'tariqul@jananidc.com',
    active: true,
    createdAt: '2024-01-10T08:00:00.000Z',
  },
  {
    id: 'tech-002',
    name: 'Kamrul Hasan Rony',
    designation: 'Senior Medical Technologist',
    department: 'Microbiology & Serology',
    employeeId: 'JDC-T-102',
    phone: '01713-445566',
    email: 'kamrul@jananidc.com',
    active: true,
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 'tech-003',
    name: 'Nasrin Akter',
    designation: 'Medical Technologist',
    department: 'Clinical Pathology & Hormones',
    employeeId: 'JDC-T-103',
    phone: '01815-667788',
    email: 'nasrin@jananidc.com',
    active: true,
    createdAt: '2024-03-15T08:00:00.000Z',
  },
  {
    id: 'tech-004',
    name: 'Sultan Mahmud',
    designation: 'Radiology & X-Ray Technologist (DR)',
    department: 'Digital Radiology & Imaging',
    employeeId: 'JDC-T-104',
    phone: '01918-778899',
    email: 'sultan@jananidc.com',
    active: true,
    createdAt: '2024-04-01T08:00:00.000Z',
  },
];

// Initial System Users with clear roles
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    name: 'Administrative Director',
    role: 'admin',
    email: 'admin@jananidc.com',
    phone: '01818-605760',
    designation: 'System Administrator',
    department: 'Operations',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-pathologist',
    username: 'pathologist',
    name: 'Prof. Dr. M. A. Rahman',
    role: 'pathologist',
    email: 'dr.rahman@jananidc.com',
    phone: '01711-307064',
    designation: 'Professor of Pathology',
    department: 'Pathology & Hematology',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-doctor',
    username: 'doctor',
    name: 'Dr. Nusrat Jahan Chowdhury',
    role: 'doctor',
    email: 'dr.nusrat@jananidc.com',
    phone: '01818-605760',
    designation: 'Consultant Biochemist',
    department: 'Clinical Biochemistry',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-radiologist',
    username: 'radiologist',
    name: 'Dr. Kazi Farhan Ahmed',
    role: 'radiologist',
    email: 'dr.farhan@jananidc.com',
    phone: '01819-887766',
    designation: 'Consultant Radiologist',
    department: 'Radiology & Imaging',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-tech',
    username: 'labtech',
    name: 'Md. Tariqul Islam',
    role: 'lab_technician',
    email: 'tariqul@jananidc.com',
    phone: '01811-223344',
    designation: 'Chief Medical Technologist',
    department: 'Laboratory',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-recep',
    username: 'receptionist',
    name: 'Abidur Rahim',
    role: 'receptionist',
    email: 'reception@jananidc.com',
    phone: '01818-605760',
    designation: 'Senior Reception Officer',
    department: 'Front Desk & Patient Services',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// Seed Patients
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    uhid: 'JDC-P-2026-00101',
    name: 'Shah Alam Chowdhury',
    age: 48,
    ageUnit: 'years',
    gender: 'male',
    phone: '01819-456789',
    address: 'Trunk Road, Feni Sadar, Feni',
    bloodGroup: 'B (+ve)',
    emergencyContact: '01819-112233',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pat-002',
    uhid: 'JDC-P-2026-00102',
    name: 'Farhana Yasmin',
    age: 29,
    ageUnit: 'years',
    gender: 'female',
    phone: '01712-345678',
    address: 'Masterpara, Feni Sadar, Feni',
    bloodGroup: 'O (+ve)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pat-003',
    uhid: 'JDC-P-2026-00103',
    name: 'Master Ayan Ahmed',
    age: 4,
    ageUnit: 'years',
    gender: 'male',
    phone: '01911-223344',
    address: 'Daganbhuiyan, Feni',
    bloodGroup: 'A (+ve)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pat-004',
    uhid: 'JDC-P-2026-00088',
    name: 'Haji Mohammad Younus',
    age: 64,
    ageUnit: 'years',
    gender: 'male',
    phone: '01817-654321',
    address: 'Sonagazi, Feni',
    bloodGroup: 'AB (+ve)',
    createdAt: '2026-05-14T09:00:00.000Z',
    updatedAt: '2026-05-14T09:00:00.000Z',
  },
];

// Helper to seed initial sample orders and reports
function generateSeedOrdersAndReports(): { orders: Order[]; reports: Report[] } {
  const todayIso = new Date().toISOString();
  const todayYmd = todayIso.slice(0, 10).replace(/-/g, '');

  // 1. Today's Completed CBC Report
  const ord1Id = 'ord-seed-001';
  const rep1Id = 'rep-seed-001';
  const order1: Order = {
    id: ord1Id,
    orderNo: `ORD-${todayYmd}-001`,
    patientId: 'pat-001',
    uhid: 'JDC-P-2026-00101',
    patientName: 'Shah Alam Chowdhury',
    patientAge: 48,
    patientAgeUnit: 'years',
    patientGender: 'male',
    patientPhone: '01819-456789',
    referringDoctorId: 'doc-001',
    referringDoctorName: 'Prof. Dr. M. A. Rahman',
    items: [
      {
        templateId: 'tmpl-cbc',
        testName: 'Complete Blood Count (CBC) with ESR & PBF',
        testCode: 'HEM-001',
        category: 'Hematology',
        fee: 450,
        sampleType: 'Whole Blood (EDTA - 2ml)',
        status: 'completed',
        reportId: rep1Id,
      },
    ],
    totalAmount: 450,
    discount: 0,
    paidAmount: 450,
    dueAmount: 0,
    paymentStatus: 'paid',
    priority: 'routine',
    status: 'completed',
    sampleCollectedAt: todayIso,
    sampleCollectorName: 'Md. Tariqul Islam',
    createdAt: todayIso,
  };

  const report1: Report = {
    id: rep1Id,
    reportNo: `REP-${todayYmd}-001`,
    orderId: ord1Id,
    orderNo: `ORD-${todayYmd}-001`,
    accessionNo: 'ACC-884201',
    patientId: 'pat-001',
    uhid: 'JDC-P-2026-00101',
    patientName: 'Shah Alam Chowdhury',
    patientAge: 48,
    patientAgeUnit: 'years',
    patientGender: 'male',
    patientPhone: '01819-456789',
    patientAddress: 'Trunk Road, Feni Sadar, Feni',
    referringDoctorId: 'doc-001',
    referringDoctorName: 'Prof. Dr. M. A. Rahman',
    testTemplateId: 'tmpl-cbc',
    testName: 'Complete Blood Count (CBC) with ESR & PBF',
    testCode: 'HEM-001',
    category: 'Hematology',
    sampleType: 'Whole Blood (EDTA - 2ml)',
    method: 'Automated 5-Part Differential Hematology Analyzer & Manual Microscopy',
    specimenReceivedAt: todayIso,
    reportedAt: todayIso,
    results: {
      'p-hb': { value: '14.8', abnormalFlag: 'NORMAL' },
      'p-rbc': { value: '4.95', abnormalFlag: 'NORMAL' },
      'p-pcv': { value: '44.2', abnormalFlag: 'NORMAL' },
      'p-mcv': { value: '89.3', abnormalFlag: 'NORMAL' },
      'p-mch': { value: '29.9', abnormalFlag: 'NORMAL' },
      'p-mchc': { value: '33.5', abnormalFlag: 'NORMAL' },
      'p-rdw': { value: '13.1', abnormalFlag: 'NORMAL' },
      'p-plt': { value: '280', abnormalFlag: 'NORMAL' },
      'p-wbc': { value: '7800', abnormalFlag: 'NORMAL' },
      'p-neutro': { value: '62', abnormalFlag: 'NORMAL' },
      'p-lymph': { value: '30', abnormalFlag: 'NORMAL' },
      'p-mono': { value: '5', abnormalFlag: 'NORMAL' },
      'p-eos': { value: '3', abnormalFlag: 'NORMAL' },
      'p-baso': { value: '0', abnormalFlag: 'NORMAL' },
      'p-esr': { value: '12', abnormalFlag: 'NORMAL' },
      'p-pbf': {
        value: 'RBCs are normocytic and normochromic. WBC count and morphology are within normal limits. Platelets adequate in number and morphology.',
        abnormalFlag: 'NORMAL',
      },
    },
    clinicalInterpretation: 'Hematological parameters are within normal biological reference intervals.',
    status: 'verified_final',
    preparedByTechnicianId: 'tech-001',
    preparedByTechnicianName: 'Md. Tariqul Islam',
    preparedAt: todayIso,
    reviewedByTechnicianId: 'tech-001',
    reviewedByTechnicianName: 'Md. Tariqul Islam',
    reviewedAt: todayIso,
    techReviewRemarks: 'Specimen verified, calibrated run, controls validated.',
    authorizedByDoctorId: 'doc-001',
    authorizedByDoctorName: 'Prof. Dr. M. A. Rahman',
    authorizedDoctorDesignation: 'Professor & Senior Consultant (Pathology)',
    authorizedDoctorBmdc: 'BMDC Reg. A-28491',
    authorizedAt: todayIso,
    doctorRemarks: 'Correlated clinically. Normal report.',
    verifiedAt: todayIso,
    revisions: [],
    printConfig: {
      withLetterhead: true,
      showQrCode: true,
      showBarcode: true,
      showReferenceRanges: true,
      fontSize: 'normal',
    },
  };

  // 2. Today's Lipid & Glucose Order in Progress
  const ord2Id = 'ord-seed-002';
  const rep2Id = 'rep-seed-002';
  const order2: Order = {
    id: ord2Id,
    orderNo: `ORD-${todayYmd}-002`,
    patientId: 'pat-002',
    uhid: 'JDC-P-2026-00102',
    patientName: 'Farhana Yasmin',
    patientAge: 29,
    patientAgeUnit: 'years',
    patientGender: 'female',
    patientPhone: '01712-345678',
    referringDoctorId: 'doc-002',
    referringDoctorName: 'Dr. Nusrat Jahan Chowdhury',
    items: [
      {
        templateId: 'tmpl-lipid',
        testName: 'Lipid Profile Panel',
        testCode: 'BIO-001',
        category: 'Biochemistry',
        fee: 850,
        sampleType: 'Serum (Fasting 10-12 hrs - 3ml)',
        status: 'in_progress',
        reportId: rep2Id,
      },
    ],
    totalAmount: 850,
    discount: 50,
    paidAmount: 800,
    dueAmount: 0,
    paymentStatus: 'paid',
    priority: 'routine',
    status: 'in_progress',
    sampleCollectedAt: todayIso,
    sampleCollectorName: 'Nasrin Akter',
    createdAt: todayIso,
  };

  const report2: Report = {
    id: rep2Id,
    reportNo: `REP-${todayYmd}-002`,
    orderId: ord2Id,
    orderNo: `ORD-${todayYmd}-002`,
    accessionNo: 'ACC-884202',
    patientId: 'pat-002',
    uhid: 'JDC-P-2026-00102',
    patientName: 'Farhana Yasmin',
    patientAge: 29,
    patientAgeUnit: 'years',
    patientGender: 'female',
    patientPhone: '01712-345678',
    patientAddress: 'Masterpara, Feni Sadar, Feni',
    referringDoctorId: 'doc-002',
    referringDoctorName: 'Dr. Nusrat Jahan Chowdhury',
    testTemplateId: 'tmpl-lipid',
    testName: 'Lipid Profile Panel',
    testCode: 'BIO-001',
    category: 'Biochemistry',
    sampleType: 'Serum (Fasting 10-12 hrs - 3ml)',
    method: 'Fully Automated Enzymatic Colorimetric Analyzer',
    specimenReceivedAt: todayIso,
    reportedAt: todayIso,
    results: {
      'p-chol': { value: '235', abnormalFlag: 'HIGH' },
      'p-tg': { value: '185', abnormalFlag: 'HIGH' },
      'p-hdl': { value: '44', abnormalFlag: 'LOW' },
      'p-ldl': { value: '154', abnormalFlag: 'HIGH' },
      'p-vldl': { value: '37', abnormalFlag: 'HIGH' },
      'p-chol-hdl': { value: '5.3', abnormalFlag: 'HIGH' },
    },
    clinicalInterpretation: 'Mixed Dyslipidemia noted with elevated Total Cholesterol, LDL, and Triglycerides with low HDL.',
    status: 'reviewed_by_tech',
    preparedByTechnicianId: 'tech-003',
    preparedByTechnicianName: 'Nasrin Akter',
    preparedAt: todayIso,
    reviewedByTechnicianId: 'tech-001',
    reviewedByTechnicianName: 'Md. Tariqul Islam',
    reviewedAt: todayIso,
    techReviewRemarks: 'Serum slightly lipemic, duplicate test verified.',
    revisions: [],
    printConfig: {
      withLetterhead: true,
      showQrCode: true,
      showBarcode: true,
      showReferenceRanges: true,
      fontSize: 'normal',
    },
  };

  // 3. Historical Report from previous month (May 2026) for testing Date/Month/Year filter
  const ordHistId = 'ord-hist-001';
  const repHistId = 'rep-hist-001';
  const histDate = '2026-05-14T10:30:00.000Z';
  const orderHist: Order = {
    id: ordHistId,
    orderNo: 'ORD-20260514-042',
    patientId: 'pat-004',
    uhid: 'JDC-P-2026-00088',
    patientName: 'Haji Mohammad Younus',
    patientAge: 64,
    patientAgeUnit: 'years',
    patientGender: 'male',
    patientPhone: '01817-654321',
    referringDoctorId: 'doc-004',
    referringDoctorName: 'Dr. Shahadat Hossain',
    items: [
      {
        templateId: 'tmpl-kft',
        testName: 'Kidney Function Test (KFT / Renal Profile)',
        testCode: 'BIO-003',
        category: 'Biochemistry',
        fee: 800,
        sampleType: 'Serum (3ml)',
        status: 'completed',
        reportId: repHistId,
      },
    ],
    totalAmount: 800,
    discount: 0,
    paidAmount: 800,
    dueAmount: 0,
    paymentStatus: 'paid',
    priority: 'routine',
    status: 'completed',
    sampleCollectedAt: histDate,
    sampleCollectorName: 'Md. Tariqul Islam',
    createdAt: histDate,
  };

  const reportHist: Report = {
    id: repHistId,
    reportNo: 'REP-20260514-042',
    orderId: ordHistId,
    orderNo: 'ORD-20260514-042',
    accessionNo: 'ACC-775190',
    patientId: 'pat-004',
    uhid: 'JDC-P-2026-00088',
    patientName: 'Haji Mohammad Younus',
    patientAge: 64,
    patientAgeUnit: 'years',
    patientGender: 'male',
    patientPhone: '01817-654321',
    patientAddress: 'Sonagazi, Feni',
    referringDoctorId: 'doc-004',
    referringDoctorName: 'Dr. Shahadat Hossain',
    testTemplateId: 'tmpl-kft',
    testName: 'Kidney Function Test (KFT / Renal Profile)',
    testCode: 'BIO-003',
    category: 'Biochemistry',
    sampleType: 'Serum (3ml)',
    method: 'Jaffe / Enzymatic & Ion Selective Electrode (ISE)',
    specimenReceivedAt: histDate,
    reportedAt: histDate,
    results: {
      'p-creat': { value: '1.9', abnormalFlag: 'HIGH' },
      'p-urea': { value: '58', abnormalFlag: 'HIGH' },
      'p-bun': { value: '27.1', abnormalFlag: 'HIGH' },
      'p-uric': { value: '7.8', abnormalFlag: 'HIGH' },
      'p-na': { value: '138', abnormalFlag: 'NORMAL' },
      'p-k': { value: '4.8', abnormalFlag: 'NORMAL' },
      'p-cl': { value: '101', abnormalFlag: 'NORMAL' },
      'p-egfr': { value: '38', abnormalFlag: 'LOW' },
    },
    clinicalInterpretation: 'Impaired renal function with elevated serum creatinine and reduced eGFR (CKD Stage 3b pattern).',
    status: 'verified_final',
    preparedByTechnicianId: 'tech-001',
    preparedByTechnicianName: 'Md. Tariqul Islam',
    preparedAt: histDate,
    reviewedByTechnicianId: 'tech-001',
    reviewedByTechnicianName: 'Md. Tariqul Islam',
    reviewedAt: histDate,
    authorizedByDoctorId: 'doc-002',
    authorizedByDoctorName: 'Dr. Nusrat Jahan Chowdhury',
    authorizedDoctorDesignation: 'Associate Professor & Consultant Biochemist',
    authorizedDoctorBmdc: 'BMDC Reg. A-39104',
    authorizedAt: histDate,
    doctorRemarks: 'Advise nephrology consultation and 24-hr urinary protein.',
    verifiedAt: histDate,
    revisions: [],
    printConfig: {
      withLetterhead: true,
      showQrCode: true,
      showBarcode: true,
      showReferenceRanges: true,
      fontSize: 'normal',
    },
  };

  return {
    orders: [order1, order2, orderHist],
    reports: [report1, report2, reportHist],
  };
}

class JananiDatabaseService {
  private isInitialized = false;

  constructor() {
    this.initDatabase();
  }

  public initDatabase(forceReset = false): void {
    if (this.isInitialized && !forceReset) return;

    // Initialize Users
    if (!localStorage.getItem(STORAGE_KEYS.USERS) || forceReset) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }

    // Initialize Doctors
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS) || forceReset) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    }

    // Initialize Technicians
    if (!localStorage.getItem(STORAGE_KEYS.TECHNICIANS) || forceReset) {
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(INITIAL_TECHNICIANS));
    }

    // Initialize Test Templates
    if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES) || forceReset) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(OFFICIAL_TEST_TEMPLATES));
    }

    // Initialize Patients
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS) || forceReset) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    }

    // Initialize Orders & Reports
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS) || !localStorage.getItem(STORAGE_KEYS.REPORTS) || forceReset) {
      const { orders, reports } = generateSeedOrdersAndReports();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }

    // Initialize Audit Logs
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || forceReset) {
      const initialLogs: AuditLog[] = [
        {
          id: 'log-001',
          timestamp: new Date().toISOString(),
          userId: 'usr-admin',
          userName: 'System Administrator',
          userRole: 'admin',
          action: 'SYSTEM_INITIALIZATION',
          entityType: 'backup',
          entityId: 'sys-init',
          details: 'Janani Diagnostic Centre clinical database initialized successfully.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
    }

    this.isInitialized = true;
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  public getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  public getUserByUsername(username: string): User | undefined {
    return this.getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase() && u.active);
  }

  public getCurrentSession(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  public setCurrentSession(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // ==========================================
  // DOCTORS
  // ==========================================
  public getDoctors(): Doctor[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return raw ? JSON.parse(raw) : INITIAL_DOCTORS;
  }

  public getActiveDoctors(): Doctor[] {
    return this.getDoctors().filter((d) => d.active);
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find((d) => d.id === id);
  }

  public saveDoctor(doctor: Doctor, currentUser?: User): void {
    const docs = this.getDoctors();
    const idx = docs.findIndex((d) => d.id === doctor.id);
    if (idx >= 0) {
      docs[idx] = doctor;
      this.logAudit(
        currentUser,
        'UPDATE_DOCTOR',
        'doctor',
        doctor.id,
        `Updated doctor record for ${doctor.name} (${doctor.specialty})`
      );
    } else {
      docs.unshift(doctor);
      this.logAudit(
        currentUser,
        'CREATE_DOCTOR',
        'doctor',
        doctor.id,
        `Added new doctor ${doctor.name} (BMDC: ${doctor.bmdcNo})`
      );
    }
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(docs));
  }

  public toggleDoctorStatus(id: string, currentUser?: User): void {
    const docs = this.getDoctors();
    const doc = docs.find((d) => d.id === id);
    if (doc) {
      doc.active = !doc.active;
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(docs));
      this.logAudit(
        currentUser,
        'TOGGLE_DOCTOR_STATUS',
        'doctor',
        id,
        `Changed active status of Dr. ${doc.name} to ${doc.active ? 'Active' : 'Inactive'}`
      );
    }
  }

  public deleteDoctor(id: string, currentUser?: User): boolean {
    const docs = this.getDoctors();
    const docToDelete = docs.find((d) => d.id === id);
    if (!docToDelete) return false;
    const updated = docs.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(updated));
    this.logAudit(
      currentUser,
      'DELETE_DOCTOR',
      'doctor',
      id,
      `Deleted doctor ${docToDelete.name} (BMDC: ${docToDelete.bmdcNo})`
    );
    return true;
  }

  // ==========================================
  // LAB TECHNICIANS
  // ==========================================
  public getTechnicians(): LabTechnician[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
    return raw ? JSON.parse(raw) : INITIAL_TECHNICIANS;
  }

  public getActiveTechnicians(): LabTechnician[] {
    return this.getTechnicians().filter((t) => t.active);
  }

  public getTechnicianById(id: string): LabTechnician | undefined {
    return this.getTechnicians().find((t) => t.id === id);
  }

  public saveTechnician(technician: LabTechnician, currentUser?: User): void {
    const techs = this.getTechnicians();
    const idx = techs.findIndex((t) => t.id === technician.id);
    if (idx >= 0) {
      techs[idx] = technician;
      this.logAudit(
        currentUser,
        'UPDATE_TECHNICIAN',
        'technician',
        technician.id,
        `Updated technician ${technician.name} (${technician.employeeId})`
      );
    } else {
      techs.unshift(technician);
      this.logAudit(
        currentUser,
        'CREATE_TECHNICIAN',
        'technician',
        technician.id,
        `Added new lab technician ${technician.name} (Emp ID: ${technician.employeeId})`
      );
    }
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(techs));
  }

  public toggleTechnicianStatus(id: string, currentUser?: User): void {
    const techs = this.getTechnicians();
    const tech = techs.find((t) => t.id === id);
    if (tech) {
      tech.active = !tech.active;
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(techs));
      this.logAudit(
        currentUser,
        'TOGGLE_TECHNICIAN_STATUS',
        'technician',
        id,
        `Changed active status of technician ${tech.name} to ${tech.active ? 'Active' : 'Inactive'}`
      );
    }
  }

  public deleteTechnician(id: string, currentUser?: User): boolean {
    const techs = this.getTechnicians();
    const techToDelete = techs.find((t) => t.id === id);
    if (!techToDelete) return false;
    const updated = techs.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(updated));
    this.logAudit(
      currentUser,
      'DELETE_TECHNICIAN',
      'technician',
      id,
      `Deleted lab technician ${techToDelete.name} (${techToDelete.employeeId})`
    );
    return true;
  }

  // ==========================================
  // PATIENTS
  // ==========================================
  public getPatients(): Patient[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : INITIAL_PATIENTS;
  }

  public getPatientById(id: string): Patient | undefined {
    return this.getPatients().find((p) => p.id === id);
  }

  public getPatientByUhid(uhid: string): Patient | undefined {
    return this.getPatients().find((p) => p.uhid.toLowerCase() === uhid.trim().toLowerCase());
  }

  public savePatient(patient: Patient, currentUser?: User): Patient {
    const patients = this.getPatients();
    const idx = patients.findIndex((p) => p.id === patient.id);
    if (idx >= 0) {
      patient.updatedAt = new Date().toISOString();
      patients[idx] = patient;
      this.logAudit(
        currentUser,
        'UPDATE_PATIENT',
        'patient',
        patient.id,
        `Updated demographics for ${patient.name} (${patient.uhid})`
      );
    } else {
      patient.createdAt = new Date().toISOString();
      patient.updatedAt = patient.createdAt;
      patients.unshift(patient);
      this.logAudit(
        currentUser,
        'REGISTER_PATIENT',
        'patient',
        patient.id,
        `Registered new patient ${patient.name} (${patient.uhid}), Age: ${patient.age} ${patient.ageUnit}, ${patient.gender}`
      );
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return patient;
  }

  public generateUhid(): string {
    const year = new Date().getFullYear();
    const patients = this.getPatients();
    const nextSeq = patients.length + 101;
    return `JDC-P-${year}-${String(nextSeq).padStart(5, '0')}`;
  }

  // ==========================================
  // TEST TEMPLATES
  // ==========================================
  public getTemplates(): TestTemplate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return raw ? JSON.parse(raw) : OFFICIAL_TEST_TEMPLATES;
  }

  public getActiveTemplates(): TestTemplate[] {
    return this.getTemplates().filter((t) => t.active);
  }

  public getTemplateById(id: string): TestTemplate | undefined {
    return this.getTemplates().find((t) => t.id === id);
  }

  public saveTemplate(template: TestTemplate, currentUser?: User): void {
    const templates = this.getTemplates();
    const idx = templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
      this.logAudit(
        currentUser,
        'UPDATE_TEMPLATE',
        'template',
        template.id,
        `Updated test template ${template.name} (${template.code})`
      );
    } else {
      templates.push(template);
      this.logAudit(
        currentUser,
        'CREATE_TEMPLATE',
        'template',
        template.id,
        `Created new test template ${template.name} (${template.code})`
      );
    }
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }

  public deleteTemplate(id: string, currentUser?: User): boolean {
    const templates = this.getTemplates();
    const templateToDelete = templates.find((t) => t.id === id);
    if (!templateToDelete) return false;

    const updatedTemplates = templates.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(updatedTemplates));
    this.logAudit(
      currentUser,
      'DELETE_TEMPLATE',
      'template',
      id,
      `Deleted test template ${templateToDelete.name} (${templateToDelete.code})`
    );
    return true;
  }

  // ==========================================
  // ORDERS
  // ==========================================
  public getOrders(): Order[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  }

  public getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  public generateOrderNo(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orders = this.getOrders();
    const todayOrders = orders.filter((o) => o.orderNo.includes(dateStr));
    const nextSeq = todayOrders.length + 1;
    return `ORD-${dateStr}-${String(nextSeq).padStart(3, '0')}`;
  }

  public generateAccessionNo(): string {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `ACC-${randomSuffix}`;
  }

  public generateReportNo(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const reports = this.getReports();
    const todayReports = reports.filter((r) => r.reportNo.includes(dateStr));
    const nextSeq = todayReports.length + 1;
    return `REP-${dateStr}-${String(nextSeq).padStart(3, '0')}`;
  }

  public createOrder(
    patient: Patient,
    selectedTemplateIds: string[],
    referringDoctor: Doctor | null,
    discountAmount: number,
    paidAmount: number,
    priority: 'routine' | 'urgent' | 'emergency',
    currentUser?: User,
    orderOptions?: {
      referralSource?: 'doctor' | 'self';
      customDoctorName?: string;
      designatedVerifierType?: 'doctor' | 'technician';
      designatedVerifierId?: string;
      designatedVerifierName?: string;
      verifierTech1Id?: string;
      verifierTech2Id?: string;
      verifierDoctorId?: string;
    }
  ): { order: Order; reports: Report[] } {
    const templates = this.getTemplates();
    const doctors = this.getDoctors();
    const technicians = this.getTechnicians();

    const orderNo = this.generateOrderNo();
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const nowIso = new Date().toISOString();

    const referralSource = orderOptions?.referralSource || (referringDoctor ? 'doctor' : 'self');
    const referringDoctorName =
      referralSource === 'self'
        ? 'Self / Walk-in'
        : orderOptions?.customDoctorName || referringDoctor?.name || 'Self / Walk-in';
    const referringDoctorId = referralSource === 'self' ? '' : referringDoctor?.id || '';

    // Resolve 2 Lab Technicians and 1 Doctor
    const tech1 =
      technicians.find((t) => t.id === orderOptions?.verifierTech1Id) ||
      technicians[0];
    const tech2 =
      technicians.find((t) => t.id === orderOptions?.verifierTech2Id) ||
      technicians.find((t) => t.id !== tech1?.id) ||
      technicians[1] ||
      tech1;
    const doc =
      doctors.find((d) => d.id === orderOptions?.verifierDoctorId) ||
      doctors[0];

    const designatedVerifierName = doc
      ? `${doc.name} (Doctor) & ${tech1?.name || 'Technician'}`
      : orderOptions?.designatedVerifierName || '';

    let totalAmount = 0;
    const items = selectedTemplateIds.map((tmplId) => {
      const tmpl = templates.find((t) => t.id === tmplId)!;
      totalAmount += tmpl.fee;
      return {
        templateId: tmpl.id,
        testName: tmpl.name,
        testCode: tmpl.code,
        category: tmpl.category,
        fee: tmpl.fee,
        sampleType: tmpl.sampleType,
        status: 'pending' as const,
        reportId: '',
      };
    });

    const netAmount = Math.max(0, totalAmount - discountAmount);
    const dueAmount = Math.max(0, netAmount - paidAmount);
    const paymentStatus = dueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid';

    const order: Order = {
      id: orderId,
      orderNo,
      patientId: patient.id,
      uhid: patient.uhid,
      patientName: patient.name,
      patientAge: patient.age,
      patientAgeUnit: patient.ageUnit,
      patientGender: patient.gender,
      patientPhone: patient.phone,
      referralSource,
      referringDoctorId,
      referringDoctorName,
      designatedVerifierType: orderOptions?.designatedVerifierType || 'doctor',
      designatedVerifierId: doc?.id || orderOptions?.designatedVerifierId,
      designatedVerifierName,
      verifierTech1Id: tech1?.id,
      verifierTech1Name: tech1?.name,
      verifierTech1Designation: tech1?.designation,
      verifierTech2Id: tech2?.id,
      verifierTech2Name: tech2?.name,
      verifierTech2Designation: tech2?.designation,
      verifierDoctorId: doc?.id,
      verifierDoctorName: doc?.name,
      verifierDoctorDesignation: doc?.designation,
      verifierDoctorBmdc: doc?.bmdcNo,
      items,
      totalAmount,
      discount: discountAmount,
      paidAmount,
      dueAmount,
      paymentStatus,
      priority,
      status: 'pending',
      sampleCollectedAt: nowIso,
      sampleCollectorName: currentUser ? currentUser.name : 'Lab Reception Desk',
      createdAt: nowIso,
    };

    // Create draft report entities for each test
    const reports: Report[] = items.map((item, idx) => {
      const tmpl = templates.find((t) => t.id === item.templateId)!;
      const repId = `rep-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
      const repNo = this.generateReportNo();
      const accNo = this.generateAccessionNo();

      item.reportId = repId;

      // Default result values
      const initialResults: Record<string, { value: string; abnormalFlag?: 'NORMAL' }> = {};
      tmpl.parameters.forEach((param) => {
        if (!param.isHeading) {
          initialResults[param.id] = {
            value: param.defaultValue || '',
            abnormalFlag: 'NORMAL',
          };
        }
      });

      const isImagingOrCardio =
        tmpl.category === 'Ultrasonography' ||
        tmpl.category === 'Digital Radiology' ||
        tmpl.category === 'Cardiology';

      // Prepopulate 3 Signatories from the 2 selected Technicians and 1 Doctor
      const defaultSignatories = [
        {
          id: tech1?.id || 'tech-1',
          type: 'technician' as const,
          title: isImagingOrCardio ? 'PREPARED BY' : 'PREPARED / REPORTED BY',
          name: tech1?.name || 'Md. Tariqul Islam',
          designation: tech1?.designation || 'Chief Medical Technologist',
          degrees: tech1?.degrees || 'B.Sc in Medical Laboratory Technology (DU)',
          registrationNo: tech1?.employeeId ? `Employee ID: ${tech1.employeeId}` : 'Emp ID: JDC-T-101',
          department: tech1?.department || 'Pathology & Hematology Lab',
        },
        {
          id: tech2?.id || 'tech-2',
          type: 'technician' as const,
          title: isImagingOrCardio ? 'CHECKED & ASSISTED BY' : 'CHECKED & EXAMINED BY',
          name: tech2?.name || 'Kamrul Hasan Rony',
          designation: tech2?.designation || 'Senior Medical Technologist',
          degrees: tech2?.degrees || 'BMLT, M.Sc (Microbiology)',
          registrationNo: tech2?.employeeId ? `Employee ID: ${tech2.employeeId}` : 'Emp ID: JDC-T-102',
          department: tech2?.department || 'Clinical Biochemistry & Serology',
        },
        {
          id: doc?.id || 'doc-auth',
          type: 'doctor' as const,
          title: isImagingOrCardio ? 'REPORTED & VERIFIED BY' : 'VERIFIED & AUTHORIZED BY',
          name: doc?.name || 'Prof. Dr. M. A. Rahman',
          designation: doc?.designation || 'Senior Consultant Pathologist',
          degrees: doc?.degrees || (isImagingOrCardio ? 'MBBS, M.Phil, FCPS (Radiology & Imaging)' : 'MBBS, FCPS (Pathology), DCP (DU)'),
          registrationNo: doc?.bmdcNo ? `BMDC Reg No: ${doc.bmdcNo}` : 'BMDC: A-28491',
          department: doc?.department || 'Department of Clinical Pathology',
        },
      ];

      return {
        id: repId,
        reportNo: repNo,
        orderId: order.id,
        orderNo: order.orderNo,
        accessionNo: accNo,
        patientId: patient.id,
        uhid: patient.uhid,
        patientName: patient.name,
        patientAge: patient.age,
        patientAgeUnit: patient.ageUnit,
        patientGender: patient.gender,
        patientPhone: patient.phone,
        patientAddress: patient.address,
        referralSource,
        referringDoctorId,
        referringDoctorName,
        designatedVerifierType: 'doctor',
        designatedVerifierId: doc?.id,
        designatedVerifierName: `${doc?.name} & ${tech1?.name}`,
        verifierTech1Id: tech1?.id,
        verifierTech1Name: tech1?.name,
        verifierTech1Designation: tech1?.designation,
        verifierTech2Id: tech2?.id,
        verifierTech2Name: tech2?.name,
        verifierTech2Designation: tech2?.designation,
        verifierDoctorId: doc?.id,
        verifierDoctorName: doc?.name,
        verifierDoctorDesignation: doc?.designation,
        verifierDoctorBmdc: doc?.bmdcNo,
        preparedByTechnicianId: tech1?.id,
        preparedByTechnicianName: tech1?.name,
        reviewedByTechnicianId: tech2?.id,
        reviewedByTechnicianName: tech2?.name,
        authorizedByDoctorId: doc?.id,
        authorizedByDoctorName: doc?.name,
        authorizedDoctorDesignation: doc?.designation,
        authorizedDoctorBmdc: doc?.bmdcNo,
        signatories: defaultSignatories,
        signatoryCount: 3,
        testTemplateId: tmpl.id,
        testName: tmpl.name,
        testCode: tmpl.code,
        category: tmpl.category,
        sampleType: tmpl.sampleType,
        method: tmpl.method,
        specimenReceivedAt: nowIso,
        reportedAt: nowIso,
        results: initialResults,
        narrativeContent: tmpl.defaultNarrative || '',
        conditionDiagnosis: tmpl.defaultConditionDiagnosis || '',
        recommendations: tmpl.defaultRecommendations || '',
        clinicalInterpretation: '',
        status: 'draft',
        revisions: [],
        printConfig: {
          withLetterhead: true,
          showQrCode: true,
          showBarcode: true,
          showReferenceRanges: true,
          fontSize: 'normal',
        },
      };
    });

    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    const existingReports = this.getReports();
    existingReports.unshift(...reports);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(existingReports));

    this.logAudit(
      currentUser,
      'CREATE_ORDER',
      'order',
      order.id,
      `Generated Order ${order.orderNo} with ${items.length} tests for patient ${patient.name} (${patient.uhid})`
    );

    return { order, reports };
  }

  // ==========================================
  // REPORTS
  // ==========================================
  public getReports(): Report[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  }

  public getReportById(id: string): Report | undefined {
    return this.getReports().find((r) => r.id === id);
  }

  public getReportsByOrderId(orderId: string): Report[] {
    return this.getReports().filter((r) => r.orderId === orderId);
  }

  public getReportByNo(reportNo: string): Report | undefined {
    return this.getReports().find(
      (r) => r.reportNo.toLowerCase() === reportNo.trim().toLowerCase()
    );
  }

  public getLabConfig() {
    return {
      labName: 'JANANI DIAGNOSTIC CENTER',
      tagline: '(Digital Diagnostic and Consultation Center)',
      address: 'Amin Tower (2nd Floor), Opposite Feni Model Police Station Gate, Trunk Road, Feni',
      phone: '01711-307064',
      hotline: '01711-307064',
      email: 'info@jananidc.com',
      website: 'www.jananidc.com',
      govRegNo: 'DGHS-P-459102',
      tradeLicence: 'TL-FENI-2024-8842',
      logoUrl: '/fj.png',
    };
  }

  public deleteReport(id: string, currentUser?: User): boolean {
    const reports = this.getReports();
    const reportToDelete = reports.find((r) => r.id === id);
    if (!reportToDelete) return false;

    const updatedReports = reports.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updatedReports));

    // If part of an order, update order item or order status
    if (reportToDelete.orderId) {
      const orders = this.getOrders();
      const order = orders.find((o) => o.id === reportToDelete.orderId);
      if (order) {
        order.items = order.items.filter((item) => item.reportId !== id);
        if (order.items.length === 0) {
          order.status = 'cancelled';
        }
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.syncOrderStatus(reportToDelete.orderId);
      }
    }

    this.logAudit(
      currentUser,
      'DELETE_REPORT',
      'report',
      id,
      `Deleted report ${reportToDelete.reportNo} (${reportToDelete.testName}) for patient ${reportToDelete.patientName} (${reportToDelete.uhid})`
    );
    return true;
  }

  public saveReport(report: Report, currentUser?: User, reasonForRevision?: string): void {
    const reports = this.getReports();
    const idx = reports.findIndex((r) => r.id === report.id);

    if (idx >= 0) {
      // If already verified and being edited, create a revision snapshot
      if (reports[idx].status === 'verified_final' && reasonForRevision) {
        const nextRevNo = (reports[idx].revisions?.length || 0) + 1;
        const revision = {
          revisionNo: nextRevNo,
          modifiedAt: new Date().toISOString(),
          modifiedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System User',
          reason: reasonForRevision,
          resultsSnapshot: { ...reports[idx].results },
        };
        report.revisions = [...(reports[idx].revisions || []), revision];
      }

      reports[idx] = report;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

      // Synchronize order item status
      this.syncOrderStatus(report.orderId);

      this.logAudit(
        currentUser,
        'UPDATE_REPORT',
        'report',
        report.id,
        `Updated Report ${report.reportNo} (${report.testName}) for ${report.patientName} - Status: ${report.status}`
      );
    }
  }

  private syncOrderStatus(orderId: string): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const reports = this.getReports().filter((r) => r.orderId === orderId);
    let allCompleted = true;
    let anyInProgress = false;

    order.items.forEach((item) => {
      const rep = reports.find((r) => r.testTemplateId === item.templateId || r.id === item.reportId);
      if (rep) {
        if (rep.status === 'verified_final') {
          item.status = 'completed';
        } else if (rep.status === 'draft' && Object.values(rep.results).some((res) => res.value)) {
          item.status = 'in_progress';
          anyInProgress = true;
          allCompleted = false;
        } else {
          allCompleted = false;
        }
      } else {
        allCompleted = false;
      }
    });

    order.status = allCompleted ? 'completed' : anyInProgress ? 'in_progress' : 'pending';
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  public getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  public logAudit(
    currentUser: User | undefined,
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser ? currentUser.id : 'sys',
      userName: currentUser ? currentUser.name : 'System Operation',
      userRole: currentUser ? currentUser.role : 'admin',
      action,
      entityType,
      entityId,
      details,
    };
    logs.unshift(newLog);
    // Keep last 1000 logs
    if (logs.length > 1000) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  // ==========================================
  // BACKUP & RESTORE
  // ==========================================
  public exportDatabaseJson(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      system: 'JANANI Diagnostic Centre Management System',
      version: '2.0.0',
      users: this.getUsers(),
      doctors: this.getDoctors(),
      technicians: this.getTechnicians(),
      patients: this.getPatients(),
      templates: this.getTemplates(),
      orders: this.getOrders(),
      reports: this.getReports(),
      auditLogs: this.getAuditLogs(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importDatabaseJson(jsonStr: string, currentUser?: User): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.patients || !parsed.reports || !parsed.templates) {
        return { success: false, message: 'Invalid backup file schema: missing core data collections.' };
      }

      if (parsed.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsed.users));
      if (parsed.doctors) localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(parsed.doctors));
      if (parsed.technicians) localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(parsed.technicians));
      if (parsed.patients) localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(parsed.patients));
      if (parsed.templates) localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(parsed.templates));
      if (parsed.orders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(parsed.orders));
      if (parsed.reports) localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(parsed.reports));
      if (parsed.auditLogs) localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(parsed.auditLogs));

      this.logAudit(
        currentUser,
        'RESTORE_DATABASE',
        'backup',
        'restore-pkg',
        `Restored complete database from backup archive exported at ${parsed.exportedAt || 'Unknown'}`
      );

      return {
        success: true,
        message: `Database restored successfully. Loaded ${parsed.patients.length} patients, ${parsed.orders?.length || 0} orders, ${parsed.reports.length} reports, and ${parsed.templates.length} test templates.`,
      };
    } catch (err: any) {
      return { success: false, message: `Failed to restore database: ${err.message}` };
    }
  }
}

export const dbService = new JananiDatabaseService();
