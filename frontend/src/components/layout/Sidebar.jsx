import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  LayoutDashboard,
  Activity,
  MapPin,
  FileSpreadsheet,
  Cpu,
  Building2,
  Users,
  HardHat,
  Eye,
  CreditCard,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const sections = [
    {
      title: t('secOverview'),
      items: [
        { label: t('navDashboard'), path: '/', icon: LayoutDashboard },
        { label: t('navMisOverview'), path: '/projects', icon: Activity },
      ],
    },
    {
      title: t('secAnalytics'),
      items: [
        { label: t('navGisMonitoring'), path: '/compliance', icon: MapPin },
        { label: t('navReportsAnalytics'), path: '/reports', icon: FileSpreadsheet },
        { label: t('navAiProgress'), path: '/review-queue', icon: Cpu },
      ],
    },
    {
      title: t('secManagement'),
      items: [
        { label: t('navAllProjects'), path: '/projects', icon: Building2 },
        { label: t('navHouseOwners'), path: '/users', icon: Home },
        { label: t('navEngineers'), path: '/users', icon: HardHat },
        { label: t('navProject360'), path: '/projects', icon: Eye },
      ],
    },
    {
      title: t('secAdmin'),
      items: [
        { label: t('navHandoverPayments'), path: '/handover', icon: CreditCard },
        { label: t('navNotifications'), path: '/notifications', icon: Bell, badge: '3' },
        { label: t('navSystemSettings'), path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white h-[calc(100vh-4rem)] sticky top-16 flex flex-col justify-between p-3.5 hidden md:flex overflow-y-auto select-none">
      <div className="space-y-3">
        {/* Brand Header with BOP Orange */}
        <div className="flex items-center gap-2.5 px-1 pb-3 border-b border-slate-100">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-center shadow-md shadow-orange-950/20 shrink-0">
            <Home className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-orange-950 leading-tight">
              {t('brandTitle')}
            </div>
            <div className="text-[8.5px] font-extrabold text-orange-600 uppercase tracking-wider">
              {t('brandSubtitle')}
            </div>
          </div>
        </div>

        {/* All Navigation Categories */}
        <div className="space-y-3">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="px-2.5 pb-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                {sec.title}
              </div>
              <nav className="space-y-0.5">
                {sec.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={`${item.path}-${i}`}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/25 font-extrabold'
                            : 'text-slate-600 hover:bg-orange-50/70 hover:text-orange-950'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="h-4 min-w-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className={`h-3 w-3 opacity-60 ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center gap-2.5 px-1 bg-white">
        <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-orange-200 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Muhammad Admin"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Muhammad+Admin&background=ED6C00&color=fff';
            }}
          />
        </div>
        <div className="overflow-hidden leading-tight">
          <div className="text-[11px] font-extrabold text-slate-900 truncate">
            {user?.username === 'admin' ? 'Muhammad Admin' : (user?.username || 'Muhammad Admin')}
          </div>
          <div className="text-[9.5px] text-orange-700 font-bold truncate">
            {user?.role === 'ADMIN' ? t('superAdmin') : (user?.role?.replace(/_/g, ' ') || t('superAdmin'))}
          </div>
        </div>
      </div>
    </aside>
  );
};
