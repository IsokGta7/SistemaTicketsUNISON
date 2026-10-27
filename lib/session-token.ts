import { jwtVerify } from "jose"

// Verifies the session JWT from the "token" cookie and returns the role it
// was signed with, or null when the token is missing, malformed, expired,
// signed with another key, or is a purpose-bound token such as a password
// reset link. Uses jose so it runs in the edge runtime.
export async function verifySessionRole(
  token: string | undefined,
  secret: string,
): Promise<string | null> {
  if (!token || !secret) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    })
    if (payload.purpose !== undefined) return null
    return typeof payload.role === "string" ? payload.role : null
  } catch {
    return null
  }
}

const STAFF_ROLES = ["admin", "tecnico"]
const REQUESTER_ROLES = ["estudiante", "profesor"]
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]

// Where a request for pathname should be sent, given the verified role (null
// when there is no valid session). Returns null to let the request through.
export function redirectFor(pathname: string, role: string | null): string | null {
  if (PUBLIC_PATHS.includes(pathname)) {
    if (role && STAFF_ROLES.includes(role)) return "/dashboard"
    if (role && REQUESTER_ROLES.includes(role)) return "/tickets"
    return null
  }

  if (!role) return "/login"

  if (pathname.startsWith("/dashboard") && !STAFF_ROLES.includes(role)) return "/tickets"
  if (pathname.startsWith("/tickets") && !REQUESTER_ROLES.includes(role)) return "/dashboard"

  return null
}
