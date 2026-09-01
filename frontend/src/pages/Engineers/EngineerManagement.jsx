import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  HardHat,
  Users,
  Building2,
  Calendar,
  Star,
  ShieldCheck,
  Plus,
  Search,
  Check,
  X,
  Phone,
  Mail,
  UserCheck,
  Award,
  ChevronRight,
  LayoutGrid,
  List,
  MapPin,
  ClipboardCheck,
  GraduationCap
} from 'lucide-react';

export const EngineerManagement = () => {
  const { t } = useLanguage();
  const { engineers, houses, addEngineer, toggleEngineerStatus, assignEngineerToHouse } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'
  
  // Modals
  const [selectedEngineerForScorecard, setSelectedEngineerForScorecard] = useState(null);
  const [isAddEngineerModalOpen, setIsAddEngineerModalOpen] = useState(false);
  const [assignHousesModalEngineer, setAssignHousesModalEngineer] = useState(null);
  const [selectedHouseToAssign, setSelectedHouseToAssign] = useState('');

  // Add Engineer Form State
  const [newEngineerForm, setNewEngineerForm] = useState({
    name: '',
    contact: '',
    email: '',
    pecNo: '',
    assignedDivision: 'Lahore & Gujranwala',
  });

  const totalEngineers = engineers.length;
  const activeEngineers = engineers.filter((e) => e.status === 'Active').length;
  const totalAssignedHouses = engineers.reduce((acc, e) => acc + (e.assignedHousesCount || 0), 0);
  const totalCompletedVisits = engineers.reduce((acc, e) => acc + (e.completedVisits || 0), 0);
  const totalWorkersTrained = engineers.reduce((acc, e) => acc + (e.workersTrained || 0), 0);

  const filteredEngineers = engineers.filter((e) => {
    // Filter tab
    if (selectedFilter === 'ACTIVE' && e.status !== 'Active') return false;
    if (selectedFilter === 'TOP_RATED' && (e.rating || 0) < 4.8) return false;
    if (selectedFilter === 'LAHORE' && !e.assignedDivision.includes('Lahore')) return false;
    if (selectedFilter === 'RAWALPINDI' && !e.assignedDivision.includes('Rawalpindi')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.pecNo.toLowerCase().includes(q) ||
        e.assignedDivision.toLowerCase().includes(q) ||
        e.contact.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddEngineerSubmit = (e) => {
    e.preventDefault();
    addEngineer({
      name: newEngineerForm.name,
      contact: newEngineerForm.contact,
      email: newEngineerForm.email,
      pecNo: newEngineerForm.pecNo,
      assignedDivision: newEngineerForm.assignedDivision,
    });
    setIsAddEngineerModalOpen(false);
    setNewEngineerForm({
      name: '',
      contact: '',
      email: '',
      pecNo: '',
      assignedDivision: 'Lahore & Gujranwala',
    });
  };

  const handleAssignHouseSubmit = (e) => {
    e.preventDefault();
    if (assignHousesModalEngineer && selectedHouseToAssign) {
      assignEngineerToHouse(selectedHouseToAssign, assignHousesModalEngineer.id);
      setAssignHousesModalEngineer(null);
      setSelectedHouseToAssign('');
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER & REGISTRATION BUTTON
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Field Engineers & Inspectors
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-100 text-orange-800">
              PEC Certified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor Pakistan Engineering Council (PEC) certified field officers, house allocations, inspections, and training throughput
          </p>
        </div>

        <button
          onClick={() => setIsAddEngineerModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Engineer</span>
        </button>
      </div>

      {/* =========================================================================
          TOP KPI METRIC STRIP
         ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Field Staff</span>
            <span className="text-2xl font-black text-slate-900 block font-mono">{totalEngineers} Officers</span>
            <span className="text-[10px] text-emerald-600 font-bold">{activeEngineers} Currently Active</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Assigned Houses</span>
            <span className="text-2xl font-black text-blue-950 block font-mono">{totalAssignedHouses} Sites</span>
            <span className="text-[10px] text-slate-400 font-medium">Under active supervision</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed Visits</span>
            <span className="text-2xl font-black text-emerald-800 block font-mono">{totalCompletedVisits} Visits</span>
            <span className="text-[10px] text-emerald-700 font-bold">100% Geo-tagged & Verified</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-700 border border-orange-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Labour Trained</span>
            <span className="text-2xl font-black text-orange-950 block font-mono">{totalWorkersTrained} Workers</span>
            <span className="text-[10px] text-orange-700 font-bold">On-site technical modules</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEARCH & FILTER TOOLBAR WITH VIEW TOGGLE
         ========================================================================= */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, PEC No, division, phone..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-medium transition"
          />
        </div>

        {/* Filter Chips & View Mode Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'ACTIVE', label: 'Active' },
              { id: 'TOP_RATED', label: '★ 4.8+ Rated' },
              { id: 'LAHORE', label: 'Lahore' },
              { id: 'RAWALPINDI', label: 'Rawalpindi' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'GRID' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ELEGANT CARD GRID VIEW (DEFAULT)
         ========================================================================= */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEngineers.map((eng) => (
            <div
              key={eng.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-200 transition duration-200 flex flex-col justify-between space-y-4"
            >
              {/* Card Header: Avatar, Name, PEC & Rating */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={eng.avatar}
                        alt={eng.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-orange-200 shadow-xs"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          eng.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        title={eng.status}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">{eng.name}</h3>
                      <span className="inline-block mt-0.5 text-[10.5px] font-mono font-extrabold text-orange-700 bg-orange-50 px-2 py-0.2 rounded-md border border-orange-200/60">
                        {eng.pecNo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200/60 text-amber-800 font-black text-xs shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{eng.rating}</span>
                  </div>
                </div>

                {/* Division & Contact Information */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <MapPin className="h-3.5 w-3.5 text-orange-600" />
                    <span>{eng.assignedDivision}</span>
                  </span>
                  <span className="font-mono text-slate-500">{eng.contact}</span>
                </div>
              </div>

              {/* 3 Core Metric Blocks */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Assigned</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{eng.assignedHousesCount} Houses</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold block">Inspections</span>
                  <span className="font-mono font-black text-emerald-900 text-sm">{eng.completedVisits} Done</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <span className="text-[10px] text-purple-800 font-bold block">Trained</span>
                  <span className="font-mono font-black text-purple-900 text-sm">{eng.workersTrained} Workers</span>
                </div>
              </div>

              {/* Assigned House Badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Active Site Allocations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {eng.assignedHouses?.length > 0 ? (
                    eng.assignedHouses.map((houseId) => (
                      <span
                        key={houseId}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {houseId}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No houses currently assigned</span>
                  )}
                </div>
              </div>

              {/* Safety Compliance Metric Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Safety Audit Score</span>
                  <span className="text-emerald-700 font-black">{eng.safetyComplianceScore}% Compliant</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${eng.safetyComplianceScore}%` }}
                  />
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedEngineerForScorecard(eng)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>Scorecard</span>
                </button>

                <button
                  onClick={() => {
                    setAssignHousesModalEngineer(eng);
                    setSelectedHouseToAssign(houses[0]?.id || '');
                  }}
                  className="py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-extrabold border border-orange-200 transition cursor-pointer"
                  title="Assign additional house"
                >
                  + Assign House
                </button>

                <button
                  onClick={() => toggleEngineerStatus(eng.id)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    eng.status === 'Active'
                      ? 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={eng.status === 'Active' ? 'Deactivate Engineer' : 'Activate Engineer'}
                >
                  {eng.status === 'Active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CLEAN, SPACIOUS TABLE VIEW (ALTERNATIVE)
         ========================================================================= */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-5 whitespace-nowrap">Engineer Name & Photo</th>
                  <th className="py-4 px-4 whitespace-nowrap">PEC Registration</th>
                  <th className="py-4 px-4 whitespace-nowrap">Division & Region</th>
                  <th className="py-4 px-4 whitespace-nowrap">Assigned Houses</th>
                  <th className="py-4 px-4 whitespace-nowrap">Completed Visits</th>
                  <th className="py-4 px-4 whitespace-nowrap">Labour Trained</th>
                  <th className="py-4 px-4 whitespace-nowrap">Rating & Audit</th>
                  <th className="py-4 px-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEngineers.map((eng) => (
                  <tr key={eng.id} className="hover:bg-slate-50/80 transition">
                    {/* Name & Avatar */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={eng.avatar} alt={eng.name} className="h-10 w-10 rounded-2xl object-cover ring-1 ring-orange-200 shrink-0" />
                        <div>
                          <div className="font-black text-slate-900 text-sm">{eng.name}</div>
                          <div className="text-[11px] text-slate-500">{eng.contact}</div>
                        </div>
                      </div>
                    </td>

                    {/* PEC */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-extrabold text-orange-800 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/70">
                        {eng.pecNo}
                      </span>
                    </td>

                    {/* Division */}
                    <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                      {eng.assignedDivision}
                    </td>

                    {/* Assigned Houses */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-slate-900">{eng.assignedHousesCount} Houses</span>
                      <div className="text-[10px] text-slate-400">{eng.assignedHouses?.join(', ') || 'None'}</div>
                    </td>

                    {/* Completed Visits */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-emerald-700 text-sm">{eng.completedVisits}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Verified Visits</span>
                    </td>

                    {/* Labour Trained */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-purple-900 text-sm">{eng.workersTrained}</span>
                      <span className="text-[10px] text-purple-700 block font-medium">{eng.trainingSessionsConducted} Sessions</span>
                    </td>

                    {/* Rating & Score */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mb-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{eng.rating}</span>
                        <span className="text-slate-400 text-[10px] font-normal">({eng.safetyComplianceScore}% score)</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          eng.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {eng.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEngineerForScorecard(eng)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
                        >
                          Scorecard
                        </button>
                        <button
                          onClick={() => {
                            setAssignHousesModalEngineer(eng);
                            setSelectedHouseToAssign(houses[0]?.id || '');
                          }}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          + House
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: REGISTER NEW ENGINEER (CLEAN & SIMPLE)
         ========================================================================= */}
      {isAddEngineerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Register Field Engineer
                </h3>
                <p className="text-xs text-slate-500">Pakistan Engineering Council (PEC) Credentials</p>
              </div>
              <button
                onClick={() => setIsAddEngineerModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddEngineerSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newEngineerForm.name}
                  onChange={(e) => setNewEngineerForm({ ...newEngineerForm, name: e.target.value })}
                  placeholder="Engr. Muhammad Tariq"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  PEC Registration Number
                </label>
                <input
                  type="text"
                  value={newEngineerForm.pecNo}
                  onChange={(e) => setNewEngineerForm({ ...newEngineerForm, pecNo: e.target.value })}
                  placeholder="PEC-CIVIL-59281"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newEngineerForm.contact}
                    onChange={(e) => setNewEngineerForm({ ...newEngineerForm, contact: e.target.value })}
                    placeholder="+92 300 1234567"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={newEngineerForm.email}
                    onChange={(e) => setNewEngineerForm({ ...newEngineerForm, email: e.target.value })}
                    placeholder="tariq@acag.punjab.gov.pk"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Assigned Administrative Division
                </label>
                <select
                  value={newEngineerForm.assignedDivision}
                  onChange={(e) => setNewEngineerForm({ ...newEngineerForm, assignedDivision: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
                >
                  <option value="Lahore & Kasur">Lahore & Kasur</option>
                  <option value="Rawalpindi & Attock">Rawalpindi & Attock</option>
                  <option value="Faisalabad & Jhang">Faisalabad & Jhang</option>
                  <option value="Multan & Khanewal">Multan & Khanewal</option>
                  <option value="Gujranwala & Sialkot">Gujranwala & Sialkot</option>
                  <option value="Bahawalpur & RYK">Bahawalpur & RYK</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEngineerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
                >
                  Register Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PERFORMANCE SCORECARD (ELEGANT)
         ========================================================================= */}
      {selectedEngineerForScorecard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEngineerForScorecard.avatar}
                  alt="Engineer"
                  className="h-12 w-12 rounded-2xl object-cover ring-2 ring-orange-200 shadow-xs"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedEngineerForScorecard.name}</h3>
                  <div className="text-xs text-orange-700 font-mono font-bold">{selectedEngineerForScorecard.pecNo}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEngineerForScorecard(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scorecard Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase">Inspection Compliance</span>
                <div className="text-2xl font-black text-emerald-950 mt-0.5">{selectedEngineerForScorecard.safetyComplianceScore}%</div>
                <span className="text-[10px] text-emerald-700 font-medium">Top Tier Field Officer</span>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-extrabold text-amber-800 uppercase">Quality Rating</span>
                <div className="text-2xl font-black text-amber-950 mt-0.5 flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span>{selectedEngineerForScorecard.rating} / 5.0</span>
                </div>
                <span className="text-[10px] text-amber-700 font-medium">Based on 40+ inspections</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Visits Completed</span>
                <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">{selectedEngineerForScorecard.completedVisits} Visits</div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                <span className="text-[10px] font-extrabold text-purple-800 uppercase">Workers Trained</span>
                <div className="text-xl font-black text-purple-900 mt-0.5 font-mono">{selectedEngineerForScorecard.workersTrained} Trained</div>
              </div>
            </div>

            {/* Active House Allocations List */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-extrabold text-slate-900 block">
                Assigned Housing Units ({selectedEngineerForScorecard.assignedHousesCount}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEngineerForScorecard.assignedHouses?.map((hId) => (
                  <span key={hId} className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                    {hId}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEngineerForScorecard(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ASSIGN HOUSES TO ENGINEER
         ========================================================================= */}
      {assignHousesModalEngineer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Assign House to {assignHousesModalEngineer.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{assignHousesModalEngineer.pecNo}</p>
              </div>
              <button
                onClick={() => setAssignHousesModalEngineer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAssignHouseSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Select House from Directory
                </label>
                <select
                  value={selectedHouseToAssign}
                  onChange={(e) => setSelectedHouseToAssign(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
                >
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id} — {h.ownerName} ({h.district} • Current: {h.engineerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignHousesModalEngineer(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
                >
                  Assign to Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
