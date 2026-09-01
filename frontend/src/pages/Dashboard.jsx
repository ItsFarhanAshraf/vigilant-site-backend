import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useDashboardData } from '../context/DashboardDataContext';
import {
  Building2,
  Activity,
  HardHat,
  Users,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Plus,
  MapPin,
  Layers,
  Maximize2,
  ChevronRight,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
  CreditCard,
  ThermometerSun,
  Droplets,
  Wind,
  Check,
  ClipboardCheck,
  Hammer
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const {
    houses,
    engineers,
    visits,
    workers,
    safetyIssues,
    loans,
    auditLogs,
    scheduleVisit,
    approveVisitReport
  } = useDashboardData();

  const [selectedMapHouse, setSelectedMapHouse] = useState(houses[0]);
  const [selectedVisitForModal, setSelectedVisitForModal] = useState(null);

  // Compute live statistics
  const totalHousesCount = houses.length;
  const pendingApplicationsCount = houses.filter((h) => h.status === 'Pending').length;
  const underConstructionCount = houses.filter((h) => h.status === 'Under Construction').length;
  const completedHousesCount = houses.filter((h) => h.status === 'Completed').length;
  const pendingInspectionsCount = visits.filter((v) => v.status === 'Scheduled').length;
  const totalEngineersCount = engineers.length;
  const totalWorkersCount = workers.length;
  const openSafetyIssuesCount = safetyIssues.filter((s) => s.status === 'Open').length;

  // Loan aggregates
  const totalLoanApproved = loans.reduce((acc, l) => acc + (l.approvedAmount || 0), 0);
  const totalLoanDisbursed = loans.reduce((acc, l) => acc + (l.disbursedAmount || 0), 0);
  const totalLoanRemaining = Math.max(0, totalLoanApproved - totalLoanDisbursed);
  const pendingInstallmentsCount = loans.reduce(
    (acc, l) => acc + l.tranches.filter((t) => t.status.includes('Pending') || t.status.includes('Approved')).length,
    0
  );

  // Construction Stage counts
  const stageStats = [
    { stage: 'Foundation', count: houses.filter((h) => h.stage === 'Foundation').length, pct: 20, color: 'bg-emerald-400' },
    { stage: 'Structure', count: houses.filter((h) => h.stage === 'Structure').length, pct: 40, color: 'bg-blue-500' },
    { stage: 'Roof', count: houses.filter((h) => h.stage === 'Roof').length, pct: 60, color: 'bg-amber-500' },
    { stage: 'Electrical', count: houses.filter((h) => h.stage === 'Electrical').length, pct: 75, color: 'bg-indigo-500' },
    { stage: 'Plumbing', count: houses.filter((h) => h.stage === 'Plumbing').length, pct: 80, color: 'bg-cyan-500' },
    { stage: 'Finishing', count: houses.filter((h) => h.stage === 'Finishing').length, pct: 90, color: 'bg-purple-500' },
    { stage: 'Completed', count: houses.filter((h) => h.stage === 'Completed').length, pct: 100, color: 'bg-emerald-600' },
  ];

  // Overall program construction percentage
  const avgProgramProgress = Math.round(
    houses.reduce((acc, h) => acc + (h.progressPct || 0), 0) / (houses.length || 1)
  );

  // Status donut distribution
  const statusCounts = {
    pending: houses.filter((h) => h.status === 'Pending').length,
    approved: houses.filter((h) => h.status === 'Approved').length,
    construction: houses.filter((h) => h.status === 'Under Construction').length,
    completed: houses.filter((h) => h.status === 'Completed').length,
    rejected: houses.filter((h) => h.status === 'Rejected').length,
  };

  // Helper for map pin colors
  const getMarkerColor = (house) => {
    if (house.safetyIssuesCount > 0 || house.environmentalRisk === 'Critical') return 'bg-rose-600 ring-rose-300';
    if (house.status === 'Completed') return 'bg-emerald-600 ring-emerald-300';
    if (house.status === 'Under Construction') return 'bg-blue-600 ring-blue-300';
    return 'bg-amber-500 ring-amber-200';
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER: Program Title + Primary Action Buttons
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 uppercase tracking-wider">
              ACAG Government Administrative MIS
            </span>
            <span className="text-xs text-slate-400">• Punjab Region</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {t('dashboardOverview')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dashboardDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span>{t('reportBtn')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/engineer-visits')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('newProjectBtn')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP STATISTICS CARDS (8 High-Density KPI Cards)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Total Houses */}
        <div
          onClick={() => navigate('/houses')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-blue-300 hover:ring-2 hover:ring-blue-100 transition duration-200 cursor-pointer group"
          title="Click to view all houses directory"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-emerald-600 flex items-center">
              +14% <ArrowUpRight className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('totalHouses')}
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block group-hover:text-blue-600 transition">
              {totalHousesCount}
            </span>
          </div>
        </div>

        {/* 2. Pending Applications */}
        <div
          onClick={() => navigate('/houses?tab=APPLICATIONS')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-amber-300 hover:ring-2 hover:ring-amber-100 transition duration-200 cursor-pointer group"
          title="Click to review pending housing applications"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Needs Review
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('pendingApplications')}
            </span>
            <span className="text-xl font-black text-amber-700 mt-0.5 block group-hover:scale-105 transition origin-left">
              {pendingApplicationsCount}
            </span>
          </div>
        </div>

        {/* 3. Houses Under Construction */}
        <div
          onClick={() => navigate('/houses?tab=UNDER_CONSTRUCTION')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-indigo-300 hover:ring-2 hover:ring-indigo-100 transition duration-200 cursor-pointer group"
          title="Click to view houses currently under construction"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-indigo-600">
              Active
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Under Const.
            </span>
            <span className="text-xl font-black text-indigo-900 mt-0.5 block group-hover:text-indigo-600 transition">
              {underConstructionCount}
            </span>
          </div>
        </div>

        {/* 4. Completed Houses */}
        <div
          onClick={() => navigate('/houses?tab=COMPLETED')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300 hover:ring-2 hover:ring-emerald-100 transition duration-200 cursor-pointer group"
          title="Click to view completed houses"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Ready
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block group-hover:scale-105 transition origin-left">
              {completedHousesCount}
            </span>
          </div>
        </div>

        {/* 5. Pending Inspections */}
        <div
          onClick={() => navigate('/engineer-visits?filter=SCHEDULED')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-orange-300 hover:ring-2 hover:ring-orange-100 transition duration-200 cursor-pointer group"
          title="Click to view pending engineer inspections"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-orange-600">
              Queue
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Pending Insp.
            </span>
            <span className="text-xl font-black text-orange-700 mt-0.5 block group-hover:scale-105 transition origin-left">
              {pendingInspectionsCount}
            </span>
          </div>
        </div>

        {/* 6. Total Engineers */}
        <div
          onClick={() => navigate('/engineers')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-purple-300 hover:ring-2 hover:ring-purple-100 transition duration-200 cursor-pointer group"
          title="Click to manage field engineers"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition flex items-center justify-center">
              <HardHat className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-slate-500">
              PEC Reg.
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('totalEngineers')}
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block group-hover:text-purple-700 transition">
              {totalEngineersCount}
            </span>
          </div>
        </div>

        {/* 7. Total Workers */}
        <div
          onClick={() => navigate('/labour')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-teal-300 hover:ring-2 hover:ring-teal-100 transition duration-200 cursor-pointer group"
          title="Click to manage labour & safety training"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
              Enrolled
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('totalWorkers')}
            </span>
            <span className="text-xl font-black text-teal-900 mt-0.5 block group-hover:text-teal-600 transition">
              {totalWorkersCount}
            </span>
          </div>
        </div>

        {/* 8. Open Safety Issues */}
        <div
          onClick={() => navigate('/safety')}
          className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-rose-300 hover:ring-2 hover:ring-rose-100 transition duration-200 cursor-pointer group"
          title="Click to view open safety incidents & hazards"
        >
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              High Risk
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Safety Issues
            </span>
            <span className="text-xl font-black text-rose-700 mt-0.5 block group-hover:scale-105 transition origin-left">
              {openSafetyIssuesCount}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: CONSTRUCTION OVERVIEW (Stage Progress) + HOUSE STATUS DONUT + LOAN SUMMARY
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. Large Interactive Construction Overview Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Construction Stage Overview</h2>
              <p className="text-[11px] text-slate-500">Program Completion Index: <strong className="text-orange-700">{avgProgramProgress}%</strong></p>
            </div>
            <span className="px-2 py-1 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              {avgProgramProgress}% Avg Progress
            </span>
          </div>

          {/* Construction Stage Bars */}
          <div className="space-y-2.5 py-1">
            {stageStats.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span>{item.stage}</span>
                  </div>
                  <span className="font-mono text-slate-900 font-extrabold">{item.count} Houses</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(item.count / (houses.length || 1)) * 100}%` }}
                    className={`h-full rounded-full ${item.color} transition-all duration-500 min-w-[6px]`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Standard ACAG 7-Stage Milestone Progression</span>
            <button
              onClick={() => navigate('/houses')}
              className="text-orange-700 hover:text-orange-900 font-extrabold flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Houses</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* 2. House Status Donut Chart (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">House Status Distribution</h2>
            <p className="text-[11px] text-slate-500">Application to Completion</p>
          </div>

          {/* Donut Chart Visual */}
          <div className="py-3 flex flex-col items-center justify-center">
            <div className="relative h-36 w-36 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                {/* Completed (Green) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4.5"
                  strokeDasharray={`${(statusCounts.completed / totalHousesCount) * 100} 100`}
                  strokeDashoffset="0"
                />
                {/* Under Construction (Blue) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4.5"
                  strokeDasharray={`${(statusCounts.construction / totalHousesCount) * 100} 100`}
                  strokeDashoffset={`-${(statusCounts.completed / totalHousesCount) * 100}`}
                />
                {/* Approved (Amber) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4.5"
                  strokeDasharray={`${(statusCounts.approved / totalHousesCount) * 100} 100`}
                  strokeDashoffset={`-${((statusCounts.completed + statusCounts.construction) / totalHousesCount) * 100}`}
                />
                {/* Rejected (Red) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="4.5"
                  strokeDasharray={`${(statusCounts.rejected / totalHousesCount) * 100} 100`}
                  strokeDashoffset={`-${((statusCounts.completed + statusCounts.construction + statusCounts.approved) / totalHousesCount) * 100}`}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900 block">{totalHousesCount}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="w-full mt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{statusCounts.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Under Const.</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{statusCounts.construction}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Approved</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{statusCounts.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Rejected</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{statusCounts.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Loan Overview Bar / Area Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">Loan & Disbursement Overview</h2>
              <p className="text-[11px] text-slate-500">Bank of Punjab Housing Tranches</p>
            </div>
            <CreditCard className="h-5 w-5 text-orange-600" />
          </div>

          <div className="space-y-3 my-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Approved</span>
                <div className="text-base font-black text-slate-900">
                  PKR {(totalLoanApproved / 1000000).toFixed(2)}M
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800">
                100%
              </span>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Total Disbursed</span>
                <div className="text-base font-black text-emerald-900">
                  PKR {(totalLoanDisbursed / 1000000).toFixed(2)}M
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900">
                {Math.round((totalLoanDisbursed / (totalLoanApproved || 1)) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block">Remaining</span>
                <span className="font-mono font-black text-slate-800">PKR {(totalLoanRemaining / 1000000).toFixed(2)}M</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block">Pending Tranches</span>
                <span className="font-mono font-black text-amber-700">{pendingInstallmentsCount} Installments</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/loans')}
            className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-800 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Manage All Loan Tranches</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: GIS OVERVIEW MAP WITH INTERACTIVE PIN POPOVER + ALERTS
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* GIS Overview Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">GIS House Locations & Risks</h2>
              <p className="text-[11px] text-slate-500">Live Punjab Project Geo-pins with status coloring</p>
            </div>
            <button
              onClick={() => navigate('/gis-map')}
              className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full GIS Map</span>
            </button>
          </div>

          {/* Map Canvas */}
          <div className="relative bg-gradient-to-br from-emerald-900/10 via-slate-100 to-blue-900/10 rounded-2xl p-4 min-h-[280px] border border-slate-200 overflow-hidden flex items-center justify-center">
            {/* Punjab Grid Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:18px_18px]" />

            {/* Pins Container */}
            <div className="relative w-full max-w-lg h-60">
              {houses.slice(0, 7).map((h, i) => {
                const posStyles = [
                  { top: '15%', left: '35%' }, // Rawalpindi
                  { top: '35%', left: '60%' }, // Gujranwala
                  { top: '45%', left: '72%' }, // Lahore
                  { top: '48%', left: '38%' }, // Faisalabad
                  { top: '70%', left: '28%' }, // Multan
                  { top: '80%', left: '42%' }, // Bahawalpur
                  { top: '28%', left: '22%' }, // Sargodha
                ][i] || { top: '50%', left: '50%' };

                const isSelected = selectedMapHouse?.id === h.id;

                return (
                  <div
                    key={h.id}
                    style={posStyles}
                    onClick={() => setSelectedMapHouse(h)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div
                      className={`h-7 w-7 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-white ring-2 transition-transform duration-200 group-hover:scale-125 ${getMarkerColor(
                        h
                      )} ${isSelected ? 'scale-125 ring-4 ring-orange-400' : ''}`}
                    >
                      {h.progressPct}%
                    </div>
                    <span className="text-[9px] font-extrabold bg-white/95 text-slate-800 px-1.5 py-0.5 rounded shadow-xs border border-slate-200 mt-1 block whitespace-nowrap">
                      {h.district}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Clicked House Summary Popover Overlay */}
            {selectedMapHouse && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl z-30 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-black text-orange-700">{selectedMapHouse.id}</span>
                    <h3 className="text-xs font-bold text-slate-900">{selectedMapHouse.ownerName}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{selectedMapHouse.address}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      selectedMapHouse.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedMapHouse.status === 'Under Construction'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedMapHouse.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-center text-[10px]">
                  <div>
                    <span className="text-slate-400 font-bold block">Stage</span>
                    <span className="font-bold text-slate-800">{selectedMapHouse.stage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Engineer</span>
                    <span className="font-bold text-slate-800 truncate block">{selectedMapHouse.engineerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Progress</span>
                    <span className="font-black text-emerald-600">{selectedMapHouse.progressPct}%</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/houses?highlight=${selectedMapHouse.id}`)}
                    className="flex-1 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-extrabold rounded-lg shadow-xs transition"
                  >
                    View 360° House Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Map Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Green = Completed
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Blue = Under Construction
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Yellow = Pending
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> Red = High Risk
            </span>
          </div>
        </div>

        {/* Safety & Environmental Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Section 1: Safety Alerts */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs font-black text-slate-900">Live Safety Violations & Alerts</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700">
                {openSafetyIssuesCount} Open
              </span>
            </div>

            <div className="space-y-2">
              {safetyIssues.slice(0, 2).map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200/70 flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{item.issueType}</span>
                      <span className="text-[9px] font-black text-rose-700 uppercase">{item.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{item.description}</p>
                    <div className="text-[9.5px] text-slate-400 font-mono mt-1">
                      {item.houseId} • {item.assignedEngineer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/safety')}
              className="w-full mt-2.5 py-1.5 text-center text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 rounded-xl transition cursor-pointer"
            >
              Open Safety Dashboard →
            </button>
          </div>

          {/* Section 2: Environmental Alerts */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CloudSun className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-black text-slate-900">Site Environmental Risks</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                Weather Advisory
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ThermometerSun className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">High Temperature & Heatwave</span>
                    <span className="text-[9px] font-black text-amber-800">42°C</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Bahawalpur & RYK: Mandatory hydration breaks every 45 mins.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200 flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <Droplets className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Heavy Monsoon Rainfall Alert</span>
                    <span className="text-[9px] font-black text-sky-800">Sialkot</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">ACAG-S-9911: Concrete slab pouring paused for 24 hours.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/environmental')}
              className="w-full mt-2.5 py-1.5 text-center text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 rounded-xl transition cursor-pointer"
            >
              Open Environmental Monitor →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 4: RECENT ENGINEER VISITS TABLE WITH REPORT ACTIONS
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">Recent Field Engineer Visits & Inspections</h2>
            <p className="text-xs text-slate-500">Quality checkpoints, safety audits, and labour training sessions</p>
          </div>
          <button
            onClick={() => navigate('/engineer-visits')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            Manage All Visits
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3 px-5">House</th>
                <th className="py-3 px-4">Engineer</th>
                <th className="py-3 px-4">Visit Type</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.slice(0, 5).map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-black text-orange-700">{v.houseId}</div>
                    <div className="text-[11px] text-slate-500">{v.houseAddress}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {v.engineerName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        v.visitType === 'Safety Inspection'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : v.visitType === 'Labour Training'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : v.visitType === 'Final Inspection'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {v.visitType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    <div>{v.visitDate}</div>
                    <div className="text-[10px] text-slate-400">{v.visitTime}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {v.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Check className="h-3 w-3" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="h-3 w-3" /> Scheduled
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => navigate(`/engineer-visits?visitId=${v.id}`)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 text-[11px] font-bold rounded-lg transition shadow-2xs cursor-pointer"
                    >
                      Inspect Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          ROW 5: RECENT ACTIVITY FEED (Admin & System Stream)
         ========================================================================= */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900">Recent Admin & System Activity</h2>
            <p className="text-xs text-slate-500">Chronological administrative and field audit trail</p>
          </div>
          <button
            onClick={() => navigate('/settings?tab=audit')}
            className="text-xs font-bold text-orange-700 hover:text-orange-900 cursor-pointer"
          >
            Full Audit Logs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {auditLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <div className="h-2 w-2 rounded-full bg-orange-600 mt-1.5 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-black text-slate-900">{log.action}</div>
                <div className="text-[11px] text-slate-600 font-medium">{log.module} • {log.houseId}</div>
                <div className="text-[9.5px] text-slate-400 mt-1 font-mono">{log.timestamp} • by {log.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
