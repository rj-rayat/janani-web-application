export type UserRole =
  | 'admin'
  | 'doctor'
  | 'pathologist'
  | 'radiologist'
  | 'lab_technician'
  | 'receptionist';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  designation: string;
  department: string;
  active: boolean;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  designation: string;
  specialty: string;
  degrees?: string;
  bmdcNo: string;
  department: string;
  phone: string;
  email: string;
  roomNo?: string;
  hospitalAffiliation?: string;
  active: boolean;
  createdAt: string;
}

export interface LabTechnician {
  id: string;
  name: string;
  designation: string;
  department: string;
  degrees?: string;
  employeeId: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface Patient {
  id: string;
  uhid: string; // e.g. JDC-2026-00101
  name: string;
  age: number;
  ageUnit: 'years' | 'months' | 'days';
  gender: 'male' | 'female' | 'other';
  phone: string;
  address: string;
  bloodGroup?: string;
  emergencyContact?: string;
  nationalId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TestCategory =
  | 'Hematology'
  | 'Biochemistry'
  | 'Clinical Pathology'
  | 'Serology & Immunology'
  | 'Endocrinology'
  | 'Microbiology'
  | 'Digital Radiology'
  | 'Ultrasonography'
  | 'Cardiology'
  | 'Histopathology & Cytology';

export type ResultType =
  | 'numeric'
  | 'text'
  | 'paragraph'
  | 'options'
  | 'narrative'
  | 'organism_antibiotic'
  | 'heading';

export interface NumericRange {
  min?: number;
  max?: number;
  text?: string;
}

export interface TestParameter {
  id: string;
  name: string;
  code: string;
  unit: string;
  resultType: ResultType;
  defaultValue?: string;
  options?: string[]; // For dropdown options
  refRange: string; // General text reference range
  genderRanges?: {
    male?: NumericRange;
    female?: NumericRange;
  };
  ageRanges?: {
    infantDaysMax?: number; // e.g. <= 30 days
    infantRange?: NumericRange;
    pediatricYearsMax?: number; // e.g. <= 14 years
    pediatricRange?: NumericRange;
    adultRange?: NumericRange;
  };
  criticalLow?: number;
  criticalHigh?: number;
  method?: string;
  isHeading?: boolean;
}

export interface TestTemplate {
  id: string;
  code: string;
  name: string;
  category: TestCategory;
  department: string;
  sampleType: string;
  method: string;
  deliveryTime: string;
  fee: number;
  parameters: TestParameter[];
  defaultNarrative?: string; // For USG / X-Ray / ECG / Histopath
  defaultConditionDiagnosis?: string; // Default Diagnosis or Condition (e.g. Normal Study)
  defaultRecommendations?: string; // Default Recommendations / Advice
  interpretationNotes?: string;
  specimenRequirement?: string;
  remarks?: string;
  active: boolean;
}

export interface OrderItem {
  templateId: string;
  testName: string;
  testCode: string;
  category: TestCategory;
  fee: number;
  sampleType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  reportId?: string;
}

export interface Order {
  id: string;
  orderNo: string; // e.g. ORD-20260831-001
  patientId: string;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientAgeUnit: 'years' | 'months' | 'days';
  patientGender: 'male' | 'female' | 'other';
  patientPhone: string;
  referralSource?: 'doctor' | 'self';
  referringDoctorId?: string;
  referringDoctorName: string;
  designatedVerifierType?: 'doctor' | 'technician';
  designatedVerifierId?: string;
  designatedVerifierName?: string;
  // Multi-verifier assignments (2 Technicians + 1 Doctor)
  verifierTech1Id?: string;
  verifierTech1Name?: string;
  verifierTech1Designation?: string;
  verifierTech2Id?: string;
  verifierTech2Name?: string;
  verifierTech2Designation?: string;
  verifierDoctorId?: string;
  verifierDoctorName?: string;
  verifierDoctorDesignation?: string;
  verifierDoctorBmdc?: string;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  sampleCollectedAt?: string;
  sampleCollectorName?: string;
  createdAt: string;
}

export type ReportStatus =
  | 'draft'
  | 'reviewed_by_tech'
  | 'authorized_by_doctor'
  | 'verified_final'
  | 'cancelled';

export interface ParameterResult {
  value: string;
  abnormalFlag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  notes?: string;
}

export interface MicrobiologySensitivity {
  organismIsolated: string;
  colonyCount: string;
  antibiotics: {
    antibioticName: string;
    susceptibility: 'Sensitive (S)' | 'Intermediate (I)' | 'Resistant (R)';
    zoneDiameter?: string;
  }[];
}

export interface ReportRevision {
  revisionNo: number;
  modifiedAt: string;
  modifiedBy: string;
  reason: string;
  resultsSnapshot: Record<string, ParameterResult>;
}

export interface ReportSignatory {
  id?: string;
  type: 'doctor' | 'technician' | 'custom';
  title: string; // e.g. "PREPARED BY" | "CHECKED BY" | "VERIFIED BY" | "REPORTED BY" | "CONSULTANT PATHOLOGIST"
  name: string;
  designation: string;
  degrees?: string;
  registrationNo?: string;
  department?: string;
}

export interface Report {
  id: string;
  reportNo: string; // e.g. REP-20260831-0101
  orderId: string;
  orderNo: string;
  accessionNo: string; // e.g. ACC-884210
  patientId: string;
  uhid: string;
  patientName: string;
  patientAge: number;
  patientAgeUnit: 'years' | 'months' | 'days';
  patientGender: 'male' | 'female' | 'other';
  patientPhone: string;
  patientAddress: string;
  referralSource?: 'doctor' | 'self';
  referringDoctorId?: string;
  referringDoctorName: string;
  designatedVerifierType?: 'doctor' | 'technician';
  designatedVerifierId?: string;
  designatedVerifierName?: string;
  // Multi-verifier assignments (2 Technicians + 1 Doctor)
  verifierTech1Id?: string;
  verifierTech1Name?: string;
  verifierTech1Designation?: string;
  verifierTech2Id?: string;
  verifierTech2Name?: string;
  verifierTech2Designation?: string;
  verifierDoctorId?: string;
  verifierDoctorName?: string;
  verifierDoctorDesignation?: string;
  verifierDoctorBmdc?: string;
  testTemplateId: string;
  testName: string;
  testCode: string;
  category: TestCategory;
  sampleType: string;
  method?: string;
  specimenReceivedAt: string;
  reportedAt: string;
  
  // Results & Clinical Content
  results: Record<string, ParameterResult>;
  narrativeContent?: string;
  conditionDiagnosis?: string; // Condition name / diagnostic impression
  recommendations?: string; // Clinical advice / follow-up recommendation
  microbiologySensitivity?: MicrobiologySensitivity;
  clinicalInterpretation?: string;
  notes?: string;

  // Workflow & Manual Review State (No auto-e-signatures)
  status: ReportStatus;
  
  // Technician review
  preparedByTechnicianId?: string;
  preparedByTechnicianName?: string;
  preparedAt?: string;
  reviewedByTechnicianId?: string;
  reviewedByTechnicianName?: string;
  reviewedAt?: string;
  techReviewRemarks?: string;

  // Doctor/Pathologist review & manual authorization
  authorizedByDoctorId?: string;
  authorizedByDoctorName?: string;
  authorizedDoctorDesignation?: string;
  authorizedDoctorBmdc?: string;
  authorizedAt?: string;
  doctorRemarks?: string;

  verifiedAt?: string;

  // Dynamic Custom Verifiers / Signatories for Print & Sign-off
  signatories?: ReportSignatory[];
  signatoryCount?: 1 | 2 | 3;

  // Revisions
  revisions: ReportRevision[];
  isSuperseded?: boolean;
  supersededByReportNo?: string;
  isCritical?: boolean;
  criticalNotificationDetails?: string;

  // Print configuration
  printConfig: {
    withLetterhead: boolean;
    showQrCode: boolean;
    showBarcode: boolean;
    showReferenceRanges: boolean;
    fontSize: 'normal' | 'compact';
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g. 'LOGIN', 'CREATE_ORDER', 'ENTER_RESULTS', 'TECH_REVIEW', 'DOCTOR_AUTHORIZE', 'VERIFY_REPORT', 'UPDATE_STAFF'
  entityType: 'patient' | 'order' | 'report' | 'doctor' | 'technician' | 'template' | 'auth' | 'backup';
  entityId: string;
  details: string;
}
