import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { PatientRegistration } from './components/PatientRegistration';
import { ReportHistory } from './components/ReportHistory';
import { ReportEditor } from './components/ReportEditor';
import { ReportPrintView } from './components/ReportPrintView';
import { StaffManagement } from './components/StaffManagement';
import { TemplateManager } from './components/TemplateManager';
import { BackupRestore } from './components/BackupRestore';
import { PublicReportVerificationModal } from './components/PublicReportVerificationModal';
import { PublicReportVerificationPortal } from './components/PublicReportVerificationPortal';
import { DailySummaryModal } from './components/DailySummaryModal';
import { DesktopAppModal } from './components/DesktopAppModal';
import { JananiLogo } from './components/JananiLogo';
import { JANANI_INFO } from './constants/branding';
import { dbService } from './services/db';
import { Report, Order } from './types';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  UserPlus,
  History,
  Stethoscope,
  FlaskConical,
  Sliders,
  Database,
  LogOut,
  Menu,
  X,
  FileSpreadsheet,
  QrCode,
  Bell,
  Settings,
  User,
  ShieldCheck,
  ChevronDown,
  Activity,
  Sparkles,
  Download,
  Monitor,
  Laptop,
} from 'lucide-react';
import OfficialLogo from './components/OfficialLogo';

