import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import jwt from "jsonwebtoken"
import { getJwtSecret, PASSWORD_RESET_PURPOSE, PASSWORD_RESET_TTL } from "@/lib/auth-tokens"

// Same answer whether or not the address has an account, so the form cannot
// be used to find out who is registered.
const GENERIC_RESPONSE = {
  message: "Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña",
}

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
      return NextResponse.json(GENERIC_RESPONSE)
    }

    const user = result.rows[0]

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, purpose: PASSWORD_RESET_PURPOSE },
      getJwtSecret(),
      { expiresIn: PASSWORD_RESET_TTL }
    )

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetLink)

    if (!emailSent) {
      // Logged rather than returned: a 500 here would only ever happen for
      // registered addresses and would give them away.
      console.error("Forgot password: reset email could not be sent")
    }

    return NextResponse.json(GENERIC_RESPONSE)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
} 