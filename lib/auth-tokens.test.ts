import { afterEach, describe, expect, it } from "vitest"
import { getJwtSecret, isPasswordResetPayload, PASSWORD_RESET_PURPOSE } from "./auth-tokens"

describe("getJwtSecret", () => {
  const original = process.env.JWT_SECRET
  afterEach(() => {
    if (original === undefined) delete process.env.JWT_SECRET
    else process.env.JWT_SECRET = original
  })

  it("throws when JWT_SECRET is missing or empty", () => {
    delete process.env.JWT_SECRET
    expect(() => getJwtSecret()).toThrow("JWT_SECRET is not set")
    process.env.JWT_SECRET = ""
    expect(() => getJwtSecret()).toThrow("JWT_SECRET is not set")
  })

  it("returns the configured secret", () => {
    process.env.JWT_SECRET = "configured"
    expect(getJwtSecret()).toBe("configured")
  })
})

describe("isPasswordResetPayload", () => {
  it("accepts a reset payload", () => {
    expect(isPasswordResetPayload({ userId: "u1", purpose: PASSWORD_RESET_PURPOSE, exp: 1 })).toBe(true)
  })

  it("rejects a session token payload, which has no purpose", () => {
    expect(isPasswordResetPayload({ userId: "u1", role: "admin" })).toBe(false)
  })

  it("rejects other purposes and missing user ids", () => {
    expect(isPasswordResetPayload({ userId: "u1", purpose: "email-verify" })).toBe(false)
    expect(isPasswordResetPayload({ purpose: PASSWORD_RESET_PURPOSE })).toBe(false)
    expect(isPasswordResetPayload({ userId: "", purpose: PASSWORD_RESET_PURPOSE })).toBe(false)
  })

  it("rejects non-objects", () => {
    expect(isPasswordResetPayload("u1")).toBe(false)
    expect(isPasswordResetPayload(null)).toBe(false)
  })
})
