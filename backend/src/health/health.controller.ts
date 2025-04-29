import type { Request, Response } from "express"
import prisma from "../db/client"
import { config } from "../config/config"

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`

      return res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
        environment: config.nodeEnv,
        version: process.env.npm_package_version || "1.0.0",
      })
    } catch (error) {
      console.error("Health check failed:", error)

      return res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Database connection failed",
      })
    }
  }
}

export const healthController = new HealthController()
