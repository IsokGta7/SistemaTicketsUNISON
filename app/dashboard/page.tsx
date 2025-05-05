"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AreaChart, BarChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, Clock, FileText, MoreHorizontal, Plus, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: string
  title: string
  status: string
  priority: string
  category: string
  createdAt: string
}

interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  percentChange: number
}

interface CategoryStats {
  name: string
  total: number
}

interface TrendStats {
  name: string
  total: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    percentChange: 0
  })
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [trendStats, setTrendStats] = useState<TrendStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchTickets()
      fetchStats()
      if (session.user.role === "admin" || session.user.role === "tecnico") {
        fetchCategoryStats()
        fetchTrendStats()
      }
    }
  }, [status, session])

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tickets?limit=5")
      if (!response.ok) throw new Error("Error al cargar los tickets")
      const data = await response.json()
      setTickets(data.tickets)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive"
      })
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/tickets/stats")
      if (!response.ok) throw new Error("Error al cargar las estadísticas")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch("/api/tickets/categories")
      if (!response.ok) throw new Error("Error al cargar las estadísticas por categoría")
      const data = await response.json()
      setCategoryStats(data)
    } catch (error) {
      console.error("Error fetching category stats:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas por categoría",
        variant: "destructive"
      })
    }
  }

  const fetchTrendStats = async () => {
    try {
      const response = await fetch("/api/tickets/trends")
      if (!response.ok) throw new Error("Error al cargar las tendencias")
      const data = await response.json()
      setTrendStats(data)
    } catch (error) {
      console.error("Error fetching trend stats:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las tendencias",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            En Progreso
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Media
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Alta
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `hace ${Math.round(diffInHours)} horas`
    } else {
      return `hace ${Math.round(diffInHours / 24)} días`
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            ¡Bienvenido de nuevo! Aquí tienes un resumen de tus tickets de soporte técnico.
          </p>
        </div>
        {(session?.user?.role === "estudiante" || session?.user?.role === "profesor") && (
          <Link href="/tickets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ticket
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics" disabled={session?.user?.role !== "admin" && session?.user?.role !== "tecnico"}>
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
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.percentChange > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      {stats.percentChange}% desde el mes pasado
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <ArrowDown className="mr-1 h-3 w-3" />
                      {Math.abs(stats.percentChange)}% desde el mes pasado
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
                <div className="text-2xl font-bold">{stats.open}</div>
                <p className="text-xs text-muted-foreground">Esperando asignación</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Actualmente en proceso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.resolved}</div>
                <p className="text-xs text-muted-foreground">Tickets completados</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tickets Recientes</CardTitle>
                <CardDescription>Últimos tickets creados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Link href={`/tickets/${ticket.id}`} className="font-medium hover:underline">
                          {ticket.title}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                          <span>{ticket.category}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(ticket.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {(session?.user?.role === "admin" || session?.user?.role === "tecnico") && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Categoría</CardTitle>
                  <CardDescription>Proporción de tickets por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={categoryStats}
                    index="name"
                    categories={["total"]}
                    colors={["#1B388F"]}
                    valueFormatter={(value: number) => `${value} tickets`}
                    className="h-[200px]"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {(session?.user?.role === "admin" || session?.user?.role === "tecnico") && (
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Tickets</CardTitle>
                  <CardDescription>Evolución de tickets en los últimos meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart
                    data={trendStats}
                    index="name"
                    categories={["total"]}
                    colors={["#1B388F"]}
                    valueFormatter={(value: number) => `${value} tickets`}
                    className="h-[200px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Categoría</CardTitle>
                  <CardDescription>Proporción de tickets por categoría</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={categoryStats}
                    index="name"
                    categories={["total"]}
                    colors={["#1B388F"]}
                    valueFormatter={(value: number) => `${value} tickets`}
                    className="h-[200px]"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
