import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { projectsApi, reportsApi } from '../api/endpoints';
import { Spinner } from '../components/common/Spinner';
import {
  Building2,
  Activity,
  HardHat,
  Users,
  Cpu,
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
  Clock
} from 'lucide-react';

export const Dashboard = () => {
  const { user, isAdmin, isEngineer } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await projectsApi.getProjects({ page_size: 20 });
      setProjects(res?.data?.results || res?.data || []);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    window.open(reportsApi.getDPRUrl({ scope: 'ALL' }), '_blank');
  };

  if (loading) {
    return <Spinner message="Loading ACAG Dashboard..." className="h-96" />;
  }

  return (
    <div className="space-y-6">
      {/* =========================================================================
          DASHBOARD HEADER: Title + Actions (Report & + New Project)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {t('dashboardOverview')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('dashboardDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            <span>{t('reportBtn')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('newProjectBtn')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: 6 KPI METRIC CARDS (Rich Color-Filled Cards with Centered Numbers)
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. TOTAL PROJECTS - 🔵 Blue Fill */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-md border border-blue-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[130px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-8 w-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              ↗ 12%
            </span>
          </div>
          <div className="text-center my-auto pt-1.5 z-10">
            <span className="text-[10px] font-extrabold uppercase text-blue-100 tracking-wider block">
              {t('totalProjects')}
            </span>
            <span className="text-2xl font-black tracking-tight text-white mt-0.5 block">
              2,456
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
        </div>

        {/* 2. ACTIVE PROJECTS - 🟢 Emerald Green Fill */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md border border-emerald-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[130px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-8 w-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              ↗ 54%
            </span>
          </div>
          <div className="text-center my-auto pt-1.5 z-10">
            <span className="text-[10px] font-extrabold uppercase text-emerald-100 tracking-wider block">
              {t('activeProjects')}
            </span>
            <span className="text-2xl font-black tracking-tight text-white mt-0.5 block">
              1,327
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
        </div>

        {/* 3. ENGINEERS - 🟣 Purple Fill */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-800 via-indigo-800 to-purple-900 text-white shadow-md border border-purple-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[130px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-8 w-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <HardHat className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              {t('stable')}
            </span>
          </div>
          <div className="text-center my-auto pt-1.5 z-10">
            <span className="text-[10px] font-extrabold uppercase text-purple-100 tracking-wider block">
              {t('engineers')}
            </span>
            <span className="text-2xl font-black tracking-tight text-white mt-0.5 block">
              186
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
        </div>

        {/* 4. HOUSE OWNERS - 🟡 Amber / Gold Fill */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-slate-950 shadow-md border border-amber-400/40 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[130px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-8 w-8 rounded-lg bg-amber-950/20 text-amber-950 flex items-center justify-center backdrop-blur-md border border-amber-950/20 shadow-inner">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-950/20 text-amber-950 border border-amber-950/20 backdrop-blur-xs">
              ↗ {t('newBadge')}
            </span>
          </div>
          <div className="text-center my-auto pt-1.5 z-10">
            <span className="text-[10px] font-black uppercase text-amber-950 tracking-wider block">
              {t('houseOwners')}
            </span>
            <span className="text-2xl font-black tracking-tight text-slate-950 mt-0.5 block">
              2,415
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-md pointer-events-none" />
        </div>

        {/* 5. AI VALIDATIONS - 🔵 Cyan / Teal Fill */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-700 via-cyan-800 to-teal-800 text-white shadow-md border border-cyan-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[130px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-8 w-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              ↗ 89%
            </span>
          </div>
          <div className="text-center my-auto pt-1.5 z-10">
            <span className="text-[10px] font-extrabold uppercase text-cyan-100 tracking-wider block">
              {t('aiValidations')}
            </span>
            <span className="text-2xl font-black tracking-tight text-white mt-0.5 block">
              1,198
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
        </div>

        {/* 6. PENDING INSP. - 🔴 Crimson Red Fill */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-md border border-red-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[130px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-8 w-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              ↘ {t('highRisk')}
            </span>
          </div>
          <div className="text-center my-auto pt-1.5 z-10">
            <span className="text-[10px] font-extrabold uppercase text-red-100 tracking-wider block">
              {t('pendingInsp')}
            </span>
            <span className="text-2xl font-black tracking-tight text-white mt-0.5 block">
              126
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          ROW 2: GIS MAP + STATUS DISTRIBUTION DONUT (Matching Screenshot 1)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: GIS Project Locations Map (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">{t('gisTitle')}</h2>
              <p className="text-xs text-slate-500">{t('gisSubtitle')}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>{t('layers')}</span>
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>{t('fullMap')}</span>
              </button>
            </div>
          </div>

          {/* Map Canvas Visual */}
          <div className="relative bg-gradient-to-br from-emerald-50/40 via-slate-50 to-blue-50/50 rounded-xl p-5 border border-slate-200/70 min-h-[260px] overflow-hidden flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0D5C3A_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Weather / Status Overlay Box */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 shadow-xs space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <CloudSun className="h-3.5 w-3.5 text-amber-500" />
                <span>Weather: Partly Cloudy, 34°C</span>
              </div>
              <div className="text-emerald-700 font-semibold">
                Resource Status: Operational
              </div>
            </div>

            {/* Map Cluster Nodes matching Punjab geographic layout */}
            <div className="relative w-full max-w-md h-56">
              {/* Rawalpindi Pin */}
              <div className="absolute top-2 left-32 flex flex-col items-center">
                <span className="h-7 w-7 rounded-full bg-[#0D5C3A] text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white ring-2 ring-emerald-600/30 animate-pulse">
                  42
                </span>
                <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-0.5">
                  Rawalpindi
                </span>
              </div>

              {/* Gujranwala Pin */}
              <div className="absolute top-16 right-28 flex flex-col items-center">
                <span className="h-7 w-7 rounded-full bg-[#0D5C3A] text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white">
                  77
                </span>
                <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-0.5">
                  Gujranwala
                </span>
              </div>

              {/* Lahore Pin (Largest Cluster) */}
              <div className="absolute top-26 right-16 flex flex-col items-center">
                <span className="h-8 w-8 rounded-full bg-[#0B462C] text-white text-xs font-black flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-emerald-600/20">
                  156
                </span>
                <span className="text-[10px] font-extrabold text-[#0D5C3A] bg-white px-2 py-0.5 rounded shadow-xs mt-0.5 border border-emerald-100">
                  Lahore
                </span>
              </div>

              {/* Faisalabad Pin */}
              <div className="absolute top-28 left-28 flex flex-col items-center">
                <span className="h-7 w-7 rounded-full bg-blue-700 text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white">
                  65
                </span>
                <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-0.5">
                  Faisalabad
                </span>
              </div>

              {/* Multan Pin (Orange) */}
              <div className="absolute bottom-4 left-16 flex flex-col items-center">
                <span className="h-7 w-7 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white">
                  89
                </span>
                <span className="text-[9px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-0.5">
                  Multan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status Distribution Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">{t('statusDistribution')}</h2>
          </div>

          {/* Donut Chart Visual Representation */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative h-40 w-40 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                {/* Segment 1: Completed (Green 36%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#0D5C3A"
                  strokeWidth="4.5"
                  strokeDasharray="36 100"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Under Construction (Blue 46%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="4.5"
                  strokeDasharray="46 100"
                  strokeDashoffset="-36"
                />
                {/* Segment 3: Planning / Risk (Red/Orange 18%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="4.5"
                  strokeDasharray="18 100"
                  strokeDashoffset="-82"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-900 block">2,456</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="w-full mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0D5C3A]" />
                  <span className="text-slate-600 font-semibold">{t('completed')}</span>
                </div>
                <span className="font-extrabold text-slate-900 font-mono">892 (36%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-800" />
                  <span className="text-slate-600 font-semibold">{t('underConstruction')}</span>
                </div>
                <span className="font-extrabold text-slate-900 font-mono">1,120 (46%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                  <span className="text-slate-600 font-semibold">{t('pendingHandover')}</span>
                </div>
                <span className="font-extrabold text-slate-900 font-mono">444 (18%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: MONTHLY ACTIVITY (BOP Orange Bar Chart) + CONSTRUCTION STAGES
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Monthly Activity (7 cols) - Styled exactly like Screenshot in BOP Orange */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-black text-slate-900">{t('monthlyActivity')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('monthlyActivitySubtitle')}</p>
          </div>

          {/* Bar Chart Canvas with Dotted Y-Axis Gridlines matching Screenshot */}
          <div className="relative pt-2 pb-1">
            {/* Horizontal Dotted Gridlines */}
            <div className="absolute inset-x-8 top-4 bottom-10 flex flex-col justify-between pointer-events-none">
              {[320, 240, 160, 80, 0].map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="text-[10px] font-medium text-slate-400 w-7 text-right pr-2 select-none">
                    {val}
                  </span>
                  <div className="flex-1 border-b border-dashed border-slate-200" />
                </div>
              ))}
            </div>

            {/* Bars Container */}
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 pl-10 pr-4 pb-2 relative z-10">
              {[
                { month: 'Dec', value: 120, heightPct: (120 / 340) * 100 },
                { month: 'Jan', value: 168, heightPct: (168 / 340) * 100 },
                { month: 'Feb', value: 185, heightPct: (185 / 340) * 100 },
                { month: 'Mar', value: 212, heightPct: (212 / 340) * 100 },
                { month: 'Apr', value: 265, heightPct: (265 / 340) * 100 },
                { month: 'May', value: 320, heightPct: (320 / 340) * 100 },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div
                    style={{ height: `${b.heightPct}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-orange-700 via-orange-600 to-amber-500 hover:from-orange-800 hover:to-amber-600 rounded-t-lg shadow-sm transition-all duration-500 cursor-pointer relative"
                    title={`${b.month}: ${b.value} completions`}
                  >
                    {/* Tooltip on hover */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-xs pointer-events-none">
                      {b.value}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 mt-2 select-none">{b.month}</span>
                </div>
              ))}
            </div>

            {/* Legend at Bottom matching Screenshot */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-2 border-t border-slate-100 text-xs font-bold">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-3 w-3 rounded-xs bg-slate-400" />
                <span>{t('inspectionsLegend')}</span>
              </span>
              <span className="flex items-center gap-2 text-slate-700 font-extrabold">
                <span className="h-3 w-3 rounded-xs bg-gradient-to-r from-orange-600 to-amber-500 shadow-2xs" />
                <span>{t('completionsLegend')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Construction Stages (5 cols) matching Screenshot 2 */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="mb-3">
            <h2 className="text-sm font-black text-slate-900">{t('constructionStages')}</h2>
          </div>

          <div className="space-y-3.5">
            {[
              { stage: t('stageFoundation'), count: 412, pct: 45, color: 'bg-emerald-300' },
              { stage: t('stagePlinth'), count: 538, pct: 60, color: 'bg-[#0D5C3A]' },
              { stage: t('stageLintel'), count: 489, pct: 54, color: 'bg-[#0D5C3A]' },
              { stage: t('stageRoofCast'), count: 356, pct: 40, color: 'bg-[#0B462C]' },
              { stage: t('stageFinishing'), count: 289, pct: 32, color: 'bg-teal-700' },
              { stage: t('stageCompleted'), count: 372, pct: 42, color: 'bg-emerald-600' },
            ].map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{s.stage}</span>
                  <span className="text-slate-900 font-mono font-extrabold">{s.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${s.pct}%` }}
                    className={`h-full rounded-full ${s.color} transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 4: RECENT ACTIVITY TABLE (Matching Screenshot 2 & 3)
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">{t('recentActivity')}</h2>
            <p className="text-xs text-slate-500">{t('recentActivitySubtitle')}</p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-6">{t('houseId')}</th>
                <th className="py-3.5 px-4">{t('location')}</th>
                <th className="py-3.5 px-4">{t('stage')}</th>
                <th className="py-3.5 px-4">{t('status')}</th>
                <th className="py-3.5 px-6 text-right">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: 'ACAG-L-4521', location: 'Jallo Park, Lahore', stage: 'Completed', status: 'HANDED_OVER', date: 'May 15' },
                { id: 'ACAG-R-2210', location: 'Taxila, Rawalpindi', stage: 'Finishing', status: 'PENDING_HANDOVER', date: 'May 18' },
                { id: 'ACAG-F-1187', location: 'Sargodha Rd, Faisalabad', stage: 'Roof Casting', status: 'UNDER_CONSTRUCTION', date: 'May 20' },
                { id: 'ACAG-M-0934', location: 'Shah Rukn, Multan', stage: 'Completed', status: 'HANDED_OVER', date: 'Apr 28' },
                { id: 'ACAG-G-2567', location: 'GT Road, Gujranwala', stage: 'Lintel Level', status: 'UNDER_CONSTRUCTION', date: 'May 22' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono font-black text-[#0D5C3A]">
                    {row.id}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {row.location}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-semibold">
                    {row.stage}
                  </td>
                  <td className="py-4 px-4">
                    {row.status === 'HANDED_OVER' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {t('handedOver')}
                      </span>
                    ) : row.status === 'PENDING_HANDOVER' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {t('pendingHandover')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        {t('underConstruction')}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-slate-500 font-mono">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
