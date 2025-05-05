import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: "El correo electrónico es requerido" },
        { status: 400 }
      )
    }

    // Check if user exists
    const result = await query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "No se encontró una cuenta con este correo electrónico" },
        { status: 404 }
      )
    }

    const user = result.rows[0]

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    )

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetLink)

    if (!emailSent) {
      return NextResponse.json(
        { message: "Error al enviar el correo de recuperación" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Se ha enviado un correo con las instrucciones para restablecer tu contraseña",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
} 