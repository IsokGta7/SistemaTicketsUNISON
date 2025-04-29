"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockNotifications = [
          {
            id: "1",
            title: "Ticket #1234 Actualizado",
            description: "Un técnico ha sido asignado a tu ticket.",
            time: "hace 5 minutos",
            read: false,
          },
          {
            id: "2",
            title: "Nuevo Comentario",
            description: "Juan Pérez comentó en tu ticket #1234.",
            time: "hace 1 hora",
            read: false,
          },
          {
            id: "3",
            title: "Ticket #1234 Resuelto",
            description: "Tu ticket ha sido marcado como resuelto.",
            time: "hace 2 días",
            read: true,
          },
        ]

        setNotifications(mockNotifications)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just update the state
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-unison-red text-white">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-auto py-1" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.read ? "bg-unison-blue/5" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <span className="font-medium">{notification.title}</span>
                  {!notification.read && (
                    <Badge
                      variant="outline"
                      className="ml-2 h-auto py-0 px-1.5 text-[10px] bg-unison-red/10 text-unison-red border-unison-red/20"
                    >
                      Nuevo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                <span className="text-xs text-muted-foreground mt-2">{notification.time}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No hay notificaciones</div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
