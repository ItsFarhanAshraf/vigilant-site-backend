import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DashboardDataProvider } from './context/DashboardDataContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';

// 14 Core ACAG Admin Modules
import { Dashboard } from './pages/Dashboard';
import { HousesManagement } from './pages/Houses/HousesManagement';
import { EngineerVisits } from './pages/EngineerVisits/EngineerVisits';
import { EngineerManagement } from './pages/Engineers/EngineerManagement';
import { LabourManagement } from './pages/Labour/LabourManagement';
import { SafetyManagement } from './pages/Safety/SafetyManagement';
import { EnvironmentalMonitoring } from './pages/Environmental/EnvironmentalMonitoring';
import { AIHazardDetection } from './pages/AIHazard/AIHazardDetection';
import { LoanManagement } from './pages/Loans/LoanManagement';
import { GISMapPage } from './pages/GIS/GISMapPage';
import { ReportsAnalytics } from './pages/Reports/ReportsAnalytics';
import { UserManagement } from './pages/Users/UserManagement';
import { NotificationsCenter } from './pages/Notifications/NotificationsCenter';
import { SettingsDashboard } from './pages/Settings/SettingsDashboard';

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
        <DashboardDataProvider>
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
                {/* Module 1: Main Dashboard Overview */}
                <Route index element={<Dashboard />} />

                {/* Module 2: Houses Management */}
                <Route path="houses" element={<HousesManagement />} />

                {/* Module 3: Engineer Visits & Inspections */}
                <Route path="engineer-visits" element={<EngineerVisits />} />

                {/* Module 4: Engineers Directory & Scorecards */}
                <Route path="engineers" element={<EngineerManagement />} />

                {/* Module 5: Labour Management & Worker Training */}
                <Route path="labour" element={<LabourManagement />} />

                {/* Module 6: Safety & HSE Management */}
                <Route path="safety" element={<SafetyManagement />} />

                {/* Module 7: Environmental & Weather Risk Monitoring */}
                <Route path="environmental" element={<EnvironmentalMonitoring />} />

                {/* Module 8: AI Computer Vision Hazard Detection */}
                <Route path="ai-hazards" element={<AIHazardDetection />} />

                {/* Module 9: Loan & BOP Disbursement Management */}
                <Route path="loans" element={<LoanManagement />} />

                {/* Module 10: GIS Geospatial Map */}
                <Route path="gis-map" element={<GISMapPage />} />

                {/* Module 11: Reports & Analytics / DPR */}
                <Route path="reports" element={<ReportsAnalytics />} />

                {/* Module 12: Users & Personas */}
                <Route path="users" element={<UserManagement />} />

                {/* Module 13: Notifications & System Alerts */}
                <Route path="notifications" element={<NotificationsCenter />} />

                {/* Module 14: Settings & Configuration */}
                <Route path="settings" element={<SettingsDashboard />} />

                {/* Aliases for backwards compatibility */}
                <Route path="projects" element={<Navigate to="/houses" replace />} />
                <Route path="projects/:id" element={<Navigate to="/houses" replace />} />
                <Route path="compliance" element={<Navigate to="/safety" replace />} />
                <Route path="review-queue" element={<Navigate to="/engineer-visits" replace />} />
                <Route path="handover" element={<Navigate to="/houses" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DashboardDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
