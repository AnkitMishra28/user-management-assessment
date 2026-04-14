import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks';
import { ToastContainer } from './components/Toast';

// Layouts
import AppLayout from './layouts/AppLayout';

// Components
import { ProtectedRoute, LoadingScreen, UnauthorizedPage, NotFoundPage } from './components/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { EditUserPage } from './pages/EditUserPage';
import { CreateUserPage } from './pages/CreateUserPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportsPage } from './pages/ReportsPage';

/**
 * App Routes after authentication
 */
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />

      {/* Users */}
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRole={['admin', 'manager']}>
            <AppLayout>
              <UsersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/create"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <CreateUserPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <AppLayout>
            <EditUserPage />
          </AppLayout>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Error pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

/**
 * Main App component
 */
function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
