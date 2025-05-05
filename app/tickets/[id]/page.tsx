"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { ChevronLeft, MessageSquare, Paperclip, Send } from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  createdAt: string
  updatedAt: string
  creatorFirstName: string
  creatorLastName: string
  assigneeFirstName?: string
  assigneeLastName?: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  userFirstName: string
  userLastName: string
}

export default function TicketPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTicket()
    fetchComments()
  }, [params.id])

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}`)
      if (!response.ok) throw new Error("Error al cargar el ticket")
      const data = await response.json()
      setTicket(data)
    } catch (error) {
      console.error("Error fetching ticket:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el ticket",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/tickets/${params.id}/comments`)
      if (!response.ok) throw new Error("Error al cargar los comentarios")
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!ticket) return

    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error("Error al actualizar el estado")

      setTicket({ ...ticket, status })
      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
        variant: "success"
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      })
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tickets/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: newComment })
      })

      if (!response.ok) throw new Error("Error al enviar el comentario")

      const comment = await response.json()
      setComments([...comments, comment])
      setNewComment("")
      toast({
        title: "Éxito",
        description: "Comentario enviado correctamente",
        variant: "success"
      })
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
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
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!ticket) {
    return <div>Ticket no encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ticket #{ticket.id}</h2>
          <p className="text-muted-foreground">Detalles y seguimiento del ticket</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Ticket</CardTitle>
            <CardDescription>Información sobre el problema reportado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              <p className="text-muted-foreground">{ticket.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                {(session?.user?.role === "admin" || session?.user?.role === "tecnico") ? (
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nuevo</SelectItem>
                      <SelectItem value="assigned">Asignado</SelectItem>
                      <SelectItem value="in_progress">En Progreso</SelectItem>
                      <SelectItem value="resolved">Resuelto</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(ticket.status)
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Prioridad</p>
                {getPriorityBadge(ticket.priority)}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Categoría</p>
                <p>{ticket.category}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Creado por</p>
                <p>{`${ticket.creatorFirstName} ${ticket.creatorLastName}`}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Asignado a</p>
                <p>
                  {ticket.assigneeFirstName && ticket.assigneeLastName
                    ? `${ticket.assigneeFirstName} ${ticket.assigneeLastName}`
                    : "No asignado"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Última actualización</p>
                <p>{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comentarios</CardTitle>
            <CardDescription>Discusión y seguimiento del ticket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {comment.userFirstName} {comment.userLastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2">{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Textarea
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
