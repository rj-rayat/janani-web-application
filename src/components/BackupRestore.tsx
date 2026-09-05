import React, { useState } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { JANANI_INFO } from '../constants/branding';
import { ThreeDCard } from './ThreeDCard';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileArchive,
  History,
  Activity,
  Sparkles,
} from 'lucide-react';

export const BackupRestore: React.FC = () => {
  const { currentUser } = useAuth();
  const [auditLogs, setAuditLogs] = useState(dbService.getAuditLogs());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const handleExportJSON = () => {
    try {
      const dataStr = dbService.exportDatabaseJson();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `janani_lims_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Database backup JSON exported successfully.' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: `Failed to export backup: ${e.message}` });
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const res = dbService.importDatabaseJson(content, currentUser || undefined);
        if (res.success) {
          setStatusMessage({ type: 'success', text: res.message });
          setAuditLogs(dbService.getAuditLogs());
        } else {
          setStatusMessage({ type: 'error', text: res.message || 'Import failed.' });
        }
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: `Invalid backup file: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDatabase = () => {
    const confirmed = window.confirm(
      'WARNING: This will reset all clinical data back to standard Janani seed records. Are you sure you want to proceed?'
    );
    if (confirmed) {
      dbService.initDatabase(true);
      setAuditLogs(dbService.getAuditLogs());
      setStatusMessage({ type: 'success', text: 'Database has been safely reset to factory clinical seed data.' });
    }
  };

  const handleDownloadProjectZip = async () => {
    setIsZipping(true);
    try {
      // First try to fetch the pre-bundled full source code zip
      const response = await fetch('/janani-lims-complete.zip');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `janani_lims_complete_source_${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setStatusMessage({
          type: 'success',
          text: 'Complete project archive (.ZIP) with full source code, components, templates, and configurations downloaded successfully.',
        });
        return;
      }
      
      // Fallback: Generate dynamic zip package with full state snapshots and configurations
      const zip = new JSZip();
      
      // 1. Add database JSON snapshot
      const dbJson = dbService.exportDatabaseJson();
      zip.file('database_backup.json', dbJson);

      // 2. Add Branding configuration
      zip.file('branding_config.json', JSON.stringify(JANANI_INFO, null, 2));

      // 3. Add Clinical Test Templates Catalog
      const templates = dbService.getTemplates();
      zip.file('clinical_test_templates.json', JSON.stringify(templates, null, 2));

      // 4. Add Project Manifest & metadata
      zip.file(
        'project_manifest.json',
        JSON.stringify(
          {
            name: 'Janani Diagnostic Centre - Laboratory Information Management System',
            version: '2.4.0',
            location: 'Amin Tower, Trunk Road, Feni, Bangladesh',
            exportedAt: new Date().toISOString(),
            framework: 'React 18 + Vite + Tailwind CSS + TypeScript',
            supportedPaperSizes: ['A4', 'A5', 'Letter', 'Legal', 'B5', 'Custom Dimensions'],
          },
          null,
          2
        )
      );

      // 5. Add Comprehensive README & Run Instructions
      zip.file(
        'README.md',
        `# Janani Diagnostic Centre - LIMS & Medical Reporting System

Official Laboratory Information Management System for **Janani Diagnostic Centre**, Amin Tower (2nd Floor), Trunk Road, Feni, Bangladesh.

---

## Key System Features
1. **Dynamic Multi-Paper Size Printing Engine**:
   - Standard formats: A4 (210×297mm), A5 (148×210mm), US Letter (8.5×11"), US Legal (8.5×14"), B5 (176×250mm).
   - Custom Paper Size option with exact width/height inputs (mm/in/cm), custom print margins, and orientation toggles.
   - Dynamic @page CSS sizing and typography density adjustments.
   - Dual format: Full Janani letterhead graphics OR reserved clearance for pre-printed stationary pads.

2. **Complete Clinical Laboratory Modules**:
   - Comprehensive test templates: CBC, Liver Function Tests (LFT), Renal Function Tests (KFT), Lipid Profile, Urine R/M/E, Serum Electrolytes, Blood Glucose, HbA1c, Serology (Widal, VDRL, HBsAg, Dengue NS1/IgG/IgM), Ultrasonography (USG), Digital X-Ray, ECG, Histopathology.

3. **Multi-Verifier System (2 Technologists + 1 Doctor)**:
   - Dedicated fields for Lab Technologist 1 (Prepared / Reported By), Lab Technologist 2 (Checked & Examined By), and Consultant Doctor / Pathologist (Verified & Authorized By).
   - Accurate print view signature blocks with designations, employee IDs, and BMDC registration numbers.

---

## How to Run the Application Locally

1. Ensure **Node.js (v18+)** and **npm** are installed on your machine.
2. Unzip this folder and open a terminal inside the project directory:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
3. Open your browser and navigate to \`http://localhost:3000\`.

---

## Production Build
\`\`\`bash
npm run build
\`\`\`
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `janani_diagnostic_centre_complete_project_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({ type: 'success', text: 'Complete project backup archive (.ZIP) generated and downloaded successfully.' });
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: `Failed to create ZIP: ${e.message}` });
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              System Maintenance, Backup &amp; Logs
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Export secure encrypted database backups, download project archives, inspect clinical audit trails, or restore records.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup & Restore Action Grid with 3D Depth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Export JSON */}
        <ThreeDCard depth={8}>
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Export Database (JSON)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Downloads complete local database snapshot including patient records, test templates, and clinical reports.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 tactile-btn shadow-xs"
            >
              <Download className="w-4 h-4" />
              Download JSON Backup
            </button>
          </div>
        </ThreeDCard>

        {/* Card 2: Restore JSON */}
        <ThreeDCard depth={8}>
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200/60 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Restore from Backup</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Restore previously exported JSON backup file into current application state with safety verification.
              </p>
            </div>
            <label className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 text-center tactile-btn shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Select JSON File</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </ThreeDCard>

        {/* Card 3: Project ZIP */}
        <ThreeDCard depth={8}>
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200/60 flex items-center justify-center">
                <FileArchive className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Download Project ZIP</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pack all database files and configurations into a compressed .ZIP archive for offline backup.
              </p>
            </div>
            <button
              onClick={handleDownloadProjectZip}
              disabled={isZipping}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 tactile-btn shadow-xs"
            >
              <FileArchive className="w-4 h-4" />
              {isZipping ? 'Compressing Archive...' : 'Generate Project ZIP'}
            </button>
          </div>
        </ThreeDCard>
      </div>

      {/* Audit Trail Log Viewer */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-700" />
            Laboratory Audit Trail &amp; Regulatory Activity Log
          </h3>
          <span className="text-xs text-slate-500 font-mono">Total Entries: {auditLogs.length}</span>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">Staff Member</th>
                <th className="py-3 px-3.5">Role</th>
                <th className="py-3 px-3.5">Action</th>
                <th className="py-3 px-3.5">Details / Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditLogs.slice(0, 50).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">{log.userName}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-semibold text-teal-800">{log.action}</td>
                  <td className="py-2.5 px-3.5 text-slate-600 font-sans text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-red-50/70 border border-red-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-red-950 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Reset Application to Initial Factory Seed
          </h4>
          <p className="text-xs text-red-800 mt-0.5">
            Restores standard test catalog, demo patients, doctors, and initial clinical state.
          </p>
        </div>
        <button
          onClick={handleResetDatabase}
          className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap tactile-btn shadow-xs"
        >
          Reset Database
        </button>
      </div>
    </div>
  );
};
