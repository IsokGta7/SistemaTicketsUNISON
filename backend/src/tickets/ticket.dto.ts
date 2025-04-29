import { z } from "zod"

// Create Ticket DTO schema
export const createTicketDtoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
})

// Update Ticket DTO schema
export const updateTicketDtoSchema = z.object({
  status: z.enum(["new", "assigned", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  assigneeId: z.string().optional(),
})

// Create Comment DTO schema
export const createCommentDtoSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
})

// Types derived from schemas
export type CreateTicketDto = z.infer<typeof createTicketDtoSchema>
export type UpdateTicketDto = z.infer<typeof updateTicketDtoSchema>
export type CreateCommentDto = z.infer<typeof createCommentDtoSchema>

// User DTO for responses within tickets
export interface UserSummaryDto {
  id: string
  firstName: string
  lastName: string
  email: string
}

// Comment DTO for responses
export interface CommentDto {
  id: string
  content: string
  createdAt: Date
  user: UserSummaryDto
}

// History entry DTO for responses
export interface HistoryEntryDto {
  id: string
  action: string
  createdAt: Date
}

// Ticket DTO for responses
export interface TicketDto {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  createdAt: Date
  updatedAt: Date
  creator?: UserSummaryDto
  assignee?: UserSummaryDto
  comments?: CommentDto[]
  history?: HistoryEntryDto[]
}
