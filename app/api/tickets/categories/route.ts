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

    // Get ticket counts by category
    const result = await query(
      "SELECT category, COUNT(*) as total FROM tickets GROUP BY category ORDER BY total DESC"
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching ticket categories:", error)
    return NextResponse.json(
      { error: "Error al obtener las estadísticas por categoría" },
      { status: 500 }
    )
  }
} 