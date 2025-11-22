import { Metadata } from 'next'
import { SUPPORTED_LANGUAGES } from './languages'
import {
  generateHreflangLinks,
  getCanonicalUrl,
  addLocaleToPathname,
  getLanguageDirection
} from './url-utils'

export interface LocalizedMetadata {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noindex?: boolean
  alternateLanguages?: Record<string, string>

}

export interface MetadataGeneratorOptions {
  pathname: string
  language: string
  baseUrl?: string
  metadata: LocalizedMetadata
}

/**
 * Generate comprehensive multilingual metadata for Next.js
 */
export function generateMultilingualMetadata({
  pathname,
  language,
  baseUrl = 'https://baobabhope.org',
  metadata
}: MetadataGeneratorOptions): Metadata {
  const {
    title,
    description,
    keywords,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noindex = false,

  } = metadata

  // Generate URLs
  const canonicalUrl = getCanonicalUrl(pathname, baseUrl)
  const hreflangLinks = generateHreflangLinks(pathname, baseUrl)
  const currentUrl = `${baseUrl}${addLocaleToPathname(pathname, language)}`
  const direction = getLanguageDirection(language)

  // Build alternates object for Next.js
  const alternates: Metadata['alternates'] = {
    canonical: canonicalUrl,
    languages: {}
  }

  // Add hreflang alternates
  hreflangLinks.forEach(({ hreflang, href }) => {
    if (alternates.languages) {
      alternates.languages[hreflang] = href
    }
  })

  // Get language info
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === language)
  const locale = currentLanguageInfo ?
    `${language}_${getRegionCode(currentLanguageInfo.region) || 'US'}` :
    `${language}_US`

  // Build alternate locales for OpenGraph
  const alternateLocales = SUPPORTED_LANGUAGES
    .filter(lang => lang.enabled && lang.code !== language)
    .map(lang => `${lang.code}_${getRegionCode(lang.region) || 'US'}`)

  const result: Metadata = {
    title,
    description,
    keywords,
    alternates,

    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: 'BAOBAB HOPE',
      locale,
      alternateLocale: alternateLocales,
      type: ogType as any,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || 'BAOBAB HOPE'
        }
      ] : undefined
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      site: '@baobabhope',
      creator: '@baobabhope'
    },
    other: {
      'html-lang': language,
      'html-dir': direction
    }
  }

  return result
}

/**
 * Generate metadata from server headers (for use in layouts)
 */
export async function generateMetadataFromHeaders(
  metadata: LocalizedMetadata,
  baseUrl?: string
): Promise<Metadata> {
  // Import headers dynamically to avoid client-side issues
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const language = headersList.get('x-locale') || 'en'

  return generateMultilingualMetadata({
    pathname,
    language,
    baseUrl,
    metadata
  })
}

/**
 * Get region code from region name for locale formatting
 */
function getRegionCode(region?: string): string | null {
  if (!region) return null

  const regionMap: Record<string, string> = {
    'Global': 'US',
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

  return regionMap[region] || 'US'
}

/**
 * Generate structured data for multilingual content
 */
export function generateStructuredData({
  pathname,
  language,
  baseUrl = 'https://baobabhope.org',
  title,
  description,
  type = 'WebPage'
}: {
  pathname: string
  language: string
  baseUrl?: string
  title?: string
  description?: string
  type?: 'WebPage' | 'Organization' | 'Article' | 'Event'
}) {
  const currentUrl = `${baseUrl}${addLocaleToPathname(pathname, language)}`
  const hreflangLinks = generateHreflangLinks(pathname, baseUrl)

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    url: currentUrl,
    name: title,
    description,
    inLanguage: language,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BAOBAB HOPE',
      url: baseUrl,
      inLanguage: SUPPORTED_LANGUAGES
        .filter(lang => lang.enabled)
        .map(lang => lang.code)
    }
  }

  // Add alternate language versions
  if (hreflangLinks.length > 0) {
    (baseStructuredData.isPartOf as any) = {
      ...baseStructuredData.isPartOf,
      potentialAction: {
        '@type': 'ReadAction',
        target: hreflangLinks.map(({ href, hreflang }) => ({
          '@type': 'EntryPoint',
          urlTemplate: href,
          inLanguage: hreflang === 'x-default' ? 'en' : hreflang
        }))
      }
    }
  }

  return baseStructuredData
}

/**
 * Generate breadcrumb structured data with language support
 */
export function generateBreadcrumbStructuredData({
  pathname,
  language,
  baseUrl = 'https://baobabhope.org',
  breadcrumbs
}: {
  pathname: string
  language: string
  baseUrl?: string
  breadcrumbs: Array<{ name: string; path: string }>
}) {
  const items = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${baseUrl}${addLocaleToPathname(crumb.path, language)}`
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  }
}