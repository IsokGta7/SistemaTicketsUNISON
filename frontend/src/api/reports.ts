import apiClient from "./client"

export interface Report {
  id: string
  title: string
  description: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface CreateReportRequest {
  title: string
  description: string
  type: string
}

export interface UpdateReportRequest {
  status: string
}

const reportsApi = {
  getAllReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<Report[]>("/reports")
    return response.data
  },

  getMyReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<Report[]>("/reports/my")
    return response.data
  },

  getReportById: async (id: string): Promise<Report> => {
    const response = await apiClient.get<Report>(`/reports/${id}`)
    return response.data
  },

  createReport: async (data: CreateReportRequest): Promise<Report> => {
    const response = await apiClient.post<Report>("/reports", data)
    return response.data
  },

  updateReport: async (id: string, data: UpdateReportRequest): Promise<Report> => {
    const response = await apiClient.patch<Report>(`/reports/${id}`, data)
    return response.data
  },
}

export default reportsApi
