import { PrismaClient } from "@prisma/client"
import { config } from "../config/config"

// Create a singleton instance of PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: config.isDevelopment ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: config.databaseUrl,
      },
    },
  })

// Prevent multiple instances during hot reloading in development
if (config.isDevelopment) globalForPrisma.prisma = prisma

export default prisma
