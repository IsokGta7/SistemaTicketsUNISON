import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/tickets - Get all tickets with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let queryString = `
      SELECT t.*, 
        u1."firstName" as "creatorFirstName", 
        u1."lastName" as "creatorLastName",
        u2."firstName" as "assigneeFirstName",
        u2."lastName" as "assigneeLastName"
      FROM "Ticket" t
      LEFT JOIN "User" u1 ON t."creatorId" = u1.id
      LEFT JOIN "User" u2 ON t."assigneeId" = u2.id
      WHERE 1=1
    `
    const params = []

    if (status && status !== "all") {
      queryString += ` AND t.status = $${params.length + 1}`
      params.push(status)
    }

    if (priority && priority !== "all") {
      queryString += ` AND t.priority = $${params.length + 1}`
      params.push(priority)
    }

    if (category && category !== "all") {
      queryString += ` AND t.category = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      queryString += ` AND (t.title ILIKE $${params.length + 1} OR t.description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    // Get total count for pagination
    const countQuery = queryString.replace(/SELECT.*?FROM/, "SELECT COUNT(*) FROM")
    const countResult = await query(countQuery, params)
    const total = parseInt(countResult.rows[0].count)

    // Add pagination
    queryString += ` ORDER BY t."createdAt" DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(queryString, params)

    return NextResponse.json({
      tickets: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ message: "Error al obtener los tickets" }, { status: 500 })
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, priority } = body

    if (!title || !description || !category) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO "Ticket" (title, description, category, priority, status, "creatorId")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, category, priority || "medium", "new", session.user.id]
    )

    // Create history entry
    await query(
      `INSERT INTO "TicketHistory" (action, "ticketId", "userId")
       VALUES ($1, $2, $3)`,
      ["Ticket creado", result.rows[0].id, session.user.id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error al crear ticket:", error)
    return NextResponse.json({ message: "Error al crear ticket" }, { status: 500 })
  }
}

// PUT /api/tickets - Update a ticket
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, category, priority, status, assigneeId } = body

    if (!id) {
      return NextResponse.json({ message: "ID de ticket requerido" }, { status: 400 })
    }

    // Get current ticket data
    const currentTicket = await query(
      `SELECT * FROM "Ticket" WHERE id = $1`,
      [id]
    )

    if (currentTicket.rows.length === 0) {
      return NextResponse.json({ message: "Ticket no encontrado" }, { status: 404 })
    }

    const ticket = currentTicket.rows[0]

    // Check if user has permission to update
    if (session.user.role !== "admin" && session.user.role !== "tecnico" && ticket.creatorId !== session.user.id) {
      return NextResponse.json({ message: "No tienes permiso para actualizar este ticket" }, { status: 403 })
    }

    // Update ticket
    const result = await query(
      `UPDATE "Ticket"
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           priority = COALESCE($4, priority),
           status = COALESCE($5, status),
           "assigneeId" = COALESCE($6, "assigneeId"),
           "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, category, priority, status, assigneeId, id]
    )

    // Create history entries for changes
    if (status && status !== ticket.status) {
      await query(
        `INSERT INTO "TicketHistory" (action, "ticketId", "userId")
         VALUES ($1, $2, $3)`,
        [`Estado cambiado a "${status}"`, id, session.user.id]
      )
    }

    if (assigneeId && assigneeId !== ticket.assigneeId) {
      const assignee = await query(
        `SELECT "firstName", "lastName" FROM "User" WHERE id = $1`,
        [assigneeId]
      )
      const assigneeName = assignee.rows[0] ? `${assignee.rows[0].firstName} ${assignee.rows[0].lastName}` : "Desconocido"
      await query(
        `INSERT INTO "TicketHistory" (action, "ticketId", "userId")
         VALUES ($1, $2, $3)`,
        [`Ticket asignado a ${assigneeName}`, id, session.user.id]
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error al actualizar ticket:", error)
    return NextResponse.json({ message: "Error al actualizar ticket" }, { status: 500 })
  }
}