const MainApp: React.FC = () => {
  const { currentUser, logout, switchRole } = useAuth();
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);

  // Handle active public QR scan verification from query string
  const [urlVerificationQuery, setUrlVerificationQuery] = useState<{
    reportNo: string;
    uhid?: string;
    name?: string;
    test?: string;
    doctor?: string;
    status?: string;
    date?: string;
  } | null>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const verifyId = params.get('verify') || params.get('rep') || params.get('reportNo');
      if (verifyId) {
        return {
          reportNo: verifyId,
          uhid: params.get('uhid') || undefined,
          name: params.get('name') || params.get('pt') || undefined,
          test: params.get('test') || undefined,
          doctor: params.get('doctor') || undefined,
          status: params.get('status') || params.get('auth') || undefined,
          date: params.get('date') || params.get('dt') || undefined,
        };
      }
    }
    return null;
  });

  // Navigation View State
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'register' | 'history' | 'editor' | 'preview' | 'staff' | 'templates' | 'backup'
  >('dashboard');

  // Active Report for Editor or Print Preview
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  // Verification Modal State
  const [verifyReportModal, setVerifyReportModal] = useState<Report | null>(null);

  // Daily Summary Modal State
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);

  // History Filter State
  const [historyFilter, setHistoryFilter] = useState<any>(null);

  // Mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User Profile Dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Total reports for badge
  const reports = dbService.getReports();
  const totalCount = reports.length;

  // If a public verification URL was accessed (e.g. from scanning a QR code with a smartphone)
  if (urlVerificationQuery) {
    return (
      <PublicReportVerificationPortal
        reportNoOrId={urlVerificationQuery.reportNo}
        urlParams={{
          uhid: urlVerificationQuery.uhid,
          patientName: urlVerificationQuery.name,
          testName: urlVerificationQuery.test,
          doctor: urlVerificationQuery.doctor,
          status: urlVerificationQuery.status,
          date: urlVerificationQuery.date,
        }}
        onStaffLoginClick={() => {
          setUrlVerificationQuery(null);
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }}
      />
    );
  }

  // If user is not logged in, render the login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  const handleNavigate = (view: any, payload?: any) => {
    if (view === 'preview' && payload) {
      setActiveReport(payload);
      setCurrentView('preview');
    } else if (view === 'editor' && payload) {
      setActiveReport(payload);
      setCurrentView('editor');
    } else if (view === 'history') {
      setHistoryFilter(payload || null);
      setCurrentView('history');
    } else {
      setCurrentView(view);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSelectReportFromHistory = (report: Report, mode: 'preview' | 'edit') => {
    setActiveReport(report);
    if (mode === 'preview') {
      setCurrentView('preview');
    } else {
      setCurrentView('editor');
    }
  };

  const handleOrderCreated = (order: Order, createdReports: Report[]) => {
    if (createdReports.length > 0) {
      setActiveReport(createdReports[0]);
      setCurrentView('editor');
    }
  };

  return (
    <div className="min-h-screen bg-[#edf0f7] p-2 sm:p-4 lg:p-6 text-slate-900 selection:bg-teal-600 selection:text-white font-sans flex flex-col items-center">
      {/* Master Main Application Container Frame (Finnova-style rounded card structure) */}
      <div className="w-full max-w-[1520px] bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_70px_-15px_rgba(15,23,42,0.09)] border border-slate-200/90 flex flex-col overflow-hidden min-h-[92vh]">
        
        {/* Top Navigation Bar with Capsule Menu */}
        <header className="no-print border-b border-slate-100 px-5 sm:px-8 py-4 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-md sticky top-0 z-40">
          
          {/* Left: Brand Identity & Active Badge */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavigate('dashboard')}
              className="cursor-pointer flex items-center gap-3 group"
            >

              <OfficialLogo/>
              {/* <JananiLogo size="md" /> */}
            </div>

            {/* Total Count Pill Badge (Reference Finnova badge: e.g. "80") */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200/80 rounded-full text-xs font-mono font-bold text-slate-700 shadow-xs" title="Total Clinical Records in Database">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{totalCount}</span>
            </div>
          </div>

          {/* Center: Dark Rounded Capsule Navigation Dock (Inspired by reference) */}
          <nav className="hidden lg:flex items-center bg-[#111322] border border-slate-800/80 p-1.5 rounded-full shadow-lg shadow-slate-950/10">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer tactile-btn ${
                currentView === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-300 inline-block" />
              Overview
            </button>

            <button
              onClick={() => handleNavigate('register')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer tactile-btn ${
                currentView === 'register'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              New Intake
            </button>

            <button
              onClick={() => handleNavigate('history')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer tactile-btn ${
                currentView === 'history' || currentView === 'preview' || currentView === 'editor'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Reports &amp; Invoices
            </button>

            <button
              onClick={() => handleNavigate('staff')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer tactile-btn ${
                currentView === 'staff'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Doctors &amp; Staff
            </button>

            <button
              onClick={() => handleNavigate('templates')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer tactile-btn ${
                currentView === 'templates'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Test Catalog
            </button>

            <button
              onClick={() => handleNavigate('backup')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer tactile-btn ${
                currentView === 'backup'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Backup &amp; Logs
            </button>
          </nav>

          {/* Right: Modern Action Icons & User Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Desktop Software Install & Setup Button */}
            <button
              onClick={() => setIsDesktopModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-bold transition cursor-pointer tactile-btn shadow-2xs"
              title="Download & Install Desktop Software"
            >
              <Monitor className="w-4 h-4 text-teal-700" />
              <span className="hidden sm:inline">Desktop App</span>
            </button>

            {/* Daily Log Action Icon */}
            <button
              onClick={() => setIsDailySummaryOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition cursor-pointer tactile-btn hidden sm:flex items-center justify-center border border-slate-200/60"
              title="Daily Log Summary"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
            </button>

            {/* Public QR Verification / Scanner Modal Action */}
            <button
              onClick={() => setVerifyReportModal(reports[0] || null)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition cursor-pointer tactile-btn hidden sm:flex items-center justify-center border border-slate-200/60"
              title="Verify Report QR"
            >
              <QrCode className="w-4 h-4 text-slate-700" />
            </button>

            {/* User Profile & Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 pr-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 rounded-full transition cursor-pointer tactile-btn"
              >
                <div className="text-right hidden md:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white">
                  {currentUser.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="border-b border-slate-100 pb-2.5">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser.email || 'staff@janani.com'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold text-[10px] uppercase border border-teal-100">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Fast Role Switcher */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Switch Active Role
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <button
                        onClick={() => { switchRole('admin'); setIsUserMenuOpen(false); }}
                        className={`p-1.5 rounded-lg text-left font-bold transition cursor-pointer ${
                          currentUser.role === 'admin' ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => { switchRole('pathologist'); setIsUserMenuOpen(false); }}
                        className={`p-1.5 rounded-lg text-left font-bold transition cursor-pointer ${
                          currentUser.role === 'pathologist' ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        Pathologist
                      </button>
                      <button
                        onClick={() => { switchRole('doctor'); setIsUserMenuOpen(false); }}
                        className={`p-1.5 rounded-lg text-left font-bold transition cursor-pointer ${
                          currentUser.role === 'doctor' ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        Doctor
                      </button>
                      <button
                        onClick={() => { switchRole('lab_technician'); setIsUserMenuOpen(false); }}
                        className={`p-1.5 rounded-lg text-left font-bold transition cursor-pointer ${
                          currentUser.role === 'lab_technician' ? 'bg-teal-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        Technician
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-2">
                    <a
                      href="/janani-lims-complete.zip"
                      download="janani-lims-complete.zip"
                      className="w-full text-xs text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100/90 py-1.5 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition border border-teal-200/70 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-700" />
                      <span>Download Project ZIP</span>
                    </a>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => { handleNavigate('backup'); setIsUserMenuOpen(false); }}
                        className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </button>
                      <button
                        onClick={logout}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-5 py-4 space-y-1.5"
          >
            <button
              onClick={() => handleNavigate('dashboard')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-700" />
              Overview Dashboard
            </button>
            <button
              onClick={() => handleNavigate('register')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
            >
              <UserPlus className="w-4 h-4 text-teal-700" />
              New Patient Registration
            </button>
            <button
              onClick={() => handleNavigate('history')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
            >
              <History className="w-4 h-4 text-teal-700" />
              Reports &amp; Invoices Archive
            </button>
            <button
              onClick={() => handleNavigate('staff')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
            >
              <Stethoscope className="w-4 h-4 text-teal-700" />
              Doctors &amp; Staff Directory
            </button>
            <button
              onClick={() => handleNavigate('templates')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
            >
              <Sliders className="w-4 h-4 text-teal-700" />
              Test Catalog &amp; Intervals
            </button>
            <button
              onClick={() => handleNavigate('backup')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2.5"
            >
              <Database className="w-4 h-4 text-teal-700" />
              System Backup &amp; ZIP
            </button>
          </motion.div>
        )}

        {/* Main Content Workspace Container */}
        <main className="flex-1 w-full p-4 sm:p-7 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (activeReport ? `-${activeReport.id}` : '')}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}

              {currentView === 'register' && (
                <PatientRegistration onOrderCreated={handleOrderCreated} />
              )}

              {currentView === 'history' && (
                <ReportHistory
                  onSelectReport={handleSelectReportFromHistory}
                  initialFilter={historyFilter}
                />
              )}

              {currentView === 'editor' && activeReport && (
                <ReportEditor
                  report={activeReport}
                  onSaveSuccess={(updated) => setActiveReport(updated)}
                  onOpenPrintPreview={(rep) => {
                    setActiveReport(rep);
                    setCurrentView('preview');
                  }}
                  onCancel={() => setCurrentView('history')}
                />
              )}

              {currentView === 'preview' && activeReport && (
                <ReportPrintView
                  report={activeReport}
                  onClose={() => setCurrentView('history')}
                  onOpenVerifyModal={(rep) => setVerifyReportModal(rep)}
                  onUpdateReport={(rep) => setActiveReport(rep)}
                />
              )}

              {currentView === 'staff' && <StaffManagement />}

              {currentView === 'templates' && <TemplateManager />}

              {currentView === 'backup' && <BackupRestore />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Sleek Minimal Footer */}
        <footer className="no-print border-t border-slate-100 py-4 px-6 sm:px-8 text-xs text-slate-500 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-medium">
              © {new Date().getFullYear()} {JANANI_INFO.fullName}. {JANANI_INFO.address.line1}, {JANANI_INFO.address.city}, Bangladesh.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Hotline: {JANANI_INFO.contacts.phone} • License: {JANANI_INFO.licenseNo}
            </p>
          </div>
        </footer>
      </div>

      {/* Public QR Verification Modal */}
      {verifyReportModal && (
        <PublicReportVerificationModal
          report={verifyReportModal}
          onClose={() => setVerifyReportModal(null)}
        />
      )}

      {/* Daily Summary Modal */}
      {isDailySummaryOpen && (
        <DailySummaryModal
          reports={reports}
          selectedDate={new Date().toISOString().slice(0, 10)}
          onClose={() => setIsDailySummaryOpen(false)}
        />
      )}

      {/* Desktop Software & Installation Center Modal */}
      <DesktopAppModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
