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
  UserCheck,
  LayoutGrid,
  List,
  MapPin,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'Muhammad Harram Admin', username: 'admin', role: 'ADMIN', email: 'admin@acag.punjab.gov.pk', phone: '+92 42 99001234', division: 'All Punjab (Apex HQ)', status: 'Active', joinedDate: '2025-12-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Engr. Yahya Reviewer', username: 'reviewer1', role: 'BACKEND_REVIEW_ENGINEER', email: 'yahya@acag.punjab.gov.pk', phone: '+92 300 9876543', division: 'Lahore HQ Review Center', status: 'Active', joinedDate: '2026-01-10', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Engr. Shoaib Akhtar', username: 'engineer1', role: 'FIELD_ENGINEER', email: 'shoaib@acag.punjab.gov.pk', phone: '+92 300 5551234', division: 'Lahore & Gujranwala', status: 'Active', joinedDate: '2026-01-15', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Muhammad Arshad (Beneficiary)', username: 'owner1', role: 'HOUSE_OWNER', email: 'arshad@gmail.com', phone: '+92 300 4521890', division: 'Lahore (ACAG-L-4521)', status: 'Active', joinedDate: '2026-01-15', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Engr. Bilal Ahmed', username: 'engineer2', role: 'FIELD_ENGINEER', email: 'bilal@acag.punjab.gov.pk', phone: '+92 312 4445678', division: 'Rawalpindi & Attock', status: 'Active', joinedDate: '2026-02-01', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Tariq Mehmood (Beneficiary)', username: 'owner2', role: 'HOUSE_OWNER', email: 'tariq@gmail.com', phone: '+92 312 8765432', division: 'Rawalpindi (ACAG-R-2210)', status: 'Active', joinedDate: '2026-02-10', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Engr. Hamza Farooq', username: 'engineer5', role: 'FIELD_ENGINEER', email: 'hamza@acag.punjab.gov.pk', phone: '+92 345 1119012', division: 'Sahiwal & Okara', status: 'Inactive', joinedDate: '2026-03-01', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
];

export const UserManagement = () => {
  const { t } = useLanguage();
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [activeRoleFilter, setActiveRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'TABLE'

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

  const totalUsers = usersList.length;
  const activeStaff = usersList.filter((u) => u.status === 'Active' && u.role !== 'HOUSE_OWNER').length;
  const beneficiariesCount = usersList.filter((u) => u.role === 'HOUSE_OWNER').length;
  const totalEngineers = usersList.filter((u) => u.role === 'FIELD_ENGINEER' || u.role === 'BACKEND_REVIEW_ENGINEER').length;

  const filteredUsers = usersList.filter((u) => {
    if (activeRoleFilter !== 'ALL' && u.role !== activeRoleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.division.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
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
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'BACKEND_REVIEW_ENGINEER':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'FIELD_ENGINEER':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              User & Access Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-100 text-orange-800">
              Role-Based Access (RBAC)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage portal accounts, permissions, and regional assignments for field engineers, reviewers, and beneficiaries
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User Account</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Accounts</span>
            <span className="text-2xl font-black text-slate-900 block font-mono">{totalUsers} Users</span>
            <span className="text-[10px] text-emerald-600 font-bold">{activeStaff} Active Staff Members</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Engineering Officers</span>
            <span className="text-2xl font-black text-emerald-800 block font-mono">{totalEngineers} Officers</span>
            <span className="text-[10px] text-slate-400 font-medium">Field & Backend reviewers</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Beneficiaries</span>
            <span className="text-2xl font-black text-amber-900 block font-mono">{beneficiariesCount} Owners</span>
            <span className="text-[10px] text-amber-700 font-bold">House Portal Access Active</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Security Protocol</span>
            <span className="text-2xl font-black text-blue-900 block font-mono">2FA Active</span>
            <span className="text-[10px] text-blue-700 font-bold">Govt PKI Encryption</span>
          </div>
        </div>
      </div>

      {/* Role Filter Tabs & Search Bar */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, email, phone..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800 font-medium transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Roles', count: usersList.length },
              { id: 'ADMIN', label: 'Admins', count: usersList.filter((u) => u.role === 'ADMIN').length },
              { id: 'FIELD_ENGINEER', label: 'Field Staff', count: usersList.filter((u) => u.role === 'FIELD_ENGINEER').length },
              { id: 'BACKEND_REVIEW_ENGINEER', label: 'Reviewers', count: usersList.filter((u) => u.role === 'BACKEND_REVIEW_ENGINEER').length },
              { id: 'HOUSE_OWNER', label: 'Owners', count: usersList.filter((u) => u.role === 'HOUSE_OWNER').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeRoleFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                    activeRoleFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'GRID' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white text-orange-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: ELEGANT USER CARDS (GRID VIEW) */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-200 transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        title={u.status}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">{u.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">@{u.username}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider shrink-0 ${getRoleBadge(u.role)}`}>
                    {u.role.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Scope & Contacts */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">{u.division}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="font-mono">{u.email}</span>
                    <span className="font-mono">{u.phone}</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedUserDetail(u)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => toggleUserStatus(u.id)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    u.status === 'Active'
                      ? 'border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                >
                  {u.status === 'Active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: CLEAN TABLE VIEW */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-5 whitespace-nowrap">User & Account</th>
                  <th className="py-4 px-4 whitespace-nowrap">System Role</th>
                  <th className="py-4 px-4 whitespace-nowrap">Official Contacts</th>
                  <th className="py-4 px-4 whitespace-nowrap">Assigned Scope / Division</th>
                  <th className="py-4 px-4 whitespace-nowrap">Status</th>
                  <th className="py-4 px-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0" />
                        <div>
                          <div className="font-black text-slate-900 text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">@{u.username}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-xl text-[10px] font-black border ${getRoleBadge(u.role)}`}>
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{u.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.phone}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-800">
                      {u.division}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUserDetail(u)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
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
      )}

      {/* MODAL 1: ADD USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Register User Account
                </h3>
                <p className="text-xs text-slate-500">Government Portal Credentials</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
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
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    System Role
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 text-slate-800"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
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
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: USER PROFILE */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={selectedUserDetail.avatar} alt={selectedUserDetail.name} className="h-11 w-11 rounded-2xl object-cover ring-2 ring-orange-200" />
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedUserDetail.name}</h3>
                  <div className="text-xs text-slate-400 font-mono">@{selectedUserDetail.username}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">System Role:</span>
                <span className="font-bold text-orange-700">{selectedUserDetail.role}</span>
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
                <span className="text-slate-500">Regional Scope:</span>
                <span className="font-bold text-slate-900">{selectedUserDetail.division}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Status:</span>
                <span className="font-bold text-emerald-700">{selectedUserDetail.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
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
