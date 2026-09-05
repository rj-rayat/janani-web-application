import React, { useEffect, useMemo, useState } from 'react';
import { Report } from '../types';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { DailySummaryModal } from './DailySummaryModal';
import { ThreeDCard } from './ThreeDCard';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Calendar,
  Filter,
  Eye,
  Printer,
  Trash2,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  User,
  Hash,
  FileSpreadsheet,
  X,
  Activity,
  Edit3,
  Sparkles,
} from 'lucide-react';

interface ReportHistoryProps {
  onSelectReport: (report: Report, mode: 'preview' | 'edit') => void;
  initialFilter?: {
    filterMode?: 'today' | 'date' | 'month' | 'year' | 'range' | 'all';
    statusFilter?: string;
    categoryFilter?: string;
    doctorFilter?: string;
    searchQuery?: string;
  } | null;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({ onSelectReport, initialFilter }) => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>(dbService.getReports());
  const doctors = dbService.getDoctors();

  // Daily Summary Modal State
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);

  // Delete Report State
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'today' | 'date' | 'month' | 'year' | 'range' | 'all'>('today');

  // Today's YYYY-MM-DD string
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentMonthStr = todayStr.slice(0, 7); // e.g. 2026-08
  const currentYearStr = todayStr.slice(0, 4); // e.g. 2026

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Apply initial filter if passed from Dashboard quick links
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.filterMode) setFilterMode(initialFilter.filterMode);
      if (initialFilter.statusFilter) setStatusFilter(initialFilter.statusFilter);
      if (initialFilter.categoryFilter) setCategoryFilter(initialFilter.categoryFilter);
      if (initialFilter.doctorFilter) setDoctorFilter(initialFilter.doctorFilter);
      if (initialFilter.searchQuery !== undefined) setSearchQuery(initialFilter.searchQuery);
    }
  }, [initialFilter]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const refreshList = () => {
    setReports(dbService.getReports());
  };

  const handleConfirmDeleteReport = () => {
    if (!reportToDelete) return;
    const repNo = reportToDelete.reportNo;
    const patName = reportToDelete.patientName;
    const success = dbService.deleteReport(reportToDelete.id, currentUser || undefined);
    if (success) {
      refreshList();
      showNotification('success', `Report ${repNo} (${patName}) has been permanently deleted.`);
    } else {
      showNotification('error', `Failed to delete report ${repNo}.`);
    }
    setReportToDelete(null);
  };

  // Filter computation
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      const repDateStr = (rep.reportedAt || rep.specimenReceivedAt || '').slice(0, 10);
      const repMonthStr = repDateStr.slice(0, 7);
      const repYearStr = repDateStr.slice(0, 4);

      // 1. Date / Month / Year constraints
      if (filterMode === 'today') {
        if (repDateStr !== todayStr) return false;
      } else if (filterMode === 'date') {
        if (selectedDate && repDateStr !== selectedDate) return false;
      } else if (filterMode === 'month') {
        if (selectedMonth && repMonthStr !== selectedMonth) return false;
      } else if (filterMode === 'year') {
        if (selectedYear && repYearStr !== selectedYear) return false;
      } else if (filterMode === 'range') {
        if (startDate && repDateStr < startDate) return false;
        if (endDate && repDateStr > endDate) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'critical') {
          const hasCritical = Object.values(rep.results).some((r: any) => r?.abnormalFlag === 'CRITICAL');
          if (!hasCritical) return false;
        } else if (rep.status !== statusFilter) {
          return false;
        }
      }

      // 3. Doctor filter
      if (doctorFilter !== 'all') {
        if (rep.referringDoctorId !== doctorFilter && rep.authorizedByDoctorId !== doctorFilter) {
          return false;
        }
      }

      // 4. Category filter
      if (categoryFilter !== 'all' && rep.category !== categoryFilter) {
        return false;
      }

      // 5. Query Search (Patient Name, UHID, Report No, Order No, Accession No, Test Name, Phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = rep.patientName.toLowerCase().includes(q);
        const matchUhid = rep.uhid.toLowerCase().includes(q);
        const matchRepNo = rep.reportNo.toLowerCase().includes(q);
        const matchAccNo = rep.accessionNo.toLowerCase().includes(q);
        const matchTest = rep.testName.toLowerCase().includes(q);
        const matchDoctor = (rep.referringDoctorName || '').toLowerCase().includes(q);
        const matchPhone = (rep.patientPhone || '').includes(q);

        if (!matchName && !matchUhid && !matchRepNo && !matchAccNo && !matchTest && !matchDoctor && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [
    reports,
    filterMode,
    selectedDate,
    selectedMonth,
    selectedYear,
    startDate,
    endDate,
    statusFilter,
    doctorFilter,
    categoryFilter,
    searchQuery,
    todayStr,
  ]);

  // Status Badge Component
  const renderStatusBadge = (rep: Report) => {
    const hasCritical = Object.values(rep.results).some((r) => r.abnormalFlag === 'CRITICAL');

    if (hasCritical) {
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          CRITICAL
        </span>
      );
    }

    switch (rep.status) {
      case 'verified_final':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Final
          </span>
        );
      case 'authorized_by_doctor':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            Doctor Authorized
          </span>
        );
      case 'reviewed_by_tech':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Tech Reviewed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Draft / Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md transition ${
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
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Title & Quick Stats */}
      <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/60">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Report History &amp; Clinical Archive
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Search, filter by Date / Month / Year, preview, print, or review diagnostic reports across all departments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsDailySummaryOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer tactile-btn"
            title="View and print summary of all patients, tests, and findings for the day"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            Daily Log Summary
          </button>

          <div className="bg-teal-50/80 border border-teal-200 px-4 py-1.5 rounded-2xl text-center shadow-xs">
            <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">Found Reports</span>
            <span className="text-lg font-black text-teal-950 leading-tight font-mono">{filteredReports.length}</span>
          </div>
          <button
            onClick={() => refreshList()}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer tactile-btn"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Control Center */}
      <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        {/* Filter Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl">
            <button
              onClick={() => setFilterMode('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer tactile-btn ${
                filterMode === 'today' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today's Reports
            </button>
            <button
              onClick={() => setFilterMode('date')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer tactile-btn ${
                filterMode === 'date' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Date
            </button>
            <button
              onClick={() => setFilterMode('month')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer tactile-btn ${
                filterMode === 'month' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Month
            </button>
            <button
              onClick={() => setFilterMode('year')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer tactile-btn ${
                filterMode === 'year' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Year
            </button>
            <button
              onClick={() => setFilterMode('range')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer tactile-btn ${
                filterMode === 'range' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Date Range
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer tactile-btn ${
                filterMode === 'all' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
          </div>

          {/* Dynamic Date Inputs based on Filter Mode */}
          <div className="flex items-center gap-2 text-xs">
            {filterMode === 'date' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none"
                />
              </div>
            )}

            {filterMode === 'month' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none"
                />
              </div>
            )}

            {filterMode === 'year' && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none"
                >
                  <option value="2026">Year 2026</option>
                  <option value="2025">Year 2025</option>
                  <option value="2024">Year 2024</option>
                  <option value="2023">Year 2023</option>
                </select>
              </div>
            )}

            {filterMode === 'range' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="From"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="To"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Bar & Dropdown Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Main search */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, UHID, Report No (REP-...), Test, or Phone..."
              className="w-full bg-slate-50/80 border border-slate-300/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300/80 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="verified_final">Verified Final</option>
              <option value="authorized_by_doctor">Authorized by Doctor</option>
              <option value="reviewed_by_tech">Tech Reviewed</option>
              <option value="draft">Draft / In Progress</option>
              <option value="critical">🚨 Critical / Panic Flags</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300/80 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Departments</option>
              <option value="Hematology">Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Clinical Pathology">Clinical Pathology</option>
              <option value="Serology & Immunology">Serology &amp; Immunology</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Digital Radiology">Digital Radiology</option>
              <option value="Ultrasonography">Ultrasonography</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Histopathology & Cytology">Histopathology</option>
            </select>
          </div>

          {/* Doctor Filter */}
          <div className="lg:col-span-2">
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-300/80 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table / Card View */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching reports found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No reports match your current filter ({filterMode}) and search criteria. Try adjusting the date, status, or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4">Report No &amp; Accession</th>
                  <th className="py-3.5 px-4">Patient Information</th>
                  <th className="py-3.5 px-4">Investigation / Test</th>
                  <th className="py-3.5 px-4">Referring Doctor</th>
                  <th className="py-3.5 px-4">Reported Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition group">
                    {/* Report & Accession */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        {rep.reportNo}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{rep.accessionNo}</span>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 text-sm block font-bold">{rep.patientName}</strong>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono text-teal-800 font-bold">{rep.uhid}</span>
                        <span>•</span>
                        <span>
                          {rep.patientAge} {rep.patientAgeUnit}, {rep.patientGender}
                        </span>
                      </div>
                    </td>

                    {/* Test */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{rep.testName}</span>
                      <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                        {rep.category}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-medium block">{rep.referringDoctorName || 'Self / Direct'}</span>
                      {rep.authorizedByDoctorName && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Auth: {rep.authorizedByDoctorName}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span>{new Date(rep.reportedAt || rep.specimenReceivedAt).toLocaleDateString()}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {new Date(rep.reportedAt || rep.specimenReceivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">{renderStatusBadge(rep)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectReport(rep, 'edit')}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-teal-600 hover:text-teal-800 text-slate-700 font-bold text-xs transition cursor-pointer tactile-btn"
                          title="Enter results, review, or authorize"
                        >
                          Review / Edit
                        </button>
                        <button
                          onClick={() => onSelectReport(rep, 'preview')}
                          className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs transition cursor-pointer tactile-btn"
                          title="Print A4 Report or Export PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print / A4
                        </button>
                        <button
                          onClick={() => setReportToDelete(rep)}
                          className="p-1.5 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Report Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-rose-200 max-w-md w-full p-6 relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Delete Diagnostic Report?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Are you sure you want to permanently delete report <strong className="text-slate-900">{reportToDelete.reportNo}</strong> for patient <strong className="text-slate-900">{reportToDelete.patientName}</strong> ({reportToDelete.uhid})?
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-5 text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Test / Investigation:</span>
                <span className="font-bold text-slate-900">{reportToDelete.testName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Accession No:</span>
                <span className="font-mono text-slate-800">{reportToDelete.accessionNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-semibold text-slate-800">{reportToDelete.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReport}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer tactile-btn"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Delete Report
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Daily Summary Modal */}
      {isDailySummaryOpen && (
        <DailySummaryModal
          reports={reports}
          selectedDate={filterMode === 'date' ? selectedDate : todayStr}
          onClose={() => setIsDailySummaryOpen(false)}
        />
      )}
    </div>
  );
};
