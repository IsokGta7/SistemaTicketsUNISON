import { NextResponse } from "next/server"

export async function POST() {
  // In a real application with server-side sessions, you would invalidate the session here
  // Since we're using JWT tokens stored in localStorage, the actual logout happens client-side

  return NextResponse.json({ message: "Sesión cerrada exitosamente" })
}
