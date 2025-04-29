import dotenv from "dotenv"
import { z } from "zod"

// Load environment variables from .env file
dotenv.config()

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is required in the environment variables",
  }),
  JWT_SECRET: z.string({
    required_error: "JWT_SECRET is required in the environment variables",
  }),
  JWT_EXPIRES_IN: z.string().default("1d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
})

// Parse and validate environment variables
const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.format())
  throw new Error("Invalid environment variables")
}

// Export validated config
export const config = {
  nodeEnv: env.data.NODE_ENV,
  port: Number.parseInt(env.data.PORT, 10),
  databaseUrl: env.data.DATABASE_URL,
  jwtSecret: env.data.JWT_SECRET,
  jwtExpiresIn: env.data.JWT_EXPIRES_IN,
  corsOrigin: env.data.CORS_ORIGIN,
  logLevel: env.data.LOG_LEVEL,
  isDevelopment: env.data.NODE_ENV === "development",
  isProduction: env.data.NODE_ENV === "production",
  isTest: env.data.NODE_ENV === "test",
}
