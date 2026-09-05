import React, { useState } from 'react';
import { Doctor, LabTechnician } from '../types';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  Stethoscope,
  FlaskConical,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  Plus,
  Save,
  X,
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'doctors' | 'technicians'>('doctors');
  const [doctors, setDoctors] = useState<Doctor[]>(dbService.getDoctors());
  const [technicians, setTechnicians] = useState<LabTechnician[]>(dbService.getTechnicians());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<LabTechnician | null>(null);

  // Delete Confirmation State
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [techToDelete, setTechToDelete] = useState<LabTechnician | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for Doctor
  const [docForm, setDocForm] = useState({
    name: '',
    designation: '',
    specialty: '',
    bmdcNo: '',
    department: 'Pathology & Hematology',
    phone: '',
    email: '',
    roomNo: '',
    hospitalAffiliation: 'Janani Diagnostic Centre',
  });

  // Form states for Technician
  const [techForm, setTechForm] = useState({
    name: '',
    designation: 'Medical Technologist (Lab)',
    department: 'Hematology & Biochemistry',
    employeeId: '',
    phone: '',
    email: '',
  });

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const refreshData = () => {
    setDoctors(dbService.getDoctors());
    setTechnicians(dbService.getTechnicians());
  };

  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocForm({
      name: '',
      designation: 'Consultant',
      specialty: 'Clinical Pathology',
      bmdcNo: '',
      department: 'Pathology & Hematology',
      phone: '',
      email: '',
      roomNo: 'Room 201',
      hospitalAffiliation: 'Janani Diagnostic Centre',
    });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setDocForm({
      name: doc.name,
      designation: doc.designation,
      specialty: doc.specialty,
      bmdcNo: doc.bmdcNo,
      department: doc.department,
      phone: doc.phone,
      email: doc.email,
      roomNo: doc.roomNo || '',
      hospitalAffiliation: doc.hospitalAffiliation || '',
    });
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.name.trim() || !docForm.bmdcNo.trim()) return;

    const doctorToSave: Doctor = {
      id: editingDoctor ? editingDoctor.id : `doc-${Date.now()}`,
      name: docForm.name.trim(),
      designation: docForm.designation.trim(),
      specialty: docForm.specialty.trim(),
      bmdcNo: docForm.bmdcNo.trim(),
      department: docForm.department.trim(),
      phone: docForm.phone.trim(),
      email: docForm.email.trim(),
      roomNo: docForm.roomNo.trim(),
      hospitalAffiliation: docForm.hospitalAffiliation.trim(),
      active: editingDoctor ? editingDoctor.active : true,
      createdAt: editingDoctor ? editingDoctor.createdAt : new Date().toISOString(),
    };

    dbService.saveDoctor(doctorToSave, currentUser || undefined);
    refreshData();
    setIsDoctorModalOpen(false);
    showNotification('success', `Dr. ${doctorToSave.name} successfully saved.`);
  };

  const handleToggleDoctor = (id: string) => {
    dbService.toggleDoctorStatus(id, currentUser || undefined);
    refreshData();
  };

  const handleConfirmDeleteDoctor = () => {
    if (!doctorToDelete) return;
    const docName = doctorToDelete.name;
    const success = dbService.deleteDoctor(doctorToDelete.id, currentUser || undefined);
    if (success) {
      refreshData();
      showNotification('success', `Dr. ${docName} has been permanently deleted.`);
    } else {
      showNotification('error', `Failed to delete Dr. ${docName}.`);
    }
    setDoctorToDelete(null);
  };

  // Technician Handlers
  const handleOpenAddTech = () => {
    setEditingTech(null);
    setTechForm({
      name: '',
      designation: 'Medical Technologist',
      department: 'Clinical Biochemistry',
      employeeId: `JDC-T-${Math.floor(100 + Math.random() * 900)}`,
      phone: '',
      email: '',
    });
    setIsTechModalOpen(true);
  };

  const handleOpenEditTech = (tech: LabTechnician) => {
    setEditingTech(tech);
    setTechForm({
      name: tech.name,
      designation: tech.designation,
      department: tech.department,
      employeeId: tech.employeeId,
      phone: tech.phone,
      email: tech.email,
    });
    setIsTechModalOpen(true);
  };

  const handleSaveTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techForm.name.trim() || !techForm.employeeId.trim()) return;

    const techToSave: LabTechnician = {
      id: editingTech ? editingTech.id : `tech-${Date.now()}`,
      name: techForm.name.trim(),
      designation: techForm.designation.trim(),
      department: techForm.department.trim(),
      employeeId: techForm.employeeId.trim(),
      phone: techForm.phone.trim(),
      email: techForm.email.trim(),
      active: editingTech ? editingTech.active : true,
      createdAt: editingTech ? editingTech.createdAt : new Date().toISOString(),
    };

    dbService.saveTechnician(techToSave, currentUser || undefined);
    refreshData();
    setIsTechModalOpen(false);
    showNotification('success', `Technologist ${techToSave.name} successfully saved.`);
  };

  const handleToggleTech = (id: string) => {
    dbService.toggleTechnicianStatus(id, currentUser || undefined);
    refreshData();
  };

  const handleConfirmDeleteTech = () => {
    if (!techToDelete) return;
    const techName = techToDelete.name;
    const success = dbService.deleteTechnician(techToDelete.id, currentUser || undefined);
    if (success) {
      refreshData();
      showNotification('success', `Lab Technologist ${techName} has been permanently deleted.`);
    } else {
      showNotification('error', `Failed to delete technologist ${techName}.`);
    }
    setTechToDelete(null);
  };

  // Filtered lists
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.bmdcNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTechnicians = technicians.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm transition ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-700" />
            Clinical Staff &amp; Technician Management
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Configure authorized consulting doctors, reviewing pathologists, and laboratory technologists for manual authorization workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'doctors' ? (
            <button
              onClick={handleOpenAddDoctor}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Doctor
            </button>
          ) : (
            <button
              onClick={handleOpenAddTech}
              className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Lab Technologist
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-700" />
            Doctors &amp; Pathologists ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('technicians')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'technicians'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-teal-700" />
            Lab Technologists ({technicians.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'doctors' ? 'doctors by name, BMDC...' : 'technicians by name, ID...'}`}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>
      </div>

      {/* Content: Doctors List */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                doc.active ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-teal-700 font-semibold">{doc.specialty}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      doc.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {doc.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>BMDC Reg: <strong className="text-slate-800">{doc.bmdcNo}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.designation} • {doc.department}</span>
                  </div>
                  {doc.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.phone}</span>
                    </div>
                  )}
                  {doc.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleDoctor(doc.id)}
                  className={`font-semibold cursor-pointer ${
                    doc.active ? 'text-slate-500 hover:text-slate-700' : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  {doc.active ? 'Deactivate' : 'Activate'}
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditDoctor(doc)}
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDoctorToDelete(doc)}
                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content: Technicians List */}
      {activeTab === 'technicians' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnicians.map((tech) => (
            <div
              key={tech.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition flex flex-col justify-between ${
                tech.active ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 flex items-center justify-center font-bold">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                        {tech.name}
                      </h3>
                      <p className="text-xs text-cyan-800 font-semibold">{tech.designation}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      tech.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tech.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Employee ID: <strong className="text-slate-800">{tech.employeeId}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dept: {tech.department}</span>
                  </div>
                  {tech.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tech.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleTech(tech.id)}
                  className={`font-semibold cursor-pointer ${
                    tech.active ? 'text-slate-500 hover:text-slate-700' : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  {tech.active ? 'Deactivate' : 'Activate'}
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenEditTech(tech)}
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setTechToDelete(tech)}
                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold cursor-pointer hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                    title="Delete Technologist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Add/Edit Modal */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 relative">
            <button
              onClick={() => setIsDoctorModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-700" />
              {editingDoctor ? 'Edit Doctor Profile' : 'Add New Consulting Doctor'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorized doctor information appears on verified clinical reports.
            </p>

            <form onSubmit={handleSaveDoctor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name with Title *</label>
                <input
                  type="text"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="e.g. Dr. Md. Rafiqul Islam"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">BMDC Registration No *</label>
                  <input
                    type="text"
                    value={docForm.bmdcNo}
                    onChange={(e) => setDocForm({ ...docForm, bmdcNo: e.target.value })}
                    placeholder="e.g. A-45892"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={docForm.designation}
                    onChange={(e) => setDocForm({ ...docForm, designation: e.target.value })}
                    placeholder="e.g. Senior Consultant Pathologist"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={docForm.specialty}
                    onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                    placeholder="e.g. Clinical Pathology & Hematology"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={docForm.department}
                    onChange={(e) => setDocForm({ ...docForm, department: e.target.value })}
                    placeholder="e.g. Pathology & Hematology"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={docForm.phone}
                    onChange={(e) => setDocForm({ ...docForm, phone: e.target.value })}
                    placeholder="e.g. 01711-223344"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={docForm.email}
                    onChange={(e) => setDocForm({ ...docForm, email: e.target.value })}
                    placeholder="e.g. doctor@jananidc.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technician Add/Edit Modal */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 relative">
            <button
              onClick={() => setIsTechModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-700" />
              {editingTech ? 'Edit Technologist Profile' : 'Add New Lab Technologist'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Technologists perform calibration, specimen runs, and initial technical reviews.
            </p>

            <form onSubmit={handleSaveTechnician} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={techForm.name}
                  onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                  placeholder="e.g. Md. Tariqul Islam"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={techForm.employeeId}
                    onChange={(e) => setTechForm({ ...techForm, employeeId: e.target.value })}
                    placeholder="e.g. JDC-T-105"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={techForm.designation}
                    onChange={(e) => setTechForm({ ...techForm, designation: e.target.value })}
                    placeholder="e.g. Medical Technologist"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Department</label>
                <input
                  type="text"
                  value={techForm.department}
                  onChange={(e) => setTechForm({ ...techForm, department: e.target.value })}
                  placeholder="e.g. Hematology & Clinical Chemistry"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={techForm.phone}
                  onChange={(e) => setTechForm({ ...techForm, phone: e.target.value })}
                  placeholder="e.g. 01811-223344"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Technologist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Modal */}
      {doctorToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-md w-full p-6 relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete Doctor Profile?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to remove <strong className="text-slate-900">{doctorToDelete.name}</strong> (BMDC: {doctorToDelete.bmdcNo})? This will delete the doctor from active selection lists.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDoctorToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDoctor}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Technician Confirmation Modal */}
      {techToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-md w-full p-6 relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete Lab Technologist?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to remove <strong className="text-slate-900">{techToDelete.name}</strong> (Emp ID: {techToDelete.employeeId})? This will permanently delete their profile.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTechToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTech}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete Technologist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
