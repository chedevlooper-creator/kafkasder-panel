import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createRateLimiter, RateLimitPresets } from '@/lib/rate-limit'

// Create rate limiters for different route types
const apiRateLimiter = createRateLimiter(RateLimitPresets.standard)
const authRateLimiter = createRateLimiter(RateLimitPresets.strict)

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  // Apply rate limiting to API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const isAuthRoute = req.nextUrl.pathname.includes('/auth')
    const limiter = isAuthRoute ? authRateLimiter : apiRateLimiter
    const result = limiter(req)

    if (result.limited) {
      const resetSeconds = Math.ceil((result.resetTime - Date.now()) / 1000)
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(isAuthRoute ? RateLimitPresets.strict.limit : RateLimitPresets.standard.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
            'Retry-After': String(resetSeconds),
          },
        }
      )
    }

    // Add rate limit headers to successful responses
    res.headers.set('X-RateLimit-Limit', String(isAuthRoute ? RateLimitPresets.strict.limit : RateLimitPresets.standard.limit))
    res.headers.set('X-RateLimit-Remaining', String(result.remaining))
    res.headers.set('X-RateLimit-Reset', String(result.resetTime))
  }

  // Only create Supabase client if credentials are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  let session = null

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.delete({ name, ...options })
          },
        },
      }
    )

    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession()
    session = supabaseSession
  }

  
  // Check for demo session cookie
  const demoSession = req.cookies.get('demo-session')?.value === 'true'

  const pathname = req.nextUrl.pathname

  // Public routes - no auth required (route groups don't affect URL path)
  const publicRoutes = ['/giris', '/kayit', '/favicon.ico']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Protected routes - require auth
  const protectedRoutes = ['/genel', '/uyeler', '/bagis', '/sosyal-yardim', '/etkinlikler', '/dokumanlar', '/kullanicilar', '/ayarlar', '/yedekleme']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Redirect to login if trying to access protected route without session
  if (isProtectedRoute && !session && !demoSession) {
    const redirectUrl = new URL('/giris', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if trying to access auth routes with active session
  if (isPublicRoute && (session || demoSession)) {
    return NextResponse.redirect(new URL('/genel', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
