/**
 * Open Graph image generation utilities
 */

export interface OGImageOptions {
  title: string
  description?: string
  language: string
  theme?: 'light' | 'dark'
  template?: 'default' | 'article' | 'project' | 'event'
}

/**
 * Generate Open Graph image URL with dynamic content
 */
export function generateOGImageUrl({
  title,
  description,
  language,
  theme = 'light',
  template = 'default'
}: OGImageOptions): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'
  
  const params = new URLSearchParams({
    title: title.slice(0, 100), // Limit title length
    lang: language,
    theme,
    template
  })
  
  if (description) {
    params.set('description', description.slice(0, 200)) // Limit description length
  }
  
  return `${baseUrl}/api/og?${params.toString()}`
}

/**
 * Get default Open Graph image for a language
 */
export function getDefaultOGImage(language: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baobabhope.org'
  return `${baseUrl}/images/og/default-${language}.png`
}

/**
 * Generate social media sharing images
 */
export function generateSocialImages({
  title,
  description,
  language
}: {
  title: string
  description?: string
  language: string
}) {
  return {
    openGraph: generateOGImageUrl({ title, description, language, template: 'default' }),
    twitter: generateOGImageUrl({ title, description, language, template: 'default' }),
    facebook: generateOGImageUrl({ title, description, language, template: 'default' }),
    linkedin: generateOGImageUrl({ title, description, language, template: 'article' })
  }
}

/**
 * Validate image dimensions for social platforms
 */
export const SOCIAL_IMAGE_DIMENSIONS = {
  openGraph: { width: 1200, height: 630, ratio: '1.91:1' },
  twitter: { width: 1200, height: 630, ratio: '1.91:1' },
  facebook: { width: 1200, height: 630, ratio: '1.91:1' },
  linkedin: { width: 1200, height: 627, ratio: '1.91:1' },
  instagram: { width: 1080, height: 1080, ratio: '1:1' }
} as const

/**
 * Get image metadata for a given platform
 */
export function getImageMetadata(platform: keyof typeof SOCIAL_IMAGE_DIMENSIONS) {
  return SOCIAL_IMAGE_DIMENSIONS[platform]
}