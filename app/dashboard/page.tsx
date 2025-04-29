"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AreaChart, BarChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, Clock, FileText, MoreHorizontal, Plus, Users } from "lucide-react"
import Link from "next/link"

// Mock data for dashboard
const mockTicketStats = {
  total: 12,
  open: 5,
  inProgress: 3,
  resolved: 4,
  percentChange: 8.5,
}

const mockRecentTickets = [
  {
    id: "T-1234",
    title: "No puedo acceder a la impresora del departamento",
    status: "in_progress",
    priority: "medium",
    created: "hace 2 horas",
    category: "Hardware",
  },
  {
    id: "T-1233",
    title: "El correo no se sincroniza en mi dispositivo móvil",
    status: "new",
    priority: "high",
    created: "hace 5 horas",
    category: "Email",
  },
  {
    id: "T-1232",
    title: "Solicitud de instalación de software",
    status: "assigned",
    priority: "low",
    created: "hace 1 día",
    category: "Software",
  },
  {
    id: "T-1231",
    title: "Problemas de conexión VPN",
    status: "resolved",
    priority: "high",
    created: "hace 2 días",
    category: "Red",
  },
]

const mockChartData = [
  {
    name: "Ene",
    total: 12,
  },
  {
    name: "Feb",
    total: 18,
  },
  {
    name: "Mar",
    total: 16,
  },
  {
    name: "Abr",
    total: 24,
  },
  {
    name: "May",
    total: 32,
  },
  {
    name: "Jun",
    total: 28,
  },
]

const mockCategoryData = [
  {
    name: "Hardware",
    total: 35,
  },
  {
    name: "Software",
    total: 45,
  },
  {
    name: "Red",
    total: 20,
  },
  {
    name: "Email",
    total: 15,
  },
  {
    name: "Cuenta",
    total: 25,
  },
]

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string>("estudiante")

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user && user.role) {
          setUserRole(user.role)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-unison-blue/10 text-unison-blue border-unison-blue/20">
            Nuevo
          </Badge>
        )
      case "assigned":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Asignado
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-unison-yellow/10 text-unison-brown border-unison-yellow/20">
            En Progreso
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-unison-green/10 text-unison-green border-unison-green/20">
            Resuelto
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Baja
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-unison-yellow/10 text-unison-brown border-unison-yellow/20">
            Media
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-unison-red/10 text-unison-red border-unison-red/20">
            Alta
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-unison-blue">Dashboard</h2>
          <p className="text-muted-foreground">
            ¡Bienvenido de nuevo! Aquí tienes un resumen de tus tickets de soporte técnico.
          </p>
        </div>
        {(userRole === "estudiante" || userRole === "profesor") && (
          <Link href="/tickets/new">
            <Button className="bg-unison-red hover:bg-unison-red/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ticket
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics" disabled={userRole !== "admin" && userRole !== "tecnico"}>
            Analíticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTicketStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {mockTicketStats.percentChange > 0 ? (
                    <span className="text-unison-green flex items-center">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      {mockTicketStats.percentChange}% desde el mes pasado
                    </span>
                  ) : (
                    <span className="text-unison-red flex items-center">
                      <ArrowDown className="mr-1 h-3 w-3" />
                      {Math.abs(mockTicketStats.percentChange)}% desde el mes pasado
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets Abiertos</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTicketStats.open}</div>
                <p className="text-xs text-muted-foreground">Esperando asignación</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTicketStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Actualmente en proceso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTicketStats.resolved}</div>
                <p className="text-xs text-muted-foreground">Completados este mes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tickets Recientes</CardTitle>
                <CardDescription>Tus tickets de soporte más recientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{ticket.title}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-muted-foreground">{ticket.id}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{ticket.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Más opciones</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Actividad de Tickets</CardTitle>
                <CardDescription>Volumen de tickets en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={mockChartData}
                  index="name"
                  categories={["total"]}
                  colors={["#1B388F"]} // UNISON Blue
                  valueFormatter={(value: number) => `${value} tickets`}
                  className="h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tickets por Categoría</CardTitle>
                <CardDescription>Distribución de tickets por categorías</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={mockCategoryData}
                  index="name"
                  categories={["total"]}
                  colors={["#1B388F"]} // UNISON Blue
                  valueFormatter={(value: number) => `${value} tickets`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Tiempo de Respuesta</CardTitle>
                <CardDescription>Tiempo promedio para primera respuesta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <div className="text-5xl font-bold text-unison-blue">4.2</div>
                  <p className="text-muted-foreground">horas</p>
                  <p className="text-sm text-unison-green flex items-center mt-4">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    12% desde el mes pasado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
