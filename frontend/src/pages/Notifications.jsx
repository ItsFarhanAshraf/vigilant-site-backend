import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Bell,
  AlertTriangle,
  Clock,
  Info,
  CheckCircle2,
  Check,
  Settings,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const Notifications = () => {
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      type: 'CRITICAL',
      title: 'AI Inspection Failed — ACAG-G-2567',
      description: 'Computer vision detected structural deviation at GT Road, Gujranwala. Immediate review required.',
      time: '2 min ago',
      isUnread: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      type: 'WARNING',
      title: 'Installment Overdue — Ali Hassan',
      description: 'Installment 3 of 5 for ACAG-R-2210 is 12 days overdue. Amount: Rs84,000.',
      time: '1 hr ago',
      isUnread: true,
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      type: 'SUCCESS',
      title: 'Quality Milestone Approved — ACAG-L-4521',
      description: 'Plinth level approved by backend review engineer. Capital installment released.',
      time: '3 hrs ago',
      isUnread: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      type: 'INFO',
      title: 'New Project Registered — ACAG-F-1187',
      description: 'Beneficiary registration completed at Sargodha Rd, Faisalabad.',
      time: '5 hrs ago',
      isUnread: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      type: 'SUCCESS',
      title: 'Handover Certificate Issued — ACAG-M-0934',
      description: 'Final handover completed and verified with dual digital signatures.',
      time: '1 day ago',
      isUnread: false,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const filteredItems = notificationsList.filter((n) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return n.isUnread;
    if (activeFilter === 'CRITICAL') return n.type === 'CRITICAL';
    if (activeFilter === 'WARNING') return n.type === 'WARNING';
    if (activeFilter === 'SUCCESS') return n.type === 'SUCCESS';
    return true;
  });

  const unreadCountVal = notificationsList.filter((n) => n.isUnread).length;
  const criticalCountVal = notificationsList.filter((n) => n.type === 'CRITICAL').length;
  const warningsCountVal = notificationsList.filter((n) => n.type === 'WARNING').length;
  const infoCountVal = notificationsList.filter((n) => n.type === 'INFO' || n.type === 'SUCCESS').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER: Title + Actions (Mark All Read & Preferences)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {t('notificationsTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('notificationsDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 text-slate-600" />
            <span>{t('markAllRead')}</span>
          </button>

          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-slate-600" />
            <span>{t('preferences')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          4 COLOR-FILLED METRIC CARDS (Clean Centered Numbers & Balanced Top Row)
         ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. UNREAD - 🟠 BOP Orange Fill */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white shadow-md border border-orange-400/40 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[140px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-10 w-10 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <Bell className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              Active
            </span>
          </div>

          <div className="text-center my-auto pt-2 z-10">
            <span className="text-[11px] font-black uppercase text-orange-100 tracking-wider block">
              {t('unreadCount')}
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5 block">
              {unreadCountVal}
            </span>
          </div>

          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* 2. CRITICAL - 🔴 Crimson Red Fill */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-md border border-red-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[140px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-10 w-10 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              High
            </span>
          </div>

          <div className="text-center my-auto pt-2 z-10">
            <span className="text-[11px] font-extrabold uppercase text-red-100 tracking-wider block">
              {t('criticalCount')}
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5 block">
              {criticalCountVal}
            </span>
          </div>

          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* 3. WARNINGS - 🟡 Amber / Yellow Fill */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-slate-950 shadow-md border border-amber-400/40 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[140px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-10 w-10 rounded-xl bg-amber-950/20 text-amber-950 flex items-center justify-center backdrop-blur-md border border-amber-950/20 shadow-inner">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-950/20 text-amber-950 border border-amber-950/20 backdrop-blur-xs">
              Pending
            </span>
          </div>

          <div className="text-center my-auto pt-2 z-10">
            <span className="text-[11px] font-black uppercase text-amber-950 tracking-wider block">
              {t('warningsCount')}
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mt-0.5 block">
              {warningsCountVal}
            </span>
          </div>

          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* 4. INFO - 🔵 Blue Fill */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-md border border-blue-400/30 flex flex-col justify-between relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 min-h-[140px]">
          <div className="flex items-center justify-between z-10">
            <div className="h-10 w-10 rounded-xl bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
              <Info className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              General
            </span>
          </div>

          <div className="text-center my-auto pt-2 z-10">
            <span className="text-[11px] font-extrabold uppercase text-blue-100 tracking-wider block">
              {t('infoCount')}
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5 block">
              {infoCountVal}
            </span>
          </div>

          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          FILTER PILLS (BOP Orange Highlight)
         ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: t('filterAll') },
          { id: 'UNREAD', label: t('filterUnread') },
          { id: 'CRITICAL', label: t('filterCritical') },
          { id: 'WARNING', label: t('filterWarnings') },
          { id: 'SUCCESS', label: t('filterSuccess') },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeFilter === f.id
                ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-orange-50/50 hover:text-orange-950'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          NOTIFICATIONS LIST
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold">
            No notifications in this category.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition ${
                item.isUnread ? 'bg-orange-50/20' : ''
              }`}
            >
              {/* Left Side: Icon + Content + Pill Badge */}
              <div className="flex items-start gap-3.5">
                {/* Icon Circle */}
                <div className="mt-0.5 shrink-0">
                  {item.type === 'CRITICAL' ? (
                    <div className="h-9 w-9 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                  ) : item.type === 'WARNING' ? (
                    <div className="h-9 w-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                  ) : item.type === 'SUCCESS' ? (
                    <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                      <Info className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Status Badge Pill */}
                  <div className="pt-1">
                    {item.type === 'CRITICAL' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100/70 text-rose-700 border border-rose-200">
                        {t('criticalBadge')}
                      </span>
                    ) : item.type === 'WARNING' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100/70 text-amber-800 border border-amber-200">
                        {t('warningBadge')}
                      </span>
                    ) : item.type === 'SUCCESS' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                        {t('successBadge')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100/70 text-sky-800 border border-sky-200">
                        {t('infoBadge')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Timestamp + Avatar */}
              <div className="flex items-center gap-3 shrink-0 pt-0.5">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{item.time}</span>
                </span>

                <div className="h-9 w-9 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-2xs">
                  <img
                    src={item.avatar}
                    alt="User"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=ED6C00&color=fff';
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
