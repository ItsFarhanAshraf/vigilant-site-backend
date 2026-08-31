import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './pages/Projects/ProjectList';
import { ProjectDetail } from './pages/Projects/ProjectDetail';
import { ComplianceDashboard } from './pages/Compliance/ComplianceDashboard';
import { ReviewQueue } from './pages/Review/ReviewQueue';
import { ReviewDetail } from './pages/Review/ReviewDetail';
import { HandoverDashboard } from './pages/Handover/HandoverDashboard';
import { ReportsCenter } from './pages/Reports/ReportsCenter';
import { UserManagement } from './pages/Users/UserManagement';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Spinner } from './components/common/Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner message="Authenticating session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Projects Directory & 360 Detail */}
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/:id" element={<ProjectDetail />} />

            {/* Compliance & Site Risk */}
            <Route
              path="compliance"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'BACKEND_REVIEW_ENGINEER', 'FIELD_ENGINEER']}>
                  <ComplianceDashboard />
                </ProtectedRoute>
              }
            />

            {/* HITL Review Queue & AI Vision */}
            <Route
              path="review-queue"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'BACKEND_REVIEW_ENGINEER']}>
                  <ReviewQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="review/:projectId/:milestoneNo"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'BACKEND_REVIEW_ENGINEER']}>
                  <ReviewDetail />
                </ProtectedRoute>
              }
            />

            {/* Handover & Completion Certificates */}
            <Route path="handover" element={<HandoverDashboard />} />

            {/* Reports Center */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'BACKEND_REVIEW_ENGINEER']}>
                  <ReportsCenter />
                </ProtectedRoute>
              }
            />

            {/* User Management */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            {/* Notifications & Alerts */}
            <Route path="notifications" element={<Notifications />} />

            {/* System Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </LanguageProvider>
);
}
