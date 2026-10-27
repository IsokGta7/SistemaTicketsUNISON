import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionRole, redirectFor } from "@/lib/session-token"

// The role comes only from the signed "token" cookie. A missing JWT_SECRET
// leaves every token unverifiable, so protected pages redirect to login.
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const role = await verifySessionRole(token, process.env.JWT_SECRET ?? "")

  const target = redirectFor(request.nextUrl.pathname, role)
  if (target) {
    return NextResponse.redirect(new URL(target, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
}
