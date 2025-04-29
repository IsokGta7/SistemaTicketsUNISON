import { compare, hash } from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import prisma from "../db/client"
import { AuthError } from "./auth.errors"
import type { LoginDto, RegisterDto, UserDto } from "./auth.dto"

export class AuthService {
  async register(data: RegisterDto): Promise<UserDto> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new AuthError("User already exists with this email")
    }

    // Hash password
    const hashedPassword = await hash(data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    })

    return this.mapToUserDto(user)
  }

  async login(data: LoginDto): Promise<{ user: UserDto; token: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new AuthError("Invalid credentials")
    }

    // Compare passwords
    const passwordMatch = await compare(data.password, user.password)

    if (!passwordMatch) {
      throw new AuthError("Invalid credentials")
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    )

    return {
      user: this.mapToUserDto(user),
      token,
    }
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return null
    }

    return this.mapToUserDto(user)
  }

  async updateUserTheme(userId: string, theme: string): Promise<UserDto> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { theme },
    })

    return this.mapToUserDto(user)
  }

  private mapToUserDto(user: any): UserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      theme: user.theme || "light",
    }
  }
}

export const authService = new AuthService()
