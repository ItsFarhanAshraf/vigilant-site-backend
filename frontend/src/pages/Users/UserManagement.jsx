import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  UserCog,
  Users,
  HardHat,
  Home,
  ShieldCheck,
  Plus,
  Search,
  Check,
  X,
  Eye,
  Lock,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'Muhammad Harram Admin', username: 'admin', role: 'ADMIN', email: 'admin@acag.punjab.gov.pk', phone: '+92 42 99001234', division: 'All Punjab', status: 'Active', joinedDate: '2025-12-01' },
  { id: 2, name: 'Engr. Yahya Reviewer', username: 'reviewer1', role: 'BACKEND_REVIEW_ENGINEER', email: 'yahya@acag.punjab.gov.pk', phone: '+92 300 9876543', division: 'Lahore HQ', status: 'Active', joinedDate: '2026-01-10' },
  { id: 3, name: 'Engr. Shoaib Akhtar', username: 'engineer1', role: 'FIELD_ENGINEER', email: 'shoaib@acag.punjab.gov.pk', phone: '+92 300 5551234', division: 'Lahore & Gujranwala', status: 'Active', joinedDate: '2026-01-15' },
  { id: 4, name: 'Muhammad Arshad (Beneficiary)', username: 'owner1', role: 'HOUSE_OWNER', email: 'arshad@gmail.com', phone: '+92 300 4521890', division: 'Lahore (ACAG-L-4521)', status: 'Active', joinedDate: '2026-01-15' },
  { id: 5, name: 'Engr. Bilal Ahmed', username: 'engineer2', role: 'FIELD_ENGINEER', email: 'bilal@acag.punjab.gov.pk', phone: '+92 312 4445678', division: 'Rawalpindi', status: 'Active', joinedDate: '2026-02-01' },
  { id: 6, name: 'Tariq Mehmood (Beneficiary)', username: 'owner2', role: 'HOUSE_OWNER', email: 'tariq@gmail.com', phone: '+92 312 8765432', division: 'Rawalpindi (ACAG-R-2210)', status: 'Active', joinedDate: '2026-02-10' },
  { id: 7, name: 'Engr. Hamza Farooq', username: 'engineer5', role: 'FIELD_ENGINEER', email: 'hamza@acag.punjab.gov.pk', phone: '+92 345 1119012', division: 'Sahiwal', status: 'Inactive', joinedDate: '2026-03-01' },
];

export const UserManagement = () => {
  const { t } = useLanguage();
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [activeRoleFilter, setActiveRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // Add User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    username: '',
    role: 'FIELD_ENGINEER',
    email: '',
    phone: '',
    division: 'Lahore',
  });

  const filteredUsers = usersList.filter((u) => {
    if (activeRoleFilter !== 'ALL' && u.role !== activeRoleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.division.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: usersList.length + 1,
      name: newUserForm.name,
      username: newUserForm.username,
      role: newUserForm.role,
      email: newUserForm.email,
      phone: newUserForm.phone,
      division: newUserForm.division,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUsersList([...usersList, newUser]);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      username: '',
      role: 'FIELD_ENGINEER',
      email: '',
      phone: '',
      division: 'Lahore',
    });
  };

  const toggleUserStatus = (userId) => {
    setUsersList(
      usersList.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'BACKEND_REVIEW_ENGINEER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FIELD_ENGINEER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            User & Role Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer accounts for House Owners, Field Engineers, Backend Review Engineers, and Super Administrators
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User Account</span>
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'ALL', label: 'All Users', count: usersList.length },
          { id: 'ADMIN', label: 'Administrators', count: usersList.filter((u) => u.role === 'ADMIN').length },
          { id: 'BACKEND_REVIEW_ENGINEER', label: 'Review Engineers', count: usersList.filter((u) => u.role === 'BACKEND_REVIEW_ENGINEER').length },
          { id: 'FIELD_ENGINEER', label: 'Field Engineers', count: usersList.filter((u) => u.role === 'FIELD_ENGINEER').length },
          { id: 'HOUSE_OWNER', label: 'House Owners', count: usersList.filter((u) => u.role === 'HOUSE_OWNER').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRoleFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeRoleFilter === tab.id
                ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeRoleFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, email, division..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-5">User & Username</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Assigned Scope / Division</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-5">
                    <div className="font-black text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getRoleBadge(u.role)}`}>
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-800 font-medium">{u.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.phone}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {u.division}
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono">
                    {u.joinedDate}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedUserDetail(u)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-800 hover:text-orange-700 text-[11px] font-bold rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Toggle Active/Inactive"
                      >
                        {u.status === 'Active' ? <X className="h-3.5 w-3.5 text-rose-500" /> : <Check className="h-3.5 w-3.5 text-emerald-500" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ADD USER
         ========================================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Register New User Account
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Engr. Usman Qureshi"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="usman_engr"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    System Role
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  >
                    <option value="FIELD_ENGINEER">Field Engineer</option>
                    <option value="BACKEND_REVIEW_ENGINEER">Backend Reviewer</option>
                    <option value="HOUSE_OWNER">House Owner</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="usman@acag.gov.pk"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: USER PROFILE VIEWER
         ========================================================================= */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">User Account Profile</h3>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-900">{selectedUserDetail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Username:</span>
                <span className="font-mono font-bold text-slate-900">@{selectedUserDetail.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-purple-700">{selectedUserDetail.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-900">{selectedUserDetail.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-bold text-slate-900">{selectedUserDetail.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Division:</span>
                <span className="font-bold text-slate-900">{selectedUserDetail.division}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
