import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { message: "Google authentication is not properly configured" },
      { status: 500 }
    )
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=email%20profile` +
    `&access_type=offline` +
    `&prompt=consent`

  return NextResponse.redirect(authUrl)
} 