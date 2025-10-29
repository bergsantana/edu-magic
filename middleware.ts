import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
//import "dotenv/config"

// Paths that don't require authentication
const publicPaths = ['/', '/auth/login', '/auth/signup', '/api/login', '/api/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Middleware checking path:', pathname)
  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Allow static files and Next.js internal files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Check for authentication token
  const cookieStr = await cookies()
  const myToken = cookieStr.get('edu-magic-auth-token')
  console.log('Middleware found token in cookies:', myToken)
  const token = request.cookies.get('edu-magic-auth-token')?.value
   
  
  if (!myToken?.value) {
    // Redirect to login if no token
    console.log('No auth token found, redirecting to login')
    cookieStr.delete('edu-magic-auth-token')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
//   try {
//     // Verify JWT token
//     console.log('Verifying token in middleware:', myToken.value, process.env.JWT_SECRET)
//     jwt.verify(myToken.value, process.env.JWT_SECRET || 'your-secret-key')
//     console.log('Token verified successfully')
//     return NextResponse.next()
//   } catch (error) {
//     // Invalid token, redirect to login
//     console.log('Invalid auth token, redirecting to login', error)
//     const response = NextResponse.redirect(new URL('/auth/login', request.url))
//     // Clear invalid token
//     response.cookies.delete('edu-magic-auth-token')
//     return response
//   }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}