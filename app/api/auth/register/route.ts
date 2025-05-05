import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@unison\.mx$/i
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "El correo electrónico debe ser un correo institucional de UNISON (@unison.mx)" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await query(
      `INSERT INTO "User" (id, "firstName", "lastName", email, password, role, "createdAt", "updatedAt")
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, "firstName", "lastName", email, role, "createdAt", "updatedAt"`,
      [firstName, lastName, email, hashedPassword, role]
    )

    const user = result.rows[0]

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
