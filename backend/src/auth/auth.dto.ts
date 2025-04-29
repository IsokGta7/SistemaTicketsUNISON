import { z } from "zod"

// Register DTO schema
export const registerDtoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["estudiante", "profesor", "tecnico", "admin"]),
})

// Login DTO schema
export const loginDtoSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

// Theme update DTO schema
export const themeUpdateDtoSchema = z.object({
  theme: z.enum(["light", "dark"]),
})

// Types derived from schemas
export type RegisterDto = z.infer<typeof registerDtoSchema>
export type LoginDto = z.infer<typeof loginDtoSchema>
export type ThemeUpdateDto = z.infer<typeof themeUpdateDtoSchema>

// User DTO for responses
export interface UserDto {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  theme: string
}
