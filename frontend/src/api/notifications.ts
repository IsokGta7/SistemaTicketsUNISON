import apiClient from "./client"

export interface Notification {
  id: string
  title: string
  description: string
  read: boolean
  createdAt: string
}

const notificationsApi = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("/notifications")
    return response.data
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.post<Notification>("/notifications/read", { id })
    return response.data
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post("/notifications/read-all")
  },
}

export default notificationsApi
