import apiClient from "./client"

export interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  createdAt: string
  updatedAt: string
  creator?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  assignee?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  comments?: Comment[]
  history?: HistoryEntry[]
}

export interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface HistoryEntry {
  id: string
  action: string
  createdAt: string
}

export interface CreateTicketRequest {
  title: string
  description: string
  category: string
  priority: string
}

export interface UpdateTicketRequest {
  status?: string
  priority?: string
  assigneeId?: string
}

export interface CreateCommentRequest {
  content: string
}

const ticketsApi = {
  getAllTickets: async (filters?: Record<string, string>): Promise<Ticket[]> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
    }

    const response = await apiClient.get<Ticket[]>(`/tickets?${params.toString()}`)
    return response.data
  },

  getMyTickets: async (): Promise<Ticket[]> => {
    const response = await apiClient.get<Ticket[]>("/tickets/my")
    return response.data
  },

  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`)
    return response.data
  },

  createTicket: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>("/tickets", data)
    return response.data
  },

  updateTicket: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}`, data)
    return response.data
  },

  addComment: async (id: string, data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/tickets/${id}/comments`, data)
    return response.data
  },
}

export default ticketsApi
