import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { usersApi } from '../../api/endpoints';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const UserManagement = () => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Register Modal
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'FIELD_ENGINEER',
    phone: '',
    division: 'Lahore',
    district: 'Lahore',
  });

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await usersApi.getUsers(params);
      setUserList(res?.data?.results || res?.data || []);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setRegError('');
    try {
      await usersApi.registerUser(formData);
      setRegisterModalOpen(false);
      fetchUsers();
    } catch (err) {
      setRegError(err?.response?.data?.message || err.message || 'User registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleToggleActive = async (u) => {
    try {
      if (u.is_active) {
        await usersApi.deactivateUser(u.id);
      } else {
        await usersApi.activateUser(u.id);
      }
      fetchUsers();
    } catch (e) {
      console.error('Failed to toggle active status', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with ACAG Forest Green theme */}
      <div className="rounded-2xl bg-[#0D5C3A] p-6 text-white shadow-lg border border-emerald-600/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">{t('usersTitle')}</h1>
            <p className="text-xs text-emerald-100 mt-0.5">{t('usersDesc')}</p>
          </div>
        </div>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-[#0D5C3A] hover:bg-emerald-50 text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-2 transition cursor-pointer"
        >
          <UserPlus className="h-4 w-4 text-[#0D5C3A]" />
          <span>{t('registerNewUser')}</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className={`h-4 w-4 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-3`} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50`}
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-white font-bold"
          >
            <option value="">{t('role')}: All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="BACKEND_REVIEW_ENGINEER">Backend Review Engineer</option>
            <option value="FIELD_ENGINEER">Field Engineer</option>
            <option value="HOUSE_OWNER">House Owner</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <Spinner message="Loading users..." className="h-64" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-extrabold uppercase">
                  <th className="py-3.5 px-6">{t('userEmployee')}</th>
                  <th className="py-3.5 px-4">{t('role')}</th>
                  <th className="py-3.5 px-4">{t('contact')}</th>
                  <th className="py-3.5 px-4">{t('location')}</th>
                  <th className="py-3.5 px-4">{t('status')}</th>
                  <th className="py-3.5 px-6 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>{u.username}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          u.role === 'ADMIN'
                            ? 'purple'
                            : u.role === 'BACKEND_REVIEW_ENGINEER'
                            ? 'primary'
                            : u.role === 'FIELD_ENGINEER'
                            ? 'success'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {u.role?.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {u.district ? `${u.district}, ` : ''}{u.division || 'Punjab'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={u.is_active ? 'success' : 'danger'} size="sm">
                        {u.is_active ? t('active') : t('deactivated')}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                          u.is_active
                            ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.is_active ? t('deactivate') : t('activate')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REGISTER USER MODAL */}
      <Modal isOpen={registerModalOpen} onClose={() => setRegisterModalOpen(false)} title={t('registerNewUser')}>
        {regError && <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold">{regError}</div>}
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('username')} *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('email')} *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('password')} *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('role')} *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
              >
                <option value="FIELD_ENGINEER">Field Engineer</option>
                <option value="BACKEND_REVIEW_ENGINEER">Backend Review Engineer</option>
                <option value="HOUSE_OWNER">House Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('contact')}</label>
              <input
                type="text"
                placeholder="+92 300 0000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('division')}</label>
              <select
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
              >
                <option value="Lahore">Lahore</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Multan">Multan</option>
                <option value="Faisalabad">Faisalabad</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={registering}
              className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold disabled:opacity-50"
            >
              {registering ? <Spinner size="sm" /> : t('registerNewUser')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
