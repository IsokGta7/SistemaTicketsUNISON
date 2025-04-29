import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "El usuario ya existe" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
