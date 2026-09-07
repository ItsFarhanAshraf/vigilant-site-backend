import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/endpoints';

const AuthContext = createContext(null);

export const TEST_USERS = [
  { role: 'ADMIN', label: 'Admin (Harram / Supervisor)', username: 'admin', password: 'admin', badge: 'bg-purple-100 text-purple-800' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_info');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    if (res && res.data) {
      const { access_token, refresh_token, user: userData } = res.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_info', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      return userData;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      setToken(null);
      setUser(null);
    }
  };

  const quickLogin = async (roleName) => {
    const target = TEST_USERS.find(u => u.role === roleName);
    if (target) {
      return await login(target.username, target.password);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    quickLogin,
    isAuthenticated: !!token && !!user,
    role: user?.role,
    isAdmin: user?.role === 'ADMIN' || user?.is_superuser,
    isReviewer: user?.role === 'BACKEND_REVIEW_ENGINEER',
    isEngineer: user?.role === 'FIELD_ENGINEER',
    isOwner: user?.role === 'HOUSE_OWNER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
