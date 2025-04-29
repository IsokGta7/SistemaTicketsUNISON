"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import authApi, { type User } from "../api/auth"
import socketService from "../api/socket"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateTheme: (theme: "light" | "dark") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authApi.getProfile()
          setUser(userData)
          socketService.connect(token)
        } catch (error) {
          console.error("Failed to get user profile:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(response.user))
    setUser(response.user)
    socketService.connect(response.token)
  }

  const register = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    await authApi.register({ firstName, lastName, email, password, role })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    socketService.disconnect()
    window.location.href = "/login"
  }

  const updateTheme = async (theme: "light" | "dark") => {
    const updatedUser = await authApi.updateTheme({ theme })
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
