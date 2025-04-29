"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface MainNavProps {
  userRole?: string
}

export function MainNav({ userRole = "estudiante" }: MainNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Clear local storage
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      // Still redirect even if there's an error
      router.push("/login")
    }
  }

  // Only show links relevant to the user's role
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      roles: ["estudiante", "profesor", "tecnico", "admin"],
    },
    {
      title: "Mis Tickets",
      href: "/tickets",
      roles: ["estudiante", "profesor", "tecnico", "admin"],
    },
    {
      title: "Nuevo Ticket",
      href: "/tickets/new",
      roles: ["estudiante", "profesor"],
    },
    {
      title: "Todos los Tickets",
      href: "/tickets/all",
      roles: ["tecnico", "admin"],
    },
    {
      title: "Reportes",
      href: "/reports",
      roles: ["admin"],
    },
    {
      title: "Gestión de Usuarios",
      href: "/users",
      roles: ["admin"],
    },
  ].filter((item) => item.roles.includes(userRole))

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center">
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-unison-blue",
              pathname === item.href ? "text-unison-blue font-semibold" : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Cerrar sesión</span>
        </Button>
      </div>
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-unison-blue",
                    pathname === item.href ? "text-unison-blue font-semibold" : "text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <Button variant="ghost" className="justify-start px-2" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar sesión
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
