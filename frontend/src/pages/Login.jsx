import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, TEST_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { Home, Lock, User, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { Spinner } from '../components/common/Spinner';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError(t('loginError'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userObj) => {
    setError('');
    setLoading(true);
    try {
      await login(userObj.username, userObj.password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Forest Green Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0D5C3A]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Language Bar */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg">
        <Globe className="h-4 w-4 text-emerald-400" />
        <LanguageToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D5C3A] text-white shadow-xl shadow-emerald-950/40 border border-emerald-500/30">
          <Home className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-white">
          {t('brandTitle')}
        </h2>
        <p className="mt-1 text-xs font-extrabold tracking-widest uppercase text-emerald-300">
          {t('brandSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          {/* Language Selection Header */}
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {language === 'ur' ? 'زبان منتخب کریں (Select Language)' : 'Language Selection'}
            </span>
            <LanguageToggle />
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {t('username')}
              </label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D5C3A] focus:border-[#0D5C3A] bg-slate-50/50`}
                  placeholder="admin, engineer1, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {t('password')}
              </label>
              <div className="mt-1 relative rounded-xl shadow-xs">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D5C3A] focus:border-[#0D5C3A] bg-slate-50/50`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 shadow-md shadow-orange-500/25 transition disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? <Spinner size="sm" /> : t('signIn')}
            </button>
          </form>

          {/* Quick Demo Login Cards */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('quickDemoLogins')}
              </span>
              <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                {t('localTestingReady')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { role: 'ADMIN', label: t('adminRole'), username: 'admin', password: 'admin123', bg: 'hover:bg-emerald-50/70 hover:border-emerald-300' },
                { role: 'BACKEND_REVIEW_ENGINEER', label: t('reviewerRole'), username: 'reviewer1', password: 'reviewer123', bg: 'hover:bg-emerald-50/70 hover:border-emerald-300' },
                { role: 'FIELD_ENGINEER', label: t('engineerRole'), username: 'engineer1', password: 'engineer123', bg: 'hover:bg-emerald-50/70 hover:border-emerald-300' },
                { role: 'HOUSE_OWNER', label: t('ownerRole'), username: 'owner1', password: 'owner123', bg: 'hover:bg-emerald-50/70 hover:border-emerald-300' },
              ].map((u) => (
                <button
                  key={u.role}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className={`flex items-start justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/80 ${u.bg} hover:shadow-xs transition text-left group cursor-pointer`}
                >
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#0D5C3A]">
                      {u.label}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      user: <span className="font-semibold">{u.username}</span> | pw: <span className="font-semibold">{u.password}</span>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-slate-300 group-hover:text-[#0D5C3A] transition shrink-0 mt-0.5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 font-medium">
          {t('copyright')}
        </div>
      </div>
    </div>
  );
};
