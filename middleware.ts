import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Paths that don't require authentication
const publicPaths = ["/", "/login", "/register", "/forgot-password", "/api/health"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname === path) || pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Check for API health endpoint
  if (pathname === "/api/health") {
    return NextResponse.next()
  }

  // Get token from Authorization header
  const authHeader = request.headers.get("authorization")
  const token = authHeader && authHeader.split(" ")[1]

  // If no token and not an API route, redirect to login
  if (!token && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For API routes, return 401 if no token
  if (!token && pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }

  try {
    // Verify token
    verify(token, process.env.JWT_SECRET || "fallback_secret")
    return NextResponse.next()
  } catch (error) {
    // If token is invalid and not an API route, redirect to login
    if (!pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // For API routes, return 401
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
}
