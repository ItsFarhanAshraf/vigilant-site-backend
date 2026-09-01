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
  Info,
  LayoutGrid,
  List,
  Send,
  Bell,
  Sun,
  CloudRain
} from 'lucide-react';

export const EnvironmentalMonitoring = () => {
  const { t } = useLanguage();
  const { houses } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'
  const [advisorySentHouseId, setAdvisorySentHouseId] = useState(null);

  // Compute environmental metrics across Punjab project sites
  const avgTemp = Math.round(houses.reduce((acc, h) => acc + (h.temperature || 32), 0) / (houses.length || 1));
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

  const handleSendAdvisory = (houseId, district) => {
    setAdvisorySentHouseId(houseId);
    setTimeout(() => {
      setAdvisorySentHouseId(null);
    }, 3000);
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Critical':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Environmental & Weather Monitoring
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800">
              Live Meteorological Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time microclimate sensors, monsoon precipitation warnings, heatwave alerts, and site stoppage protocols
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PMD Radar Active (Punjab Grid)</span>
          </span>
        </div>
      </div>

      {/* Weather Gauges Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <ThermometerSun className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Average Temperature</span>
            <span className="text-2xl font-black text-slate-900 block font-mono">{avgTemp}°C</span>
            <span className="text-[10px] text-amber-700 font-bold">Max 42°C in Bahawalpur</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Monsoon Precipitation</span>
            <span className="text-2xl font-black text-sky-900 block font-mono">Sialkot</span>
            <span className="text-[10px] text-sky-700 font-bold">45mm heavy rainfall warning</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Wind Velocity</span>
            <span className="text-2xl font-black text-indigo-900 block font-mono">24 km/h</span>
            <span className="text-[10px] text-indigo-700 font-bold">Gujranwala Corridor</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Advisory Triggered</span>
            <span className="text-2xl font-black text-rose-700 block font-mono">{criticalRiskHouses.length} Sites</span>
            <span className="text-[10px] text-rose-600 font-bold">Mandatory hydration & pausing</span>
          </div>
        </div>
      </div>

      {/* Active Regional Directives Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black shrink-0 mt-0.5">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-900">South Punjab Heatwave Protocol</h3>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-md font-extrabold bg-amber-200 text-amber-900">42°C Extreme</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Mandatory work stoppage enforced in <strong>Bahawalpur & Rahim Yar Khan</strong> from 12:00 PM to 03:00 PM. Hydration breaks every 45 mins.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black shrink-0 mt-0.5">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black text-slate-900">Upper Punjab Monsoon Warning</h3>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-md font-extrabold bg-sky-200 text-sky-900">Rain Alert</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Concrete roof slab casting restricted in <strong>Sialkot & Gujranwala</strong> for next 24 hours. Cover exposed rebar and electrical panels.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search house by ID, district, weather..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-medium transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            {['ALL', 'Critical', 'High', 'Medium', 'Low'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                  riskFilter === r
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? 'All Sites' : `${r} Risk`}
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

      {/* Notification Toast */}
      {advisorySentHouseId && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in">
          <span>Direct Weather Advisory successfully dispatched via SMS & WhatsApp to Engineer for site {advisorySentHouseId}!</span>
          <button onClick={() => setAdvisorySentHouseId(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* VIEW 1: SITE MICROCLIMATE CARDS (GRID VIEW) */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredHouses.map((h) => (
            <div
              key={h.id}
              className={`bg-white rounded-3xl p-5 border shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 ${
                h.environmentalRisk === 'Critical' || h.environmentalRisk === 'High'
                  ? 'border-amber-300/80 ring-1 ring-amber-200'
                  : 'border-slate-200/80'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-black text-orange-700">{h.id}</span>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">{h.ownerName}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="h-3 w-3 text-orange-600" />
                      <span>{h.district}, {h.division}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider shrink-0 ${getRiskBadge(h.environmentalRisk)}`}>
                    {h.environmentalRisk} Risk
                  </span>
                </div>

                {/* Weather Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Conditions</span>
                    <span className="font-bold text-slate-900 text-xs truncate block">{h.weather}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <span className="text-[10px] text-amber-800 font-bold block">Temperature</span>
                    <span className="font-mono font-black text-amber-900 text-sm">{h.temperature}°C</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-sky-50/50 border border-sky-100">
                    <span className="text-[10px] text-sky-800 font-bold block">Precipitation</span>
                    <span className="font-mono font-black text-sky-900 text-xs">
                      {h.district === 'Sialkot' ? '45mm' : '0mm'}
                    </span>
                  </div>
                </div>

                {/* Directive Status */}
                <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Site Directive:</span>
                  {h.temperature >= 40
                    ? 'Enforce shade breaks & hydration every 45 mins.'
                    : h.district === 'Sialkot'
                    ? 'Concrete pouring paused for 24h during cloudburst.'
                    : 'Standard site operations clear under current weather.'}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleSendAdvisory(h.id, h.district)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Send className="h-3.5 w-3.5 text-amber-400" />
                  <span>Send Advisory to Engineer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-5 whitespace-nowrap">House ID & Owner</th>
                  <th className="py-4 px-4 whitespace-nowrap">Location</th>
                  <th className="py-4 px-4 whitespace-nowrap">Current Weather</th>
                  <th className="py-4 px-4 whitespace-nowrap">Temperature</th>
                  <th className="py-4 px-4 whitespace-nowrap">Precipitation & Flood</th>
                  <th className="py-4 px-4 whitespace-nowrap">Site Risk Level</th>
                  <th className="py-4 px-5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHouses.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-mono font-black text-orange-700">{h.id}</div>
                      <div className="text-[11px] text-slate-600">{h.ownerName}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{h.district}, {h.division}</div>
                      <div className="text-[10px] text-slate-400">{h.tehsil}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-900">
                      {h.weather}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-slate-900 text-sm">{h.temperature}°C</span>
                      <span className="text-[10px] text-slate-400 block">{h.temperature >= 40 ? 'Extreme Heat' : 'Moderate'}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {h.district === 'Sialkot' ? (
                        <span className="font-bold text-rose-700">45mm Rainfall Warning</span>
                      ) : (
                        <span className="text-slate-500">Normal (0mm)</span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getRiskBadge(h.environmentalRisk)}`}>
                        {h.environmentalRisk} Risk
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleSendAdvisory(h.id, h.district)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
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
      )}
    </div>
  );
};
