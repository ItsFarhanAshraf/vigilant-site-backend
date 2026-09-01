import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, TEST_USERS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
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
  ShieldAlert,
  CloudSun,
  Home,
  UserCheck,
  CreditCard,
  Menu
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, quickLogin, role } = useAuth();
  const { t, isRTL } = useLanguage();
  const { notifications, markNotificationRead, markAllNotificationsRead, houses } = useDashboardData();
  const navigate = useNavigate();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications?.filter((n) => n.unread)?.length || 0;

  // Search filter
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matched = houses.filter(
        (h) =>
          h.id.toLowerCase().includes(q) ||
          h.ownerName.toLowerCase().includes(q) ||
          h.ownerCnic.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.division.toLowerCase().includes(q)
      );
      setSearchResults(matched.slice(0, 5));
      setSearchOpen(true);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  }, [searchQuery, houses]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CRITICAL_HAZARD':
      case 'SAFETY_ISSUE':
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case 'ENVIRONMENTAL_RISK':
        return <CloudSun className="h-4 w-4 text-amber-600" />;
      case 'LOAN_APPROVAL':
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case 'NEW_APPLICATION':
        return <Home className="h-4 w-4 text-blue-600" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-teal-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-4 md:px-7 shadow-xs">
      {/* Left: Program Branding & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
          <div>
            <h1 className="text-xs md:text-sm font-black text-slate-900 tracking-tight leading-none">
              {t('brandSubtitle')}
            </h1>
            <span className="text-[10px] text-slate-500 font-bold hidden sm:inline-block">
              Government of Punjab • Housing Management Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 md:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-80" ref={searchRef}>
          <Search className={`h-4 w-4 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className={`w-full ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition`}
          />

          {/* Search Results Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-full rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 animate-in fade-in`}>
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Matching Houses ({searchResults.length})
              </div>
              <div className="space-y-1 mt-1">
                {searchResults.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(`/houses?highlight=${h.id}`);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-orange-50 transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-black text-slate-900">{h.id} — {h.ownerName}</div>
                      <div className="text-[10px] text-slate-500">{h.district}, {h.division} • {h.stage}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {h.progressPct}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Interactive Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className={`relative p-2 rounded-xl transition cursor-pointer ${
              notifDropdownOpen ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
            title="System Alerts & Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Menu */}
          {notifDropdownOpen && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 rounded-2xl bg-white p-3 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2`}>
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">{t('navNotifications')}</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-bold text-orange-700 hover:text-orange-900 cursor-pointer flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Alerts List */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {notifications?.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markNotificationRead(item.id)}
                    className={`p-2.5 rounded-xl border transition flex items-start gap-2.5 cursor-pointer ${
                      item.unread
                        ? 'bg-orange-50/50 border-orange-200/80 shadow-2xs'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-slate-100">
                      {getNotificationIcon(item.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-black text-slate-900 truncate">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <div className="text-[9.5px] text-slate-400 font-bold mt-1">
                        {item.time} {item.houseId && `• ${item.houseId}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setNotifDropdownOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full py-2 text-center text-xs font-extrabold text-orange-700 hover:text-orange-900 bg-orange-50/70 hover:bg-orange-100/70 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View All Notifications ({notifications.length})</span>
                  <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <LanguageToggle />

        {/* Quick Demo Role Switcher */}
        <div className="relative hidden sm:block" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Switch demo account"
          >
            <RefreshCw className={`h-3 w-3 text-slate-500 ${switching ? 'animate-spin' : ''}`} />
            <span className="text-[11px] text-slate-500">{t('switchRole')}</span>
            <span className="font-extrabold text-orange-950">{user?.role?.split('_')[0] || 'Admin'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2`}>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Demo Logins (1-Click)
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

        {/* Settings Shortcut */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          title="System Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
