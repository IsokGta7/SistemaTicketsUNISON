import { AuthService } from "./auth.service"
import prisma from "../db/client"
import { hash } from "bcrypt"
import { AuthError } from "./auth.errors"
import { registerDtoSchema } from "./auth.dto"

// Mock Prisma client
jest.mock("../db/client", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}))

describe("AuthService", () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    jest.clearAllMocks()
  })

  describe("register", () => {
    it("should throw an error if user already exists", async () => {
      // Mock user exists
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
      })

      await expect(
        authService.register({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(AuthError)
    })

    it("should create a new user successfully", async () => {
      // Mock user doesn't exist
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      // Mock user creation
      ;(prisma.user.create as jest.Mock).mockResolvedValue({
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        role: "estudiante",
        theme: "light",
      })

      const result = await authService.register({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
      })

      expect(result).toEqual({
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        role: "estudiante",
        theme: "light",
      })
      expect(prisma.user.create).toHaveBeenCalled()
    })
  })

  describe("register role", () => {
    it("drops a client-supplied role when parsing the request body", () => {
      const parsed = registerDtoSchema.parse({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        role: "admin",
      })

      expect(parsed).not.toHaveProperty("role")
    })

    it("always stores the student role", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(prisma.user.create as jest.Mock).mockResolvedValue({ id: "1", role: "estudiante" })

      await authService.register({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        role: "admin",
      } as any)

      const createArgs = (prisma.user.create as jest.Mock).mock.calls[0][0]
      expect(createArgs.data.role).toBe("estudiante")
    })
  })

  describe("login", () => {
    it("should throw an error if user does not exist", async () => {
      // Mock user doesn't exist
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(
        authService.login({
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(AuthError)
    })

    it("should throw an error if password is incorrect", async () => {
      // Mock user exists but password doesn't match
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: await hash("different-password", 10),
      })

      await expect(
        authService.login({
          email: "test@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(AuthError)
    })

    it("should return user and token if login is successful", async () => {
      // Mock user exists and password matches
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: await hash("password123", 10),
        role: "estudiante",
        theme: "light",
      })

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      })

      expect(result).toHaveProperty("user")
      expect(result).toHaveProperty("token")
      expect(result.user).toEqual({
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        role: "estudiante",
        theme: "light",
      })
    })
  })
})
