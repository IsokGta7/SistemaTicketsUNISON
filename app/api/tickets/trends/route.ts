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

    // Get ticket counts by month for the last 6 months
    const result = await query(`
      WITH RECURSIVE months AS (
        SELECT 
          DATE_TRUNC('month', CURRENT_DATE) as month,
          TO_CHAR(CURRENT_DATE, 'Mon') as name
        UNION ALL
        SELECT 
          DATE_TRUNC('month', month - INTERVAL '1 month'),
          TO_CHAR(month - INTERVAL '1 month', 'Mon')
        FROM months
        WHERE DATE_TRUNC('month', month - INTERVAL '1 month') >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
      ),
      ticket_counts AS (
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as total
        FROM tickets
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
        GROUP BY DATE_TRUNC('month', created_at)
      )
      SELECT 
        m.name,
        COALESCE(tc.total, 0) as total
      FROM months m
      LEFT JOIN ticket_counts tc ON m.month = tc.month
      ORDER BY m.month ASC;
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching ticket trends:", error)
    return NextResponse.json(
      { error: "Error al obtener las tendencias de tickets" },
      { status: 500 }
    )
  }
} 