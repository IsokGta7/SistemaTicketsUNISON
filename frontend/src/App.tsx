"use client"

import type React from "react"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { NotificationProvider } from "./contexts/NotificationContext"

// Layouts
import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"

// Pages
import LoginPage from "./modules/auth/pages/LoginPage"
import RegisterPage from "./modules/auth/pages/RegisterPage"
import DashboardPage from "./modules/dashboard/pages/DashboardPage"
import TicketsPage from "./modules/tickets/pages/TicketsPage"
import TicketDetailPage from "./modules/tickets/pages/TicketDetailPage"
import NewTicketPage from "./modules/tickets/pages/NewTicketPage"
import ReportsPage from "./modules/reports/pages/ReportsPage"
import NewReportPage from "./modules/reports/pages/NewReportPage"
import UserSettingsPage from "./modules/users/pages/UserSettingsPage"
import NotFoundPage from "./modules/common/pages/NotFoundPage"

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

// Role-based route component
const RoleRoute = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TicketsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NewTicketPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TicketDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NewReportPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UserSettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["admin"]}>
              <DashboardLayout>
                <UserSettingsPage />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
