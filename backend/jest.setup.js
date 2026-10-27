// config.ts refuses to load without these; tests never reach a real database.
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test"
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret"
