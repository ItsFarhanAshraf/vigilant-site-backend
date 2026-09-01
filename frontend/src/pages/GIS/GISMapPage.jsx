import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  MapPin,
  Layers,
  Filter,
  Search,
  Maximize2,
  Minimize2,
  Building2,
  HardHat,
  ShieldAlert,
  CloudSun,
  Eye,
  CheckCircle2,
  Calendar,
  X,
  CreditCard,
  ThermometerSun
} from 'lucide-react';

export const GISMapPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetHouseId = searchParams.get('houseId');

  const { houses, engineers } = useDashboardData();

  const [selectedHouse, setSelectedHouse] = useState(
    targetHouseId ? houses.find((h) => h.id === targetHouseId) || houses[0] : houses[0]
  );

  // Filters State
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [engineerFilter, setEngineerFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayer, setActiveLayer] = useState('STANDARD'); // STANDARD | HEATMAP | SATELLITE
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Unique districts and stages
  const districtsList = Array.from(new Set(houses.map((h) => h.district)));
  const stagesList = ['Foundation', 'Structure', 'Roof', 'Electrical', 'Plumbing', 'Finishing', 'Completed'];

  // Filtered houses
  const filteredHouses = houses.filter((h) => {
    if (stageFilter !== 'ALL' && h.stage !== stageFilter) return false;
    if (statusFilter !== 'ALL' && h.status !== statusFilter) return false;
    if (districtFilter !== 'ALL' && h.district !== districtFilter) return false;
    if (engineerFilter !== 'ALL' && h.engineerName !== engineerFilter) return false;

    if (riskFilter === 'HIGH_RISK' && !(h.safetyIssuesCount > 0 || h.environmentalRisk === 'Critical')) return false;
    if (riskFilter === 'SAFE' && (h.safetyIssuesCount > 0 || h.environmentalRisk === 'Critical')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.id.toLowerCase().includes(q) ||
        h.ownerName.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getMarkerColor = (house) => {
    if (house.safetyIssuesCount > 0 || house.environmentalRisk === 'Critical') return 'bg-rose-600 ring-rose-300';
    if (house.status === 'Completed') return 'bg-emerald-600 ring-emerald-300';
    if (house.status === 'Under Construction') return 'bg-blue-600 ring-blue-300';
    return 'bg-amber-500 ring-amber-200';
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 p-6 overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-wider">
              GIS Geospatial Engine
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            GIS Interactive Program Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic visualization of ACAG houses, field clusters, risk zones, and construction milestones across Punjab
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold">
            <button
              onClick={() => setActiveLayer('STANDARD')}
              className={`px-3 py-1 rounded-lg transition ${
                activeLayer === 'STANDARD' ? 'bg-orange-600 text-white font-extrabold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Standard Pins
            </button>
            <button
              onClick={() => setActiveLayer('HEATMAP')}
              className={`px-3 py-1 rounded-lg transition ${
                activeLayer === 'HEATMAP' ? 'bg-orange-600 text-white font-extrabold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Risk Heatmap
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Search */}
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search house/owner..."
              className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 font-semibold"
            />
          </div>

          {/* 2. Construction Stage */}
          <div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
            >
              <option value="ALL">All Stages</option>
              {stagesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 3. House Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* 4. District */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
            >
              <option value="ALL">All Districts</option>
              {districtsList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 5. Engineer */}
          <div>
            <select
              value={engineerFilter}
              onChange={(e) => setEngineerFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
            >
              <option value="ALL">All Engineers</option>
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.name}>{eng.name}</option>
              ))}
            </select>
          </div>

          {/* 6. Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
            >
              <option value="ALL">All Risk Profiles</option>
              <option value="HIGH_RISK">High / Critical Risk Only</option>
              <option value="SAFE">Safe / Low Risk Only</option>
            </select>
          </div>
        </div>

        {/* Marker Color Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-emerald-600" /> Green = Completed
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-blue-600" /> Blue = Construction
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-amber-500" /> Yellow = Pending
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-rose-600 animate-pulse" /> Red = High Risk
            </span>
          </div>

          <span className="text-slate-500">
            Showing <strong className="text-slate-900 font-mono">{filteredHouses.length}</strong> of {houses.length} mapped houses
          </span>
        </div>
      </div>

      {/* Main Map Canvas & Sidebar Flyout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Full Interactive Punjab Map (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          {/* Map Surface Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/5 via-slate-100 to-amber-950/10" />
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

          {/* District Boundary Cluster Background Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-orange-200/60 pointer-events-none opacity-40" />

          {/* Map Top Status Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-800 shadow-xs flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-orange-600" />
              <span>Punjab Province Geospatial Grid</span>
            </span>

            {activeLayer === 'HEATMAP' && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow animate-pulse">
                Risk Intensity Layer Active
              </span>
            )}
          </div>

          {/* Geo-Markers Canvas */}
          <div className="relative w-full h-96 my-auto">
            {filteredHouses.map((h, i) => {
              // Custom geographic coordinate offsets mapped into canvas viewport
              const customPositions = [
                { top: '15%', left: '36%' }, // Rawalpindi
                { top: '32%', left: '60%' }, // Gujranwala
                { top: '42%', left: '74%' }, // Lahore
                { top: '48%', left: '42%' }, // Faisalabad
                { top: '68%', left: '26%' }, // Multan
                { top: '78%', left: '42%' }, // Bahawalpur
                { top: '26%', left: '22%' }, // Sargodha
                { top: '48%', left: '72%' }, // Kasur
                { top: '56%', left: '60%' }, // Okara
                { top: '88%', left: '22%' }, // Rahim Yar Khan
                { top: '44%', left: '76%' }, // Lahore Cantt
                { top: '30%', left: '68%' }, // Sialkot
              ][i] || { top: '50%', left: '50%' };

              const isSelected = selectedHouse?.id === h.id;

              return (
                <div
                  key={h.id}
                  style={customPositions}
                  onClick={() => setSelectedHouse(h)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    className={`h-8 w-8 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-white ring-2 transition-all duration-300 group-hover:scale-125 ${getMarkerColor(
                      h
                    )} ${isSelected ? 'scale-125 ring-4 ring-orange-500 shadow-orange-500/30 z-30' : ''}`}
                  >
                    {h.progressPct}%
                  </div>

                  <span className="text-[9px] font-extrabold bg-white/95 text-slate-800 px-1.5 py-0.5 rounded shadow border border-slate-200 mt-1 block whitespace-nowrap group-hover:scale-105 transition">
                    {h.district} • {h.id}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-[10px] text-slate-400 font-bold">
            Live GPS telemetry updated via field engineer mobile app inspection check-ins
          </div>
        </div>

        {/* Selected House Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                {selectedHouse.id}
              </span>
              <h2 className="text-base font-black text-slate-900 mt-1">{selectedHouse.ownerName}</h2>
              <p className="text-xs text-slate-500">{selectedHouse.address}</p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
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

          {/* Photo */}
          <div className="rounded-2xl overflow-hidden h-40 border border-slate-200 relative">
            <img src={selectedHouse.photoUrl} alt="House" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
              Lat: {selectedHouse.lat}, Lng: {selectedHouse.lng}
            </div>
          </div>

          {/* Quick Details Table */}
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Construction Stage:</span>
              <span className="font-extrabold text-slate-900">{selectedHouse.stage} ({selectedHouse.progressPct}%)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Assigned Engineer:</span>
              <span className="font-extrabold text-slate-900">{selectedHouse.engineerName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Loan Disbursed:</span>
              <span className="font-mono font-black text-emerald-700">PKR {(selectedHouse.loanDisbursed / 1000).toLocaleString()}k</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Safety Condition:</span>
              <span
                className={`font-black ${
                  selectedHouse.safetyIssuesCount > 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {selectedHouse.safetyStatus} ({selectedHouse.safetyIssuesCount} issues)
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Microclimate / Risk:</span>
              <span className="font-bold text-amber-800">{selectedHouse.weather} ({selectedHouse.temperature}°C) • {selectedHouse.environmentalRisk} Risk</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => navigate(`/houses?highlight=${selectedHouse.id}`)}
              className="w-full py-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>Open 360° House Management</span>
            </button>

            <button
              onClick={() => navigate(`/engineer-visits`)}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
            >
              Schedule Engineer Inspection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
