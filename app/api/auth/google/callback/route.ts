import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        { message: "Código de autorización no proporcionado" },
        { status: 400 }
      )
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error("Error al obtener tokens de Google")
    }

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const userInfo = await userInfoResponse.json()

    // Verify email domain
    if (!userInfo.email.endsWith("@unison.mx")) {
      return NextResponse.json(
        { message: "Solo se permiten correos electrónicos de UNISON (@unison.mx)" },
        { status: 403 }
      )
    }

    // Check if user exists in database
    const result = await query(
      'SELECT * FROM "User" WHERE email = $1',
      [userInfo.email]
    )

    let user = result.rows[0]

    // If user doesn't exist, create new user
    if (!user) {
      const insertResult = await query(
        'INSERT INTO "User" (email, firstName, lastName, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [userInfo.email, userInfo.given_name, userInfo.family_name, "estudiante"]
      )
      user = insertResult.rows[0]
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    )

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    // Create response with token and user data
    const response = NextResponse.redirect(new URL("/", request.url))
    
    // Set cookie with token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Google callback error:", error)
    return NextResponse.json(
      { message: "Error en la autenticación con Google" },
      { status: 500 }
    )
  }
} 