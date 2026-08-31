import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { reviewApi, projectsApi } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ShieldCheck,
  Send,
  Eye,
  Camera
} from 'lucide-react';

export const ReviewDetail = () => {
  const { projectId, milestoneNo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState('ACCEPTED');
  const [finalGrade, setFinalGrade] = useState('A');
  const [remarks, setRemarks] = useState('Milestone execution meets structural engineering standards and design specs.');
  const [rectificationInstructions, setRectificationInstructions] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const pRes = await projectsApi.getProject(projectId);
      setProject(pRes?.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (decision === 'REJECTED' && !rectificationInstructions.trim()) {
      setError('Rectification instructions are mandatory when rejecting a milestone.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await reviewApi.submitReview(projectId, {
        milestone_no: parseInt(milestoneNo, 10),
        decision,
        final_grade: finalGrade,
        remarks,
        rectification_instructions: decision === 'REJECTED' ? rectificationInstructions : undefined,
      });
      navigate('/review-queue');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner message="Loading AI vision analysis..." className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/review-queue')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-900 transition cursor-pointer"
      >
        <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
        <span>{t('reviewQueueTitle')}</span>
      </button>

      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 p-6 text-white shadow-lg border border-purple-700/30 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-white/20 font-black">
              {project?.case_id}
            </span>
            <span className="text-xs text-purple-200">Milestone {milestoneNo} of 15</span>
          </div>
          <h1 className="text-xl font-extrabold mt-1">{project?.owner_name}</h1>
        </div>
        <Badge variant="warning" size="md">Pending Review</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Photo Inspection & AI Outputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">Field Photo Inspection</h2>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-bold">Live Feed</span>
            </div>

            <div className="h-80 bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60"
                alt="Site Inspection"
                className="w-full h-full object-cover"
              />
              {/* Defect Detection Box Overlay */}
              <div className="absolute top-1/4 left-1/3 border-2 border-emerald-400 bg-emerald-400/20 px-2 py-1 rounded text-white text-[10px] font-bold backdrop-blur-xs">
                ✓ Foundation Reinforcement (96.4%)
              </div>
            </div>
          </div>

          {/* AI Vision Metrics Card */}
          <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-sm bg-purple-50/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-700" />
              <h3 className="text-xs font-black text-purple-900 uppercase tracking-wider">{t('aiAnalysisOutput')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-2xs">
                <span className="text-slate-500 font-bold text-[10px] block">{t('stageMatchConfidence')}</span>
                <span className="text-xl font-black text-emerald-700 mt-1 block">96.8% Match</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-2xs">
                <span className="text-slate-500 font-bold text-[10px] block">{t('blurScore')}</span>
                <span className="text-xl font-black text-blue-700 mt-1 block">8.7 / 10 (Clear)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Decision Workspace (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider pb-3 border-b border-slate-100">
              {t('decisionWorkspace')}
            </h2>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Decision Radio Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">{t('decision')} *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ACCEPTED', label: t('accept'), color: 'hover:bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { id: 'OVERRIDDEN', label: t('override'), color: 'hover:bg-amber-50 text-amber-700 border-amber-200' },
                    { id: 'REJECTED', label: t('reject'), color: 'hover:bg-rose-50 text-rose-700 border-rose-200' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setDecision(btn.id)}
                      className={`p-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer text-center ${
                        decision === btn.id
                          ? btn.id === 'ACCEPTED'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : btn.id === 'OVERRIDDEN'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-rose-600 text-white border-rose-600'
                          : `bg-white ${btn.color}`
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('finalGrade')}</label>
                <select
                  value={finalGrade}
                  onChange={(e) => setFinalGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                >
                  <option value="A">Grade A (Optimal / Compliant)</option>
                  <option value="B">Grade B (Satisfactory)</option>
                  <option value="C">Grade C (Minor Defect / Acceptable)</option>
                  <option value="REJECTED">Grade F (Non-Compliant / Rejected)</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('remarks')} *</label>
                <textarea
                  rows="3"
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Rectification Mandatory field for Rejected */}
              {decision === 'REJECTED' && (
                <div>
                  <label className="block font-bold text-rose-700 mb-1">{t('rectificationMandatory')} *</label>
                  <textarea
                    rows="3"
                    required
                    value={rectificationInstructions}
                    onChange={(e) => setRectificationInstructions(e.target.value)}
                    className="w-full px-3 py-2 border border-rose-300 rounded-xl bg-rose-50/50 text-rose-900"
                    placeholder="Specific engineering steps field engineer must take before re-submitting..."
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold shadow-md shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Spinner size="sm" /> : t('submitReview')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
