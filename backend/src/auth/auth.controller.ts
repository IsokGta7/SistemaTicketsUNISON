import type { Request, Response } from "express"
import { authService } from "./auth.service"
import { loginDtoSchema, registerDtoSchema, themeUpdateDtoSchema } from "./auth.dto"

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerDtoSchema.parse(req.body)
      const user = await authService.register(validatedData)
      return res.status(201).json(user)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      if (error.name === "AuthError") {
        return res.status(409).json({ message: error.message })
      }
      console.error("Registration error:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginDtoSchema.parse(req.body)
      const { user, token } = await authService.login(validatedData)
      return res.status(200).json({ user, token })
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      if (error.name === "AuthError") {
        return res.status(401).json({ message: error.message })
      }
      console.error("Login error:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async updateTheme(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const validatedData = themeUpdateDtoSchema.parse(req.body)
      const user = await authService.updateUserTheme(userId, validatedData.theme)
      return res.status(200).json(user)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Theme update error:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const user = await authService.getUserById(userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      return res.status(200).json(user)
    } catch (error) {
      console.error("Get profile error:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}

export const authController = new AuthController()
