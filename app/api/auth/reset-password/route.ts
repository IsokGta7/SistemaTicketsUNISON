import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }
    } catch (error) {
      return NextResponse.json(
        { message: "El enlace de recuperación no es válido o ha expirado" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password
    await query(
      'UPDATE "User" SET password = $1 WHERE id = $2',
      [hashedPassword, decoded.userId]
    )

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { message: "Error al actualizar la contraseña" },
      { status: 500 }
    )
  }
} 