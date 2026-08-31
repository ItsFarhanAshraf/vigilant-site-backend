import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Bell,
  Database,
  Check,
  Key,
  UserPlus,
  Moon,
  Globe,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Download,
  RotateCcw
} from 'lucide-react';

export const Settings = () => {
  const { t, language, changeLanguage, isRTL } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State - General
  const [orgInfo, setOrgInfo] = useState({
    name: 'ACAG — Apni Chhat Apna Ghar',
    province: 'Punjab, Pakistan',
    email: 'admin@acag.gov.pk',
    phone: '+92-42-9999-1234',
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: language || 'en',
    timezone: 'PKT (UTC+5)',
    autoSave: true,
  });

  // Form State - Security
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [accessControls, setAccessControls] = useState({
    twoFactor: true,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLog: true,
  });

  // User Management List (Matching Screenshot 3)
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Muhammad Admin', role: 'Super Admin', division: 'All', status: 'Active' },
    { id: 2, name: 'Bilal Ahmed', role: 'Engineer', division: 'Lahore', status: 'Active' },
    { id: 3, name: 'Sara Khan', role: 'Inspector', division: 'Lahore', status: 'Active' },
    { id: 4, name: 'Usman Ali', role: 'Engineer', division: 'Rawalpindi', status: 'Active' },
    { id: 5, name: 'Ayesha Mir', role: 'Engineer', division: 'Faisalabad', status: 'On Leave' },
  ]);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: t('tabGeneral'), icon: SettingsIcon },
    { id: 'users', label: t('tabUsersRoles'), icon: Users },
    { id: 'security', label: t('tabSecurity'), icon: Shield },
    { id: 'notifications', label: t('tabNotifications'), icon: Bell },
    { id: 'data', label: t('tabDataBackups'), icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          PAGE HEADER: Title + Actions (Save Changes in BOP Orange)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {t('settingsTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('settingsDesc')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Check className="h-4 w-4" />
          <span>{saveSuccess ? 'Changes Saved!' : t('saveChangesBtn')}</span>
        </button>
      </div>

      {/* =========================================================================
          SETTINGS GRID: Left Vertical Tabs (BOP Orange) + Right Content Area
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Tab Navigation with BOP Orange Accent */}
        <div className="md:col-span-3 bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20 font-extrabold'
                    : 'text-slate-600 hover:bg-orange-50/70 hover:text-orange-950'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 space-y-6">
          {/* =========================================================================
              TAB 1: GENERAL
             ========================================================================= */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Card 1: Organization Information */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
                <h2 className="text-sm font-black text-slate-900">
                  {t('secOrgInfo')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('orgName')}
                    </label>
                    <input
                      type="text"
                      value={orgInfo.name}
                      onChange={(e) => setOrgInfo({ ...orgInfo, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-semibold transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('province')}
                    </label>
                    <input
                      type="text"
                      value={orgInfo.province}
                      onChange={(e) => setOrgInfo({ ...orgInfo, province: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-semibold transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('contactEmail')}
                    </label>
                    <input
                      type="email"
                      value={orgInfo.email}
                      onChange={(e) => setOrgInfo({ ...orgInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-semibold transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('contactPhone')}
                    </label>
                    <input
                      type="text"
                      value={orgInfo.phone}
                      onChange={(e) => setOrgInfo({ ...orgInfo, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-semibold font-mono transition"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: System Preferences */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
                <h2 className="text-sm font-black text-slate-900">
                  {t('secSystemPrefs')}
                </h2>

                <div className="divide-y divide-slate-100">
                  {/* Dark Mode */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('darkMode')}</div>
                      <div className="text-[11px] text-slate-500">{t('darkModeDesc')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.darkMode}
                        onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Language */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('language')}</div>
                      <div className="text-[11px] text-slate-500">{t('languageDesc')}</div>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-bold cursor-pointer transition"
                    >
                      <option value="en">English</option>
                      <option value="ur">اردو (Urdu)</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('timezone')}</div>
                      <div className="text-[11px] text-slate-500">{t('timezoneDesc')}</div>
                    </div>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-bold cursor-pointer transition"
                    >
                      <option value="PKT (UTC+5)">PKT (UTC+5)</option>
                      <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                      <option value="EST (UTC-5)">EST (UTC-5)</option>
                    </select>
                  </div>

                  {/* Auto-save */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('autoSave')}</div>
                      <div className="text-[11px] text-slate-500">{t('autoSaveDesc')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: USERS & ROLES
             ========================================================================= */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900">
                  {t('userManagement')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-4">{t('colUser') || 'USER'}</th>
                      <th className="py-3 px-4">{t('colRole') || 'ROLE'}</th>
                      <th className="py-3 px-4">{t('colDivision') || 'DIVISION'}</th>
                      <th className="py-3 px-4">{t('colStatus') || 'STATUS'}</th>
                      <th className="py-3 px-4 text-right">{t('colActions') || 'ACTIONS'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {u.name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {u.role}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {u.division}
                        </td>
                        <td className="py-3.5 px-4">
                          {u.status === 'Active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              On Leave
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-orange-700 hover:bg-orange-50 transition cursor-pointer"
                            title="Manage User Permissions"
                          >
                            <SettingsIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{t('inviteNewUser')}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SECURITY
             ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Card 1: Password & Authentication */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
                <h2 className="text-sm font-black text-slate-900">
                  {t('secPasswordAuth')}
                </h2>

                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('currentPassword')}
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('newPassword')}
                    </label>
                    <input
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      {t('confirmPassword')}
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Key className="h-4 w-4" />
                      <span>{t('updatePasswordBtn')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Access Controls */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
                <h2 className="text-sm font-black text-slate-900">
                  {t('secAccessControls')}
                </h2>

                <div className="divide-y divide-slate-100">
                  {/* Two-Factor Authentication */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('twoFactorAuth')}</div>
                      <div className="text-[11px] text-slate-500">{t('twoFactorDesc')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessControls.twoFactor}
                        onChange={(e) => setAccessControls({ ...accessControls, twoFactor: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Session Timeout */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('sessionTimeout')}</div>
                      <div className="text-[11px] text-slate-500">{t('sessionTimeoutDesc')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessControls.sessionTimeout}
                        onChange={(e) => setAccessControls({ ...accessControls, sessionTimeout: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* IP Whitelist */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('ipWhitelist')}</div>
                      <div className="text-[11px] text-slate-500">{t('ipWhitelistDesc')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessControls.ipWhitelist}
                        onChange={(e) => setAccessControls({ ...accessControls, ipWhitelist: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  {/* Audit Log */}
                  <div className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{t('auditLog')}</div>
                      <div className="text-[11px] text-slate-500">{t('auditLogDesc')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessControls.auditLog}
                        onChange={(e) => setAccessControls({ ...accessControls, auditLog: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: NOTIFICATIONS PREFERENCES
             ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <h2 className="text-sm font-black text-slate-900">
                Alerts & Dispatch Preferences
              </h2>

              <div className="divide-y divide-slate-100">
                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">Email Notifications</div>
                    <div className="text-[11px] text-slate-500">Receive instant email alerts for structural compliance deviations</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-orange-600" />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">SMS & WhatsApp Alerts</div>
                    <div className="text-[11px] text-slate-500">Send disbursement verification SMS codes to house owners</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-orange-600" />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">AI Quality Inspection Notifications</div>
                    <div className="text-[11px] text-slate-500">Notify backend engineer upon computer vision inspection anomalies</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-orange-600" />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: DATA & BACKUPS
             ========================================================================= */}
          {activeTab === 'data' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
              <h2 className="text-sm font-black text-slate-900">
                Database Snapshots & Maintenance
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs font-black text-slate-900">Automated Nightly Cloud Backup</div>
                  <div className="text-[11px] text-slate-500">Location: Punjab IT Board (PITB) Tier-3 Secure Datacenter</div>
                  <div className="text-[11px] font-bold text-orange-700">Last Successful Backup: Today, 03:00 AM (2.4 GB)</div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Download className="h-4 w-4 text-slate-500" />
                    <span>Export Full System Database (JSON/SQL)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Create Manual Backup Snapshot</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
