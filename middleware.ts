import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const user = request.cookies.get("user")?.value
  const { pathname } = request.nextUrl

  // Rutas públicas
  const publicPaths = ["/login", "/register", "/forgot-password"]
  if (publicPaths.includes(pathname)) {
    if (token && user) {
      const parsedUser = JSON.parse(user)
      // Redirigir a la página correspondiente según el rol
      if (["admin", "tecnico"].includes(parsedUser.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      } else if (["estudiante", "profesor"].includes(parsedUser.role)) {
        return NextResponse.redirect(new URL("/tickets", request.url))
      }
    }
    return NextResponse.next()
  }

  // Rutas protegidas
  if (!token || !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const parsedUser = JSON.parse(user)

  // Verificar acceso a rutas según el rol
  if (pathname.startsWith("/dashboard")) {
    if (!["admin", "tecnico"].includes(parsedUser.role)) {
      return NextResponse.redirect(new URL("/tickets", request.url))
    }
  }

  if (pathname.startsWith("/tickets")) {
    if (!["estudiante", "profesor"].includes(parsedUser.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
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
