import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, TEST_USERS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, quickLogin, role } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const notifRef = useRef(null);
  const roleRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'CRITICAL',
      title: 'AI Inspection Failed — ACAG-G-2567',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'WARNING',
      title: 'Installment Overdue — Ali Hassan',
      time: '1 hr ago',
      unread: true,
    },
    {
      id: 3,
      type: 'SUCCESS',
      title: 'Quality Milestone Approved — ACAG-L-4521',
      time: '3 hrs ago',
      unread: true,
    },
  ]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickSwitch = async (roleName) => {
    setSwitching(true);
    setRoleDropdownOpen(false);
    try {
      await quickLogin(roleName);
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-4 md:px-7 shadow-2xs">
      {/* Left: Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm md:text-base font-extrabold text-slate-800">
          {t('dashboardOverview')}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <Search className={`h-4 w-4 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className={`w-full ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-700 transition`}
          />
        </div>

        {/* Notifications Icon with Interactive Popup Menu */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className={`relative p-2 rounded-xl transition cursor-pointer ${
              notifDropdownOpen ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
            title="Quick Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          {/* Quick Notifications Popup Dropdown (Does NOT navigate, just displays alerts) */}
          {notifDropdownOpen && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 rounded-2xl bg-white p-3 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2`}>
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">{t('navNotifications')}</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-orange-700 hover:text-orange-900 cursor-pointer flex items-center gap-0.5"
                  >
                    <Check className="h-3 w-3" />
                    <span>{t('markAllRead')}</span>
                  </button>
                )}
              </div>

              {/* Notification Alerts List */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border transition flex items-start gap-2.5 ${
                      item.unread
                        ? 'bg-orange-50/40 border-orange-200/70'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'CRITICAL' ? (
                        <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                      ) : item.type === 'WARNING' ? (
                        <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: View All Link */}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full py-2 text-center text-xs font-extrabold text-orange-700 hover:text-orange-900 bg-orange-50/70 hover:bg-orange-100/70 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{t('viewAll')}</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Gear */}
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Language Switcher (BOP Orange) */}
        <LanguageToggle />

        {/* Test Role Switcher */}
        <div className="relative hidden sm:block" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Switch demo account"
          >
            <RefreshCw className={`h-3 w-3 text-slate-500 ${switching ? 'animate-spin' : ''}`} />
            <span className="text-[11px] text-slate-500">{t('switchRole')}</span>
            <span className="font-extrabold text-orange-950">{user?.role?.split('_')[0] || t('guest')}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2`}>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('quickDemoLogins')}
              </div>
              {TEST_USERS.map((u) => (
                <button
                  key={u.role}
                  onClick={() => handleQuickSwitch(u.role)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-orange-50/60 transition cursor-pointer ${
                    role === u.role ? 'bg-orange-50 font-bold text-orange-950' : 'text-slate-700'
                  }`}
                >
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="font-semibold">{u.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.username}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${u.badge}`}>
                    {u.role.split('_')[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden ring-1 ring-orange-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="User profile"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Muhammad+Admin&background=ED6C00&color=fff';
              }}
            />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-black text-slate-900 leading-tight">
              {user?.username === 'admin' ? 'Muhammad Admin' : (user?.username || 'Muhammad Admin')}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {user?.district ? `${user.district}, ` : ''}{user?.division || 'Lahore'}
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-1"
            title={t('logout')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
