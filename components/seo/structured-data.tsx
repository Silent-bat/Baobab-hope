'use client'

import { useUrl } from '@/lib/i18n/use-url'

interface StructuredDataProps {
  title?: string
  description?: string
  type?: 'WebPage' | 'Organization' | 'Article' | 'Event'
  breadcrumbs?: Array<{ name: string; path: string }>
  customData?: Record<string, any>
}

/**
 * Component for injecting structured data (JSON-LD) into the page
 */
export function StructuredData({
  title,
  description,
  type = 'WebPage',
  breadcrumbs,
  customData
}: StructuredDataProps) {
  const { getCleanPathname, language, baseUrl, generateHreflangLinks } = useUrl()
  const pathname = getCleanPathname()

  // Generate main structured data inline
  const currentUrl = `${baseUrl}${pathname}`
  const hreflangLinks = generateHreflangLinks(pathname)

  const mainStructuredData = {
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
      inLanguage: ['en', 'fr', 'es', 'ar', 'zh', 'ru', 'pt', 'de', 'ja', 'hi']
    }
  }

  // Generate breadcrumb structured data if provided
  const breadcrumbStructuredData = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}/${language}${crumb.path}`
    }))
  } : null

  // Combine all structured data
  const allStructuredData = [
    mainStructuredData,
    ...(breadcrumbStructuredData ? [breadcrumbStructuredData] : []),
    ...(customData ? [customData] : [])
  ]

  return (
    <>
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2)
          }}
        />
      ))}
    </>
  )
}

/**
 * Organization structured data for the main site (server-side)
 */
export function OrganizationStructuredData({ baseUrl = 'https://baobabhope.org' }: { baseUrl?: string }) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'BAOBAB HOPE',
    alternateName: 'One Heart, One Hand',
    description: 'A non-profit organization dedicated to sustainable development, education, and community empowerment.',
    url: baseUrl,
    logo: `${baseUrl}/images/newlogo.png`,
    slogan: 'One Heart, One Hand',
    foundingDate: '2020',
    sameAs: [
      'https://facebook.com/baobabhope',
      'https://twitter.com/baobabhope',
      'https://instagram.com/baobabhope',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Hope Street',
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'info@baobabhope.org',
      availableLanguage: ['English', 'French', 'Spanish', 'Arabic']
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Education',
      'Healthcare',
      'Environmental Conservation',
      'Community Development',
      'Sustainable Development',
      'Poverty Alleviation'
    ],
    inLanguage: ['en', 'fr', 'es', 'ar', 'zh', 'ru', 'pt', 'de', 'ja', 'hi']
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData, null, 2)
      }}
    />
  )
}

/**
 * Website structured data (server-side)
 */
export function WebsiteStructuredData({ baseUrl = 'https://baobabhope.org' }: { baseUrl?: string }) {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BAOBAB HOPE',
    alternateName: 'One Heart, One Hand',
    url: baseUrl,
    description: 'Empowering communities through sustainable development, education, and humanitarian aid.',
    inLanguage: ['en', 'fr', 'es', 'ar', 'zh', 'ru', 'pt', 'de', 'ja', 'hi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'NGO',
      name: 'BAOBAB HOPE',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/newlogo.png`
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteData, null, 2)
      }}
    />
  )
}