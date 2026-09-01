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
  ChevronRight
} from 'lucide-react';

export const EngineerManagement = () => {
  const { t } = useLanguage();
  const { engineers, houses, addEngineer, toggleEngineerStatus, assignEngineerToHouse } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngineerForScorecard, setSelectedEngineerForScorecard] = useState(null);
  const [isAddEngineerModalOpen, setIsAddEngineerModalOpen] = useState(false);
  const [assignHousesModalEngineer, setAssignHousesModalEngineer] = useState(null);
  const [selectedHouseToAssign, setSelectedHouseToAssign] = useState('');

  // Add Engineer Form
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
  const totalPendingVisits = engineers.reduce((acc, e) => acc + (e.pendingVisits || 0), 0);

  const filteredEngineers = engineers.filter((e) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.pecNo.toLowerCase().includes(q) ||
        e.assignedDivision.toLowerCase().includes(q) ||
        e.contact.toLowerCase().includes(q)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Engineer Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor PEC-certified field engineers, house allocations, inspection throughput, and performance scorecards
          </p>
        </div>

        <button
          onClick={() => setIsAddEngineerModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Engineer</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-black shrink-0">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Engineers</span>
            <span className="text-2xl font-black text-slate-900 block">{totalEngineers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Engineers</span>
            <span className="text-2xl font-black text-emerald-700 block">{activeEngineers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Houses</span>
            <span className="text-2xl font-black text-blue-900 block">{totalAssignedHouses}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-orange-50 text-orange-700 border border-orange-200 flex items-center justify-center font-black shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Visits</span>
            <span className="text-2xl font-black text-orange-700 block">{totalPendingVisits}</span>
          </div>
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
            placeholder="Search engineer by name, PEC No, division..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>
      </div>

      {/* Engineer Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-5">Engineer Name</th>
                <th className="py-3.5 px-4">PEC & Contact</th>
                <th className="py-3.5 px-4">Division Assigned</th>
                <th className="py-3.5 px-4">Assigned Houses</th>
                <th className="py-3.5 px-4">Completed Visits</th>
                <th className="py-3.5 px-4">Labour Training Sessions</th>
                <th className="py-3.5 px-4">Rating & Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEngineers.map((eng) => (
                <tr key={eng.id} className="hover:bg-slate-50/80 transition">
                  {/* Name & Avatar */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-orange-200 shrink-0">
                        <img src={eng.avatar} alt={eng.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{eng.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{eng.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-slate-800">{eng.pecNo}</div>
                    <div className="text-[10px] text-slate-500">{eng.contact}</div>
                  </td>

                  {/* Division */}
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {eng.assignedDivision}
                  </td>

                  {/* Assigned Houses */}
                  <td className="py-4 px-4">
                    <div className="font-mono font-black text-orange-700">
                      {eng.assignedHousesCount} Houses
                    </div>
                    <div className="text-[9.5px] text-slate-400 truncate max-w-[130px]">
                      {eng.assignedHouses?.join(', ') || 'None'}
                    </div>
                  </td>

                  {/* Completed Visits */}
                  <td className="py-4 px-4 font-bold text-slate-800">
                    <span className="font-mono font-extrabold text-emerald-700">{eng.completedVisits}</span> Visits
                  </td>

                  {/* Training Sessions */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-purple-900 font-mono">
                      {eng.trainingSessionsConducted} Sessions
                    </div>
                    <div className="text-[10px] text-purple-700">
                      {eng.workersTrained} Workers Trained
                    </div>
                  </td>

                  {/* Status & Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px] mb-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{eng.rating}</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-black ${
                        eng.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {eng.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedEngineerForScorecard(eng)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-800 hover:text-orange-700 text-[11px] font-extrabold rounded-lg shadow-2xs transition cursor-pointer"
                        title="View Scorecard"
                      >
                        Scorecard
                      </button>

                      <button
                        onClick={() => {
                          setAssignHousesModalEngineer(eng);
                          setSelectedHouseToAssign(houses[0]?.id || '');
                        }}
                        className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100 text-[11px] font-bold rounded-lg transition cursor-pointer"
                        title="Assign Houses"
                      >
                        + House
                      </button>

                      <button
                        onClick={() => toggleEngineerStatus(eng.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Toggle Active/Inactive"
                      >
                        {eng.status === 'Active' ? <X className="h-3.5 w-3.5 text-rose-500" /> : <Check className="h-3.5 w-3.5 text-emerald-500" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: REGISTER NEW ENGINEER
         ========================================================================= */}
      {isAddEngineerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Register Field Engineer (PEC)
              </h3>
              <button
                onClick={() => setIsAddEngineerModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Add Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PERFORMANCE SCORECARD
         ========================================================================= */}
      {selectedEngineerForScorecard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl overflow-hidden ring-1 ring-orange-300">
                  <img src={selectedEngineerForScorecard.avatar} alt="Engineer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{selectedEngineerForScorecard.name}</h3>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedEngineerForScorecard.pecNo}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEngineerForScorecard(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scorecard Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Inspection Compliance</span>
                <div className="text-xl font-black text-emerald-950 mt-0.5">{selectedEngineerForScorecard.safetyComplianceScore}%</div>
                <span className="text-[10px] text-emerald-700">Top Tier Field Officer</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Quality Rating</span>
                <div className="text-xl font-black text-amber-950 mt-0.5 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>{selectedEngineerForScorecard.rating} / 5.0</span>
                </div>
                <span className="text-[10px] text-amber-700">Based on 40+ inspections</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Visits Completed</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">{selectedEngineerForScorecard.completedVisits} Visits</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Workers Trained</span>
                <div className="text-lg font-black text-purple-900 mt-0.5">{selectedEngineerForScorecard.workersTrained} Trained</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Assigned Houses ({selectedEngineerForScorecard.assignedHousesCount}):</span>
              <div className="text-[11px] text-slate-600 font-mono">
                {selectedEngineerForScorecard.assignedHouses?.join(', ') || 'No active houses'}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEngineerForScorecard(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 transition"
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
              <h3 className="text-sm font-black text-slate-900">
                Assign House to {assignHousesModalEngineer.name}
              </h3>
              <button
                onClick={() => setAssignHousesModalEngineer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
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
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
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
