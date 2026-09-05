import { TestTemplate } from '../types';

export const OFFICIAL_TEST_TEMPLATES: TestTemplate[] = [
  // ==========================================
  // 1. HEMATOLOGY & HEMOSTASIS
  // ==========================================
  {
    id: 'tmpl-cbc',
    code: 'HEM-001',
    name: 'Complete Blood Count (CBC) with ESR & PBF',
    category: 'Hematology',
    department: 'Hematology',
    sampleType: 'Whole Blood (EDTA - 2ml)',
    method: 'Automated 5-Part Differential Hematology Analyzer & Manual Microscopy',
    deliveryTime: '2 Hours',
    fee: 450,
    active: true,
    interpretationNotes: 'Evaluates overall health and detects a wide range of disorders including anemia, infection, and leukemia.',
    parameters: [
      {
        id: 'p-hb',
        name: 'Hemoglobin (Hb)',
        code: 'HB',
        unit: 'g/dL',
        resultType: 'numeric',
        refRange: 'Male: 13.5 - 17.5 g/dL | Female: 12.0 - 15.5 g/dL',
        genderRanges: {
          male: { min: 13.5, max: 17.5 },
          female: { min: 12.0, max: 15.5 },
        },
        ageRanges: {
          infantDaysMax: 30,
          infantRange: { min: 14.0, max: 22.0, text: '14.0 - 22.0' },
          pediatricYearsMax: 12,
          pediatricRange: { min: 11.5, max: 14.5, text: '11.5 - 14.5' },
        },
        criticalLow: 7.0,
        criticalHigh: 20.0,
      },
      {
        id: 'p-rbc',
        name: 'Total RBC Count',
        code: 'RBC',
        unit: 'x10^12/L',
        resultType: 'numeric',
        refRange: 'Male: 4.5 - 5.9 | Female: 4.0 - 5.2',
        genderRanges: {
          male: { min: 4.5, max: 5.9 },
          female: { min: 4.0, max: 5.2 },
        },
      },
      {
        id: 'p-pcv',
        name: 'Hematocrit (PCV)',
        code: 'PCV',
        unit: '%',
        resultType: 'numeric',
        refRange: 'Male: 40 - 50% | Female: 36 - 46%',
        genderRanges: {
          male: { min: 40, max: 50 },
          female: { min: 36, max: 46 },
        },
      },
      {
        id: 'p-mcv',
        name: 'Mean Corpuscular Volume (MCV)',
        code: 'MCV',
        unit: 'fL',
        resultType: 'numeric',
        refRange: '80.0 - 98.0 fL',
        genderRanges: {
          male: { min: 80.0, max: 98.0 },
          female: { min: 80.0, max: 98.0 },
        },
      },
      {
        id: 'p-mch',
        name: 'Mean Corpuscular Hemoglobin (MCH)',
        code: 'MCH',
        unit: 'pg',
        resultType: 'numeric',
        refRange: '27.0 - 32.0 pg',
        genderRanges: {
          male: { min: 27.0, max: 32.0 },
          female: { min: 27.0, max: 32.0 },
        },
      },
      {
        id: 'p-mchc',
        name: 'Mean Corpuscular Hb Conc. (MCHC)',
        code: 'MCHC',
        unit: 'g/dL',
        resultType: 'numeric',
        refRange: '32.0 - 36.0 g/dL',
        genderRanges: {
          male: { min: 32.0, max: 36.0 },
          female: { min: 32.0, max: 36.0 },
        },
      },
      {
        id: 'p-rdw',
        name: 'RDW-CV',
        code: 'RDW',
        unit: '%',
        resultType: 'numeric',
        refRange: '11.5 - 14.5 %',
        genderRanges: {
          male: { min: 11.5, max: 14.5 },
          female: { min: 11.5, max: 14.5 },
        },
      },
      {
        id: 'p-plt',
        name: 'Total Platelet Count',
        code: 'PLT',
        unit: 'x10^9/L',
        resultType: 'numeric',
        refRange: '150 - 450 x10^9/L',
        genderRanges: {
          male: { min: 150, max: 450 },
          female: { min: 150, max: 450 },
        },
        criticalLow: 50,
        criticalHigh: 1000,
      },
      {
        id: 'p-wbc',
        name: 'Total Leucocyte Count (TLC / WBC)',
        code: 'WBC',
        unit: '/cu.mm',
        resultType: 'numeric',
        refRange: '4,000 - 11,000 /cu.mm',
        genderRanges: {
          male: { min: 4000, max: 11000 },
          female: { min: 4000, max: 11000 },
        },
        criticalLow: 2000,
        criticalHigh: 30000,
      },
      {
        id: 'p-diff-head',
        name: '--- Differential Leucocyte Count (DLC) ---',
        code: 'DLC_HEAD',
        unit: '',
        resultType: 'text',
        refRange: '',
        isHeading: true,
      },
      {
        id: 'p-neutro',
        name: 'Neutrophils',
        code: 'NEUT',
        unit: '%',
        resultType: 'numeric',
        refRange: '40 - 75 %',
        genderRanges: {
          male: { min: 40, max: 75 },
          female: { min: 40, max: 75 },
        },
      },
      {
        id: 'p-lymph',
        name: 'Lymphocytes',
        code: 'LYMPH',
        unit: '%',
        resultType: 'numeric',
        refRange: '20 - 45 %',
        genderRanges: {
          male: { min: 20, max: 45 },
          female: { min: 20, max: 45 },
        },
      },
      {
        id: 'p-mono',
        name: 'Monocytes',
        code: 'MONO',
        unit: '%',
        resultType: 'numeric',
        refRange: '02 - 08 %',
        genderRanges: {
          male: { min: 2, max: 8 },
          female: { min: 2, max: 8 },
        },
      },
      {
        id: 'p-eos',
        name: 'Eosinophils',
        code: 'EOS',
        unit: '%',
        resultType: 'numeric',
        refRange: '01 - 06 %',
        genderRanges: {
          male: { min: 1, max: 6 },
          female: { min: 1, max: 6 },
        },
      },
      {
        id: 'p-baso',
        name: 'Basophils',
        code: 'BASO',
        unit: '%',
        resultType: 'numeric',
        refRange: '00 - 01 %',
        genderRanges: {
          male: { min: 0, max: 1 },
          female: { min: 0, max: 1 },
        },
      },
      {
        id: 'p-esr',
        name: 'ESR (Westergren 1st Hour)',
        code: 'ESR',
        unit: 'mm/1st hr',
        resultType: 'numeric',
        refRange: 'Male: 0 - 15 mm | Female: 0 - 20 mm',
        genderRanges: {
          male: { min: 0, max: 15 },
          female: { min: 0, max: 20 },
        },
      },
      {
        id: 'p-pbf',
        name: 'Peripheral Blood Film (PBF) Comment',
        code: 'PBF',
        unit: '',
        resultType: 'text',
        defaultValue: 'RBCs are normocytic and normochromic. WBC series shows normal maturation. Platelets adequate on smear. No hemoparasites or blast cells seen.',
        refRange: 'Normocytic Normochromic',
      },
    ],
  },
  {
    id: 'tmpl-pt-inr',
    code: 'HEM-002',
    name: 'Prothrombin Time (PT) with INR',
    category: 'Hematology',
    department: 'Hematology',
    sampleType: 'Citrated Plasma (Blue top - 2ml)',
    method: 'Coagulometer Optical Clot Detection',
    deliveryTime: '2 Hours',
    fee: 550,
    active: true,
    parameters: [
      {
        id: 'p-pt-test',
        name: 'Test Prothrombin Time',
        code: 'PT_TEST',
        unit: 'seconds',
        resultType: 'numeric',
        refRange: '11.0 - 15.0 sec',
        genderRanges: { male: { min: 11.0, max: 15.0 }, female: { min: 11.0, max: 15.0 } },
      },
      {
        id: 'p-pt-control',
        name: 'Control Prothrombin Time',
        code: 'PT_CTRL',
        unit: 'seconds',
        resultType: 'numeric',
        defaultValue: '12.5',
        refRange: '11.5 - 13.5 sec',
      },
      {
        id: 'p-pt-inr',
        name: 'INR (International Normalized Ratio)',
        code: 'INR',
        unit: 'Ratio',
        resultType: 'numeric',
        refRange: 'Normal: 0.8 - 1.2 | Therapeutic (Oral Anticoagulants): 2.0 - 3.0',
        genderRanges: { male: { min: 0.8, max: 1.2 }, female: { min: 0.8, max: 1.2 } },
        criticalHigh: 4.5,
      },
    ],
  },
  {
    id: 'tmpl-blood-group',
    code: 'HEM-003',
    name: 'Blood Grouping & Rh Typing (Forward & Reverse)',
    category: 'Hematology',
    department: 'Blood Transfusion',
    sampleType: 'Whole Blood (EDTA)',
    method: 'Tube & Gel Agglutination Technique',
    deliveryTime: '1 Hour',
    fee: 250,
    active: true,
    parameters: [
      {
        id: 'p-abo',
        name: 'ABO Blood Group',
        code: 'ABO',
        unit: '',
        resultType: 'options',
        options: ['A', 'B', 'AB', 'O'],
        refRange: 'A, B, AB, or O',
      },
      {
        id: 'p-rh',
        name: 'Rh (D) Factor',
        code: 'RH',
        unit: '',
        resultType: 'options',
        options: ['Positive (+ve)', 'Negative (-ve)'],
        refRange: 'Positive / Negative',
      },
    ],
  },

  // ==========================================
  // 2. BIOCHEMISTRY / CLINICAL CHEMISTRY
  // ==========================================
  {
    id: 'tmpl-lipid',
    code: 'BIO-001',
    name: 'Lipid Profile Panel',
    category: 'Biochemistry',
    department: 'Clinical Biochemistry',
    sampleType: 'Serum (Fasting 10-12 hrs - 3ml)',
    method: 'Fully Automated Enzymatic Colorimetric Analyzer',
    deliveryTime: '3 Hours',
    fee: 850,
    active: true,
    parameters: [
      {
        id: 'p-chol',
        name: 'Serum Total Cholesterol',
        code: 'CHOL',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: 'Desirable: < 200 mg/dL | Borderline: 200-239 | High: >= 240',
        genderRanges: { male: { min: 100, max: 200 }, female: { min: 100, max: 200 } },
      },
      {
        id: 'p-tg',
        name: 'Serum Triglycerides (TG)',
        code: 'TG',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: 'Normal: < 150 mg/dL | Borderline: 150-199 | High: >= 200',
        genderRanges: { male: { min: 40, max: 150 }, female: { min: 35, max: 150 } },
        criticalHigh: 500,
      },
      {
        id: 'p-hdl',
        name: 'HDL Cholesterol (Good)',
        code: 'HDL',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: 'Male: > 40 mg/dL | Female: > 50 mg/dL',
        genderRanges: { male: { min: 40, max: 70 }, female: { min: 50, max: 80 } },
      },
      {
        id: 'p-ldl',
        name: 'LDL Cholesterol (Calculated / Direct)',
        code: 'LDL',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: 'Optimal: < 100 mg/dL | Near Optimal: 100-129 | Borderline: 130-159',
        genderRanges: { male: { min: 50, max: 100 }, female: { min: 50, max: 100 } },
      },
      {
        id: 'p-vldl',
        name: 'VLDL Cholesterol',
        code: 'VLDL',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '05 - 30 mg/dL',
        genderRanges: { male: { min: 5, max: 30 }, female: { min: 5, max: 30 } },
      },
      {
        id: 'p-chol-hdl',
        name: 'Total Cholesterol / HDL Ratio',
        code: 'CHOL_HDL_RATIO',
        unit: 'Ratio',
        resultType: 'numeric',
        refRange: '3.3 - 4.4 (Desirable < 4.5)',
        genderRanges: { male: { min: 2.5, max: 4.5 }, female: { min: 2.5, max: 4.5 } },
      },
    ],
  },
  {
    id: 'tmpl-lft',
    code: 'BIO-002',
    name: 'Liver Function Test (LFT) Comprehensive',
    category: 'Biochemistry',
    department: 'Clinical Biochemistry',
    sampleType: 'Serum (Clot Activator - 3ml)',
    method: 'Fully Automated Kinetic & Colorimetric Photometry',
    deliveryTime: '3 Hours',
    fee: 950,
    active: true,
    parameters: [
      {
        id: 'p-s-bili-tot',
        name: 'Total Bilirubin',
        code: 'BILI_TOT',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '0.2 - 1.2 mg/dL',
        genderRanges: { male: { min: 0.2, max: 1.2 }, female: { min: 0.2, max: 1.2 } },
        criticalHigh: 15.0,
      },
      {
        id: 'p-s-bili-dir',
        name: 'Direct (Conjugated) Bilirubin',
        code: 'BILI_DIR',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '0.0 - 0.3 mg/dL',
        genderRanges: { male: { min: 0.0, max: 0.3 }, female: { min: 0.0, max: 0.3 } },
      },
      {
        id: 'p-s-bili-indir',
        name: 'Indirect (Unconjugated) Bilirubin',
        code: 'BILI_INDIR',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '0.2 - 0.9 mg/dL',
        genderRanges: { male: { min: 0.2, max: 0.9 }, female: { min: 0.2, max: 0.9 } },
      },
      {
        id: 'p-sgpt',
        name: 'SGPT / ALT (Alanine Aminotransferase)',
        code: 'SGPT',
        unit: 'U/L',
        resultType: 'numeric',
        refRange: 'Male: < 45 U/L | Female: < 34 U/L',
        genderRanges: { male: { min: 5, max: 45 }, female: { min: 5, max: 34 } },
        criticalHigh: 500,
      },
      {
        id: 'p-sgot',
        name: 'SGOT / AST (Aspartate Aminotransferase)',
        code: 'SGOT',
        unit: 'U/L',
        resultType: 'numeric',
        refRange: 'Male: < 40 U/L | Female: < 32 U/L',
        genderRanges: { male: { min: 5, max: 40 }, female: { min: 5, max: 32 } },
        criticalHigh: 500,
      },
      {
        id: 'p-alp',
        name: 'Alkaline Phosphatase (ALP)',
        code: 'ALP',
        unit: 'U/L',
        resultType: 'numeric',
        refRange: 'Adult: 40 - 130 U/L (Children higher during bone growth)',
        genderRanges: { male: { min: 40, max: 130 }, female: { min: 40, max: 130 } },
        ageRanges: {
          pediatricYearsMax: 14,
          pediatricRange: { min: 100, max: 350, text: '100 - 350 U/L' },
        },
      },
      {
        id: 'p-tot-prot',
        name: 'Serum Total Protein',
        code: 'TP',
        unit: 'g/dL',
        resultType: 'numeric',
        refRange: '6.4 - 8.3 g/dL',
        genderRanges: { male: { min: 6.4, max: 8.3 }, female: { min: 6.4, max: 8.3 } },
      },
      {
        id: 'p-alb',
        name: 'Serum Albumin',
        code: 'ALB',
        unit: 'g/dL',
        resultType: 'numeric',
        refRange: '3.5 - 5.2 g/dL',
        genderRanges: { male: { min: 3.5, max: 5.2 }, female: { min: 3.5, max: 5.2 } },
      },
      {
        id: 'p-glob',
        name: 'Serum Globulin (Calculated)',
        code: 'GLOB',
        unit: 'g/dL',
        resultType: 'numeric',
        refRange: '2.3 - 3.5 g/dL',
        genderRanges: { male: { min: 2.3, max: 3.5 }, female: { min: 2.3, max: 3.5 } },
      },
      {
        id: 'p-ag-ratio',
        name: 'A/G Ratio',
        code: 'AG_RATIO',
        unit: 'Ratio',
        resultType: 'numeric',
        refRange: '1.2 - 2.2',
        genderRanges: { male: { min: 1.2, max: 2.2 }, female: { min: 1.2, max: 2.2 } },
      },
    ],
  },
  {
    id: 'tmpl-kft',
    code: 'BIO-003',
    name: 'Kidney Function Test (KFT / Renal Profile)',
    category: 'Biochemistry',
    department: 'Clinical Biochemistry',
    sampleType: 'Serum (3ml)',
    method: 'Jaffe / Enzymatic & Ion Selective Electrode (ISE)',
    deliveryTime: '2 Hours',
    fee: 800,
    active: true,
    parameters: [
      {
        id: 'p-creat',
        name: 'Serum Creatinine',
        code: 'CREAT',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: 'Male: 0.7 - 1.3 mg/dL | Female: 0.5 - 1.1 mg/dL',
        genderRanges: { male: { min: 0.7, max: 1.3 }, female: { min: 0.5, max: 1.1 } },
        ageRanges: {
          pediatricYearsMax: 12,
          pediatricRange: { min: 0.3, max: 0.7, text: '0.3 - 0.7 mg/dL' },
        },
        criticalHigh: 5.0,
      },
      {
        id: 'p-urea',
        name: 'Blood Urea',
        code: 'UREA',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '15 - 45 mg/dL',
        genderRanges: { male: { min: 15, max: 45 }, female: { min: 15, max: 45 } },
      },
      {
        id: 'p-bun',
        name: 'Blood Urea Nitrogen (BUN)',
        code: 'BUN',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '7.0 - 20.0 mg/dL',
        genderRanges: { male: { min: 7.0, max: 20.0 }, female: { min: 7.0, max: 20.0 } },
      },
      {
        id: 'p-uric',
        name: 'Serum Uric Acid',
        code: 'URIC',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: 'Male: 3.5 - 7.2 mg/dL | Female: 2.6 - 6.0 mg/dL',
        genderRanges: { male: { min: 3.5, max: 7.2 }, female: { min: 2.6, max: 6.0 } },
      },
      {
        id: 'p-na',
        name: 'Serum Sodium (Na+)',
        code: 'NA',
        unit: 'mmol/L',
        resultType: 'numeric',
        refRange: '135 - 145 mmol/L',
        genderRanges: { male: { min: 135, max: 145 }, female: { min: 135, max: 145 } },
        criticalLow: 120,
        criticalHigh: 160,
      },
      {
        id: 'p-k',
        name: 'Serum Potassium (K+)',
        code: 'K',
        unit: 'mmol/L',
        resultType: 'numeric',
        refRange: '3.5 - 5.1 mmol/L',
        genderRanges: { male: { min: 3.5, max: 5.1 }, female: { min: 3.5, max: 5.1 } },
        criticalLow: 2.8,
        criticalHigh: 6.5,
      },
      {
        id: 'p-cl',
        name: 'Serum Chloride (Cl-)',
        code: 'CL',
        unit: 'mmol/L',
        resultType: 'numeric',
        refRange: '96 - 108 mmol/L',
        genderRanges: { male: { min: 96, max: 108 }, female: { min: 96, max: 108 } },
      },
      {
        id: 'p-egfr',
        name: 'Estimated GFR (CKD-EPI)',
        code: 'EGFR',
        unit: 'mL/min/1.73m2',
        resultType: 'numeric',
        refRange: '> 90 Normal Kidney Function',
        genderRanges: { male: { min: 90, max: 140 }, female: { min: 90, max: 140 } },
        criticalLow: 15,
      },
    ],
  },
  {
    id: 'tmpl-glucose-hba1c',
    code: 'BIO-004',
    name: 'Blood Glucose & Glycated Hemoglobin (HbA1c)',
    category: 'Biochemistry',
    department: 'Clinical Biochemistry',
    sampleType: 'Fluoride Plasma & EDTA Blood',
    method: 'Hexokinase & HPLC / Boronate Affinity',
    deliveryTime: '2 Hours',
    fee: 750,
    active: true,
    parameters: [
      {
        id: 'p-fbs',
        name: 'Fasting Blood Sugar (FBS)',
        code: 'FBS',
        unit: 'mmol/L',
        resultType: 'numeric',
        refRange: 'Normal: 3.9 - 5.6 mmol/L | Impaired: 5.6 - 6.9 | Diabetic: >= 7.0',
        genderRanges: { male: { min: 3.9, max: 5.6 }, female: { min: 3.9, max: 5.6 } },
        criticalLow: 2.5,
        criticalHigh: 22.0,
      },
      {
        id: 'p-2habf',
        name: '2 Hours Postprandial Blood Sugar (2HABF)',
        code: '2HABF',
        unit: 'mmol/L',
        resultType: 'numeric',
        refRange: 'Normal: < 7.8 mmol/L | Impaired: 7.8 - 11.0 | Diabetic: >= 11.1',
        genderRanges: { male: { min: 4.0, max: 7.8 }, female: { min: 4.0, max: 7.8 } },
      },
      {
        id: 'p-hba1c',
        name: 'HbA1c (Glycated Hemoglobin)',
        code: 'HBA1C',
        unit: '%',
        resultType: 'numeric',
        refRange: 'Normal: < 5.7% | Pre-diabetes: 5.7 - 6.4% | Diabetes: >= 6.5%',
        genderRanges: { male: { min: 4.0, max: 5.6 }, female: { min: 4.0, max: 5.6 } },
        criticalHigh: 14.0,
      },
      {
        id: 'p-eag',
        name: 'Estimated Average Glucose (eAG)',
        code: 'EAG',
        unit: 'mg/dL',
        resultType: 'numeric',
        refRange: '< 117 mg/dL',
      },
    ],
  },
  {
    id: 'tmpl-thyroid',
    code: 'BIO-005',
    name: 'Thyroid Function Panel (TSH, FT3, FT4)',
    category: 'Endocrinology',
    department: 'Immunology & Hormones',
    sampleType: 'Serum (3ml)',
    method: 'Chemiluminescence Immunoassay (CLIA)',
    deliveryTime: '4 Hours',
    fee: 1100,
    active: true,
    parameters: [
      {
        id: 'p-tsh',
        name: 'TSH (Ultrasensitive Thyroid Stimulating Hormone)',
        code: 'TSH',
        unit: 'μIU/mL',
        resultType: 'numeric',
        refRange: '0.40 - 4.50 μIU/mL (Pregnancy trimester specific ranges apply)',
        genderRanges: { male: { min: 0.40, max: 4.50 }, female: { min: 0.40, max: 4.50 } },
        criticalLow: 0.01,
        criticalHigh: 20.0,
      },
      {
        id: 'p-ft3',
        name: 'Free Triiodothyronine (FT3)',
        code: 'FT3',
        unit: 'pg/mL',
        resultType: 'numeric',
        refRange: '2.0 - 4.4 pg/mL',
        genderRanges: { male: { min: 2.0, max: 4.4 }, female: { min: 2.0, max: 4.4 } },
      },
      {
        id: 'p-ft4',
        name: 'Free Thyroxine (FT4)',
        code: 'FT4',
        unit: 'ng/dL',
        resultType: 'numeric',
        refRange: '0.80 - 1.80 ng/dL',
        genderRanges: { male: { min: 0.80, max: 1.80 }, female: { min: 0.80, max: 1.80 } },
      },
    ],
  },

  // ==========================================
  // 3. CLINICAL PATHOLOGY
  // ==========================================
  {
    id: 'tmpl-urine-rme',
    code: 'CP-001',
    name: 'Urine Routine & Microscopic Examination (R/M/E)',
    category: 'Clinical Pathology',
    department: 'Clinical Pathology',
    sampleType: 'Fresh Midstream Urine (Clean container - 20ml)',
    method: 'Automated Urine Chemistry Strip & Manual Centrifuged Microscopy',
    deliveryTime: '1 Hour',
    fee: 250,
    active: true,
    parameters: [
      {
        id: 'p-u-phys-head',
        name: '--- PHYSICAL EXAMINATION ---',
        code: 'U_PHYS_HEAD',
        unit: '',
        resultType: 'text',
        refRange: '',
        isHeading: true,
      },
      {
        id: 'p-u-color',
        name: 'Color',
        code: 'U_COLOR',
        unit: '',
        resultType: 'options',
        options: ['Straw', 'Pale Yellow', 'Yellow', 'Amber', 'Reddish', 'Brownish'],
        defaultValue: 'Pale Yellow',
        refRange: 'Pale Yellow to Straw',
      },
      {
        id: 'p-u-app',
        name: 'Appearance',
        code: 'U_APP',
        unit: '',
        resultType: 'options',
        options: ['Clear', 'Slightly Hazy', 'Hazy', 'Turbid'],
        defaultValue: 'Clear',
        refRange: 'Clear',
      },
      {
        id: 'p-u-sg',
        name: 'Specific Gravity',
        code: 'U_SG',
        unit: '',
        resultType: 'numeric',
        defaultValue: '1.015',
        refRange: '1.005 - 1.030',
        genderRanges: { male: { min: 1.005, max: 1.030 }, female: { min: 1.005, max: 1.030 } },
      },
      {
        id: 'p-u-ph',
        name: 'Reaction (pH)',
        code: 'U_PH',
        unit: '',
        resultType: 'numeric',
        defaultValue: '6.0',
        refRange: '5.0 - 7.5 (Acidic)',
        genderRanges: { male: { min: 5.0, max: 7.5 }, female: { min: 5.0, max: 7.5 } },
      },
      {
        id: 'p-u-chem-head',
        name: '--- CHEMICAL EXAMINATION ---',
        code: 'U_CHEM_HEAD',
        unit: '',
        resultType: 'text',
        refRange: '',
        isHeading: true,
      },
      {
        id: 'p-u-prot',
        name: 'Protein (Albumin)',
        code: 'U_PROT',
        unit: '',
        resultType: 'options',
        options: ['Nil', 'Trace', '+ (1+)', '++ (2+)', '+++ (3+)', '++++ (4+)'],
        defaultValue: 'Nil',
        refRange: 'Nil',
      },
      {
        id: 'p-u-sugar',
        name: 'Sugar (Glucose)',
        code: 'U_SUGAR',
        unit: '',
        resultType: 'options',
        options: ['Nil', 'Trace', '+ (1+)', '++ (2+)', '+++ (3+)', '++++ (4+)'],
        defaultValue: 'Nil',
        refRange: 'Nil',
      },
      {
        id: 'p-u-ketone',
        name: 'Ketone Bodies',
        code: 'U_KET',
        unit: '',
        resultType: 'options',
        options: ['Nil', 'Trace', 'Positive (+)'],
        defaultValue: 'Nil',
        refRange: 'Nil',
      },
      {
        id: 'p-u-bili',
        name: 'Bilirubin / Bile Salts',
        code: 'U_BILI',
        unit: '',
        resultType: 'options',
        options: ['Negative', 'Positive (+)'],
        defaultValue: 'Negative',
        refRange: 'Negative',
      },
      {
        id: 'p-u-micro-head',
        name: '--- MICROSCOPIC EXAMINATION (/HPF) ---',
        code: 'U_MICRO_HEAD',
        unit: '',
        resultType: 'text',
        refRange: '',
        isHeading: true,
      },
      {
        id: 'p-u-pus',
        name: 'Pus Cells (WBCs)',
        code: 'U_PUS',
        unit: '/HPF',
        resultType: 'numeric',
        defaultValue: '2',
        refRange: '0 - 5 /HPF',
        genderRanges: { male: { min: 0, max: 5 }, female: { min: 0, max: 8 } },
        criticalHigh: 50,
      },
      {
        id: 'p-u-rbc',
        name: 'Red Blood Cells (RBCs)',
        code: 'U_RBC',
        unit: '/HPF',
        resultType: 'numeric',
        defaultValue: '0',
        refRange: '0 - 2 /HPF',
        genderRanges: { male: { min: 0, max: 2 }, female: { min: 0, max: 2 } },
        criticalHigh: 20,
      },
      {
        id: 'p-u-epi',
        name: 'Epithelial Cells',
        code: 'U_EPI',
        unit: '/HPF',
        resultType: 'options',
        options: ['Nil', 'A few (1-3)', 'Moderate (4-8)', 'Plenty'],
        defaultValue: 'A few (1-3)',
        refRange: 'A few (1 - 4) /HPF',
      },
      {
        id: 'p-u-casts',
        name: 'Casts (Hyaline / Granular)',
        code: 'U_CASTS',
        unit: '',
        resultType: 'options',
        options: ['Nil', 'Hyaline Casts Seen', 'Granular Casts Seen', 'Pus Casts Seen'],
        defaultValue: 'Nil',
        refRange: 'Nil',
      },
      {
        id: 'p-u-cryst',
        name: 'Crystals (Calcium Oxalate / Uric Acid)',
        code: 'U_CRYST',
        unit: '',
        resultType: 'options',
        options: ['Nil', 'Calcium Oxalate (+)', 'Uric Acid (+)', 'Triple Phosphate (+)'],
        defaultValue: 'Nil',
        refRange: 'Nil',
      },
    ],
  },
  {
    id: 'tmpl-stool-rme',
    code: 'CP-002',
    name: 'Stool Routine & Microscopic Examination',
    category: 'Clinical Pathology',
    department: 'Clinical Pathology',
    sampleType: 'Fresh Stool Specimen',
    method: 'Macroscopic Inspection & Saline/Iodine Wet Mount Microscopy',
    deliveryTime: '1 Hour',
    fee: 250,
    active: true,
    parameters: [
      {
        id: 'p-st-color',
        name: 'Color',
        code: 'ST_COLOR',
        unit: '',
        resultType: 'options',
        options: ['Yellowish-Brown', 'Brown', 'Clay-colored', 'Black / Tar', 'Greenish'],
        defaultValue: 'Yellowish-Brown',
        refRange: 'Yellowish Brown',
      },
      {
        id: 'p-st-consist',
        name: 'Consistency',
        code: 'ST_CONS',
        unit: '',
        resultType: 'options',
        options: ['Formed', 'Semiformed', 'Soft', 'Liquid / Watery'],
        defaultValue: 'Semiformed',
        refRange: 'Formed / Semiformed',
      },
      {
        id: 'p-st-mucus',
        name: 'Mucus',
        code: 'ST_MUCUS',
        unit: '',
        resultType: 'options',
        options: ['Nil', 'Present (+)'],
        defaultValue: 'Nil',
        refRange: 'Nil',
      },
      {
        id: 'p-st-blood',
        name: 'Occult Blood Test (OBT)',
        code: 'ST_OBT',
        unit: '',
        resultType: 'options',
        options: ['Negative', 'Positive (+)'],
        defaultValue: 'Negative',
        refRange: 'Negative',
      },
      {
        id: 'p-st-pus',
        name: 'Pus Cells',
        code: 'ST_PUS',
        unit: '/HPF',
        resultType: 'numeric',
        defaultValue: '1',
        refRange: '0 - 2 /HPF',
      },
      {
        id: 'p-st-proto',
        name: 'Protozoa / Cysts (E. histolytica / G. lamblia)',
        code: 'ST_PROTO',
        unit: '',
        resultType: 'options',
        options: ['Not Seen', 'E. histolytica Cyst Seen', 'G. lamblia Cyst Seen'],
        defaultValue: 'Not Seen',
        refRange: 'Not Seen',
      },
      {
        id: 'p-st-ova',
        name: 'Helminths / Ova',
        code: 'ST_OVA',
        unit: '',
        resultType: 'options',
        options: ['Not Seen', 'A. lumbricoides Ova', 'A. duodenale Ova', 'T. trichiura Ova'],
        defaultValue: 'Not Seen',
        refRange: 'Not Seen',
      },
    ],
  },

  // ==========================================
  // 4. SEROLOGY & INFECTIOUS DISEASES
  // ==========================================
  {
    id: 'tmpl-dengue',
    code: 'SER-001',
    name: 'Dengue Duo Combo (NS1 Antigen + IgG / IgM Antibody)',
    category: 'Serology & Immunology',
    department: 'Microbiology & Serology',
    sampleType: 'Serum / Plasma (2ml)',
    method: 'Immunochromatographic Assay (ICT Rapid) & ELISA Confirmation',
    deliveryTime: '1 Hour',
    fee: 700,
    active: true,
    parameters: [
      {
        id: 'p-dengue-ns1',
        name: 'Dengue NS1 Antigen (Early acute phase)',
        code: 'DENGUE_NS1',
        unit: '',
        resultType: 'options',
        options: ['Negative', 'Positive (+)'],
        defaultValue: 'Negative',
        refRange: 'Negative',
      },
      {
        id: 'p-dengue-igm',
        name: 'Dengue IgM Antibody (Active / Primary infection)',
        code: 'DENGUE_IGM',
        unit: '',
        resultType: 'options',
        options: ['Negative', 'Positive (+)'],
        defaultValue: 'Negative',
        refRange: 'Negative',
      },
      {
        id: 'p-dengue-igg',
        name: 'Dengue IgG Antibody (Past / Secondary infection)',
        code: 'DENGUE_IGG',
        unit: '',
        resultType: 'options',
        options: ['Negative', 'Positive (+)'],
        defaultValue: 'Negative',
        refRange: 'Negative',
      },
    ],
  },
  {
    id: 'tmpl-widal',
    code: 'SER-002',
    name: 'Widal Agglutination Test (Enteric Fever / Typhoid)',
    category: 'Serology & Immunology',
    department: 'Microbiology & Serology',
    sampleType: 'Serum (2ml)',
    method: 'Tube / Slide Agglutination Method',
    deliveryTime: '2 Hours',
    fee: 350,
    active: true,
    parameters: [
      {
        id: 'p-widal-to',
        name: 'S. typhi "O" (Somatic Antigen)',
        code: 'WIDAL_TO',
        unit: 'Titre',
        resultType: 'options',
        options: ['< 1:80', '1:80', '1:160', '1:320', '>= 1:640'],
        defaultValue: '< 1:80',
        refRange: '< 1:80 (Significant if >= 1:160)',
      },
      {
        id: 'p-widal-th',
        name: 'S. typhi "H" (Flagellar Antigen)',
        code: 'WIDAL_TH',
        unit: 'Titre',
        resultType: 'options',
        options: ['< 1:80', '1:80', '1:160', '1:320', '>= 1:640'],
        defaultValue: '< 1:80',
        refRange: '< 1:80 (Significant if >= 1:160)',
      },
      {
        id: 'p-widal-ah',
        name: 'S. paratyphi "AH"',
        code: 'WIDAL_AH',
        unit: 'Titre',
        resultType: 'options',
        options: ['< 1:80', '1:80', '1:160', '1:320'],
        defaultValue: '< 1:80',
        refRange: '< 1:80',
      },
      {
        id: 'p-widal-bh',
        name: 'S. paratyphi "BH"',
        code: 'WIDAL_BH',
        unit: 'Titre',
        resultType: 'options',
        options: ['< 1:80', '1:80', '1:160', '1:320'],
        defaultValue: '< 1:80',
        refRange: '< 1:80',
      },
    ],
  },
  {
    id: 'tmpl-viral-markers',
    code: 'SER-003',
    name: 'Viral Screening Panel (HBsAg, Anti-HCV, HIV 1&2, VDRL)',
    category: 'Serology & Immunology',
    department: 'Microbiology & Serology',
    sampleType: 'Serum (3ml)',
    method: 'Chemiluminescent Microparticle Immunoassay (CMIA) & ELISA',
    deliveryTime: '3 Hours',
    fee: 1400,
    active: true,
    parameters: [
      {
        id: 'p-hbsag',
        name: 'HBsAg (Hepatitis B Surface Antigen)',
        code: 'HBSAG',
        unit: '',
        resultType: 'options',
        options: ['Non-Reactive / Negative', 'Reactive / Positive (+)'],
        defaultValue: 'Non-Reactive / Negative',
        refRange: 'Non-Reactive',
      },
      {
        id: 'p-hcv',
        name: 'Anti-HCV (Hepatitis C Virus Antibody)',
        code: 'ANTI_HCV',
        unit: '',
        resultType: 'options',
        options: ['Non-Reactive / Negative', 'Reactive / Positive (+)'],
        defaultValue: 'Non-Reactive / Negative',
        refRange: 'Non-Reactive',
      },
      {
        id: 'p-hiv',
        name: 'HIV 1 & 2 Antibodies / p24 Antigen',
        code: 'HIV',
        unit: '',
        resultType: 'options',
        options: ['Non-Reactive / Negative', 'Reactive / Positive (+)'],
        defaultValue: 'Non-Reactive / Negative',
        refRange: 'Non-Reactive',
      },
      {
        id: 'p-vdrl',
        name: 'VDRL / RPR (Syphilis Screening)',
        code: 'VDRL',
        unit: '',
        resultType: 'options',
        options: ['Non-Reactive', 'Reactive (+)'],
        defaultValue: 'Non-Reactive',
        refRange: 'Non-Reactive',
      },
    ],
  },

  // ==========================================
  // 5. MICROBIOLOGY & SENSITIVITY
  // ==========================================
  {
    id: 'tmpl-urine-culture',
    code: 'MIC-001',
    name: 'Urine Culture & Antimicrobial Susceptibility',
    category: 'Microbiology',
    department: 'Microbiology',
    sampleType: 'Midstream Clean Catch Urine (Sterile container - 10ml)',
    method: 'Standard Calibrated Loop Inoculation on CLED & MacConkey Agar with Kirby-Bauer Disk Diffusion',
    deliveryTime: '48 - 72 Hours',
    fee: 650,
    active: true,
    parameters: [
      {
        id: 'p-mic-growth',
        name: 'Culture Growth Status',
        code: 'CULT_STATUS',
        unit: '',
        resultType: 'options',
        options: [
          'No significant bacterial growth after 48 hours of incubation at 37°C.',
          'Significant bacterial growth isolated.',
          'Contamination / Mixed flora growth.',
        ],
        defaultValue: 'No significant bacterial growth after 48 hours of incubation at 37°C.',
        refRange: 'No growth',
      },
      {
        id: 'p-mic-organism',
        name: 'Isolated Pathogenic Organism',
        code: 'ORGANISM',
        unit: '',
        resultType: 'text',
        defaultValue: 'None isolated',
        refRange: 'Sterile',
      },
      {
        id: 'p-mic-count',
        name: 'Colony Count',
        code: 'COLONY_COUNT',
        unit: 'CFU/mL',
        resultType: 'text',
        defaultValue: '< 10^3 CFU/mL',
        refRange: '< 10^4 CFU/mL (Insignificant)',
      },
    ],
  },

  // ==========================================
  // 6. DIGITAL RADIOLOGY / X-RAY
  // ==========================================
  {
    id: 'tmpl-xray-chest',
    code: 'RAD-001',
    name: 'Digital X-Ray Chest P/A View (500mA DR)',
    category: 'Digital Radiology',
    department: 'Digital Radiology',
    sampleType: 'Digital Radiograph',
    method: 'Direct Digital Radiography (DR System)',
    deliveryTime: '1 Hour',
    fee: 500,
    active: true,
    parameters: [],
    defaultNarrative: `EXAMINATION: DIGITAL CHEST X-RAY (P/A VIEW)

FINDINGS:
• Trachea is centrally located in midline.
• Both lung fields appear clear without evidence of focal consolidation, infiltration, cavitation, or active parenchymal lesion.
• Both hilar regions show normal vascular pattern and density.
• Cardiac silhouette is within normal limits of size and configuration (Cardiothoracic ratio < 0.50).
• Hemidiaphragms are normal in outline, position, and contour.
• Both costophrenic and cardiophrenic angles are clear and sharp.
• Visualized thoracic bony cage and soft tissue planes show normal appearances.

IMPRESSION:
NORMAL DIGITAL CHEST RADIOGRAPH. NO ACTIVE PULMONARY OR CARDIAC LESION SEEN.`,
  },
  {
    id: 'tmpl-xray-spine',
    code: 'RAD-002',
    name: 'Digital X-Ray Lumbo-Sacral (L-S) Spine AP & Lateral',
    category: 'Digital Radiology',
    department: 'Digital Radiology',
    sampleType: 'Digital Radiograph',
    method: 'Direct Digital Radiography',
    deliveryTime: '1 Hour',
    fee: 900,
    active: true,
    parameters: [],
    defaultNarrative: `EXAMINATION: DIGITAL X-RAY LUMBAR SPINE (AP & LATERAL VIEWS)

FINDINGS:
• Lumbar lordosis is preserved.
• Vertebral body heights and alignment are normal. No fracture or collapse noted.
• Intervertebral disc spaces at L1-L2, L2-L3, L3-L4, L4-L5, and L5-S1 appear maintained.
• No significant marginal osteophytes or spondylolisthesis seen.
• Pedicles, spinous processes, and sacroiliac joints are unremarkable.
• Psoas muscle shadows appear symmetric.

IMPRESSION:
UNREMARKABLE DIGITAL RADIOGRAPH OF LUMBO-SACRAL SPINE.`,
  },

  // ==========================================
  // 7. ULTRASONOGRAPHY (USG)
  // ==========================================
  {
    id: 'tmpl-usg-abdomen',
    code: 'USG-001',
    name: '4D / Color Doppler USG of Whole Abdomen & Pelvis',
    category: 'Ultrasonography',
    department: 'Ultrasonography',
    sampleType: 'Real-time Ultrasound Scan',
    method: 'High-Resolution 4D Curved & Linear Transducer with Color Doppler',
    deliveryTime: '1 Hour',
    fee: 1200,
    active: true,
    parameters: [],
    defaultNarrative: `EXAMINATION: ULTRASONOGRAM OF WHOLE ABDOMEN AND PELVIS

FINDINGS:
• LIVER: Normal in size (13.2 cm), contour, and parenchymal echotexture. No focal space-occupying lesion (SOL) detected. Intrahepatic biliary channels and portal vein are not dilated.
• GALLBLADDER: Well distended, thin-walled (< 3 mm). Lumen is clear without calculus, polyp, or sludge. Common Bile Duct (CBD) is normal in caliber (4.0 mm).
• SPLEEN: Normal in size (9.5 cm) and homogeneous in echotexture. No focal lesion or splenomegaly.
• PANCREAS: Visualized head, body, and tail are normal in size and echotexture. Main pancreatic duct is not dilated.
• KIDNEYS:
  - Right Kidney: Measures 10.2 x 4.5 cm with normal cortical thickness (1.5 cm). Corticomedullary differentiation is distinct. No calculus, hydronephrosis, or mass lesion seen.
  - Left Kidney: Measures 10.6 x 4.8 cm with normal cortical thickness (1.6 cm). Corticomedullary differentiation is distinct. No calculus, hydronephrosis, or mass lesion seen.
• URINARY BLADDER: Well filled, thin regular wall. No calculus, diverticulum, or mass lesion seen.
• PROSTATE (Male) / UTERUS (Female): Normal in size, outline, and homogenous echotexture. No focal lesion detected.
• PERITONEAL CAVITY: No evidence of ascites or enlarged retroperitoneal lymphadenopathy seen.

IMPRESSION:
NORMAL ULTRASONOGRAM OF WHOLE ABDOMEN AND PELVIS. NO SIGNIFICANT ABNORMALITY DETECTED.`,
  },
  {
    id: 'tmpl-usg-pregnancy',
    code: 'USG-002',
    name: '4D Obstetric / Pregnancy Ultrasonography with Fetal Biometry',
    category: 'Ultrasonography',
    department: 'Ultrasonography',
    sampleType: 'Real-time Ultrasound Scan',
    method: 'Transabdominal Color Doppler Obstetric Scan',
    deliveryTime: '1 Hour',
    fee: 1200,
    active: true,
    parameters: [],
    defaultNarrative: `EXAMINATION: 4D OBSTETRIC ULTRASONOGRAM (PREGNANCY PROFILE)

FINDINGS:
• Gravid uterus reveals a single live intrauterine fetus in cephalic presentation.
• Fetal cardiac pulsation is present and regular (Fetal Heart Rate: 146 bpm).
• Active fetal body movements and breathing movements are noted.

FETAL BIOMETRY:
• Biparietal Diameter (BPD): 54.0 mm (~ 22 Weeks 4 Days)
• Head Circumference (HC): 202.0 mm
• Abdominal Circumference (AC): 178.0 mm
• Femur Length (FL): 38.2 mm (~ 22 Weeks 3 Days)
• Estimated Fetal Weight (EFW): ~ 510 grams ± 10%

ANCILLARY FINDINGS:
• Placenta: Fundal posterior, Grade-I maturity. No retroplacental clot/hematoma.
• Liquor Amnii: Adequate in volume (Amniotic Fluid Index / AFI: 14.5 cm).
• Internal Os: Closed. Cervical length is adequate (3.8 cm).

IMPRESSION:
SINGLE LIVE INTRAUTERINE PREGNANCY AT APPROXIMATELY 22 WEEKS 3 DAYS OF GESTATIONAL AGE WITH NORMAL FETAL ACTIVITY, ADEQUATE LIQUOR, AND NO GROSS CONGENITAL ANOMALIES DETECTED.`,
  },

  // ==========================================
  // 8. CARDIOLOGY / ECG & ECHO
  // ==========================================
  {
    id: 'tmpl-ecg',
    code: 'CARD-001',
    name: '12-Lead Standard Electrocardiogram (ECG / EKG)',
    category: 'Cardiology',
    department: 'Cardiology',
    sampleType: '12-Lead Surface ECG Tracing',
    method: 'Computerized 12-Channel High-Fidelity ECG Recording with Rhythm Strip',
    deliveryTime: '30 Minutes',
    fee: 350,
    active: true,
    parameters: [],
    defaultNarrative: `EXAMINATION: 12-LEAD RESTING ELECTROCARDIOGRAM (ECG)

RECORDING PARAMETERS:
• Paper Speed: 25 mm/sec | Calibration Voltage: 10 mm/mV (Standard)

MEASUREMENTS:
• Heart Rate: 72 beats/minute (Regular)
• Rhythm: Normal Sinus Rhythm (P waves precede every QRS complex)
• PR Interval: 0.16 seconds (Normal 0.12 - 0.20 sec)
• QRS Duration: 0.08 seconds (Normal < 0.10 sec)
• QT / QTc Interval: 0.38 / 0.41 seconds (Normal QTc < 0.44 sec)
• Mean QRS Electrical Axis: Normal (+45°)

ELECTROPHYSIOLOGICAL FINDINGS:
• P Wave: Normal morphology in leads I, II, aVF, and V1.
• QRS Complex: Normal R-wave progression in precordial leads V1 through V6. No pathological Q waves.
• ST Segment: Isoelectric across all leads. No acute ST-elevation or ST-depression seen.
• T Wave: Upright in leads I, II, V3-V6. No hyperacute or symmetrical T-wave inversions.

DIAGNOSTIC IMPRESSION:
NORMAL 12-LEAD RESTING ELECTROCARDIOGRAM. NORMAL SINUS RHYTHM AT 72 BPM. NO EVIDENCE OF ACUTE ISCHEMIA OR CONDUCTION ABNORMALITY.`,
  },
  {
    id: 'tmpl-echo-2d',
    code: 'CARD-002',
    name: '2D Echocardiography (ECHO) with Color Doppler',
    category: 'Cardiology',
    department: 'Cardiology',
    sampleType: 'Transthoracic Echocardiographic Examination',
    method: 'High-Resolution 2D, M-Mode, Pulsed Wave, Continuous Wave & Color Flow Doppler',
    deliveryTime: 'Same Day (2 Hours)',
    fee: 1800,
    active: true,
    parameters: [
      { id: 'p_ao', code: 'AO', name: 'Aorta', unit: 'cm', refRange: '2.0 - 3.7', resultType: 'numeric' },
      { id: 'p_la', code: 'LA', name: 'Left Atrium (LA)', unit: 'cm', refRange: '2.7 - 4.0', resultType: 'numeric' },
      { id: 'p_ivs', code: 'IVS', name: 'Interventricular Septum (IVS)', unit: 'cm', refRange: '0.6 - 1.1', resultType: 'numeric' },
      { id: 'p_lvedd', code: 'LVEDD', name: 'LV End Diastole (LVEDD)', unit: 'cm', refRange: '3.5 - 5.6', resultType: 'numeric' },
      { id: 'p_lvesd', code: 'LVESD', name: 'LV End Systole (LVESD)', unit: 'cm', refRange: '2.0 - 4.0', resultType: 'numeric' },
      { id: 'p_pw', code: 'PW', name: 'Posterior Wall (PW)', unit: 'cm', refRange: '0.6 - 1.1', resultType: 'numeric' },
      { id: 'p_ra', code: 'RA', name: 'Right Atrium (RA)', unit: 'cm', refRange: '2.5 - 4.0', resultType: 'numeric' },
      { id: 'p_rv', code: 'RV', name: 'Right Ventricle (RV)', unit: 'cm', refRange: '1.9 - 2.6', resultType: 'numeric' },
      { id: 'p_lvef', code: 'EF', name: 'LVEF (Teichholz)', unit: '%', refRange: '55 - 75', resultType: 'numeric' },
      { id: 'p_fs', code: 'FS', name: 'Fractional Shortening', unit: '%', refRange: '28 - 44', resultType: 'numeric' },
      { id: 'p_ea', code: 'EA', name: 'E/A Ratio', unit: '', refRange: '0.8 - 2.0', resultType: 'numeric' },
      { id: 'p_dt', code: 'DT', name: 'Deceleration Time', unit: 'msec', refRange: '160 - 240', resultType: 'numeric' },
      { id: 'p_ivrt', code: 'IVRT', name: 'IVRT', unit: 'msec', refRange: '70 - 100', resultType: 'numeric' },
      { id: 'p_eprime', code: 'EPRIME', name: "E' (Septal)", unit: 'cm/s', refRange: '> 8.0', resultType: 'numeric' },
      { id: 'p_eeprime', code: 'EEPRIME', name: "E/E' (Septal)", unit: '', refRange: '< 8.0', resultType: 'numeric' },
      { id: 'p_lvsys', code: 'LVSYS', name: 'LV Systolic Function', unit: '', refRange: 'Normal', resultType: 'options', options: ['Normal', 'Mild LV Dysfunction', 'Moderate LV Dysfunction', 'Severe LV Dysfunction'] },
      { id: 'p_mv', code: 'MV', name: 'Mitral Valve', unit: '', refRange: 'Normal', resultType: 'options', options: ['Normal', 'Mild MR', 'Moderate MR', 'Severe MR', 'MS', 'MVP'] },
      { id: 'p_av', code: 'AV', name: 'Aortic Valve', unit: '', refRange: 'Normal', resultType: 'options', options: ['Normal', 'Mild AR', 'Moderate AR', 'Severe AR', 'AS', 'Bicuspid'] },
      { id: 'p_tv', code: 'TV', name: 'Tricuspid Valve', unit: '', refRange: 'Normal', resultType: 'options', options: ['Normal', 'Mild TR', 'Moderate TR', 'Severe TR'] },
      { id: 'p_pv', code: 'PV', name: 'Pulmonary Valve', unit: '', refRange: 'Normal', resultType: 'options', options: ['Normal', 'Mild PR', 'Moderate PR', 'PS'] },
    ],
    defaultNarrative: `CLINICAL INDICATION: Routine evaluation.

SUMMARY / IMPRESSION:
• Normal cardiac chamber sizes.
• Global LV systolic function is normal. LVEF ≈ 62%.
• No significant valvular abnormality.
• Mild tricuspid regurgitation (RVSP ≈ 28 mmHg).
• No pericardial effusion.
• Overall study is within normal limits.`,
  },

  // ==========================================
  // 9. HISTOPATHOLOGY & CYTOPATHOLOGY
  // ==========================================
  {
    id: 'tmpl-histopath',
    code: 'PATH-001',
    name: 'Histopathological Examination of Biopsy / Tissue Specimen',
    category: 'Histopathology & Cytology',
    department: 'Pathology & Histopathology',
    sampleType: 'Formalin Fixed Tissue Specimen in 10% Neutral Buffered Formalin',
    method: 'Automated Vacuum Tissue Processing, Paraffin Embedding, 4μm Sectioning & H&E Staining',
    deliveryTime: '5 - 7 Days',
    fee: 2200,
    active: true,
    parameters: [],
    defaultNarrative: `SPECIMEN: Excisional / Incisional Biopsy Specimen
CLINICAL HISTORY: Swelling under evaluation.

GROSS EXAMINATION:
Received specimen consists of a single fibrofatty tissue mass measuring 3.5 x 2.2 x 1.4 cm. External surface is lobulated, greyish-yellow to pinkish in color. Cut section reveals homogeneous, soft, glistening yellow lobules without cystic change, hemorrhage, or necrosis. Entire tissue processed in 2 cassettes.

MICROSCOPIC EXAMINATION:
Sections reveal encapsulated lobules of mature adipocytes separated by delicate, thin vascularized fibrovascular septa. The individual lipocytes display uniform, large clear lipid vacuoles with eccentrically placed, flattened benign nuclei. No nuclear pleomorphism, hyperchromasia, lipoblasts, mitotic figures, or evidence of malignancy seen.

DIAGNOSIS:
BENIGN LIPOMA. NO EVIDENCE OF MALIGNANCY SEEN.`,
  },
  {
    id: 'tmpl-fnac',
    code: 'PATH-002',
    name: 'Fine Needle Aspiration Cytology (FNAC)',
    category: 'Histopathology & Cytology',
    department: 'Pathology & Histopathology',
    sampleType: 'Fine Needle Cellular Aspirate',
    method: '23G Needle Aspiration, Wet Alcohol Fixed & Air-Dried Smears stained with PAP and Giemsa Stains',
    deliveryTime: '24 - 48 Hours',
    fee: 950,
    active: true,
    parameters: [],
    defaultNarrative: `EXAMINATION: FINE NEEDLE ASPIRATION CYTOLOGY (FNAC)
SITE OF ASPIRATION: Right Cervical Lymph Node / Thyroid Nodule

GROSS ASPIRATE:
Aspiration yielded 0.2 ml of hemorrhagic / cellular material. 4 smears prepared (2 alcohol-fixed for PAP stain, 2 air-dried for Giemsa stain).

MICROSCOPIC EXAMINATION:
Smears are moderately cellular and reveal a polymorphous population of lymphoid cells comprising small mature lymphocytes, activated centrocytes, histiocytes, and tangible-body macrophages on a clean background. No Reed-Sternberg cells, epithelioid granulomas, caseous necrosis, or metastatic malignant cells detected.

CYTOLOGICAL DIAGNOSIS:
REACTIVE LYMPHOID HYPERPLASIA. BENIGN SMEAR. NO MALIGNANCY DETECTED.`,
  },
];
