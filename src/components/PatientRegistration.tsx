import React, { useState } from 'react';
import { dbService } from '../services/db';
import { Patient, Doctor, LabTechnician, TestTemplate, Order, Report } from '../types';
import { useAuth } from '../context/AuthContext';
import { ThreeDCard } from './ThreeDCard';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  ShieldCheck,
  User,
  Stethoscope,
  FlaskConical,
  Activity,
  Sparkles,
  Layers,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';

interface PatientRegistrationProps {
  onOrderCreated: (order: Order, reports: Report[]) => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onOrderCreated }) => {
  const { currentUser } = useAuth();

  const [doctors] = useState<Doctor[]>(dbService.getActiveDoctors());
  const [technicians] = useState<LabTechnician[]>(dbService.getActiveTechnicians());
  const [templates] = useState<TestTemplate[]>(dbService.getActiveTemplates());

  // Existing patient search
  const [searchUhid, setSearchUhid] = useState('');
  const [existingPatient, setExistingPatient] = useState<Patient | null>(null);
  const [searchError, setSearchError] = useState('');

  // Form State - Patient Demographics
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [ageUnit, setAgeUnit] = useState<'years' | 'months' | 'days'>('years');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [nationalId, setNationalId] = useState('');

  // Referral Source State
  const [referralSource, setReferralSource] = useState<'doctor' | 'self'>('doctor');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [customDoctorName, setCustomDoctorName] = useState('');

  // Report Verifiers & Signatories Selection State (2 Lab Technicians + 1 Doctor)
  const [selectedTech1Id, setSelectedTech1Id] = useState<string>(technicians[0]?.id || '');
  const [selectedTech2Id, setSelectedTech2Id] = useState<string>(
    technicians[1]?.id || technicians[0]?.id || ''
  );
  const [selectedVerifierDoctorId, setSelectedVerifierDoctorId] = useState<string>(
    doctors[0]?.id || ''
  );

  // Order Details
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Success Confirmation State
  const [createdOrderData, setCreatedOrderData] = useState<{
    order: Order;
    reports: Report[];
  } | null>(null);

  // Quick test selection search
  const [testSearchQuery, setTestSearchQuery] = useState('');

  // Handle Search by UHID
  const handleSearchPatient = () => {
    setSearchError('');
    if (!searchUhid.trim()) return;

    const patient = dbService.getPatientByUhid(searchUhid.trim());
    if (patient) {
      setExistingPatient(patient);
      setName(patient.name);
      setAge(patient.age);
      setAgeUnit(patient.ageUnit);
      setGender(patient.gender);
      setPhone(patient.phone);
      setAddress(patient.address);
      setBloodGroup(patient.bloodGroup || '');
      setEmergencyContact(patient.emergencyContact || '');
      setNationalId(patient.nationalId || '');
    } else {
      setSearchError(`No patient found with UHID: ${searchUhid}`);
      setExistingPatient(null);
    }
  };

  const handleClearPatientForm = () => {
    setExistingPatient(null);
    setSearchUhid('');
    setName('');
    setAge('');
    setAgeUnit('years');
    setGender('male');
    setPhone('');
    setAddress('');
    setBloodGroup('');
    setEmergencyContact('');
    setNationalId('');
    setReferralSource('doctor');
    setCustomDoctorName('');
    setSelectedTemplateIds([]);
    setDiscountAmount(0);
    setPaidAmount(0);
    setCreatedOrderData(null);
  };

  // Test Selection Handlers
  const handleToggleTest = (tmplId: string) => {
    if (selectedTemplateIds.includes(tmplId)) {
      setSelectedTemplateIds(selectedTemplateIds.filter((id) => id !== tmplId));
    } else {
      setSelectedTemplateIds([...selectedTemplateIds, tmplId]);
    }
  };

  // Total Billing Calculations
  const selectedTemplates = templates.filter((t) => selectedTemplateIds.includes(t.id));
  const grossTotal = selectedTemplates.reduce((sum, t) => sum + (t.fee || 0), 0);
  const netPayable = Math.max(0, grossTotal - discountAmount);
  const dueAmount = Math.max(0, netPayable - paidAmount);

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || age === '' || selectedTemplateIds.length === 0) {
      alert('Please fill in patient demographics and select at least one laboratory investigation.');
      return;
    }

    const refDoctor =
      referralSource === 'doctor'
        ? doctors.find((d) => d.id === selectedDoctorId) || doctors[0]
        : null;

    // Verifier resolution (2 Lab Technicians + 1 Doctor)
    const tech1 = technicians.find((t) => t.id === selectedTech1Id) || technicians[0];
    const tech2 =
      technicians.find((t) => t.id === selectedTech2Id) ||
      technicians.find((t) => t.id !== tech1?.id) ||
      technicians[1] ||
      tech1;
    const vDoc = doctors.find((d) => d.id === selectedVerifierDoctorId) || doctors[0];
    const designatedVerifierName = `${vDoc?.name || 'Doctor'} & ${tech1?.name || 'Technician'}`;

    // 1. Save or Update Patient Record
    let patientRecord: Patient;
    if (existingPatient) {
      patientRecord = dbService.savePatient(
        {
          ...existingPatient,
          name,
          age: Number(age),
          ageUnit,
          gender,
          phone,
          address,
          bloodGroup,
          emergencyContact,
          nationalId,
        },
        currentUser || undefined
      );
    } else {
      const generatedUhid = dbService.generateUhid();
      patientRecord = dbService.savePatient(
        {
          id: `pat-${Date.now()}`,
          uhid: generatedUhid,
          name,
          age: Number(age),
          ageUnit,
          gender,
          phone,
          address,
          bloodGroup,
          emergencyContact,
          nationalId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        currentUser || undefined
      );
    }

    // 2. Create Order & Generate Report Records
    const result = dbService.createOrder(
      patientRecord,
      selectedTemplateIds,
      refDoctor,
      discountAmount,
      paidAmount,
      priority,
      currentUser || undefined,
      {
        referralSource,
        customDoctorName: referralSource === 'doctor' && customDoctorName.trim() ? customDoctorName.trim() : undefined,
        designatedVerifierType: 'doctor',
        designatedVerifierId: vDoc?.id,
        designatedVerifierName,
        verifierTech1Id: tech1?.id,
        verifierTech2Id: tech2?.id,
        verifierDoctorId: vDoc?.id,
      }
    );

    setCreatedOrderData(result);
    onOrderCreated(result.order, result.reports);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Patient Registration &amp; Order Intake
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Register new outpatients, search returning records by UHID, set referral source, assign verifier, and auto-route to templates.
          </p>
        </div>

        {existingPatient && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>Existing Record: <strong>{existingPatient.uhid}</strong></span>
          </div>
        )}
      </div>

      {/* Confirmation Receipt if Order Just Placed */}
      <AnimatePresence>
        {createdOrderData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50/90 border-2 border-emerald-500 rounded-3xl p-6 space-y-4 shadow-md backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-950">
                    Order Successfully Placed &amp; Specimen Accessioned!
                  </h3>
                  <p className="text-xs text-emerald-800 font-mono mt-0.5">
                    Order: <strong>{createdOrderData.order.orderNo}</strong> • UHID: <strong>{createdOrderData.order.uhid}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOrderCreated(createdOrderData.order, createdOrderData.reports)}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5 tactile-btn"
                >
                  <FileText className="w-4 h-4" />
                  Open Report Template Now
                </button>
                <button
                  type="button"
                  onClick={handleClearPatientForm}
                  className="bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer tactile-btn"
                >
                  Register Next Patient
                </button>
              </div>
            </div>

            <div className="bg-white/95 rounded-2xl p-4 border border-emerald-200 text-xs text-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Patient Name</span>
                <strong className="text-slate-900 font-bold">{createdOrderData.order.patientName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Total / Paid</span>
                <span className="font-mono font-bold text-slate-900">
                  ৳ {createdOrderData.order.totalAmount} / ৳ {createdOrderData.order.paidAmount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Due Balance</span>
                <span className="font-mono font-bold text-red-600">
                  ৳ {createdOrderData.order.dueAmount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Assigned Verifiers</span>
                <span className="font-bold text-teal-800 truncate block" title={`Doctor: ${createdOrderData.order.verifierDoctorName || 'Assigned'}, Tech 1: ${createdOrderData.order.verifierTech1Name || 'Tech 1'}, Tech 2: ${createdOrderData.order.verifierTech2Name || 'Tech 2'}`}>
                  {createdOrderData.order.verifierDoctorName ? `${createdOrderData.order.verifierDoctorName.split(' ')[0]} ${createdOrderData.order.verifierDoctorName.split(' ')[1] || ''}` : 'Doctor'} + 2 Techs
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Registration & Order Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: Patient Details & Investigation Selection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Lookup Returning Patient */}
          <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-700" />
                1. Lookup Returning Patient (UHID Search)
              </h3>
              {existingPatient && (
                <button
                  type="button"
                  onClick={handleClearPatientForm}
                  className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer"
                >
                  Clear &amp; New
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchUhid}
                onChange={(e) => setSearchUhid(e.target.value)}
                placeholder="e.g. JDC-P-2026-00101"
                className="flex-1 bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={handleSearchPatient}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer tactile-btn shadow-xs"
              >
                Search UHID
              </button>
            </div>

            {searchError && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                {searchError}
              </p>
            )}
          </div>

          {/* Card 2: Patient Demographics */}
          <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-700" />
              2. Patient Demographics &amp; Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name of Patient *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mohammad Rahim"
                  required
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                    placeholder="35"
                    min="0"
                    max="130"
                    required
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Unit</label>
                  <select
                    value={ageUnit}
                    onChange={(e) => setAgeUnit(e.target.value as any)}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01818-XXXXXX"
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Unknown / Select</option>
                  <option value="A+">A (+ve)</option>
                  <option value="A-">A (-ve)</option>
                  <option value="B+">B (+ve)</option>
                  <option value="B-">B (-ve)</option>
                  <option value="O+">O (+ve)</option>
                  <option value="O-">O (-ve)</option>
                  <option value="AB+">AB (+ve)</option>
                  <option value="AB-">AB (-ve)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Trunk Road, Feni Sadar, Feni"
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">NID / Birth Certificate</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Investigation Test Selection */}
          <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                3. Diagnostic Investigations Ordered ({selectedTemplateIds.length} selected)
              </h3>
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={testSearchQuery}
                  onChange={(e) => setTestSearchQuery(e.target.value)}
                  placeholder="Filter tests..."
                  className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {templates
                .filter((t) =>
                  t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
                  t.category.toLowerCase().includes(testSearchQuery.toLowerCase())
                )
                .map((tmpl) => {
                  const isSelected = selectedTemplateIds.includes(tmpl.id);
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleToggleTest(tmpl.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between tactile-btn ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-500 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <strong className="text-xs text-slate-900 block leading-tight">{tmpl.name}</strong>
                        <span className="text-[11px] text-teal-800 font-medium">{tmpl.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-slate-900 block">
                          ৳ {tmpl.fee}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Add'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Referral, Verifier, Priority & Billing Summary */}
        <div className="space-y-6">
          {/* Card 4: Patient Referral Source */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              4. Patient Referral Source
            </h3>

            {/* Referral Source Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setReferralSource('doctor')}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  referralSource === 'doctor'
                    ? 'bg-white text-teal-950 shadow-xs border border-slate-200/80 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                Doctor Referred
              </button>
              <button
                type="button"
                onClick={() => setReferralSource('self')}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  referralSource === 'self'
                    ? 'bg-white text-teal-950 shadow-xs border border-slate-200/80 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-teal-700" />
                Self-Referred / Walk-in
              </button>
            </div>

            {referralSource === 'doctor' ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Registered Doctor / Specialist *
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty} • BMDC: {doc.bmdcNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Or External / Custom Referring Doctor
                  </label>
                  <input
                    type="text"
                    value={customDoctorName}
                    onChange={(e) => setCustomDoctorName(e.target.value)}
                    placeholder="e.g. Prof. Dr. AKM Faruk (Feni General Hosp)"
                    className="w-full bg-slate-50/80 border border-slate-300/80 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5 text-xs text-teal-950">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  Self-Referred / Direct Patient Intake
                </p>
                <p className="text-[11px] text-teal-800 mt-1">
                  Report will display <strong>Ref: Self / Direct Walk-in</strong> on printed A4 pathology slips.
                </p>
              </div>
            )}
          </div>

          {/* Card 5: Report Verifiers & Signatories Selection (2 Technicians + 1 Doctor) */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-700" />
                5. Report Verifiers &amp; Signatories
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                2 Techs + 1 Doctor
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Technician 1 */}
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    Lab Technologist 1 (Prepared / Reported By) *
                  </label>
                </div>
                <select
                  value={selectedTech1Id}
                  onChange={(e) => setSelectedTech1Id(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} — {tech.designation} ({tech.employeeId || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Technician 2 */}
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-teal-700 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    Lab Technologist 2 (Checked &amp; Examined By) *
                  </label>
                </div>
                <select
                  value={selectedTech2Id}
                  onChange={(e) => setSelectedTech2Id(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} — {tech.designation} ({tech.employeeId || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor / Pathologist */}
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    Doctor / Pathologist (Verified &amp; Authorized By) *
                  </label>
                </div>
                <select
                  value={selectedVerifierDoctorId}
                  onChange={(e) => setSelectedVerifierDoctorId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.designation} (BMDC: {doc.bmdcNo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clinical Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Priority
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['routine', 'urgent', 'emergency'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-bold capitalize rounded-xl border transition cursor-pointer tactile-btn ${
                        priority === p
                          ? p === 'emergency'
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : p === 'urgent'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-teal-700 text-white border-teal-700 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Financial Summary & Order Submission */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-700" />
              Invoice &amp; Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs border-b border-slate-100 pb-3">
              <div className="flex justify-between text-slate-600">
                <span>Gross Tests Total:</span>
                <span className="font-mono font-bold text-slate-900">৳ {grossTotal}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Special Discount (৳):</span>
                <input
                  type="number"
                  min="0"
                  max={grossTotal}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-right font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                <span>Net Payable:</span>
                <span className="font-mono text-sm text-teal-900">৳ {netPayable}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-700 font-semibold">Amount Paid (৳):</span>
                <input
                  type="number"
                  min="0"
                  max={netPayable}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-right font-mono text-xs text-emerald-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-between font-bold pt-1">
                <span className="text-slate-700">Due Balance:</span>
                <span className={`font-mono ${dueAmount > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                  ৳ {dueAmount}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedTemplateIds.length === 0}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-black py-3 rounded-2xl text-xs sm:text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 tactile-btn"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Registration &amp; Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
