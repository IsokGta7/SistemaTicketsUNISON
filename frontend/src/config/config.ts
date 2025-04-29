// Environment variables configuration
const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:3001",
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
