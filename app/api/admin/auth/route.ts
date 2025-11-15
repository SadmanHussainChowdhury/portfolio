import { NextRequest, NextResponse } from 'next/server'

// Simple authentication - In production, use proper auth (NextAuth, Clerk, etc.)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_SESSION_KEY = 'admin-authenticated'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true })
      response.cookies.set(ADMIN_SESSION_KEY, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  const isAuthenticated = request.cookies.get(ADMIN_SESSION_KEY)?.value === 'true'
  return NextResponse.json({ authenticated: isAuthenticated })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(ADMIN_SESSION_KEY)
  return response
}

