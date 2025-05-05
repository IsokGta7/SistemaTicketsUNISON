import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Get total tickets count
    const totalResult = await query(
      "SELECT COUNT(*) as total FROM tickets"
    )
    const total = parseInt(totalResult.rows[0].total)

    // Get open tickets count
    const openResult = await query(
      "SELECT COUNT(*) as open FROM tickets WHERE status = 'new'"
    )
    const open = parseInt(openResult.rows[0].open)

    // Get in progress tickets count
    const inProgressResult = await query(
      "SELECT COUNT(*) as in_progress FROM tickets WHERE status = 'in_progress'"
    )
    const inProgress = parseInt(inProgressResult.rows[0].in_progress)

    // Get resolved tickets count
    const resolvedResult = await query(
      "SELECT COUNT(*) as resolved FROM tickets WHERE status = 'resolved'"
    )
    const resolved = parseInt(resolvedResult.rows[0].resolved)

    // Get tickets from last month for percentage change
    const lastMonthResult = await query(
      "SELECT COUNT(*) as last_month FROM tickets WHERE created_at >= NOW() - INTERVAL '1 month'"
    )
    const lastMonth = parseInt(lastMonthResult.rows[0].last_month)

    // Get tickets from two months ago
    const twoMonthsAgoResult = await query(
      "SELECT COUNT(*) as two_months_ago FROM tickets WHERE created_at >= NOW() - INTERVAL '2 months' AND created_at < NOW() - INTERVAL '1 month'"
    )
    const twoMonthsAgo = parseInt(twoMonthsAgoResult.rows[0].two_months_ago)

    // Calculate percentage change
    const percentChange = twoMonthsAgo === 0 
      ? 100 
      : Math.round(((lastMonth - twoMonthsAgo) / twoMonthsAgo) * 100)

    return NextResponse.json({
      total,
      open,
      inProgress,
      resolved,
      percentChange
    })
  } catch (error) {
    console.error("Error fetching ticket stats:", error)
    return NextResponse.json(
      { error: "Error al obtener las estadísticas de tickets" },
      { status: 500 }
    )
  }
} 