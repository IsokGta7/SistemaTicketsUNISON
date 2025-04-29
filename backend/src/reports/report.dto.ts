import { z } from "zod"

// Create Report DTO schema
export const createReportDtoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["performance", "issue", "suggestion"]),
})

// Update Report DTO schema
export const updateReportDtoSchema = z.object({
  status: z.enum(["pending", "in_review", "approved", "rejected"]).optional(),
})

// Types derived from schemas
export type CreateReportDto = z.infer<typeof createReportDtoSchema>
export type UpdateReportDto = z.infer<typeof updateReportDtoSchema>

// User DTO for responses within reports
export interface UserSummaryDto {
  id: string
  firstName: string
  lastName: string
  email: string
}

// Report DTO for responses
export interface ReportDto {
  id: string
  title: string
  description: string
  type: string
  status: string
  createdAt: Date
  updatedAt: Date
  user?: UserSummaryDto
}
