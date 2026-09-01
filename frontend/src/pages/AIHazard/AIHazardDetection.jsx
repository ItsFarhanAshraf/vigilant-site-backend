import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  Cpu,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Eye,
  Check,
  X,
  Camera,
  RotateCcw,
  UserCheck,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';

export const AIHazardDetection = () => {
  const { t } = useLanguage();
  const { aiHazards, engineers, resolveAiHazard } = useDashboardData();

  const [selectedHazard, setSelectedHazard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totalImagesAnalyzed = 1420;
  const totalHazardsDetected = aiHazards.length + 32;
  const criticalHazards = aiHazards.filter((h) => h.severity === 'Critical').length + 8;
  const resolvedHazards = aiHazards.filter((h) => h.status === 'Resolved').length + 24;
  const pendingHazards = aiHazards.filter((h) => h.status === 'Pending Review').length;

  const filteredHazards = aiHazards.filter((h) => {
    if (activeFilter === 'PENDING' && h.status !== 'Pending Review') return false;
    if (activeFilter === 'RESOLVED' && h.status !== 'Resolved') return false;
    if (activeFilter === 'CRITICAL' && h.severity !== 'Critical') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        h.id.toLowerCase().includes(q) ||
        h.houseId.toLowerCase().includes(q) ||
        h.hazardName.toLowerCase().includes(q) ||
        h.engineerAssigned.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> ACAG AI Vision Engine
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
            AI Automated Hazard Detection
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep learning computer vision auditing site photos for PPE violations, scaffolding hazards, and structural defects
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>YOLOv8 & OpenCV Pipeline Active (98.4% Acc)</span>
          </span>
        </div>
      </div>

      {/* Top 5 AI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Images Analyzed</span>
            <span className="text-xl font-black text-slate-900 block">{totalImagesAnalyzed}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 flex items-center justify-center font-black shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Hazards Detected</span>
            <span className="text-xl font-black text-orange-700 block">{totalHazardsDetected}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-black shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Critical Hazards</span>
            <span className="text-xl font-black text-rose-700 block">{criticalHazards}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Hazards</span>
            <span className="text-xl font-black text-emerald-700 block">{resolvedHazards}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Pending Review</span>
            <span className="text-xl font-black text-amber-700 block">{pendingHazards}</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hazard name, house ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['ALL', 'PENDING', 'CRITICAL', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeFilter === f
                  ? 'bg-slate-900 text-white font-extrabold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* AI Hazards Visual Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHazards.map((hazard) => (
          <div
            key={hazard.id}
            className={`bg-white rounded-3xl p-5 border shadow-2xs space-y-4 hover:shadow-md transition ${
              hazard.status === 'Pending Review' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
            }`}
          >
            {/* Visual Image with Computer Vision Bounding Box Overlay */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <img
                src={hazard.imageUrl}
                alt={hazard.hazardName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Bounding Box Visual Overlay */}
              {hazard.boundingBox && (
                <div
                  style={{
                    top: hazard.boundingBox.y,
                    left: hazard.boundingBox.x,
                    width: hazard.boundingBox.width,
                    height: hazard.boundingBox.height,
                  }}
                  className="absolute border-2 border-rose-500 bg-rose-500/20 animate-pulse pointer-events-none rounded"
                >
                  <span className="absolute -top-6 left-0 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    {hazard.hazardName} ({hazard.confidence}%)
                  </span>
                </div>
              )}

              {/* Top Status Tags on Image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[10px] font-black bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg">
                  {hazard.id} • {hazard.houseId}
                </span>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black backdrop-blur-md ${
                    hazard.severity === 'Critical'
                      ? 'bg-rose-600/90 text-white'
                      : 'bg-amber-600/90 text-white'
                  }`}
                >
                  {hazard.severity} Severity
                </span>
              </div>

              {/* Bottom Confidence Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl text-white flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>AI Model Confidence:</span>
                </div>
                <span className="font-mono text-emerald-400 font-black">{hazard.confidence}%</span>
              </div>
            </div>

            {/* Hazard Metadata */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{hazard.hazardName}</h3>
                  <p className="text-[11px] text-slate-500">{hazard.houseAddress}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    hazard.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {hazard.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Assigned Engineer</span>
                  <span className="font-bold text-slate-800 truncate block">{hazard.engineerAssigned}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Detected Time</span>
                  <span className="font-bold text-slate-800 block">{hazard.detectedAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedHazard(hazard)}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-800 text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Full Evidence</span>
              </button>

              {hazard.status === 'Pending Review' && (
                <button
                  onClick={() => resolveAiHazard(hazard.id)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Mark Hazard Resolved</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MODAL: FULL EVIDENCE VIEWER
         ========================================================================= */}
      {selectedHazard && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedHazard.hazardName}</h3>
                <p className="text-[11px] text-slate-500">{selectedHazard.id} • {selectedHazard.houseId}</p>
              </div>
              <button
                onClick={() => setSelectedHazard(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 relative">
              <img src={selectedHazard.imageUrl} alt="Hazard Full Evidence" className="w-full h-80 object-cover" />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">AI Model Tag:</span>
                <span className="font-bold text-slate-900">{selectedHazard.hazardName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Classification Confidence:</span>
                <span className="font-bold text-emerald-700">{selectedHazard.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{selectedHazard.houseAddress}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedHazard(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
