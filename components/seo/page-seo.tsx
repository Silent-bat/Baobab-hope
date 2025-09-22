'use client'

import Head from 'next/head'
import { useSEO, type SEOData } from '@/lib/i18n/use-seo'
import { StructuredData } from './structured-data'

interface PageSEOProps extends SEOData {
  titleKey?: string
  descriptionKey?: string
  keywordsKey?: string
  breadcrumbs?: Array<{ nameKey: string; path: string; fallbackName?: string }>
  structuredDataType?: 'WebPage' | 'Organization' | 'Article' | 'Event'
  customStructuredData?: Record<string, any>
}

/**
 * Comprehensive SEO component for pages
 */
export function PageSEO({
  title,
  titleKey,
  description,
  descriptionKey,
  keywords,
  keywordsKey,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  breadcrumbs,
  structuredDataType = 'WebPage',
  customStructuredData
}: PageSEOProps) {
  const {
    generateMetaTags,
    getPageTitle,
    getMetaDescription,
    getKeywords,
    generateBreadcrumbs,
    getOGImageUrl,
    language,
    direction,
    canonicalUrl,
    currentUrl,
    hreflangLinks
  } = useSEO()

  // Get localized content
  const finalTitle = title || (titleKey ? getPageTitle(getMetaDescription(titleKey)) : undefined)
  const finalDescription = description || (descriptionKey ? getMetaDescription(descriptionKey) : undefined)
  const finalKeywords = keywords || (keywordsKey ? getKeywords(keywordsKey) : undefined)
  const finalOGImage = getOGImageUrl(ogImage)
  
  // Generate breadcrumb data
  const breadcrumbData = breadcrumbs ? generateBreadcrumbs(breadcrumbs) : undefined

  return (
    <>
      <Head>
        {/* Basic meta tags */}
        {finalTitle && <title>{finalTitle}</title>}
        {finalDescription && <meta name="description" content={finalDescription} />}
        {finalKeywords && <meta name="keywords" content={finalKeywords} />}
        
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
        
        {/* Robots */}
        <meta
          name="robots"
          content={noindex ? 'noindex,nofollow' : 'index,follow'}
        />
        <meta
          name="googlebot"
          content={noindex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'}
        />
        
        {/* Open Graph */}
        {finalTitle && <meta property="og:title" content={finalTitle} />}
        {finalDescription && <meta property="og:description" content={finalDescription} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:locale" content={language} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="BAOBAB HOPE" />
        {finalOGImage && <meta property="og:image" content={finalOGImage} />}
        {finalOGImage && <meta property="og:image:width" content="1200" />}
        {finalOGImage && <meta property="og:image:height" content="630" />}
        {finalOGImage && <meta property="og:image:alt" content={finalTitle || 'BAOBAB HOPE'} />}
        
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
        <meta name="twitter:card" content={twitterCard} />
        {finalTitle && <meta name="twitter:title" content={finalTitle} />}
        {finalDescription && <meta name="twitter:description" content={finalDescription} />}
        {finalOGImage && <meta name="twitter:image" content={finalOGImage} />}
        <meta name="twitter:site" content="@baobabhope" />
        <meta name="twitter:creator" content="@baobabhope" />
        
        {/* Additional meta tags */}
        <meta name="author" content="BAOBAB HOPE" />
        <meta name="publisher" content="BAOBAB HOPE" />
        <meta name="generator" content="Next.js" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#10b981" />
      </Head>
      
      {/* Structured Data */}
      <StructuredData
        title={finalTitle}
        description={finalDescription}
        type={structuredDataType}
        breadcrumbs={breadcrumbData}
        customData={customStructuredData}
      />
    </>
  )
}

/**
 * Simplified SEO component for basic pages
 */
export function BasicPageSEO({
  titleKey,
  descriptionKey,
  keywordsKey,
  ogImage
}: {
  titleKey: string
  descriptionKey?: string
  keywordsKey?: string
  ogImage?: string
}) {
  return (
    <PageSEO
      titleKey={titleKey}
      descriptionKey={descriptionKey}
      keywordsKey={keywordsKey}
      ogImage={ogImage}
    />
  )
}

/**
 * Article SEO component for blog posts and articles
 */
export function ArticleSEO({
  title,
  description,
  keywords,
  ogImage,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags
}: {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}) {
  const { currentUrl } = useSEO()

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: currentUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: author ? {
      '@type': 'Person',
      name: author
    } : {
      '@type': 'Organization',
      name: 'BAOBAB HOPE'
    },
    publisher: {
      '@type': 'Organization',
      name: 'BAOBAB HOPE',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png'
      }
    },
    articleSection: section,
    keywords: tags?.join(', ') || keywords
  }

  return (
    <>
      <PageSEO
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType="article"
        structuredDataType="Article"
        customStructuredData={articleStructuredData}
      />
      
      {/* Additional article meta tags */}
      <Head>
        <meta property="article:published_time" content={publishedTime} />
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {author && <meta property="article:author" content={author} />}
        {section && <meta property="article:section" content={section} />}
        {tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>
    </>
  )
}