import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  Users,
  HardHat,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileCheck,
  Hammer,
  Sparkles,
  Camera
} from 'lucide-react';

export const LabourManagement = () => {
  const { t } = useLanguage();
  const {
    workers,
    trainingTopics,
    houses,
    engineers,
    recordTrainingSession,
    addTrainingTopic,
  } = useDashboardData();

  const [activeTab, setActiveTab] = useState('WORKERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');

  // Modals
  const [isRecordSessionModalOpen, setIsRecordSessionModalOpen] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [selectedWorkerHistory, setSelectedWorkerHistory] = useState(null);

  // Training Session Form State
  const [sessionForm, setSessionForm] = useState({
    houseId: houses[0]?.id || '',
    engineerId: engineers[0]?.id || '',
    topic: trainingTopics[0]?.name || 'PPE Safety',
    date: new Date().toISOString().split('T')[0],
    duration: 45,
    selectedWorkers: [workers[0]?.name || 'Muhammad Khan'],
    evidenceUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    remarks: 'Workers instructed on mandatory hard hat and harness attachment.',
  });

  // Add Topic Form State
  const [topicForm, setTopicForm] = useState({
    name: '',
    duration: '30 mins',
    required: true,
    description: '',
  });

  const totalWorkers = workers.length;
  const trainedWorkers = workers.filter((w) => w.trainingStatus === 'Trained').length;
  const pendingTrainingWorkers = totalWorkers - trainedWorkers;
  const totalTrainingSessions = engineers.reduce((acc, e) => acc + (e.trainingSessionsConducted || 0), 0);

  // Skills list
  const skillsList = ['Mason', 'Electrician', 'Plumber', 'Carpenter', 'Welder', 'Painter'];

  const filteredWorkers = workers.filter((w) => {
    if (skillFilter !== 'ALL' && w.skill !== skillFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.id.toLowerCase().includes(q) ||
        w.name.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q) ||
        w.assignedHouseId.toLowerCase().includes(q) ||
        w.assignedHouseOwner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRecordSessionSubmit = (e) => {
    e.preventDefault();
    const targetEng = engineers.find((eng) => eng.id === Number(sessionForm.engineerId)) || engineers[0];

    recordTrainingSession({
      houseId: sessionForm.houseId,
      engineerId: targetEng.id,
      engineerName: targetEng.name,
      topic: sessionForm.topic,
      date: sessionForm.date,
      duration: sessionForm.duration,
      workersPresent: sessionForm.selectedWorkers,
      evidenceUrl: sessionForm.evidenceUrl,
      remarks: sessionForm.remarks,
    });

    setIsRecordSessionModalOpen(false);
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    addTrainingTopic({
      name: topicForm.name,
      duration: topicForm.duration,
      required: topicForm.required,
      description: topicForm.description,
    });
    setIsAddTopicModalOpen(false);
    setTopicForm({ name: '', duration: '30 mins', required: true, description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Labour Management & Worker Safety Training
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track site artisans, mandatory PPE skill certifications, and field training conducted during engineer visits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRecordSessionModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span>Record On-Site Training</span>
          </button>
        </div>
      </div>

      {/* Top 4 Training Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Workers</span>
            <span className="text-2xl font-black text-slate-900 block">{totalWorkers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fully Trained</span>
            <span className="text-2xl font-black text-emerald-700 block">{trainedWorkers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Training</span>
            <span className="text-2xl font-black text-amber-700 block">{pendingTrainingWorkers}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-black shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Training Sessions</span>
            <span className="text-2xl font-black text-purple-900 block">{totalTrainingSessions}</span>
          </div>
        </div>
      </div>

      {/* Main 3 Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'WORKERS', label: 'Registered Workers', icon: Users },
          { id: 'TOPICS', label: 'Training Topics Catalog', icon: BookOpen },
          { id: 'HISTORY', label: 'Worker Training Matrix & History', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: WORKERS DIRECTORY
         ========================================================================= */}
      {activeTab === 'WORKERS' && (
        <div className="space-y-4">
          {/* Search & Skill Filter Toolbar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search worker by name, skill, house..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Skill Trade:</span>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 cursor-pointer"
              >
                <option value="ALL">All Skills</option>
                {skillsList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Workers Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                    <th className="py-3.5 px-5">Worker ID</th>
                    <th className="py-3.5 px-4">Name & Contact</th>
                    <th className="py-3.5 px-4">Skill Trade</th>
                    <th className="py-3.5 px-4">Assigned House</th>
                    <th className="py-3.5 px-4">Training Status</th>
                    <th className="py-3.5 px-4">Safety Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-5 font-mono font-black text-slate-900">
                        {w.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900">{w.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{w.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                          {w.skill}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono font-black text-orange-700">{w.assignedHouseId}</div>
                        <div className="text-[10px] text-slate-500">{w.assignedHouseOwner}</div>
                      </td>
                      <td className="py-4 px-4">
                        {w.trainingStatus === 'Trained' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Check className="h-3 w-3" /> Fully Trained
                          </span>
                        ) : w.trainingStatus === 'In Progress' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200">
                            <Clock className="h-3 w-3" /> In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {w.safetyStatus === 'Safe' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3" /> Compliant
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" /> Warning
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedWorkerHistory(w)}
                          className="px-3 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-800 hover:text-orange-700 text-[11px] font-extrabold rounded-xl shadow-2xs transition cursor-pointer"
                        >
                          Training History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TRAINING TOPICS CATALOG
         ========================================================================= */}
      {activeTab === 'TOPICS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">Standard ACAG Safety Training Curriculum</h2>
            <button
              onClick={() => setIsAddTopicModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Training Topic</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainingTopics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      {topic.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        topic.required ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {topic.required ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900">{topic.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{topic.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Duration: <strong className="text-slate-800">{topic.duration}</strong></span>
                  <span className="text-purple-700 font-extrabold">{topic.trainedCount} Workers Trained</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: WORKER TRAINING MATRIX & HISTORY
         ========================================================================= */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">Worker Safety Training Matrix</h2>
              <p className="text-xs text-slate-500">Live qualification transcript of each artisan across mandatory modules</p>
            </div>

            <div className="space-y-3">
              {workers.map((worker) => (
                <div key={worker.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                        {worker.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{worker.name} ({worker.id})</div>
                        <div className="text-[10px] text-slate-500">{worker.skill} • Assigned to {worker.assignedHouseId} ({worker.assignedHouseOwner})</div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        worker.trainingStatus === 'Trained'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {worker.trainingStatus} ({worker.completedTopics.length} / {worker.completedTopics.length + worker.pendingTopics.length} Topics)
                    </span>
                  </div>

                  {/* Modules Progress Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {worker.completedTopics.map((topic, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>{topic} — Completed</span>
                      </span>
                    ))}
                    {worker.pendingTopics.map((topic, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="h-3 w-3 text-amber-600" />
                        <span>{topic} — Pending</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: RECORD ON-SITE TRAINING SESSION
         ========================================================================= */}
      {isRecordSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Record On-Site Labour Training
              </h3>
              <button
                onClick={() => setIsRecordSessionModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSessionSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    House Site
                  </label>
                  <select
                    value={sessionForm.houseId}
                    onChange={(e) => setSessionForm({ ...sessionForm, houseId: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    {houses.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id} ({h.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Conducting Engineer
                  </label>
                  <select
                    value={sessionForm.engineerId}
                    onChange={(e) => setSessionForm({ ...sessionForm, engineerId: e.target.value })}
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
                    Training Topic
                  </label>
                  <select
                    value={sessionForm.topic}
                    onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    {trainingTopics.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: Number(e.target.value) })}
                    min={15}
                    max={180}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Workers Present (Select all attendees)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {workers.map((w) => {
                    const isChecked = sessionForm.selectedWorkers.includes(w.name);
                    return (
                      <label key={w.id} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSessionForm({ ...sessionForm, selectedWorkers: [...sessionForm.selectedWorkers, w.name] });
                            } else {
                              setSessionForm({
                                ...sessionForm,
                                selectedWorkers: sessionForm.selectedWorkers.filter((n) => n !== w.name),
                              });
                            }
                          }}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className="font-bold text-slate-800">{w.name} ({w.skill})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Engineer Remarks & Assessment
                </label>
                <textarea
                  value={sessionForm.remarks}
                  onChange={(e) => setSessionForm({ ...sessionForm, remarks: e.target.value })}
                  placeholder="e.g. All workers demonstrated correct harness tying on 2nd level..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Save Training Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD TRAINING TOPIC
         ========================================================================= */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Add New Training Topic
              </h3>
              <button
                onClick={() => setIsAddTopicModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTopicSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  placeholder="e.g. Chemical Handling & Paint Safety"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Standard Duration
                  </label>
                  <input
                    type="text"
                    value={topicForm.duration}
                    onChange={(e) => setTopicForm({ ...topicForm, duration: e.target.value })}
                    placeholder="30 mins"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Requirement Type
                  </label>
                  <select
                    value={topicForm.required ? 'MANDATORY' : 'OPTIONAL'}
                    onChange={(e) => setTopicForm({ ...topicForm, required: e.target.value === 'MANDATORY' })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    <option value="MANDATORY">Mandatory for All</option>
                    <option value="OPTIONAL">Optional / Trade Specific</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Description / Curriculum Summary
                </label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  placeholder="Describe key learning objectives and demonstration requirements..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INDIVIDUAL WORKER HISTORY MODAL
         ========================================================================= */}
      {selectedWorkerHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {selectedWorkerHistory.name} — Training Transcript
                </h3>
                <p className="text-[11px] text-slate-500">
                  {selectedWorkerHistory.skill} • {selectedWorkerHistory.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedWorkerHistory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Completed Modules ({selectedWorkerHistory.completedTopics.length}):</span>
              <div className="space-y-1">
                {selectedWorkerHistory.completedTopics.map((topic, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950">{topic}</span>
                    <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Certified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedWorkerHistory.pendingTopics.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase text-slate-400">Pending Required Modules ({selectedWorkerHistory.pendingTopics.length}):</span>
                <div className="space-y-1">
                  {selectedWorkerHistory.pendingTopics.map((topic, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-950">{topic}</span>
                      <span className="font-extrabold text-amber-700">Scheduled on next visit</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedWorkerHistory(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
