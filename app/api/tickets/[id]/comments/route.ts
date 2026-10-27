import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { checkTicketAccess } from "@/lib/ticket-guard"

// POST /api/tickets/[id]/comments - Añadir un comentario a un ticket
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const access = await checkTicketAccess(params.id, session.user)
    if (access === "not_found") {
      return new NextResponse("Ticket not found", { status: 404 })
    }
    if (access === "forbidden") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return new NextResponse("Content is required", { status: 400 })
    }

    const result = await query(
      `INSERT INTO comments (ticket_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at as "createdAt"`,
      [params.id, session.user.id, content]
    )

    // Get user details for the response
    const user = await query(
      `SELECT first_name as "userFirstName", last_name as "userLastName"
       FROM users
       WHERE id = $1`,
      [session.user.id]
    )

    return NextResponse.json({
      ...result.rows[0],
      userFirstName: user.rows[0].userFirstName,
      userLastName: user.rows[0].userLastName
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const access = await checkTicketAccess(params.id, session.user)
    if (access === "not_found") {
      return new NextResponse("Ticket not found", { status: 404 })
    }
    if (access === "forbidden") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const comments = await query(
      `SELECT 
        c.id,
        c.content,
        c.created_at as "createdAt",
        u.first_name as "userFirstName",
        u.last_name as "userLastName"
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = $1
      ORDER BY c.created_at ASC`,
      [params.id]
    )

    return NextResponse.json(comments.rows)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
