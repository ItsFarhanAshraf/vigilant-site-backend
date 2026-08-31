import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { projectsApi, complianceApi, reviewApi } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';
import { ProgressBar } from '../../components/common/StatCard';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  FileCheck,
  AlertTriangle,
  Upload,
  User,
  ShieldCheck,
  ChevronLeft,
  DollarSign,
  Phone,
  HardHat,
  Send,
  Plus
} from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isEngineer } = useAuth();
  const { t, isRTL } = useLanguage();

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [visits, setVisits] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [scores, setScores] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('milestones');

  // Complete Milestone Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [submittingMilestone, setSubmittingMilestone] = useState(false);
  const [milestoneRemarks, setMilestoneRemarks] = useState('');
  const [photoInput, setPhotoInput] = useState('');
  const [photosList, setPhotosList] = useState(['/media/photos/sample_site_photo_1.jpg']);
  const [milestoneError, setMilestoneError] = useState('');

  // Create Visit Modal
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [visitError, setVisitError] = useState('');
  const [visitData, setVisitData] = useState({
    visit_no: 'ONE',
    visit_date: new Date().toISOString().slice(0, 16),
    latitude: 31.5204,
    longitude: 74.3587,
    progress_pct_reported: 25.0,
    engineer_remarks: 'Site inspection conducted; foundations verified in compliance with engineering standard.',
  });

  useEffect(() => {
    loadAllProjectData();
  }, [id]);

  const loadAllProjectData = async () => {
    setLoading(true);
    try {
      const pRes = await projectsApi.getProject(id);
      const projData = pRes?.data || null;
      setProject(projData);

      if (projData) {
        setVisitData(prev => ({
          ...prev,
          latitude: projData.latitude || 31.5204,
          longitude: projData.longitude || 74.3587,
          progress_pct_reported: projData.overall_progress_pct || 10,
        }));
      }

      const mRes = await projectsApi.getMilestones(id);
      setMilestones(mRes?.data || []);

      const vRes = await projectsApi.getVisits(id);
      setVisits(vRes?.data || []);

      const phRes = await projectsApi.getPhotos(id);
      setPhotos(phRes?.data || []);

      try {
        const scRes = await complianceApi.getScores(id);
        setScores(scRes?.data || null);
      } catch (e) {
        console.error('Scores error', e);
      }

      try {
        const rRes = await reviewApi.getReviewHistory(id);
        setReviews(rRes?.data || []);
      } catch (e) {
        console.error('Review history error', e);
      }
    } catch (err) {
      console.error('Failed to load project details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCompleteModal = (m) => {
    setSelectedMilestone(m);
    setMilestoneRemarks(m.remarks || '');
    setPhotosList([
      `/media/photos/${project?.case_id}_m${m.milestone_no}_photo1.jpg`,
      `/media/photos/${project?.case_id}_m${m.milestone_no}_photo2.jpg`,
    ]);
    setMilestoneError('');
    setCompleteModalOpen(true);
  };

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setPhotosList([...photosList, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleRemovePhoto = (idx) => {
    setPhotosList(photosList.filter((_, i) => i !== idx));
  };

  const handleCompleteMilestoneSubmit = async (e) => {
    e.preventDefault();
    if (photosList.length === 0) {
      setMilestoneError('At least 1 photo reference is required.');
      return;
    }
    setSubmittingMilestone(true);
    setMilestoneError('');
    try {
      await projectsApi.completeMilestone(id, selectedMilestone.milestone_no, {
        remarks: milestoneRemarks,
        photos: photosList,
        latitude: project.latitude,
        longitude: project.longitude,
        gps_accuracy_m: 3.5,
      });
      setCompleteModalOpen(false);
      loadAllProjectData();
    } catch (err) {
      setMilestoneError(err?.response?.data?.message || err.message || 'Failed to complete milestone');
    } finally {
      setSubmittingMilestone(false);
    }
  };

  const handleCreateVisitSubmit = async (e) => {
    e.preventDefault();
    setSubmittingVisit(true);
    setVisitError('');
    try {
      await projectsApi.createVisit(id, {
        ...visitData,
        visit_date: new Date(visitData.visit_date).toISOString(),
      });
      setVisitModalOpen(false);
      loadAllProjectData();
    } catch (err) {
      setVisitError(err?.response?.data?.message || err.message || 'Failed to create visit');
    } finally {
      setSubmittingVisit(false);
    }
  };

  if (loading) {
    return <Spinner message="Loading 360° project view..." className="h-96" />;
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition cursor-pointer"
      >
        <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
        <span>{t('projectsDirectory')}</span>
      </button>

      {/* 360° Hero Card with vibrant UI */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white font-mono text-xs font-black shadow-sm">
                {project.case_id}
              </span>
              <Badge variant={project.site_risk_flag ? 'danger' : 'success'} size="sm">
                {project.site_risk_flag ? t('riskFlagged') : t('clearRisk')}
              </Badge>
              <Badge variant="primary" size="sm">
                {project.project_type?.replace(/_/g, ' ')}
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900">{project.owner_name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                {project.tehsil}, {project.district}, {project.division}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {project.owner_phone}
              </span>
              <span>{t('coordinates')}: {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}</span>
            </div>
          </div>

          {/* Progress Box */}
          <div className="w-full lg:w-72 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl p-4 border border-blue-200/70">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
              <span>{t('overallProgress')}</span>
              <span className="text-blue-900 font-extrabold">{project.overall_progress_pct?.toFixed(1)}%</span>
            </div>
            <ProgressBar
              progress={project.overall_progress_pct || 0}
              color={project.overall_progress_pct >= 100 ? 'emerald' : 'blue'}
              size="md"
              showLabel={false}
            />
            <div className="mt-2 text-[11px] font-bold text-slate-600 flex justify-between">
              <span>{t('currentStage')}:</span>
              <span className="text-blue-950">Milestone {project.current_milestone_no || 0} of 15</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">{t('plotSize')}</span>
            <div className="font-extrabold text-slate-900 mt-0.5">{project.plot_size_marla} Marla / {project.covered_area_sqft} sq ft</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">{t('loanApproved')}</span>
            <div className="font-extrabold text-slate-900 mt-0.5">PKR {Number(project.loan_approved).toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
            <span className="text-emerald-700 font-bold uppercase text-[10px] tracking-wider block">{t('loanDisbursed')}</span>
            <div className="font-black text-emerald-800 mt-0.5">PKR {Number(project.loan_disbursed).toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">{t('assignedEngineer')}</span>
            <div className="font-extrabold text-slate-900 mt-0.5 flex items-center gap-1">
              <HardHat className="h-3.5 w-3.5 text-blue-600" />
              <span>{project.assigned_engineer?.username || 'Unassigned'}</span>
            </div>
          </div>
        </div>

        {/* Compliance Badges Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-slate-700">{t('complianceAudit')}:</span>
            <span className="inline-flex items-center gap-1 text-xs">
              <span className="text-slate-500">{t('plansStatus')}:</span>
              <Badge variant={project.plans_status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                {project.plans_status}
              </Badge>
            </span>
            <span className="inline-flex items-center gap-1 text-xs">
              <span className="text-slate-500">{t('envStatus')}:</span>
              <Badge variant={project.environment_status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                {project.environment_status}
              </Badge>
            </span>
            <span className="inline-flex items-center gap-1 text-xs">
              <span className="text-slate-500">{t('qualStatus')}:</span>
              <Badge variant={project.quality_status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                {project.quality_status}
              </Badge>
            </span>
          </div>

          {scores && (
            <div className="flex items-center gap-3 text-xs font-extrabold">
              <span className="text-slate-700">{t('hseScore')}: <span className="text-blue-700">{scores.hse?.score}%</span></span>
              <span className="text-slate-700">{t('essScore')}: <span className="text-teal-700">{scores.ess?.score}%</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-2xl px-4 shadow-xs">
        <nav className="flex space-x-6 overflow-x-auto text-xs font-bold">
          {[
            { id: 'milestones', label: `${t('tabRoadmap')} (${milestones.length})` },
            { id: 'visits', label: `${t('tabVisits')} (${visits.length})` },
            { id: 'photos', label: `${t('tabPhotos')} (${photos.length})` },
            { id: 'compliance', label: t('tabCompliance') },
            { id: 'reviews', label: `${t('tabReviews')} (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-800 text-blue-900 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* TAB 1: 15 MILESTONES ROADMAP */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t('roadmapTitle')}</h2>
              <p className="text-xs text-slate-500">{t('roadmapDesc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((m) => {
              const isCompleted = m.status === 'COMPLETED';
              return (
                <div
                  key={m.id || m.milestone_no}
                  className={`rounded-2xl border p-4 transition-all relative ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-white text-xs font-black">
                      M{m.milestone_no}
                    </span>
                    <Badge variant={isCompleted ? 'success' : 'default'} size="sm">
                      {m.status}
                    </Badge>
                  </div>

                  <h3 className="mt-2.5 text-xs font-bold text-slate-900">
                    Milestone {m.milestone_no}
                  </h3>

                  {isCompleted ? (
                    <div className="mt-2 text-[11px] text-emerald-800 space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Verified on {new Date(m.completed_date).toLocaleDateString()}</span>
                      </div>
                      {m.remarks && <p className="text-slate-600 italic">"{m.remarks}"</p>}
                    </div>
                  ) : (
                    <div className="mt-3">
                      {(isAdmin || isEngineer) && (
                        <button
                          onClick={() => handleOpenCompleteModal(m)}
                          className="w-full py-2 px-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>{t('completeAndUpload')}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INSPECTION VISITS */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{t('inspectionVisits')}</h2>
            </div>
            {(isAdmin || isEngineer) && (
              <button
                onClick={() => setVisitModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>{t('logNewVisit')}</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {visits.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <Clock className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <span>No inspection visits recorded yet.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {visits.map((v) => (
                  <div key={v.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900 text-xs px-2.5 py-0.5 bg-blue-50 rounded-md border border-blue-200">
                          {v.visit_no}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {new Date(v.visit_date).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400">&bull; Inspector: {v.engineer?.username || 'Engineer'}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">{v.engineer_remarks || 'Inspection verified.'}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500 font-bold">{t('reportedProgress')}</span>
                      <div className="text-xl font-black text-slate-900">{v.progress_pct_reported}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PHOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">{t('sitePhotos')}</h2>
          {photos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              <Camera className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <span>No photos uploaded for this project yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((ph) => (
                <div key={ph.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={ph.image_ref.startsWith('/') ? ph.image_ref : `/${ph.image_ref}`}
                      alt={`Milestone ${ph.milestone_no}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60';
                      }}
                    />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/75 text-white text-[10px] font-black">
                      M{ph.milestone_no}
                    </span>
                  </div>
                  <div className="p-3 text-[11px] text-slate-600">
                    <div className="font-bold text-slate-800">
                      Captured: {new Date(ph.captured_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">{t('complianceAudit')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40">
                <span className="text-xs font-bold text-blue-900 block mb-2">{t('hseStandard')}</span>
                <div className="text-3xl font-black text-blue-900">{scores?.hse?.score || 0}%</div>
              </div>

              <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40">
                <span className="text-xs font-bold text-teal-900 block mb-2">{t('essSafeguards')}</span>
                <div className="text-3xl font-black text-teal-900">{scores?.ess?.score || 0}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">{t('reviewHistory')}</h3>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <span>No review history logged yet.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={r.decision === 'ACCEPTED' ? 'success' : r.decision === 'REJECTED' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {r.decision}
                      </Badge>
                      <span className="text-[11px] text-slate-400">{new Date(r.reviewed_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-700">
                      <strong>Final Grade:</strong> {r.final_grade} &bull; <strong>Remarks:</strong> {r.remarks || 'None'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPLETE MILESTONE MODAL */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title={`${t('completeMilestoneModalTitle')} ${selectedMilestone?.milestone_no}`}
      >
        {milestoneError && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-bold">
            {milestoneError}
          </div>
        )}
        <form onSubmit={handleCompleteMilestoneSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">{t('fieldEngineerRemarks')} *</label>
            <textarea
              rows="3"
              required
              value={milestoneRemarks}
              onChange={(e) => setMilestoneRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">{t('uploadPhotosReq')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                placeholder="/media/photos/photo.jpg"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
              >
                {t('addPhoto')}
              </button>
            </div>

            <div className="mt-2 space-y-1.5">
              {photosList.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-mono text-slate-700 truncate max-w-sm">{p}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="text-rose-600 hover:text-rose-800 font-bold px-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCompleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submittingMilestone}
              className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
            >
              {submittingMilestone ? <Spinner size="sm" /> : t('confirmCompletion')}
            </button>
          </div>
        </form>
      </Modal>

      {/* LOG VISIT MODAL */}
      <Modal
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        title={t('logNewVisit')}
      >
        {visitError && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-bold">
            {visitError}
          </div>
        )}
        <form onSubmit={handleCreateVisitSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('visitNo')} *</label>
              <select
                value={visitData.visit_no}
                onChange={(e) => setVisitData({ ...visitData, visit_no: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
              >
                <option value="ONE">Visit 1</option>
                <option value="TWO">Visit 2</option>
                <option value="THREE">Visit 3</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('reportedProgress')} *</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                required
                value={visitData.progress_pct_reported}
                onChange={(e) => setVisitData({ ...visitData, progress_pct_reported: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">{t('fieldEngineerRemarks')} *</label>
            <textarea
              rows="3"
              required
              value={visitData.engineer_remarks}
              onChange={(e) => setVisitData({ ...visitData, engineer_remarks: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setVisitModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submittingVisit}
              className="px-5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
            >
              {submittingVisit ? <Spinner size="sm" /> : t('saveVisit')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
