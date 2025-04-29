import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/tickets/[id] - Obtener un ticket específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
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
          orderBy: {
            createdAt: "asc",
          },
        },
        history: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ message: "Ticket no encontrado" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error al obtener ticket:", error)
    return NextResponse.json({ message: "Error al obtener ticket" }, { status: 500 })
  }
}

// PATCH /api/tickets/[id] - Actualizar un ticket
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { status, priority, assigneeId } = body

    // En una aplicación real, obtendríamos el usuario de la sesión
    const userId = "user_demo_id" // Normalmente: session.user.id

    // Verificar que el ticket existe
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!existingTicket) {
      return NextResponse.json({ message: "Ticket no encontrado" }, { status: 404 })
    }

    // Actualizar el ticket
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId && { assigneeId }),
        updatedAt: new Date(),
      },
    })

    // Registrar cambios en el historial
    if (status && status !== existingTicket.status) {
      await prisma.ticketHistory.create({
        data: {
          action: `Estado cambiado a '${status}'`,
          ticketId: id,
          userId,
        },
      })
    }

    if (priority && priority !== existingTicket.priority) {
      await prisma.ticketHistory.create({
        data: {
          action: `Prioridad cambiada a '${priority}'`,
          ticketId: id,
          userId,
        },
      })
    }

    if (assigneeId && assigneeId !== existingTicket.assigneeId) {
      await prisma.ticketHistory.create({
        data: {
          action: `Ticket asignado a nuevo técnico`,
          ticketId: id,
          userId,
        },
      })
    }

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("Error al actualizar ticket:", error)
    return NextResponse.json({ message: "Error al actualizar ticket" }, { status: 500 })
  }
}
