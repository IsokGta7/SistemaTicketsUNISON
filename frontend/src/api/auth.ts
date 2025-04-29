import apiClient from "./client"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  theme: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ThemeUpdateRequest {
  theme: "light" | "dark"
}

const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>("/auth/register", data)
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/profile")
    return response.data
  },

  updateTheme: async (data: ThemeUpdateRequest): Promise<User> => {
    const response = await apiClient.patch<User>("/auth/theme", data)
    return response.data
  },
}

export default authApi
