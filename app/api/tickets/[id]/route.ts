import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

// GET /api/tickets/[id] - Obtener un ticket específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const ticket = await query(
      `SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.category,
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        c.first_name as "creatorFirstName",
        c.last_name as "creatorLastName",
        a.first_name as "assigneeFirstName",
        a.last_name as "assigneeLastName"
      FROM tickets t
      LEFT JOIN users c ON t.creator_id = c.id
      LEFT JOIN users a ON t.assignee_id = a.id
      WHERE t.id = $1`,
      [params.id]
    )

    if (!ticket.rows.length) {
      return new NextResponse("Ticket not found", { status: 404 })
    }

    return NextResponse.json(ticket.rows[0])
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// PATCH /api/tickets/[id] - Actualizar un ticket
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (session.user.role !== "admin" && session.user.role !== "tecnico") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return new NextResponse("Status is required", { status: 400 })
    }

    const validStatuses = ["new", "assigned", "in_progress", "resolved"]
    if (!validStatuses.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    const result = await query(
      `UPDATE tickets 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, params.id]
    )

    if (!result.rows.length) {
      return new NextResponse("Ticket not found", { status: 404 })
    }

    // Log the status change in ticket history
    await query(
      `INSERT INTO ticket_history (ticket_id, action, user_id)
       VALUES ($1, $2, $3)`,
      [params.id, `Status changed to ${status}`, session.user.id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating ticket:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
