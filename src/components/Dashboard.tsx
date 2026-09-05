import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import { Report, Order } from '../types';
import { toLocalDateKey } from '../utils/localDate';
import { useAuth } from '../context/AuthContext';
import { DailySummaryModal } from './DailySummaryModal';
import { ThreeDCard } from './ThreeDCard';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  FlaskConical,
  FileCheck2,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  Stethoscope,
  Plus,
  Search,
  Calendar,
  Building,
  FileSpreadsheet,
  Layers,
  Receipt,
  Edit3,
  TrendingUp,
  CreditCard,
  FileText,
  Activity,
  Sparkles,
  Zap,
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  Lock,
  ArrowRight,
  CheckCircle2,
  Share2,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, switchRole } = useAuth();
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);

  // Data queries
  const reports = dbService.getReports();
  const orders = dbService.getOrders();
  const templates = dbService.getTemplates();
  const doctors = dbService.getDoctors();

  const [todayStr, setTodayStr] = useState(() => toLocalDateKey(new Date()));

  // Roll the dashboard over automatically at midnight (and after returning to the tab).
  useEffect(() => {
    const updateCurrentDay = () => setTodayStr(toLocalDateKey(new Date()));
    const intervalId = window.setInterval(updateCurrentDay, 60_000);

    window.addEventListener('focus', updateCurrentDay);
    document.addEventListener('visibilitychange', updateCurrentDay);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', updateCurrentDay);
      document.removeEventListener('visibilitychange', updateCurrentDay);
    };
  }, []);

  // Filter and tabs state in dark workspace
  const [workspaceTab, setWorkspaceTab] = useState<'all' | 'draft' | 'reviewed' | 'authorized' | 'verified'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  
  // Dashboard filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Computed stats
  const todayReports = reports.filter(
    (r) => toLocalDateKey(r.reportedAt || r.specimenReceivedAt || '') === todayStr
  );
  const todayOrders = orders.filter((o) => toLocalDateKey(o.createdAt || '') === todayStr);
  const todayPatientCount = new Set(todayReports.map((r) => r.uhid)).size;

  const pendingTechReview = todayReports.filter((r) => r.status === 'draft');
  const pendingDoctorAuth = todayReports.filter((r) => r.status === 'reviewed_by_tech');
  const verifiedFinal = todayReports.filter(
    (r) => r.status === 'verified_final' || r.status === 'authorized_by_doctor'
  );

  const criticalReports = todayReports.filter((r) =>
    Object.values(r.results).some((res) => res.abnormalFlag === 'CRITICAL')
  );

  // Today financial computation
  const todayTotalRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const todayPaidRevenue = todayOrders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
  const todayDueRevenue = todayOrders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);

  const completedTurnaroundHours = todayReports.flatMap((report) => {
    const completedAt = report.verifiedAt || report.authorizedAt;
    if (!completedAt || !report.specimenReceivedAt) return [];

    const durationMs = new Date(completedAt).getTime() - new Date(report.specimenReceivedAt).getTime();
    return durationMs >= 0 ? [durationMs / 3_600_000] : [];
  });
  const averageTurnaroundHours = completedTurnaroundHours.length
    ? completedTurnaroundHours.reduce((sum, hours) => sum + hours, 0) / completedTurnaroundHours.length
    : null;

  // Selected report for the interactive workspace panel
  const selectedReport = todayReports.find((r) => r.id === selectedReportId) || todayReports[0] || null;
  const activeSelectedReportId = selectedReport?.id || '';

  // The dashboard worklist is intentionally limited to the current local day.
  const workspaceFilteredReports = todayReports.filter((rep) => {
    if (workspaceTab === 'draft' && rep.status !== 'draft') return false;
    if (workspaceTab === 'reviewed' && rep.status !== 'reviewed_by_tech') return false;
    if (workspaceTab === 'authorized' && rep.status !== 'authorized_by_doctor') return false;
    if (workspaceTab === 'verified' && rep.status !== 'verified_final') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rep.patientName.toLowerCase().includes(q);
      const matchNo = rep.reportNo.toLowerCase().includes(q);
      const matchUhid = rep.uhid.toLowerCase().includes(q);
      const matchTest = rep.testName.toLowerCase().includes(q);
      if (!matchName && !matchNo && !matchUhid && !matchTest) return false;
    }

    if (departmentFilter !== 'all' && rep.category !== departmentFilter) return false;
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Sub-Header Bar (Matching the Finnova Invoices Title & Action Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition cursor-pointer tactile-btn shrink-0"
            title="Refresh Dashboard"
          >
            <Activity className="w-5 h-5 text-teal-700" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Diagnostic Reports &amp; Clinical Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage and track all diagnostic investigations, test parameters, and patient orders in one place.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('history', { filterMode: 'all' })}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition cursor-pointer tactile-btn"
            title="Advanced Search & Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-teal-700/20 transition cursor-pointer tactile-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create Patient Intake</span>
          </button>
        </div>
      </div>

      {/* Row of 4 Stat Cards (Finnova Top Cards Design System Recreated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Critical & Panic Flags (Ref: Overdue Card) */}
        <div 
          onClick={() => onNavigate('history', { statusFilter: 'critical', filterMode: 'all' })}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-[210px] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Critical Panic Values</span>
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight block">
              {criticalReports.length > 0 ? `${criticalReports.length} Critical` : '0 Normal'}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-rose-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {criticalReports.length > 0
                  ? 'Requires attention today'
                  : todayReports.length > 0
                    ? 'All parameters stable today'
                    : 'No reports recorded today'}
              </span>
            </div>
          </div>

          {/* Mini Clinical Station Graphic */}
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-[11px] leading-tight">
              <strong className="text-slate-800 font-bold block">Central Pathology</strong>
              <span className="text-slate-500">Feni Automated Lab</span>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Patient Intake & Bar Chart (Ref: Due Next Month Card) */}
        <div 
          onClick={() => onNavigate('history', { filterMode: 'today', statusFilter: 'all' })}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-[210px] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Patient Intake</span>
            <div className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight block">
              {todayPatientCount} Patients
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-teal-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Current-day registrations only</span>
            </div>
          </div>

          {/* Mini Bar Chart (Recreating Reference Finnova Bar Chart) */}
          <div className="flex items-end justify-between gap-1.5 h-10 px-1">
            <div className="w-full bg-teal-100 rounded-t-sm h-[40%]" />
            <div className="w-full bg-teal-200 rounded-t-sm h-[60%]" />
            <div className="w-full bg-teal-300 rounded-t-sm h-[50%]" />
            <div className="w-full bg-teal-400 rounded-t-sm h-[75%]" />
            <div className="w-full bg-teal-500 rounded-t-sm h-[90%]" />
            <div className="w-full bg-teal-600 rounded-t-sm h-[100%]" />
          </div>
        </div>

        {/* Card 3: Average Turnaround Time & Sparkline (Ref: Average Time Card) */}
        <div 
          onClick={() => onNavigate('history', { statusFilter: 'all', filterMode: 'all' })}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between h-[210px] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Average Turnaround Time</span>
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight block">
              {averageTurnaroundHours === null ? '—' : `${averageTurnaroundHours.toFixed(1)} Hours`}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {completedTurnaroundHours.length > 0
                  ? `${completedTurnaroundHours.length} completed today`
                  : 'No completed reports today'}
              </span>
            </div>
          </div>

          {/* Smooth Curve SVG Sparkline with Glowing Dots */}
          <div className="relative h-10 flex items-center">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30" fill="none">
              <path
                d="M 0,25 Q 20,28 35,18 T 70,12 T 100,5"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="25" r="2.5" fill="#0d9488" />
              <circle cx="35" cy="18" r="2.5" fill="#0d9488" />
              <circle cx="70" cy="12" r="2.5" fill="#0d9488" />
              <circle cx="100" cy="5" r="3.5" fill="#0d9488" className="animate-ping" />
              <circle cx="100" cy="5" r="3" fill="#0f766e" />
            </svg>
          </div>
        </div>

        {/* Card 4: Daily Diagnostic Revenue & Payouts (Ref: Instant Payout Card) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[210px] relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Collections</span>
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight block">
              ৳ {todayTotalRevenue.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-slate-500">
              <span>Paid: ৳ {todayPaidRevenue.toLocaleString()}</span>
              <span>•</span>
              <span className="text-amber-600">Due: ৳ {todayDueRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Channels and Action Button */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-mono font-bold text-slate-700">Cash</span>
              <span className="px-2 py-0.5 rounded-lg bg-teal-600 text-[10px] font-mono font-bold text-white shadow-xs">bKash</span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-mono font-bold text-slate-700">Nagad</span>
            </div>
            <button
              onClick={() => setIsDailySummaryOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs whitespace-nowrap"
            >
              Daily Log
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Bar (Matching the Finnova Pill Filter Bar) */}
      <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Active filters pill badge */}
          <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <span>Active filters</span>
            <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 font-mono text-[10px] font-black flex items-center justify-center">
              2
            </span>
          </div>

          {/* Department Filter Pill */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold px-3.5 py-1.5 pr-8 rounded-full border border-slate-200/80 focus:outline-none transition cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="Hematology">Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Clinical Pathology">Clinical Pathology</option>
              <option value="Digital Radiology">Digital Radiology</option>
              <option value="Ultrasonography">Ultrasonography</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Serology & Immunology">Serology &amp; Immunology</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter Pill */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold px-3.5 py-1.5 pr-8 rounded-full border border-slate-200/80 focus:outline-none transition cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="verified_final">Verified Final</option>
              <option value="authorized_by_doctor">Doctor Authorized</option>
              <option value="reviewed_by_tech">Tech Reviewed</option>
              <option value="draft">Draft / In Progress</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Selector Pill */}
          <div className="flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-200/80">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter report #, UHID, patient..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* GIANT FUTURISTIC DARK WORKSPACE PANEL (Exact Finnova Bottom Half Recreation!) */}
      <div className="bg-[#101322] rounded-[32px] sm:rounded-[36px] p-5 sm:p-7 border border-slate-800/90 shadow-2xl text-white space-y-6">
        
        {/* Workspace Top Header Bar with Tab Switches */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-400" />
              Active Diagnostic Worklist &amp; Reports
            </h2>
          </div>

          {/* Tab Capsules (Matching Finnova "All Invoices, Draft, Unpaid" Pills) */}
          <div className="flex items-center gap-1.5 bg-[#181b2e] p-1.5 rounded-full border border-slate-800/80 overflow-x-auto">
            <button
              onClick={() => setWorkspaceTab('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                workspaceTab === 'all'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today's Reports ({todayReports.length})
            </button>

            <button
              onClick={() => setWorkspaceTab('draft')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                workspaceTab === 'draft'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Draft</span>
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center">
                {pendingTechReview.length}
              </span>
            </button>

            <button
              onClick={() => setWorkspaceTab('reviewed')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                workspaceTab === 'reviewed'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Tech Reviewed</span>
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center">
                {pendingDoctorAuth.length}
              </span>
            </button>

            <button
              onClick={() => setWorkspaceTab('verified')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                workspaceTab === 'verified'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Verified Final</span>
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center">
                {verifiedFinal.length}
              </span>
            </button>
          </div>
        </div>

        {/* Split Screen: Left List (Selectable) + Right Detailed Workspace Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: List of Diagnostic Reports with Active Highlight Row */}
          <div className="lg:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {workspaceFilteredReports.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No reports recorded for today.
              </div>
            ) : (
              workspaceFilteredReports.map((rep) => {
                const isSelected = rep.id === activeSelectedReportId;
                const hasCritical = Object.values(rep.results).some((r: any) => r?.abnormalFlag === 'CRITICAL');

                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-3.5 rounded-2xl transition cursor-pointer flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'bg-[#3b3a98] border-[#5856d6] text-white shadow-lg shadow-[#3b3a98]/30'
                        : 'bg-[#181b2e]/70 hover:bg-[#181b2e] border-slate-800/60 text-slate-300'
                    }`}
                  >
                    {/* Left: Avatar + Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 ring-2 ring-white/10">
                        {rep.patientName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs tracking-tight">#{rep.reportNo}</span>
                          <span className="text-[10px] opacity-75">
                            {new Date(rep.reportedAt || rep.specimenReceivedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <strong className="text-xs font-bold text-white block truncate">{rep.patientName}</strong>
                        <span className="text-[11px] opacity-80 truncate block">{rep.testName}</span>
                      </div>
                    </div>

                    {/* Right: Status Pill & Action */}
                    <div className="text-right shrink-0 space-y-1">
                      <span className="text-xs font-mono font-bold block text-teal-300">
                        ৳ {templates.find((t) => t.id === rep.testTemplateId)?.fee || 1200}
                      </span>
                      {hasCritical ? (
                        <span className="inline-block bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[9px] font-bold px-2 py-0.5 rounded-full">
                          CRITICAL
                        </span>
                      ) : (
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {rep.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Workspace Panel (Matching Finnova Details Card) */}
          <div className="lg:col-span-7">
            {selectedReport ? (
              <div className="bg-[#1a1e36] border border-slate-800/90 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                
                {/* Header: Report ID & Patient Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        Diagnostic Report Details
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                        {selectedReport.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black font-mono text-white tracking-tight">
                      #{selectedReport.reportNo}
                    </h3>
                    <p className="text-xs text-teal-300 font-medium">{selectedReport.category}</p>
                  </div>

                  {/* Patient Card Box */}
                  <div className="bg-[#24294a] border border-slate-700/80 p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      {selectedReport.patientName.charAt(0)}
                    </div>
                    <div className="text-left leading-tight">
                      <strong className="text-xs font-bold text-white block">{selectedReport.patientName}</strong>
                      <span className="text-[11px] text-slate-300 block font-mono mt-0.5">{selectedReport.uhid}</span>
                      <span className="text-[10px] text-slate-400">
                        {selectedReport.patientAge} {selectedReport.patientAgeUnit}, {selectedReport.patientGender}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Parameter / Investigation Metric Cards (Matching Finnova middle cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Parameter Card 1 */}
                  <div className="bg-[#24294a]/80 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-teal-400">
                      <span className="text-xs font-mono font-bold">
                        ৳ {templates.find((t) => t.id === selectedReport.testTemplateId)?.fee || 1200}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <strong className="text-xs font-bold text-white block truncate">{selectedReport.testName}</strong>
                    <span className="text-[10px] text-slate-400 block">Primary Investigation</span>
                  </div>

                  {/* Parameter Card 2 */}
                  <div className="bg-[#24294a]/80 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-teal-400">
                      <span className="text-xs font-mono font-bold">Parameters</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <strong className="text-xs font-bold text-white block">
                      {Object.keys(selectedReport.results || {}).length} Values
                    </strong>
                    <span className="text-[10px] text-slate-400 block">Laboratory Analytics</span>
                  </div>

                  {/* Parameter Card 3: Referring Doctor */}
                  <div className="bg-[#24294a]/80 border border-slate-700/60 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-teal-400">
                      <span className="text-xs font-bold">Referring Source</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <strong className="text-xs font-bold text-white block truncate">
                      {selectedReport.referringDoctorName || 'Self / Direct'}
                    </strong>
                    <span className="text-[10px] text-slate-400 block truncate">Clinical Consultant</span>
                  </div>
                </div>

                {/* Bottom Financial Totals & Action Controls */}
                <div className="bg-[#121526] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sub Total</span>
                      <strong className="text-sm text-white">
                        ৳ {templates.find((t) => t.id === selectedReport.testTemplateId)?.fee || 1200}
                      </strong>
                    </div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Due</span>
                      <strong className="text-sm text-emerald-400">৳ 0.00</strong>
                    </div>
                  </div>

                  {/* Action Buttons: Print A4 / Review */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onNavigate('editor', selectedReport)}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Review / Edit</span>
                    </button>

                    <button
                      onClick={() => onNavigate('preview', selectedReport)}
                      className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-white/10 tactile-btn"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-700" />
                      <span>Print A4 Report</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1a1e36] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
                Select a diagnostic report from the list to preview details and print.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ThreeDCard depth={6} onClick={() => onNavigate('register')}>
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Patient Intake</h3>
                <p className="text-[11px] text-slate-500">Register &amp; Book Tests</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition" />
          </div>
        </ThreeDCard>

        <ThreeDCard depth={6} onClick={() => onNavigate('history', { filterMode: 'all' })}>
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Search Archive</h3>
                <p className="text-[11px] text-slate-500">Filter by Date &amp; Dept</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition" />
          </div>
        </ThreeDCard>

        <ThreeDCard depth={6} onClick={() => onNavigate('staff')}>
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Staff Directory</h3>
                <p className="text-[11px] text-slate-500">Doctors &amp; Technicians</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition" />
          </div>
        </ThreeDCard>

        <ThreeDCard depth={6} onClick={() => onNavigate('templates')}>
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Test Catalog</h3>
                <p className="text-[11px] text-slate-500">Reference Intervals</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition" />
          </div>
        </ThreeDCard>
      </div>

      {/* Daily Summary Modal */}
      {isDailySummaryOpen && (
        <DailySummaryModal
          reports={reports}
          selectedDate={todayStr}
          onClose={() => setIsDailySummaryOpen(false)}
        />
      )}
    </div>
  );
};
