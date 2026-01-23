import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = [
  '/',
  '/customers',
  '/vendors',
  '/mechanics',
  '/inventory',
  '/parts',
  '/orders',
  '/jobs',
  '/services',
  '/service-history',
  '/feedback',
  '/support',
  '/settings',
  '/reports'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow login page and API routes
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if path requires authentication
  const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
  
  if (isProtected) {
    // Check for session cookie
    const session = request.cookies.get('session')
    
    if (!session) {
      // Redirect to login if no session
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|grid.svg|.*\\.png$).*)']
}
