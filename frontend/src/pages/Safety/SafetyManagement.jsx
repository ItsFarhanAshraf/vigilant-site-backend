import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Eye,
  Check,
  X,
  HardHat,
  RotateCcw,
  Camera,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const SafetyManagement = () => {
  const { t } = useLanguage();
  const {
    safetyIssues,
    houses,
    engineers,
    resolveSafetyIssue,
    assignSafetyIssue,
    logSafetyViolation
  } = useDashboardData();

  const [activeSeverity, setActiveSeverity] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isLogViolationModalOpen, setIsLogViolationModalOpen] = useState(false);
  const [assignEngineerModalIssue, setAssignEngineerModalIssue] = useState(null);
  const [selectedEngineerName, setSelectedEngineerName] = useState(engineers[0]?.name || '');
  const [selectedIssueDetail, setSelectedIssueDetail] = useState(null);
  const [resolveModalIssue, setResolveModalIssue] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Log Violation Form State
  const [violationForm, setViolationForm] = useState({
    houseId: houses[0]?.id || '',
    issueType: 'Worker without helmet',
    severity: 'High',
    assignedEngineer: engineers[0]?.name || '',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
  });

  const totalOpen = safetyIssues.filter((s) => s.status === 'Open').length;
  const criticalCount = safetyIssues.filter((s) => s.severity === 'Critical' && s.status === 'Open').length;
  const resolvedCount = safetyIssues.filter((s) => s.status === 'Resolved').length;
  const totalReports = safetyIssues.length;

  const filteredIssues = safetyIssues.filter((s) => {
    if (activeSeverity !== 'ALL' && s.severity !== activeSeverity) return false;
    if (activeStatus === 'OPEN' && s.status !== 'Open') return false;
    if (activeStatus === 'RESOLVED' && s.status !== 'Resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.houseId.toLowerCase().includes(q) ||
        s.issueType.toLowerCase().includes(q) ||
        s.assignedEngineer.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLogViolationSubmit = (e) => {
    e.preventDefault();
    const targetHouse = houses.find((h) => h.id === violationForm.houseId) || houses[0];
    logSafetyViolation({
      houseId: targetHouse.id,
      houseAddress: targetHouse.address,
      issueType: violationForm.issueType,
      severity: violationForm.severity,
      assignedEngineer: violationForm.assignedEngineer,
      description: violationForm.description,
      photoUrl: violationForm.photoUrl,
    });
    setIsLogViolationModalOpen(false);
    setViolationForm({
      houseId: houses[0]?.id || '',
      issueType: 'Worker without helmet',
      severity: 'High',
      assignedEngineer: engineers[0]?.name || '',
      description: '',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f5?w=600&auto=format&fit=crop&q=80',
    });
  };

  const handleAssignEngineerSubmit = (e) => {
    e.preventDefault();
    if (assignEngineerModalIssue && selectedEngineerName) {
      assignSafetyIssue(assignEngineerModalIssue.id, selectedEngineerName);
      setAssignEngineerModalIssue(null);
    }
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (resolveModalIssue) {
      resolveSafetyIssue(resolveModalIssue.id, resolutionNotes);
      setResolveModalIssue(null);
      setResolutionNotes('');
      if (selectedIssueDetail?.id === resolveModalIssue.id) {
        setSelectedIssueDetail(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Safety Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor HSE hazards, PPE compliance, scaffolding integrity, and assign rectification orders to field engineers
          </p>
        </div>

        <button
          onClick={() => setIsLogViolationModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Log Safety Incident</span>
        </button>
      </div>

      {/* Top 4 Safety Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Open Issues</span>
            <span className="text-2xl font-black text-amber-700 block">{totalOpen}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-black shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Issues</span>
            <span className="text-2xl font-black text-rose-700 block">{criticalCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Issues</span>
            <span className="text-2xl font-black text-emerald-700 block">{resolvedCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Safety Reports</span>
            <span className="text-2xl font-black text-blue-900 block">{totalReports}</span>
          </div>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Severities' },
            { id: 'Critical', label: 'Critical' },
            { id: 'High', label: 'High' },
            { id: 'Medium', label: 'Medium' },
            { id: 'Low', label: 'Low' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSeverity(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSeverity === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveStatus('ALL')}
            className={`px-3 py-1 text-xs font-bold rounded-lg ${activeStatus === 'ALL' ? 'bg-orange-100 text-orange-900 font-extrabold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            All Status
          </button>
          <button
            onClick={() => setActiveStatus('OPEN')}
            className={`px-3 py-1 text-xs font-bold rounded-lg ${activeStatus === 'OPEN' ? 'bg-rose-100 text-rose-900 font-extrabold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Open Only
          </button>
          <button
            onClick={() => setActiveStatus('RESOLVED')}
            className={`px-3 py-1 text-xs font-bold rounded-lg ${activeStatus === 'RESOLVED' ? 'bg-emerald-100 text-emerald-900 font-extrabold' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Resolved Only
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hazard type, house ID, engineer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>
      </div>

      {/* Safety Issues Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className={`bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition ${
              issue.severity === 'Critical' && issue.status === 'Open'
                ? 'border-rose-300 ring-1 ring-rose-200'
                : 'border-slate-200'
            }`}
          >
            <div className="space-y-2.5">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {issue.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase ${
                      issue.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : issue.severity === 'High'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : issue.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {issue.severity}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-black ${
                      issue.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
              </div>

              {/* Title & House */}
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">{issue.issueType}</h3>
                <div className="text-[11px] font-bold text-orange-700 font-mono mt-0.5">
                  {issue.houseId} — {issue.houseAddress}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2">{issue.description}</p>

              {/* Photo Evidence Preview */}
              {issue.photoUrl && (
                <div className="rounded-xl overflow-hidden h-32 border border-slate-200 relative group cursor-pointer" onClick={() => setSelectedIssueDetail(issue)}>
                  <img src={issue.photoUrl} alt="Safety Evidence" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs gap-1">
                    <Eye className="h-4 w-4" /> View Full Evidence
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions & Assigned Engineer */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned To:</span>
                <span className="font-bold text-slate-900 truncate max-w-[150px]">{issue.assignedEngineer}</span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {issue.status === 'Open' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setResolveModalIssue(issue)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Resolved</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAssignEngineerModalIssue(issue);
                        setSelectedEngineerName(issue.assignedEngineer || engineers[0]?.name);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                      title="Reassign Engineer"
                    >
                      <UserCheck className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full py-1.5 bg-emerald-50 text-emerald-800 text-center text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Rectified & Closed ({issue.resolvedDate})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MODAL 1: LOG NEW SAFETY VIOLATION
         ========================================================================= */}
      {isLogViolationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Log New Safety Incident / Non-Compliance
              </h3>
              <button
                onClick={() => setIsLogViolationModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogViolationSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Select House Site
                  </label>
                  <select
                    value={violationForm.houseId}
                    onChange={(e) => setViolationForm({ ...violationForm, houseId: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id} — {h.ownerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Severity Level
                  </label>
                  <select
                    value={violationForm.severity}
                    onChange={(e) => setViolationForm({ ...violationForm, severity: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    <option value="Critical">Critical (Immediate Stop Work)</option>
                    <option value="High">High Severity</option>
                    <option value="Medium">Medium Severity</option>
                    <option value="Low">Low / Advisory</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Safety Issue Type
                  </label>
                  <select
                    value={violationForm.issueType}
                    onChange={(e) => setViolationForm({ ...violationForm, issueType: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    <option value="Worker without helmet">Worker without helmet</option>
                    <option value="Missing PPE">Missing PPE</option>
                    <option value="Unsafe scaffolding">Unsafe scaffolding</option>
                    <option value="Electrical hazard">Electrical hazard</option>
                    <option value="Working at height without harness">Working at height without harness</option>
                    <option value="Unsafe material storage">Unsafe material storage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Assigned Engineer
                  </label>
                  <select
                    value={violationForm.assignedEngineer}
                    onChange={(e) => setViolationForm({ ...violationForm, assignedEngineer: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    {engineers.map((eng) => (
                      <option key={eng.id} value={eng.name}>{eng.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Incident Description / Observed Defect
                </label>
                <textarea
                  value={violationForm.description}
                  onChange={(e) => setViolationForm({ ...violationForm, description: e.target.value })}
                  placeholder="Describe non-compliance observed on site..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogViolationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: MARK ISSUE RESOLVED
         ========================================================================= */}
      {resolveModalIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-emerald-800">
                Mark Safety Issue as Resolved: {resolveModalIssue.id}
              </h3>
              <button
                onClick={() => setResolveModalIssue(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Resolution Notes & Corrective Action Taken
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Scaffolding planks clamped; harnesses issued to all 4 workers on site."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalIssue(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ASSIGN ISSUE TO ENGINEER
         ========================================================================= */}
      {assignEngineerModalIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                Assign Rectification to Engineer
              </h3>
              <button
                onClick={() => setAssignEngineerModalIssue(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAssignEngineerSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Select Field Engineer
                </label>
                <select
                  value={selectedEngineerName}
                  onChange={(e) => setSelectedEngineerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                >
                  {engineers.map((eng) => (
                    <option key={eng.id} value={eng.name}>{eng.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignEngineerModalIssue(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Assign Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
