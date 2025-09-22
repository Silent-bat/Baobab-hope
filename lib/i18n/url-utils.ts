import { SUPPORTED_LANGUAGES } from './languages'

// Get list of supported language codes
const supportedLocales = SUPPORTED_LANGUAGES
  .filter(lang => lang.enabled)
  .map(lang => lang.code)

const defaultLocale = 'en'

/**
 * Get the current locale from the pathname
 */
export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && supportedLocales.includes(segments[1])) {
    return segments[1]
  }
  return defaultLocale
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && supportedLocales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/')
  }
  return pathname
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: string): string {
  // Remove existing locale if present
  const cleanPathname = removeLocaleFromPathname(pathname)
  
  // Add new locale
  if (cleanPathname === '/') {
    return `/${locale}`
  }
  return `/${locale}${cleanPathname}`
}

/**
 * Generate localized URLs for all supported languages
 */
export function generateLocalizedUrls(pathname: string, baseUrl: string = ''): Record<string, string> {
  const cleanPathname = removeLocaleFromPathname(pathname)
  const urls: Record<string, string> = {}
  
  supportedLocales.forEach(locale => {
    const localizedPath = addLocaleToPathname(cleanPathname, locale)
    urls[locale] = `${baseUrl}${localizedPath}`
  })
  
  return urls
}

/**
 * Get canonical URL for the current page
 */
export function getCanonicalUrl(pathname: string, baseUrl: string = ''): string {
  const cleanPathname = removeLocaleFromPathname(pathname)
  const defaultLocalePath = addLocaleToPathname(cleanPathname, defaultLocale)
  return `${baseUrl}${defaultLocalePath}`
}

/**
 * Generate hreflang links for SEO
 */
export function generateHreflangLinks(pathname: string, baseUrl: string = ''): Array<{
  hreflang: string
  href: string
}> {
  const cleanPathname = removeLocaleFromPathname(pathname)
  const links: Array<{ hreflang: string; href: string }> = []
  
  // Add links for all supported languages
  SUPPORTED_LANGUAGES
    .filter(lang => lang.enabled)
    .forEach(language => {
      const localizedPath = addLocaleToPathname(cleanPathname, language.code)
      
      // Add standard hreflang
      links.push({
        hreflang: language.code,
        href: `${baseUrl}${localizedPath}`
      })
      
      // Add region-specific hreflang if applicable
      if (language.region && language.region !== 'Global') {
        const regionCode = getRegionCode(language.region)
        if (regionCode) {
          links.push({
            hreflang: `${language.code}-${regionCode}`,
            href: `${baseUrl}${localizedPath}`
          })
        }
      }
    })
  
  // Add x-default for default language
  const defaultPath = addLocaleToPathname(cleanPathname, defaultLocale)
  links.push({
    hreflang: 'x-default',
    href: `${baseUrl}${defaultPath}`
  })
  
  return links
}

/**
 * Get region code from region name
 */
function getRegionCode(region: string): string | null {
  const regionMap: Record<string, string> = {
    'Europe': 'EU',
    'Americas': 'US',
    'East Asia': 'CN',
    'Southeast Asia': 'SG',
    'South Asia': 'IN',
    'Middle East': 'AE',
    'North Africa': 'EG',
    'West Africa': 'NG',
    'East Africa': 'KE',
    'Europe/Africa': 'FR',
    'Europe/Asia': 'TR',
    'Eastern Europe/Asia': 'RU',
    'Americas/Europe': 'ES',
    'Americas/Europe/Africa': 'PT'
  }
  
  return regionMap[region] || null
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): boolean {
  return supportedLocales.includes(locale)
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): string {
  return defaultLocale
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): string[] {
  return [...supportedLocales]
}

/**
 * Get language direction for a locale
 */
export function getLanguageDirection(locale: string): 'ltr' | 'rtl' {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === locale)
  return language?.direction || 'ltr'
}

/**
 * Generate alternate URLs for sitemap
 */
export function generateSitemapAlternates(pathname: string, baseUrl: string = ''): Array<{
  lang: string
  url: string
}> {
  const cleanPathname = removeLocaleFromPathname(pathname)
  
  return SUPPORTED_LANGUAGES
    .filter(lang => lang.enabled)
    .map(language => ({
      lang: language.code,
      url: `${baseUrl}${addLocaleToPathname(cleanPathname, language.code)}`
    }))
}