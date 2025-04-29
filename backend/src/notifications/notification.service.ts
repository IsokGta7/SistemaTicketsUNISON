import prisma from "../db/client"
import type { NotificationDto } from "./notification.dto"

export class NotificationService {
  async getNotificationsByUser(userId: string): Promise<NotificationDto[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return notifications.map(this.mapToNotificationDto)
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDto> {
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!notification) {
      throw new Error("Notification not found")
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        read: true,
      },
    })

    return this.mapToNotificationDto(updatedNotification)
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    })
  }

  private mapToNotificationDto(notification: any): NotificationDto {
    return {
      id: notification.id,
      title: notification.title,
      description: notification.description,
      read: notification.read,
      createdAt: notification.createdAt,
    }
  }
}

export const notificationService = new NotificationService()
