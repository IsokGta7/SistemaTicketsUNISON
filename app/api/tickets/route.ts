import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET /api/tickets - Obtener todos los tickets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const category = searchParams.get("category")

    // Construir filtros
    const filters: any = {}
    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (category) filters.category = category

    // Obtener tickets con filtros
    const tickets = await prisma.ticket.findMany({
      where: filters,
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
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    return NextResponse.json({ message: "Error al obtener tickets" }, { status: 500 })
  }
}

// POST /api/tickets - Crear un nuevo ticket
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, category, priority } = body

    // Validar datos requeridos
    if (!title || !description || !category) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    // En una aplicación real, obtendríamos el usuario de la sesión
    // Por ahora, usaremos un ID de usuario fijo para demostración
    const userId = "user_demo_id" // Normalmente: session.user.id

    // Crear el ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        category,
        priority: priority || "medium",
        status: "new",
        creatorId: userId,
        // No asignamos assigneeId inicialmente
      },
    })

    // Registrar en el historial
    await prisma.ticketHistory.create({
      data: {
        action: "Ticket creado",
        ticketId: ticket.id,
        userId: userId,
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("Error al crear ticket:", error)
    return NextResponse.json({ message: "Error al crear ticket" }, { status: 500 })
  }
}
