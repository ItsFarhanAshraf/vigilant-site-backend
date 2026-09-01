import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  Building2,
  Home,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  UserCheck,
  Calendar,
  CreditCard,
  HardHat,
  Users,
  ShieldAlert,
  CloudSun,
  Camera,
  FileCheck,
  ChevronRight,
  Plus
} from 'lucide-react';

export const HousesManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const initialTab = searchParams.get('tab') || 'ALL';

  const {
    houses,
    engineers,
    visits,
    workers,
    safetyIssues,
    loans,
    approveHouse,
    rejectHouse,
    assignEngineerToHouse,
    updateHouseStatus,
    scheduleVisit
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(highlightId || '');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  React.useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Modal States
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [assignEngineerModalHouse, setAssignEngineerModalHouse] = useState(null);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [rejectModalHouse, setRejectModalHouse] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [scheduleModalHouse, setScheduleModalHouse] = useState(null);
  const [visitScheduleForm, setVisitScheduleForm] = useState({
    engineerId: '',
    visitDate: '',
    visitTime: '10:00 AM',
    visitType: 'Construction Inspection',
    purpose: '',
    notes: '',
  });

  // Filter houses by Tab
  const filteredHouses = houses.filter((h) => {
    // Tab filter
    if (activeTab === 'APPLICATIONS' && h.status !== 'Pending') return false;
    if (activeTab === 'APPROVED' && h.status !== 'Approved') return false;
    if (activeTab === 'UNDER_CONSTRUCTION' && h.status !== 'Under Construction') return false;
    if (activeTab === 'COMPLETED' && h.status !== 'Completed') return false;
    if (activeTab === 'REJECTED' && h.status !== 'Rejected') return false;

    // District filter
    if (districtFilter !== 'ALL' && h.district !== districtFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.id.toLowerCase().includes(q) ||
        h.ownerName.toLowerCase().includes(q) ||
        h.ownerCnic.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.division.toLowerCase().includes(q) ||
        h.engineerName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const districtsList = Array.from(new Set(houses.map((h) => h.district)));

  // Tab counts
  const tabCounts = {
    ALL: houses.length,
    APPLICATIONS: houses.filter((h) => h.status === 'Pending').length,
    APPROVED: houses.filter((h) => h.status === 'Approved').length,
    UNDER_CONSTRUCTION: houses.filter((h) => h.status === 'Under Construction').length,
    COMPLETED: houses.filter((h) => h.status === 'Completed').length,
    REJECTED: houses.filter((h) => h.status === 'Rejected').length,
  };

  const handleAssignEngineerSubmit = (e) => {
    e.preventDefault();
    if (assignEngineerModalHouse && selectedEngineerId) {
      assignEngineerToHouse(assignEngineerModalHouse.id, selectedEngineerId);
      setAssignEngineerModalHouse(null);
      setSelectedEngineerId('');
    }
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (rejectModalHouse) {
      rejectHouse(rejectModalHouse.id, rejectReason);
      setRejectModalHouse(null);
      setRejectReason('');
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (scheduleModalHouse) {
      const selectedEng = engineers.find((eng) => eng.id === Number(visitScheduleForm.engineerId)) || engineers[0];
      scheduleVisit({
        houseId: scheduleModalHouse.id,
        houseAddress: scheduleModalHouse.address,
        engineerId: selectedEng.id,
        engineerName: selectedEng.name,
        visitType: visitScheduleForm.visitType,
        visitDate: visitScheduleForm.visitDate || new Date().toISOString().split('T')[0],
        visitTime: visitScheduleForm.visitTime,
        purpose: visitScheduleForm.purpose || 'Site quality inspection',
        progressPctReported: scheduleModalHouse.progressPct,
        workersPresent: scheduleModalHouse.workersCount || 4,
        trainingProvided: null,
        safetyChecklist: null,
        environmentalConditions: null,
        issuesFound: [],
        engineerRemarks: visitScheduleForm.notes || '',
        photos: [],
        aiHazardResult: null,
      });
      setScheduleModalHouse(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            House Management Module
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor beneficiaries, construction stages, loan accounts, engineers, and quality inspection workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (filteredHouses.length > 0) {
                setScheduleModalHouse(filteredHouses[0]);
                setVisitScheduleForm({
                  ...visitScheduleForm,
                  engineerId: filteredHouses[0].engineerId || engineers[0]?.id,
                });
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            <span>Schedule Field Visit</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'ALL', label: 'All Houses' },
          { id: 'APPLICATIONS', label: 'Applications' },
          { id: 'APPROVED', label: 'Approved' },
          { id: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
          { id: 'COMPLETED', label: 'Completed' },
          { id: 'REJECTED', label: 'Rejected' },
        ].map((tab) => {
          const count = tabCounts[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, owner, CNIC, engineer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>District:</span>
          </div>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 cursor-pointer"
          >
            <option value="ALL">All Districts</option>
            {districtsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Houses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-5">House ID</th>
                <th className="py-3.5 px-4">Owner Info</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Assigned Engineer</th>
                <th className="py-3.5 px-4">Stage & Progress</th>
                <th className="py-3.5 px-4">Loan Status</th>
                <th className="py-3.5 px-4">Safety</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHouses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No houses match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredHouses.map((h) => (
                  <tr
                    key={h.id}
                    className={`hover:bg-slate-50/80 transition ${
                      highlightId === h.id ? 'bg-orange-50/60 ring-2 ring-orange-300' : ''
                    }`}
                  >
                    {/* House ID */}
                    <td className="py-4 px-5">
                      <div className="font-mono font-black text-orange-700">{h.id}</div>
                      <div className="text-[10px] text-slate-400">{h.plotSizeMarla} Marla • {h.coveredAreaSqft} sqft</div>
                    </td>

                    {/* Owner */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-900">{h.ownerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{h.ownerCnic}</div>
                      <div className="text-[10px] text-slate-400">{h.ownerPhone}</div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{h.district}, {h.division}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{h.tehsil}</div>
                    </td>

                    {/* Engineer */}
                    <td className="py-4 px-4">
                      {h.engineerName !== 'Unassigned' ? (
                        <div className="flex items-center gap-1.5">
                          <HardHat className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                          <span className="font-bold text-slate-800">{h.engineerName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAssignEngineerModalHouse(h);
                            setSelectedEngineerId(engineers[0]?.id || '');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black hover:bg-orange-100 transition cursor-pointer"
                        >
                          + Assign Engineer
                        </button>
                      )}
                    </td>

                    {/* Progress & Stage */}
                    <td className="py-4 px-4 min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 mb-1">
                        <span>{h.stage}</span>
                        <span className="font-mono">{h.progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${h.progressPct}%` }}
                          className={`h-full rounded-full ${
                            h.progressPct === 100
                              ? 'bg-emerald-600'
                              : h.progressPct > 50
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Loan Status */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 text-[11px]">
                        PKR {(h.loanDisbursed / 1000).toLocaleString()}k
                      </div>
                      <div className="text-[10px] text-slate-500">{h.loanStatus}</div>
                    </td>

                    {/* Safety Status */}
                    <td className="py-4 px-4">
                      {h.safetyStatus === 'Critical Issue' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="h-3 w-3" /> Critical ({h.safetyIssuesCount})
                        </span>
                      ) : h.safetyStatus === 'Minor Issue' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="h-3 w-3" /> Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> Safe
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          h.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : h.status === 'Under Construction'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : h.status === 'Approved'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : h.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedHouse(h)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-orange-700 hover:bg-orange-50 transition shadow-2xs cursor-pointer"
                          title="View 360° House Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {h.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => approveHouse(h.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
                              title="Approve Application"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setRejectModalHouse(h)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-2xs cursor-pointer"
                              title="Reject Application"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setAssignEngineerModalHouse(h);
                            setSelectedEngineerId(h.engineerId || engineers[0]?.id || '');
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition shadow-2xs cursor-pointer"
                          title="Assign Engineer"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setScheduleModalHouse(h);
                            setVisitScheduleForm({
                              ...visitScheduleForm,
                              engineerId: h.engineerId || engineers[0]?.id,
                            });
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-orange-700 hover:bg-orange-50 transition shadow-2xs cursor-pointer"
                          title="Schedule Engineer Visit"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: 360° HOUSE DETAILS VIEWER (Rich multi-section modal)
         ========================================================================= */}
      {selectedHouse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-6 animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center font-black">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedHouse.id}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        selectedHouse.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedHouse.status === 'Under Construction'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedHouse.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedHouse.address}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHouse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick KPI Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase">Owner</span>
                <div className="text-xs font-black text-slate-900 mt-0.5">{selectedHouse.ownerName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{selectedHouse.ownerCnic}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase">Stage & Progress</span>
                <div className="text-xs font-black text-slate-900 mt-0.5">{selectedHouse.stage}</div>
                <div className="text-[10px] text-emerald-600 font-bold">{selectedHouse.progressPct}% Completed</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase">Loan Disbursed</span>
                <div className="text-xs font-black text-slate-900 mt-0.5">
                  PKR {(selectedHouse.loanDisbursed / 1000).toLocaleString()}k
                </div>
                <div className="text-[10px] text-slate-500">of {(selectedHouse.loanApproved / 1000).toLocaleString()}k Total</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase">Assigned Engineer</span>
                <div className="text-xs font-black text-slate-900 mt-0.5 truncate">{selectedHouse.engineerName}</div>
                <div className="text-[10px] text-orange-700 font-bold">Field Incharge</div>
              </div>
            </div>

            {/* Photo & GIS View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 relative group">
                <img
                  src={selectedHouse.photoUrl}
                  alt="Construction Site Photo"
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  Latest On-Site Photo (GPS Accuracy: 2.1m)
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 mb-2">Location & Coordinates</h3>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Division / District:</span>
                      <span className="font-bold">{selectedHouse.division} / {selectedHouse.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tehsil:</span>
                      <span className="font-bold">{selectedHouse.tehsil}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPS Coordinates:</span>
                      <span className="font-mono font-bold text-orange-800">{selectedHouse.lat}, {selectedHouse.lng}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Weather & Env Risk:</span>
                      <span className="font-bold text-amber-800">{selectedHouse.weather} ({selectedHouse.temperature}°C) • Risk: {selectedHouse.environmentalRisk}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedHouse(null);
                      navigate(`/gis-map?houseId=${selectedHouse.id}`);
                    }}
                    className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl transition"
                  >
                    View on Full GIS Map
                  </button>
                </div>
              </div>
            </div>

            {/* Workers & Labour Training Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900">Assigned Labour & Safety Training</h3>
                <span className="text-[11px] font-bold text-purple-700">
                  {selectedHouse.trainedWorkersCount} of {selectedHouse.workersCount} Workers Trained
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                During engineer inspections, on-site safety training modules (PPE, Working at Height, Scaffolding) are conducted and recorded for this house.
              </p>
            </div>

            {/* Admin Action Buttons inside modal */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedHouse(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = selectedHouse;
                  setSelectedHouse(null);
                  setScheduleModalHouse(target);
                  setVisitScheduleForm({
                    ...visitScheduleForm,
                    engineerId: target.engineerId || engineers[0]?.id,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold hover:bg-orange-100 transition cursor-pointer"
              >
                Schedule Visit
              </button>

              {selectedHouse.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => {
                    approveHouse(selectedHouse.id);
                    setSelectedHouse(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
                >
                  Approve Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ASSIGN ENGINEER
         ========================================================================= */}
      {assignEngineerModalHouse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                Assign Field Engineer to {assignEngineerModalHouse.id}
              </h3>
              <button
                onClick={() => setAssignEngineerModalHouse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAssignEngineerSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Select Field Engineer (PEC Registered)
                </label>
                <select
                  value={selectedEngineerId}
                  onChange={(e) => setSelectedEngineerId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-bold"
                >
                  <option value="">Select Engineer</option>
                  {engineers.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} ({eng.assignedDivision} • {eng.assignedHousesCount} Houses)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-[11px] text-orange-950 space-y-1">
                <div className="font-bold">House Details:</div>
                <div>Owner: {assignEngineerModalHouse.ownerName}</div>
                <div>Location: {assignEngineerModalHouse.address}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignEngineerModalHouse(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: REJECT HOUSE APPLICATION
         ========================================================================= */}
      {rejectModalHouse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-rose-700">
                Reject Application: {rejectModalHouse.id}
              </h3>
              <button
                onClick={() => setRejectModalHouse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Rejection Reason / Remarks
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify grounds for rejection (e.g. Land registry dispute, non-qualifying income criteria)..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalHouse(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: SCHEDULE VISIT
         ========================================================================= */}
      {scheduleModalHouse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Schedule Engineer Inspection
                </h3>
                <p className="text-[11px] text-slate-500">House: {scheduleModalHouse.id} ({scheduleModalHouse.ownerName})</p>
              </div>
              <button
                onClick={() => setScheduleModalHouse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Select Engineer
                  </label>
                  <select
                    value={visitScheduleForm.engineerId}
                    onChange={(e) => setVisitScheduleForm({ ...visitScheduleForm, engineerId: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    {engineers.map((eng) => (
                      <option key={eng.id} value={eng.id}>
                        {eng.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Visit Type
                  </label>
                  <select
                    value={visitScheduleForm.visitType}
                    onChange={(e) => setVisitScheduleForm({ ...visitScheduleForm, visitType: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    <option value="Construction Inspection">Construction Inspection</option>
                    <option value="Progress Verification">Progress Verification</option>
                    <option value="Safety Inspection">Safety Inspection</option>
                    <option value="Labour Training">Labour Training</option>
                    <option value="Final Inspection">Final Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={visitScheduleForm.visitDate}
                    onChange={(e) => setVisitScheduleForm({ ...visitScheduleForm, visitDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Visit Time
                  </label>
                  <input
                    type="text"
                    value={visitScheduleForm.visitTime}
                    onChange={(e) => setVisitScheduleForm({ ...visitScheduleForm, visitTime: e.target.value })}
                    placeholder="10:30 AM"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Purpose / Focus Area
                </label>
                <input
                  type="text"
                  value={visitScheduleForm.purpose}
                  onChange={(e) => setVisitScheduleForm({ ...visitScheduleForm, purpose: e.target.value })}
                  placeholder="e.g. Verify steel reinforcement before roof concrete pouring"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Special Notes for Engineer
                </label>
                <textarea
                  value={visitScheduleForm.notes}
                  onChange={(e) => setVisitScheduleForm({ ...visitScheduleForm, notes: e.target.value })}
                  placeholder="e.g. Conduct worker safety briefing on PPE and check water supply..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalHouse(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
