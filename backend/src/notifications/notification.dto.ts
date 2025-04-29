import { z } from "zod"

// Mark as read DTO schema
export const markAsReadDtoSchema = z.object({
  id: z.string().min(1, "Notification ID is required"),
})

// Types derived from schemas
export type MarkAsReadDto = z.infer<typeof markAsReadDtoSchema>

// Notification DTO for responses
export interface NotificationDto {
  id: string
  title: string
  description: string
  read: boolean
  createdAt: Date
}
