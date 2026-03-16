import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const passengerPaths = ['/passenger', '/payment', '/ticket', '/notifications', '/profile']
const adminPaths = ['/admin']
const authPaths = ['/login', '/signup', '/login/admin']
const adminLoginPath = '/login/admin'

async function verifyToken(token: string): Promise<{ id: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { id: (payload.id as string) || '', role: (payload.role as string) || 'passenger' }
  } catch {
    return null
  }
}

function getToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7)
  return req.cookies.get('token')?.value || null
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = getToken(req)
  const user = token ? await verifyToken(token) : null

  const isPassengerPath = passengerPaths.some((p) => pathname.startsWith(p))
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p))
  const isAuthPath = authPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isAdminPath && !pathname.includes('/login')) {
    if (!user) {
      const url = new URL(adminLoginPath, req.url)
      return NextResponse.redirect(url)
    }
    if (user.role !== 'admin') {
      const url = new URL('/login', req.url)
      return NextResponse.redirect(url)
    }
  }

  if (isPassengerPath && !user) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if ((pathname === '/login' || pathname === '/signup') && user && user.role === 'passenger') {
    return NextResponse.redirect(new URL('/passenger/dashboard', req.url))
  }
  if ((pathname === '/admin/login' || pathname === '/login/admin') && user && user.role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL(adminLoginPath, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/passenger/:path*',
    '/admin/:path*',
    '/login',
    '/login/admin',
    '/signup',
    '/profile',
    '/payment/:path*',
    '/ticket/:path*',
    '/notifications',
  ],
}
