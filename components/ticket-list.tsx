"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Ticket {
  id: string
  title: string
  status: string
  priority: string
  category: string
  createdAt: string
  updatedAt: string
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets")
        if (!response.ok) throw new Error("Error al cargar tickets")

        const data = await response.json()
        setTickets(data)

        // En una implementación real, manejaríamos la paginación desde el backend
        setTotalPages(Math.ceil(data.length / 5))
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Paginación simple del lado del cliente
  const itemsPerPage = 5
  const paginatedTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  if (loading) {
    return <p>Cargando tickets...</p>
  }

  return (
    <div className="rounded-md border mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className="w-[300px]">Título</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTickets.length > 0 ? (
            paginatedTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">
                  <Link href={`/tickets/${ticket.id}`} className="text-unison-blue hover:underline">
                    {ticket.id.substring(0, 8)}
                  </Link>
                </TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{formatDate(new Date(ticket.createdAt))}</TableCell>
                <TableCell>{formatDate(new Date(ticket.updatedAt))}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron tickets.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4 px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      )}
    </div>
  )
}
