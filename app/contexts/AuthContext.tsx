"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = localStorage.getItem("user")
          if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            setIsAuthenticated(true)
            // Redirect based on role if on login/register pages
            if (window.location.pathname === "/login" || window.location.pathname === "/register") {
              redirectBasedOnRole(parsedUser.role)
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        toast({
          title: "Error de autenticación",
          description: "Hubo un problema al verificar tu sesión",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [toast])

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "admin":
      case "tecnico":
        router.push("/dashboard")
        break
      case "estudiante":
      case "profesor":
        router.push("/tickets")
        break
      default:
        router.push("/")
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al iniciar sesión")
      }

      const data = await response.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      setIsAuthenticated(true)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al Sistema de Soporte Técnico",
        variant: "success",
      })
      redirectBasedOnRole(data.user.role)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Por favor verifica tus credenciales e intenta nuevamente",
        variant: "destructive",
      })
      throw error
    }
  }

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al registrar usuario")
      }

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente. Por favor inicia sesión.",
        variant: "success",
      })
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error al registrar",
        description: error instanceof Error ? error.message : "Ocurrió un error al crear tu cuenta",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    })
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 