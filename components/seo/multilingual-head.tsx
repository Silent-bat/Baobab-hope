'use client'

import Head from 'next/head'
import { useUrl } from '@/lib/i18n/use-url'

interface MultilingualHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  noindex?: boolean
}

/**
 * Component for handling multilingual SEO meta tags
 */
export function MultilingualHead({
  title,
  description,
  keywords,
  ogImage,
  noindex = false
}: MultilingualHeadProps) {
  const {
    getCanonicalUrlForPage,
    getHreflangLinks,
    getCurrentUrl,
    language,
    direction
  } = useUrl()

  const canonicalUrl = getCanonicalUrlForPage()
  const hreflangLinks = getHreflangLinks()
  const currentUrl = getCurrentUrl()

  return (
    <Head>
      {/* Language and direction */}
      <html lang={language} dir={direction} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang links */}
      {hreflangLinks.map(({ hreflang, href }) => (
        <link
          key={hreflang}
          rel="alternate"
          hrefLang={hreflang}
          href={href}
        />
      ))}
      
      {/* Basic meta tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
      />
      
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={language} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Add alternate locales for Open Graph */}
      {hreflangLinks
        .filter(link => link.hreflang !== language && link.hreflang !== 'x-default')
        .map(({ hreflang }) => (
          <meta
            key={`og-locale-${hreflang}`}
            property="og:locale:alternate"
            content={hreflang}
          />
        ))}
      
      {/* Twitter Card */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}

/**
 * Server-side version for use in layout or page components
 */
export function generateMultilingualMetadata({
  title,
  description,
  keywords,
  ogImage,
  pathname,
  language,
  baseUrl = 'https://baobabhope.org'
}: {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  pathname: string
  language: string
  baseUrl?: string
}) {
  // Import URL utilities (these work on server-side too)
  const {
    generateHreflangLinks,
    getCanonicalUrl,
    addLocaleToPathname,
    getLanguageDirection
  } = require('@/lib/i18n/url-utils')

  const canonicalUrl = getCanonicalUrl(pathname, baseUrl)
  const hreflangLinks = generateHreflangLinks(pathname, baseUrl)
  const currentUrl = `${baseUrl}${addLocaleToPathname(pathname, language)}`
  const direction = getLanguageDirection(language)

  return {
    title,
    description,
    keywords,
    canonical: canonicalUrl,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        hreflangLinks.map(({ hreflang, href }) => [hreflang, href])
      )
    },
    openGraph: {
      title,
      description,
      url: currentUrl,
      locale: language,
      alternateLocale: hreflangLinks
        .filter(link => link.hreflang !== language && link.hreflang !== 'x-default')
        .map(link => link.hreflang),
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      card: 'summary_large_image'
    },
    robots: {
      index: true,
      follow: true
    },
    other: {
      'html-lang': language,
      'html-dir': direction
    }
  }
}