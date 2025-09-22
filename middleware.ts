import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LANGUAGES } from './lib/i18n/languages'

// Get list of supported language codes
const supportedLocales = SUPPORTED_LANGUAGES
  .filter(lang => lang.enabled)
  .map(lang => lang.code)

const defaultLocale = 'en'

// Matcher configuration for Next.js middleware
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|logo.png|images|locales|.*\\.).*)',
  ],
}

function getLocaleFromRequest(request: NextRequest): string {
  // 1. Check URL pathname for language code
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return pathname.split('/')[1]
  }

  // 2. Check user preference from cookie
  const cookieLocale = request.cookies.get('preferred-language')?.value
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 3. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale] = lang.trim().split(';')
        return locale.toLowerCase()
      })

    // Check for exact matches first
    for (const browserLocale of browserLocales) {
      if (supportedLocales.includes(browserLocale)) {
        return browserLocale
      }
    }

    // Check for language family matches (e.g., 'en-US' -> 'en')
    for (const browserLocale of browserLocales) {
      const langCode = browserLocale.split('-')[0]
      if (supportedLocales.includes(langCode)) {
        return langCode
      }
    }
  }

  // 4. Fallback to default locale
  return defaultLocale
}

function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && supportedLocales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/')
  }
  return pathname
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }
  
  // Check if pathname already has a supported locale
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If pathname doesn't have a locale, redirect to add one
  if (!pathnameHasLocale) {
    const detectedLocale = getLocaleFromRequest(request)
    
    // Handle root path specially
    const targetPath = pathname === '/' ? '' : pathname
    const newUrl = new URL(`/${detectedLocale}${targetPath}`, request.url)
    
    // Copy search params
    newUrl.search = request.nextUrl.search
    
    const response = NextResponse.redirect(newUrl)
    
    // Set cookie to remember user's language preference
    response.cookies.set('preferred-language', detectedLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    return response
  }

  // If pathname has a locale, continue with the request
  // but rewrite the URL to remove the locale for internal routing
  const locale = pathname.split('/')[1]
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname)
  
  // Handle empty path after locale removal
  const targetPath = pathnameWithoutLocale || '/'
  
  // Rewrite the URL to the actual file path
  const rewriteUrl = new URL(targetPath, request.url)
  rewriteUrl.search = request.nextUrl.search
  
  const response = NextResponse.rewrite(rewriteUrl)
  
  // Add locale information to headers for use in components
  response.headers.set('x-locale', locale)
  response.headers.set('x-pathname', pathnameWithoutLocale)
  
  // Ensure the language preference cookie is set
  if (!request.cookies.get('preferred-language')) {
    response.cookies.set('preferred-language', locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  }
  
  return response
}