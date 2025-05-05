import { NextResponse } from "next/server"
import { verifyRecaptcha } from "@/lib/recaptcha"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token de reCAPTCHA no proporcionado" },
        { status: 400 }
      )
    }

    const isValid = await verifyRecaptcha(token)

    if (!isValid) {
      return NextResponse.json(
        { error: "Verificación de reCAPTCHA fallida" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en la verificación de reCAPTCHA:", error)
    return NextResponse.json(
      { error: "Error en la verificación de reCAPTCHA" },
      { status: 500 }
    )
  }
} 