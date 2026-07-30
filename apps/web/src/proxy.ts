import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/libs/utils/src/session'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/analytics', '/settings', '/task']
// Routes only for unauthenticated users (redirect to dashboard if logged in)
const publicOnlyRoutes = ['/login', '/signup']

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
  const isPublicOnly = publicOnlyRoutes.some((r) => path.startsWith(r))

  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  if (isProtected && !session?.userId) {
    // Not authenticated → send to login
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('from', path)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicOnly && session?.userId) {
    // Already logged in → send to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
