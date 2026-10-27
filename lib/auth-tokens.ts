// Shared by the API routes (jsonwebtoken) and middleware (jose, edge
// runtime), so it must not import any Node-only module.

// The one place JWT_SECRET is read. There is deliberately no fallback: a
// missing secret is a configuration error, never a reason to sign with a
// value anyone can read in the source.
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET is not set")
  }
  return secret
}

// Password-reset links carry a JWT signed with the same secret as session
// tokens, so the payload names its purpose and reset-password accepts
// nothing else. A session token has no purpose claim and is rejected there.
export const PASSWORD_RESET_PURPOSE = "password-reset"
export const PASSWORD_RESET_TTL = "1h"

export type PasswordResetPayload = { userId: string; purpose: typeof PASSWORD_RESET_PURPOSE }

export function isPasswordResetPayload(payload: unknown): payload is PasswordResetPayload {
  if (typeof payload !== "object" || payload === null) return false
  const { userId, purpose } = payload as Record<string, unknown>
  return purpose === PASSWORD_RESET_PURPOSE && typeof userId === "string" && userId.length > 0
}
