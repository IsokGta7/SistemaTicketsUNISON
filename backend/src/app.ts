import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { config } from "./config/config"

// Import routes
import authRoutes from "./auth/auth.routes"
import ticketRoutes from "./tickets/ticket.routes"
import reportRoutes from "./reports/report.routes"
import notificationRoutes from "./notifications/notification.routes"
import healthRoutes from "./health/health.routes"

// Create Express app
const app = express()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan(config.isDevelopment ? "dev" : "combined"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/healthz", healthRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Internal Server Error",
    ...(config.isDevelopment && { error: err.message }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" })
})

export default app
