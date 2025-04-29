import type { Request, Response } from "express"
import { notificationService } from "./notification.service"
import { markAsReadDtoSchema } from "./notification.dto"

export class NotificationController {
  async getMyNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const notifications = await notificationService.getNotificationsByUser(userId)
      return res.status(200).json(notifications)
    } catch (error) {
      console.error("Error getting notifications:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const validatedData = markAsReadDtoSchema.parse(req.body)
      const notification = await notificationService.markAsRead(validatedData.id, userId)

      return res.status(200).json(notification)
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors })
      }
      console.error("Error marking notification as read:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      await notificationService.markAllAsRead(userId)
      return res.status(200).json({ message: "All notifications marked as read" })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
}

export const notificationController = new NotificationController()
