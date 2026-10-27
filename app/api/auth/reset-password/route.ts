import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getJwtSecret, isPasswordResetPayload } from "@/lib/auth-tokens"

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
    // Only tokens issued by forgot-password are accepted; a session token
    // signed with the same secret has no purpose claim and is rejected.
    let decoded: unknown
    try {
      decoded = jwt.verify(token, getJwtSecret())
    } catch (error) {
      decoded = null
    }
    if (!isPasswordResetPayload(decoded)) {
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