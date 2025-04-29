"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateTheme } = useAuth()
  const [theme, setTheme] = useState<Theme>("light")

  // Initialize theme from user preference or system preference
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme as Theme)
      document.documentElement.classList.toggle("dark", user.theme === "dark")
    } else {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      const initialTheme = savedTheme || (prefersDark ? "dark" : "light")
      setTheme(initialTheme)
      document.documentElement.classList.toggle("dark", initialTheme === "dark")
    }
  }, [user])

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")

    // Save to localStorage for non-authenticated users
    localStorage.setItem("theme", newTheme)

    // If user is authenticated, save preference to user profile
    if (user) {
      try {
        await updateTheme(newTheme)
      } catch (error) {
        console.error("Failed to update theme preference:", error)
      }
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
