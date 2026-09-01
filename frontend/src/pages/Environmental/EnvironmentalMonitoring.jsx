import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  CloudSun,
  ThermometerSun,
  Droplets,
  Wind,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const EnvironmentalMonitoring = () => {
  const { t } = useLanguage();
  const { houses } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Compute environmental metrics across Punjab project sites
  const avgTemp = Math.round(houses.reduce((acc, h) => acc + (h.temperature || 32), 0) / houses.length);
  const criticalRiskHouses = houses.filter((h) => h.environmentalRisk === 'Critical' || h.environmentalRisk === 'High');
  const mediumRiskHouses = houses.filter((h) => h.environmentalRisk === 'Medium');
  const lowRiskHouses = houses.filter((h) => h.environmentalRisk === 'Low');

  const filteredHouses = houses.filter((h) => {
    if (riskFilter !== 'ALL' && h.environmentalRisk !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.id.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.division.toLowerCase().includes(q) ||
        h.weather.toLowerCase().includes(q) ||
        h.ownerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Environmental Monitoring & Weather Risk System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time microclimate conditions, heatwaves, monsoon rainfall, and flood susceptibility at construction sites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <CloudSun className="h-4 w-4 text-amber-600" />
            <span>Punjab Met Department Feed Live</span>
          </span>
        </div>
      </div>

      {/* Weather & Environmental Gauges (4 Top Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Gauge 1: Temperature */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black shrink-0">
            <ThermometerSun className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Temp</span>
            <span className="text-2xl font-black text-slate-900 block">{avgTemp}°C</span>
            <span className="text-[9.5px] text-amber-700 font-bold">Max 42°C in RYK</span>
          </div>
        </div>

        {/* Gauge 2: Monsoon Rainfall Alert */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-black shrink-0">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rainfall Warning</span>
            <span className="text-2xl font-black text-sky-900 block">Sialkot</span>
            <span className="text-[9.5px] text-sky-700 font-bold">45mm precipitation</span>
          </div>
        </div>

        {/* Gauge 3: Wind & Dust Storm Risk */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-black shrink-0">
            <Wind className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wind Velocity</span>
            <span className="text-2xl font-black text-indigo-900 block">24 km/h</span>
            <span className="text-[9.5px] text-indigo-600 font-bold">Gujranwala Corridor</span>
          </div>
        </div>

        {/* Gauge 4: Critical Sites Flagged */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-black shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Risk Sites</span>
            <span className="text-2xl font-black text-rose-700 block">{criticalRiskHouses.length}</span>
            <span className="text-[9.5px] text-rose-600 font-bold">Advisories Dispatched</span>
          </div>
        </div>
      </div>

      {/* Active Environmental Advisories Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900">
              Active Regional Alert: South Punjab Heatwave & Upper Punjab Monsoon Front
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Work stoppage advisory active in Bahawalpur & RYK between 12:00 PM – 03:00 PM. Slab casting restricted in Sialkot & Gujranwala during heavy cloudburst.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search house by ID, district, weather..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500">Risk Level:</span>
          {['ALL', 'Critical', 'High', 'Medium', 'Low'].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                riskFilter === r
                  ? 'bg-slate-900 text-white font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* House Environmental Risk Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-5">House ID</th>
                <th className="py-3.5 px-4">Location / Tehsil</th>
                <th className="py-3.5 px-4">Current Weather</th>
                <th className="py-3.5 px-4">Temperature</th>
                <th className="py-3.5 px-4">Flood & Rain Risk</th>
                <th className="py-3.5 px-4">Heat Stress Risk</th>
                <th className="py-3.5 px-4">Overall Site Risk</th>
                <th className="py-3.5 px-5 text-right">Site Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHouses.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-5">
                    <div className="font-mono font-black text-orange-700">{h.id}</div>
                    <div className="text-[10px] text-slate-500">{h.ownerName}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800">{h.district}, {h.division}</div>
                    <div className="text-[10px] text-slate-500">{h.tehsil}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900">{h.weather}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-slate-800 text-[12px]">{h.temperature}°C</div>
                    <div className="text-[9.5px] text-slate-400">{h.temperature > 38 ? 'Extreme Heat' : 'Moderate'}</div>
                  </td>

                  <td className="py-4 px-4">
                    {h.district === 'Sialkot' ? (
                      <span className="font-extrabold text-rose-700">Critical Rainfall (High)</span>
                    ) : (
                      <span className="text-slate-600">Low / Stable</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    {h.temperature >= 40 ? (
                      <span className="font-extrabold text-amber-700">Extreme Heatwave (Orange)</span>
                    ) : (
                      <span className="text-slate-600">Normal</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getRiskBadge(
                        h.environmentalRisk
                      )}`}
                    >
                      {h.environmentalRisk} Risk
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => alert(`Weather Advisory dispatched for ${h.id} (${h.district}): Maintain safety protocols and hydrate workforce.`)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-800 hover:text-orange-700 text-[11px] font-bold rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      Send Advisory
                    </button>
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
