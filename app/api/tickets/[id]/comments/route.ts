import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST /api/tickets/[id]/comments - Añadir un comentario a un ticket
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const ticketId = params.id
    const { content } = await request.json()

    // Validar contenido
    if (!content) {
      return NextResponse.json({ message: "El contenido del comentario es requerido" }, { status: 400 })
    }

    // En una aplicación real, obtendríamos el usuario de la sesión
    const userId = "user_demo_id" // Normalmente: session.user.id

    // Verificar que el ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      return NextResponse.json({ message: "Ticket no encontrado" }, { status: 404 })
    }

    // Crear el comentario
    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Registrar en el historial
    await prisma.ticketHistory.create({
      data: {
        action: "Comentario añadido",
        ticketId,
        userId,
      },
    })

    // Crear notificación para el creador del ticket (si no es el mismo usuario)
    if (ticket.creatorId !== userId) {
      await prisma.notification.create({
        data: {
          title: `Nuevo comentario en ticket #${ticketId}`,
          description: `Se ha añadido un nuevo comentario a tu ticket: "${ticket.title}"`,
          userId: ticket.creatorId,
        },
      })
    }

    // Si hay un asignado, notificarle también (si no es el mismo usuario)
    if (ticket.assigneeId && ticket.assigneeId !== userId) {
      await prisma.notification.create({
        data: {
          title: `Nuevo comentario en ticket #${ticketId}`,
          description: `Se ha añadido un nuevo comentario al ticket: "${ticket.title}"`,
          userId: ticket.assigneeId,
        },
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error al añadir comentario:", error)
    return NextResponse.json({ message: "Error al añadir comentario" }, { status: 500 })
  }
}
