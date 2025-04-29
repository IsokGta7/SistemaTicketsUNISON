"use client"

import type React from "react"
import type { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { useNotifications } from "../contexts/NotificationContext"
import Sidebar from "../modules/common/components/Sidebar"
import Header from "../modules/common/components/Header"

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { unreadCount } = useNotifications()

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header unreadCount={unreadCount} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="container mx-auto">{children}</div>
          </main>

          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
            <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Universidad de Sonora. Todos los derechos reservados.
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
