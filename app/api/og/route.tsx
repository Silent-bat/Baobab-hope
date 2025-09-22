import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'BAOBAB HOPE'
    const description = searchParams.get('description') || 'One Heart, One Hand'
    const language = searchParams.get('lang') || 'en'
    const theme = searchParams.get('theme') || 'light'
    const template = searchParams.get('template') || 'default'

    // Get language direction
    const isRTL = ['ar', 'he', 'fa', 'ur'].includes(language)
    
    // Color schemes
    const colors = {
      light: {
        background: '#ffffff',
        primary: '#10b981',
        secondary: '#059669',
        text: '#1f2937',
        accent: '#f3f4f6'
      },
      dark: {
        background: '#1f2937',
        primary: '#34d399',
        secondary: '#10b981',
        text: '#ffffff',
        accent: '#374151'
      }
    }
    
    const colorScheme = colors[theme as keyof typeof colors] || colors.light

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colorScheme.background,
            backgroundImage: `linear-gradient(45deg, ${colorScheme.primary}20, ${colorScheme.secondary}20)`,
            fontFamily: 'Inter, sans-serif',
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {/* Header with logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              gap: '20px'
            }}
          >
            {/* Logo placeholder - in a real implementation, you'd load the actual logo */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: colorScheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              BH
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: colorScheme.text,
                textAlign: isRTL ? 'right' : 'left'
              }}
            >
              BAOBAB HOPE
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '900px',
              padding: '0 60px'
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : '64px',
                fontWeight: '800',
                color: colorScheme.text,
                lineHeight: '1.2',
                marginBottom: '30px',
                textAlign: 'center'
              }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p
                style={{
                  fontSize: '24px',
                  color: colorScheme.text + '80',
                  lineHeight: '1.4',
                  marginBottom: '40px',
                  textAlign: 'center'
                }}
              >
                {description}
              </p>
            )}

            {/* Language indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                backgroundColor: colorScheme.accent,
                borderRadius: '25px',
                fontSize: '16px',
                color: colorScheme.text,
                fontWeight: '500'
              }}
            >
              <span>🌍</span>
              <span>{getLanguageName(language)}</span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '18px',
              color: colorScheme.text + '60'
            }}
          >
            <span>One Heart, One Hand</span>
            <span>•</span>
            <span>baobabhope.org</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new NextResponse('Failed to generate image', { status: 500 })
  }
}

function getLanguageName(code: string): string {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'fr': 'Français',
    'es': 'Español',
    'ar': 'العربية',
    'zh': '中文',
    'ru': 'Русский',
    'pt': 'Português',
    'de': 'Deutsch',
    'ja': '日本語',
    'hi': 'हिन्दी',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'ko': '한국어',
    'tr': 'Türkçe',
    'pl': 'Polski',
    'uk': 'Українська',
    'vi': 'Tiếng Việt',
    'th': 'ไทย',
    'id': 'Bahasa Indonesia',
    'ms': 'Bahasa Melayu',
    'sw': 'Kiswahili',
    'am': 'አማርኛ',
    'yo': 'Yorùbá',
    'ha': 'Hausa',
    'bn': 'বাংলা',
    'ur': 'اردو',
    'fa': 'فارسی',
    'he': 'עברית'
  }
  
  return languageNames[code] || code.toUpperCase()
}