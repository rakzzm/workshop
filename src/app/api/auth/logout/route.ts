import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  // Clear session cookie
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return NextResponse.json(
    { message: 'Logged out successfully' },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie }
    }
  )
}
