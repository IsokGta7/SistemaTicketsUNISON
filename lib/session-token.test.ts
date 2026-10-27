import { SignJWT } from "jose"
import { describe, expect, it } from "vitest"
import { redirectFor, verifySessionRole } from "./session-token"

const SECRET = "test-secret"
const key = (s: string) => new TextEncoder().encode(s)

function sign(payload: Record<string, unknown>, secret = SECRET, expiresIn = "1h") {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime(expiresIn).sign(key(secret))
}

describe("verifySessionRole", () => {
  it("returns the role from a token signed with the secret", async () => {
    expect(await verifySessionRole(await sign({ userId: "u1", role: "admin" }), SECRET)).toBe("admin")
  })

  it("rejects a token signed with another secret", async () => {
    expect(await verifySessionRole(await sign({ role: "admin" }, "other"), SECRET)).toBeNull()
  })

  it("rejects an unsigned token carrying a role", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url")
    const body = Buffer.from(JSON.stringify({ role: "admin" })).toString("base64url")
    expect(await verifySessionRole(`${header}.${body}.`, SECRET)).toBeNull()
  })

  it("rejects an expired token", async () => {
    const expired = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(key(SECRET))
    expect(await verifySessionRole(expired, SECRET)).toBeNull()
  })

  it("rejects a password-reset token", async () => {
    expect(await verifySessionRole(await sign({ userId: "u1", purpose: "password-reset" }), SECRET)).toBeNull()
  })

  it("rejects missing tokens, garbage and an empty secret", async () => {
    expect(await verifySessionRole(undefined, SECRET)).toBeNull()
    expect(await verifySessionRole("not-a-jwt", SECRET)).toBeNull()
    expect(await verifySessionRole(await sign({ role: "admin" }), "")).toBeNull()
  })
})

describe("redirectFor", () => {
  it("sends anonymous visitors of protected pages to login", () => {
    expect(redirectFor("/dashboard", null)).toBe("/login")
    expect(redirectFor("/tickets/123", null)).toBe("/login")
  })

  it("lets anonymous visitors use the public pages", () => {
    expect(redirectFor("/login", null)).toBeNull()
  })

  it("routes signed-in users away from the public pages by role", () => {
    expect(redirectFor("/login", "tecnico")).toBe("/dashboard")
    expect(redirectFor("/register", "estudiante")).toBe("/tickets")
  })

  it("keeps each role on its own area", () => {
    expect(redirectFor("/dashboard", "profesor")).toBe("/tickets")
    expect(redirectFor("/tickets", "admin")).toBe("/dashboard")
    expect(redirectFor("/dashboard/x", "admin")).toBeNull()
    expect(redirectFor("/tickets/new", "estudiante")).toBeNull()
  })
})
