import { z } from "zod"

export const TICKET_STATUSES = ["new", "assigned", "in_progress", "resolved", "closed"] as const
export const TICKET_PRIORITIES = ["low", "medium", "high"] as const

// Create Ticket DTO schema
export const createTicketDtoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(TICKET_PRIORITIES).optional().default("medium"),
})

// Update Ticket DTO schema
export const updateTicketDtoSchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  assigneeId: z.string().optional(),
})

// Create Comment DTO schema
export const createCommentDtoSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
})

// List filters from the query string. Express parses ?status[not]=x or a
// repeated key into objects and arrays, so every field must be a plain string
// before it reaches a Prisma where clause. Category has no fixed set of values
// in the schema, so it is only required to be a short string.
export const ticketFiltersSchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  category: z.string().min(1).max(100).optional(),
})

// Types derived from schemas
export type TicketFilters = z.infer<typeof ticketFiltersSchema>
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
