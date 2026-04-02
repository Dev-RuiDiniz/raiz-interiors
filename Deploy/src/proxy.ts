import { NextRequest, NextResponse } from 'next/server'
import {
  defaultLocale,
  isLocale,
  localeCookieMaxAge,
  localeCookieName,
  locales,
  type Locale,
} from './i18n/config'

const bypassPaths = ['/language', '/login']

const getLocaleFromPathname = (pathname: string): Locale | null => {
  const locale = locales.find(
    (value) => pathname.startsWith(`/${value}/`) || pathname === `/${value}`
  )

  return locale ?? null
}

const buildForwardHeaders = (request: NextRequest, pathname: string) => {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', pathname)
  return headers
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Skip routes that should never be localized or redirected.
  const isInternal =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'

  if (isInternal) return null

  // Keep these non-localized routes untouched.
  const shouldBypass = bypassPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  if (shouldBypass) {
    return NextResponse.next({
      request: {
        headers: buildForwardHeaders(request, pathname),
      },
    })
  }

  // Paths that already contain a supported locale set the cookie and continue.
  const pathnameLocale = getLocaleFromPathname(pathname)
  if (pathnameLocale) {
    const response = NextResponse.next({
      request: {
        headers: buildForwardHeaders(request, pathname),
      },
    })
    const cookieLocale = request.cookies.get(localeCookieName)?.value

    if (cookieLocale !== pathnameLocale) {
      response.cookies.set(localeCookieName, pathnameLocale, {
        path: '/',
        maxAge: localeCookieMaxAge,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value
  const savedLocale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : null
  const targetLocale = savedLocale ?? defaultLocale
  const redirectUrl = request.nextUrl.clone()
  const normalizedPath = pathname === '/' ? '' : pathname

  redirectUrl.pathname = `/${targetLocale}${normalizedPath}`
  redirectUrl.search = search

  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
}
