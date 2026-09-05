import React, { useState } from 'react';
import { TestTemplate, TestParameter, TestCategory, ResultType } from '../types';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import {
  FlaskConical,
  Search,
  Edit2,
  Plus,
  Save,
  Trash2,
  Sliders,
  DollarSign,
  Tag,
  CheckCircle2,
  X,
  FileText,
  Stethoscope,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Download,
} from 'lucide-react';

export const TemplateManager: React.FC = () => {
  const { currentUser } = useAuth();
  const [templates, setTemplates] = useState<TestTemplate[]>(dbService.getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [editingTemplate, setEditingTemplate] = useState<TestTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Deletion modal state
  const [templateToDelete, setTemplateToDelete] = useState<TestTemplate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<TestTemplate>>({});

  const refreshTemplates = () => {
    setTemplates(dbService.getTemplates());
  };

  const handleEdit = (tpl: TestTemplate) => {
    setEditingTemplate(tpl);
    setFormData(JSON.parse(JSON.stringify(tpl)));
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (tpl: TestTemplate) => {
    setTemplateToDelete(tpl);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;

    const success = dbService.deleteTemplate(templateToDelete.id, currentUser || undefined);
    if (success) {
      setActionNotice(`Template "${templateToDelete.name}" (${templateToDelete.code}) was successfully deleted.`);
      setTimeout(() => setActionNotice(null), 4000);
      refreshTemplates();
      setIsDeleteModalOpen(false);
      setTemplateToDelete(null);
      if (editingTemplate?.id === templateToDelete.id) {
        setIsModalOpen(false);
        setEditingTemplate(null);
      }
    }
  };

  const handleAddNew = () => {
    const newTpl: TestTemplate = {
      id: `tpl-custom-${Date.now()}`,
      code: `JDC-TEST-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'Hematology',
      department: 'Hematology',
      sampleType: 'Whole Blood (EDTA - 3ml)',
      fee: 500,
      deliveryTime: '2 hours',
      method: 'Automated Clinical Analyzer',
      defaultNarrative: '',
      defaultConditionDiagnosis: '',
      defaultRecommendations: '',
      parameters: [],
      active: true,
    };
    setEditingTemplate(null);
    setFormData(newTpl);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    const tplToSave: TestTemplate = {
      id: editingTemplate ? editingTemplate.id : (formData.id || `tpl-${Date.now()}`),
      code: formData.code || 'JDC-TEST',
      name: formData.name,
      category: formData.category as TestCategory,
      department: formData.department || formData.category || 'Pathology',
      sampleType: formData.sampleType || 'Whole Blood',
      fee: formData.fee || 500,
      deliveryTime: formData.deliveryTime || 'Same Day',
      method: formData.method || 'Standard Clinical Method',
      defaultNarrative: formData.defaultNarrative || '',
      defaultConditionDiagnosis: formData.defaultConditionDiagnosis || '',
      defaultRecommendations: formData.defaultRecommendations || '',
      parameters: formData.parameters || [],
      active: true,
    };

    dbService.saveTemplate(tplToSave, currentUser || undefined);
    setActionNotice(`Template "${tplToSave.name}" (${tplToSave.code}) saved successfully.`);
    setTimeout(() => setActionNotice(null), 3000);
    refreshTemplates();
    setIsModalOpen(false);
  };

  // Add parameter to template
  const handleAddParam = (type: ResultType = 'numeric') => {
    const newParam: TestParameter = {
      id: `p-${Date.now()}`,
      code: `P-${Math.floor(100 + Math.random() * 900)}`,
      name: type === 'heading' ? 'NEW SECTION HEADING' : 'New Parameter',
      unit: '',
      refRange: '',
      resultType: type,
      isHeading: type === 'heading',
      options: type === 'options' ? ['Normal', 'Abnormal'] : undefined,
    };
    setFormData((prev) => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParam],
    }));
  };

  const handleRemoveParam = (paramId: string) => {
    setFormData((prev) => ({
      ...prev,
      parameters: (prev.parameters || []).filter((p) => p.id !== paramId),
    }));
  };

  const handleUpdateParam = (index: number, field: keyof TestParameter, val: any) => {
    const updated = [...(formData.parameters || [])];
    updated[index] = { ...updated[index], [field]: val };
    if (field === 'resultType') {
      if (val === 'heading') {
        updated[index].isHeading = true;
      } else {
        updated[index].isHeading = false;
      }
    }
    setFormData({ ...formData, parameters: updated });
  };

  // Filtered Templates
  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-teal-700" />
            Diagnostic Test Catalog &amp; Template Studio
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Configure numerical &amp; text-based fields, standard normal findings, clinical impressions, recommendations, pricing, or delete obsolete templates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/janani-lims-complete.zip"
            download="janani-diagnostic-lims-complete.zip"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 transition cursor-pointer"
            title="Download complete project source archive (.zip)"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Download Project ZIP
          </a>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Investigation Template
          </button>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-teal-600 hover:text-teal-800 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests by name or code..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            'all',
            'Hematology',
            'Biochemistry',
            'Clinical Pathology',
            'Serology & Immunology',
            'Microbiology',
            'Digital Radiology',
            'Ultrasonography',
            'Cardiology',
            'Histopathology & Cytology',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Departments' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No Investigation Templates Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            No templates matched your filter or search query. You can add a new investigation template anytime.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {tpl.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">৳ {tpl.fee}</span>
                    <button
                      onClick={() => handleOpenDeleteModal(tpl)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete this report template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">{tpl.name}</h3>
                <p className="text-xs text-teal-800 font-semibold">{tpl.category}</p>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p>Specimen: <strong>{tpl.sampleType}</strong></p>
                  <p>Turnaround: {tpl.deliveryTime}</p>
                  <p className="text-slate-500 text-[11px]">
                    Fields: {tpl.parameters ? tpl.parameters.length : 0} configured • {tpl.defaultNarrative ? 'Structured Protocol' : 'Tabular Form'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {tpl.method || 'Standard Method'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDeleteModal(tpl)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title={`Delete ${tpl.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(tpl)}
                    className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Template Deletion */}
      {isDeleteModalOpen && templateToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  Delete Investigation Template?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to permanently remove this template from the active test catalog?
                </p>

                {/* Template Info Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Test Name:</span>
                    <span className="font-bold text-slate-900 text-right">{templateToDelete.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Code / Dept:</span>
                    <span className="font-mono text-slate-700">{templateToDelete.code} • {templateToDelete.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Standard Fee:</span>
                    <span className="font-bold text-teal-800">৳ {templateToDelete.fee} BDT</span>
                  </div>
                </div>

                <p className="text-[11px] text-red-600 bg-red-50/70 border border-red-200 rounded-lg p-2 leading-tight">
                  <strong>Warning:</strong> Once deleted, this test cannot be selected for new patient invoices or lab worklists. Historical finalized reports will remain archived in report history.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTemplateToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Confirm &amp; Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Test / Parameters / Text Fields */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-700" />
              {editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'Create Investigation Template'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure parameters, text-based findings, diagnostic impressions, recommendations, and sample requirements.
            </p>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Test / Investigation Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Ultrasonography of Whole Abdomen / Serum Creatinine"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Test Code</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.category || 'Hematology'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TestCategory })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Clinical Pathology">Clinical Pathology</option>
                    <option value="Serology & Immunology">Serology &amp; Immunology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Digital Radiology">Digital Radiology</option>
                    <option value="Ultrasonography">Ultrasonography</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Histopathology & Cytology">Histopathology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specimen / Sample</label>
                  <input
                    type="text"
                    value={formData.sampleType || ''}
                    onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                    placeholder="e.g. None (Imaging) / Blood"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (৳ BDT)</label>
                  <input
                    type="number"
                    value={formData.fee || 0}
                    onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={formData.deliveryTime || 'Same Day'}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g. 2 hours / Same Day"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Enhanced Text-Based Fields for Imaging, Radiology & Narrative Diagnostic Reports */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Imaging &amp; Text-Based Diagnostic Protocol Fields
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Structured Protocol / Findings Narrative Template
                  </label>
                  <textarea
                    rows={4}
                    value={formData.defaultNarrative || ''}
                    onChange={(e) => setFormData({ ...formData, defaultNarrative: e.target.value })}
                    placeholder="Enter default structured normal findings, organ descriptions, anatomical checkpoints..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Default Condition Name / Diagnostic Impression
                    </label>
                    <input
                      type="text"
                      value={formData.defaultConditionDiagnosis || ''}
                      onChange={(e) => setFormData({ ...formData, defaultConditionDiagnosis: e.target.value })}
                      placeholder="e.g. NORMAL ULTRASOUND STUDY (NID) / Normal Study"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Default Clinical Recommendations / Patient Advice
                    </label>
                    <input
                      type="text"
                      value={formData.defaultRecommendations || ''}
                      onChange={(e) => setFormData({ ...formData, defaultRecommendations: e.target.value })}
                      placeholder="e.g. Routine clinical correlation advised"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Parameters / Quantitative & Qualitative Fields List */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Configured Parameters &amp; Input Fields ({formData.parameters?.length || 0})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Supports numerical readings, text notes, paragraphs, dropdown options, and section headings.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleAddParam('numeric')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-teal-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Numeric Field
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddParam('text')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-blue-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Text Note
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddParam('options')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-purple-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Dropdown
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddParam('heading')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Section Heading
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {(formData.parameters || []).length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      No parameters configured yet. (Template will operate in full narrative protocol mode).
                    </div>
                  ) : (
                    (formData.parameters || []).map((p, idx) => {
                      const isHead = p.resultType === 'heading' || p.isHeading;
                      return (
                        <div
                          key={p.id || idx}
                          className={`p-3 rounded-xl border grid grid-cols-12 gap-2 items-center text-xs transition ${
                            isHead
                              ? 'bg-teal-50/70 border-teal-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className={isHead ? 'col-span-8' : 'col-span-4'}>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Field / Heading Name</label>
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => handleUpdateParam(idx, 'name', e.target.value)}
                              placeholder="Parameter Name"
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                            />
                          </div>

                          <div className="col-span-3">
                            <label className="block text-[10px] text-slate-400 mb-0.5">Field Type</label>
                            <select
                              value={p.resultType || (p.isHeading ? 'heading' : 'numeric')}
                              onChange={(e) => handleUpdateParam(idx, 'resultType', e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium"
                            >
                              <option value="numeric">Numeric Value</option>
                              <option value="text">Text Field</option>
                              <option value="paragraph">Multi-line Paragraph</option>
                              <option value="options">Options Dropdown</option>
                              <option value="heading">Section Header</option>
                            </select>
                          </div>

                          {!isHead && (
                            <>
                              <div className="col-span-2">
                                <label className="block text-[10px] text-slate-400 mb-0.5">Unit</label>
                                <input
                                  type="text"
                                  value={p.unit || ''}
                                  onChange={(e) => handleUpdateParam(idx, 'unit', e.target.value)}
                                  placeholder="e.g. mg/dL"
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[10px] text-slate-400 mb-0.5">Reference Range</label>
                                <input
                                  type="text"
                                  value={p.refRange || ''}
                                  onChange={(e) => handleUpdateParam(idx, 'refRange', e.target.value)}
                                  placeholder="e.g. 70 - 100"
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs"
                                />
                              </div>
                            </>
                          )}

                          <div className="col-span-1 text-right pt-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveParam(p.id)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete field"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200">
                {editingTemplate ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenDeleteModal(editingTemplate);
                    }}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Template
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Test Configuration
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
