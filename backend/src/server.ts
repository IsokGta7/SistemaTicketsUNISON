import app from "./app"
import { config } from "./config/config"
import prisma from "./db/client"

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("✅ Database connection established")

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`✅ Server running on port ${config.port} in ${config.nodeEnv} mode`)
    })

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down server...")
      await prisma.$disconnect()
      server.close(() => {
        console.log("Server closed")
        process.exit(0)
      })
    }

    process.on("SIGTERM", shutdown)
    process.on("SIGINT", shutdown)
  } catch (error) {
    console.error("❌ Failed to start server:", error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer()
