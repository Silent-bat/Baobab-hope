// Cultural formatting service for dates, numbers, and currencies

import { getLanguageByCode } from './languages'

export interface Address {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface PhoneNumberFormat {
  countryCode?: string
  areaCode?: string
  number: string
  extension?: string
}

export class CulturalFormattingService {
  private static formatters: Map<string, {
    date: Intl.DateTimeFormat
    number: Intl.NumberFormat
    currency: Map<string, Intl.NumberFormat>
  }> = new Map()

  // Regional phone number patterns
  private static phonePatterns: Record<string, RegExp> = {
    'en-US': /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    'en-GB': /^(\+?44)?[-.\s]?(\d{4,5})[-.\s]?(\d{6})$/,
    'fr': /^(\+?33)?[-.\s]?(\d{1})[-.\s]?(\d{2})[-.\s]?(\d{2})[-.\s]?(\d{2})[-.\s]?(\d{2})$/,
    'de': /^(\+?49)?[-.\s]?(\d{3,4})[-.\s]?(\d{3,8})$/,
    'es': /^(\+?34)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{3})$/,
    'it': /^(\+?39)?[-.\s]?(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})$/,
    'pt': /^(\+?351)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{3})$/,
    'nl': /^(\+?31)?[-.\s]?(\d{2})[-.\s]?(\d{3,4})[-.\s]?(\d{4})$/,
    'ja': /^(\+?81)?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{4})$/,
    'ko': /^(\+?82)?[-.\s]?(\d{2,3})[-.\s]?(\d{3,4})[-.\s]?(\d{4})$/,
    'zh': /^(\+?86)?[-.\s]?(\d{3})[-.\s]?(\d{4})[-.\s]?(\d{4})$/,
  }

  /**
   * Format date according to locale
   */
  static formatDate(
    date: Date, 
    locale: string, 
    options?: Intl.DateTimeFormatOptions
  ): string {
    try {
      const formatter = new Intl.DateTimeFormat(locale, options)
      return formatter.format(date)
    } catch (error) {
      console.warn(`Date formatting failed for locale ${locale}:`, error)
      // Fallback to English formatting
      return new Intl.DateTimeFormat('en', options).format(date)
    }
  }

  /**
   * Format number according to locale
   */
  static formatNumber(
    number: number, 
    locale: string, 
    options?: Intl.NumberFormatOptions
  ): string {
    try {
      const formatter = new Intl.NumberFormat(locale, options)
      return formatter.format(number)
    } catch (error) {
      console.warn(`Number formatting failed for locale ${locale}:`, error)
      // Fallback to English formatting
      return new Intl.NumberFormat('en', options).format(number)
    }
  }

  /**
   * Format currency according to locale
   */
  static formatCurrency(
    amount: number, 
    currency: string, 
    locale: string
  ): string {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      })
      return formatter.format(amount)
    } catch (error) {
      console.warn(`Currency formatting failed for ${currency} in locale ${locale}:`, error)
      // Fallback to English formatting
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currency
      }).format(amount)
    }
  }

  /**
   * Get localized currency options for a locale
   */
  static getLocalizedCurrencies(locale: string): string[] {
    const language = getLanguageByCode(locale.split('-')[0])
    return language?.currencyFormats.supported || ['USD', 'EUR']
  }

  /**
   * Get primary currency for a locale
   */
  static getPrimaryCurrency(locale: string): string {
    const language = getLanguageByCode(locale.split('-')[0])
    return language?.currencyFormats.primary || 'USD'
  }

  /**
   * Format phone number according to locale with comprehensive patterns
   */
  static formatPhoneNumber(phone: string, locale: string): string {
    if (!phone) return ''
    
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 0) return phone
    
    // Try locale-specific pattern first
    const pattern = this.phonePatterns[locale] || this.phonePatterns[locale.split('-')[0]]
    if (pattern) {
      const match = phone.match(pattern)
      if (match) {
        return this.formatPhoneByLocale(match, locale)
      }
    }
    
    // Fallback to basic formatting based on locale
    return this.formatPhoneBasic(cleaned, locale)
  }

  private static formatPhoneByLocale(match: RegExpMatchArray, locale: string): string {
    const [, countryCode, ...parts] = match
    
    switch (locale.split('-')[0]) {
      case 'en':
        if (locale === 'en-US') {
          return `${countryCode ? '+1 ' : ''}(${parts[0]}) ${parts[1]}-${parts[2]}`
        } else if (locale === 'en-GB') {
          return `${countryCode ? '+44 ' : ''}${parts[0]} ${parts[1]}`
        }
        break
      case 'fr':
        return `${countryCode ? '+33 ' : ''}${parts.join(' ')}`
      case 'de':
        return `${countryCode ? '+49 ' : ''}${parts[0]} ${parts[1]}`
      case 'es':
        return `${countryCode ? '+34 ' : ''}${parts.join(' ')}`
      case 'it':
        return `${countryCode ? '+39 ' : ''}${parts.join(' ')}`
      case 'pt':
        return `${countryCode ? '+351 ' : ''}${parts.join(' ')}`
      case 'nl':
        return `${countryCode ? '+31 ' : ''}${parts.join(' ')}`
      case 'ja':
        return `${countryCode ? '+81 ' : ''}${parts.join('-')}`
      case 'ko':
        return `${countryCode ? '+82 ' : ''}${parts.join('-')}`
      case 'zh':
        return `${countryCode ? '+86 ' : ''}${parts.join(' ')}`
    }
    
    return match[0] // Return original match if no specific formatting
  }

  private static formatPhoneBasic(cleaned: string, locale: string): string {
    const langCode = locale.split('-')[0]
    
    switch (langCode) {
      case 'en':
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
          return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
        }
        break
      case 'fr':
        if (cleaned.length === 10) {
          return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
        }
        break
      case 'de':
        if (cleaned.length >= 10) {
          return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
        }
        break
      case 'es':
        if (cleaned.length === 9) {
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
        }
        break
      case 'it':
        if (cleaned.length >= 9) {
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
        }
        break
      case 'pt':
        if (cleaned.length === 9) {
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
        }
        break
      case 'nl':
        if (cleaned.length === 10) {
          return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`
        }
        break
      case 'ja':
        if (cleaned.length >= 10) {
          return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
        }
        break
      case 'ko':
        if (cleaned.length >= 10) {
          return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
        }
        break
      case 'zh':
        if (cleaned.length === 11) {
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
        }
        break
      case 'ar':
      case 'fa':
      case 'he':
      case 'ur':
        // RTL languages - basic formatting
        if (cleaned.length >= 9) {
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
        }
        break
    }
    
    // Default formatting for unknown patterns
    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    
    return cleaned
  }

  /**
   * Format address according to locale conventions with comprehensive regional support
   */
  static formatAddress(address: Address, locale: string): string {
    const parts: string[] = []
    const langCode = locale.split('-')[0]
    
    // Different address formats based on locale
    switch (langCode) {
      case 'en':
        if (locale === 'en-US') {
          // US format: Street, City, State ZIP, Country
          if (address.street) parts.push(address.street)
          if (address.city) {
            let cityLine = address.city
            if (address.state) cityLine += `, ${address.state}`
            if (address.postalCode) cityLine += ` ${address.postalCode}`
            parts.push(cityLine)
          }
          if (address.country && address.country !== 'United States') parts.push(address.country)
        } else if (locale === 'en-GB') {
          // UK format: Street, City, PostalCode, Country
          if (address.street) parts.push(address.street)
          if (address.city) parts.push(address.city)
          if (address.postalCode) parts.push(address.postalCode)
          if (address.country && address.country !== 'United Kingdom') parts.push(address.country)
        } else {
          // Other English-speaking countries
          if (address.street) parts.push(address.street)
          if (address.city) parts.push(address.city)
          if (address.state) parts.push(address.state)
          if (address.postalCode) parts.push(address.postalCode)
          if (address.country) parts.push(address.country)
        }
        break
        
      case 'fr':
        // French format: Street, PostalCode City, Country
        if (address.street) parts.push(address.street)
        if (address.postalCode && address.city) {
          parts.push(`${address.postalCode} ${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.country && address.country !== 'France') parts.push(address.country)
        break
        
      case 'de':
        // German format: Street, PostalCode City, Country
        if (address.street) parts.push(address.street)
        if (address.postalCode && address.city) {
          parts.push(`${address.postalCode} ${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.country && address.country !== 'Germany') parts.push(address.country)
        break
        
      case 'es':
        // Spanish format: Street, PostalCode City (State), Country
        if (address.street) parts.push(address.street)
        if (address.postalCode && address.city) {
          let cityLine = `${address.postalCode} ${address.city}`
          if (address.state) cityLine += ` (${address.state})`
          parts.push(cityLine)
        } else if (address.city) {
          let cityLine = address.city
          if (address.state) cityLine += ` (${address.state})`
          parts.push(cityLine)
        }
        if (address.country && address.country !== 'Spain') parts.push(address.country)
        break
        
      case 'it':
        // Italian format: Street, PostalCode City (State), Country
        if (address.street) parts.push(address.street)
        if (address.postalCode && address.city) {
          let cityLine = `${address.postalCode} ${address.city}`
          if (address.state) cityLine += ` (${address.state})`
          parts.push(cityLine)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.country && address.country !== 'Italy') parts.push(address.country)
        break
        
      case 'pt':
        // Portuguese format: Street, PostalCode City, Country
        if (address.street) parts.push(address.street)
        if (address.postalCode && address.city) {
          parts.push(`${address.postalCode} ${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.country && !['Portugal', 'Brazil'].includes(address.country || '')) {
          parts.push(address.country)
        }
        break
        
      case 'nl':
        // Dutch format: Street, PostalCode City, Country
        if (address.street) parts.push(address.street)
        if (address.postalCode && address.city) {
          parts.push(`${address.postalCode} ${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.country && address.country !== 'Netherlands') parts.push(address.country)
        break
        
      case 'ja':
        // Japanese format: PostalCode, State City Street, Country
        if (address.postalCode) parts.push(`〒${address.postalCode}`)
        if (address.state && address.city) {
          parts.push(`${address.state}${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.street) parts.push(address.street)
        if (address.country && address.country !== 'Japan') parts.push(address.country)
        break
        
      case 'ko':
        // Korean format: State City Street, PostalCode, Country
        if (address.state && address.city) {
          parts.push(`${address.state} ${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.street) parts.push(address.street)
        if (address.postalCode) parts.push(address.postalCode)
        if (address.country && address.country !== 'South Korea') parts.push(address.country)
        break
        
      case 'zh':
        // Chinese format: State City Street, PostalCode, Country
        if (address.state && address.city) {
          parts.push(`${address.state}${address.city}`)
        } else if (address.city) {
          parts.push(address.city)
        }
        if (address.street) parts.push(address.street)
        if (address.postalCode) parts.push(address.postalCode)
        if (address.country && address.country !== 'China') parts.push(address.country)
        break
        
      case 'ar':
      case 'fa':
      case 'he':
      case 'ur':
        // RTL languages - right-to-left format
        if (address.street) parts.push(address.street)
        if (address.city) parts.push(address.city)
        if (address.state) parts.push(address.state)
        if (address.postalCode) parts.push(address.postalCode)
        if (address.country) parts.push(address.country)
        break
        
      case 'ru':
        // Russian format: Street, City, State, PostalCode, Country
        if (address.street) parts.push(address.street)
        if (address.city) parts.push(address.city)
        if (address.state) parts.push(address.state)
        if (address.postalCode) parts.push(address.postalCode)
        if (address.country && address.country !== 'Russia') parts.push(address.country)
        break
        
      default:
        // Default format for other languages
        if (address.street) parts.push(address.street)
        if (address.city) parts.push(address.city)
        if (address.state) parts.push(address.state)
        if (address.postalCode) parts.push(address.postalCode)
        if (address.country) parts.push(address.country)
    }
    
    return parts.join('\n')
  }

  /**
   * Get relative time formatting
   */
  static formatRelativeTime(
    date: Date, 
    locale: string, 
    baseDate: Date = new Date()
  ): string {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
      const diffInSeconds = (date.getTime() - baseDate.getTime()) / 1000
      
      const units: Array<[string, number]> = [
        ['year', 365 * 24 * 60 * 60],
        ['month', 30 * 24 * 60 * 60],
        ['week', 7 * 24 * 60 * 60],
        ['day', 24 * 60 * 60],
        ['hour', 60 * 60],
        ['minute', 60],
        ['second', 1]
      ]
      
      for (const [unit, secondsInUnit] of units) {
        const value = Math.round(diffInSeconds / secondsInUnit)
        if (Math.abs(value) >= 1) {
          return rtf.format(value, unit as Intl.RelativeTimeFormatUnit)
        }
      }
      
      return rtf.format(0, 'second')
    } catch (error) {
      console.warn(`Relative time formatting failed for locale ${locale}:`, error)
      return date.toLocaleDateString('en')
    }
  }

  /**
   * Get list formatting for arrays
   */
  static formatList(
    items: string[], 
    locale: string, 
    options?: { style?: 'long' | 'short' | 'narrow'; type?: 'conjunction' | 'disjunction' | 'unit' }
  ): string {
    try {
      // Check if Intl.ListFormat is available
      if (typeof (Intl as any).ListFormat === 'function') {
        const formatter = new (Intl as any).ListFormat(locale, options)
        return formatter.format(items)
      } else {
        // Fallback for older browsers/environments
        return this.formatListFallback(items, locale, options?.type || 'conjunction')
      }
    } catch (error) {
      console.warn(`List formatting failed for locale ${locale}:`, error)
      return this.formatListFallback(items, locale, options?.type || 'conjunction')
    }
  }

  /**
   * Fallback list formatting for environments without Intl.ListFormat
   */
  private static formatListFallback(
    items: string[], 
    locale: string, 
    type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction'
  ): string {
    if (items.length === 0) return ''
    if (items.length === 1) return items[0]
    if (items.length === 2) {
      const connector = this.getListConnector(locale, type)
      return `${items[0]} ${connector} ${items[1]}`
    }
    
    const connector = this.getListConnector(locale, type)
    const allButLast = items.slice(0, -1).join(', ')
    return `${allButLast}, ${connector} ${items[items.length - 1]}`
  }

  /**
   * Get appropriate list connector for locale and type
   */
  private static getListConnector(locale: string, type: 'conjunction' | 'disjunction' | 'unit'): string {
    const langCode = locale.split('-')[0]
    
    if (type === 'disjunction') {
      switch (langCode) {
        case 'fr': return 'ou'
        case 'es': return 'o'
        case 'de': return 'oder'
        case 'it': return 'o'
        case 'pt': return 'ou'
        case 'ru': return 'или'
        case 'ja': return 'または'
        case 'ko': return '또는'
        case 'zh': return '或'
        case 'ar': return 'أو'
        case 'he': return 'או'
        case 'hi': return 'या'
        default: return 'or'
      }
    } else {
      // conjunction or unit
      switch (langCode) {
        case 'fr': return 'et'
        case 'es': return 'y'
        case 'de': return 'und'
        case 'it': return 'e'
        case 'pt': return 'e'
        case 'ru': return 'и'
        case 'ja': return 'と'
        case 'ko': return '그리고'
        case 'zh': return '和'
        case 'ar': return 'و'
        case 'he': return 'ו'
        case 'hi': return 'और'
        default: return 'and'
      }
    }
  }

  /**
   * Check if locale uses 24-hour time format
   */
  static uses24HourTime(locale: string): boolean {
    // Most locales use 24-hour format except US and a few others
    const uses12Hour = ['en-US', 'en-CA', 'en-AU', 'en-NZ', 'en-PH']
    return !uses12Hour.includes(locale) && !locale.startsWith('en-US')
  }

  /**
   * Get first day of week for locale (0 = Sunday, 1 = Monday)
   */
  static getFirstDayOfWeek(locale: string): number {
    // Most countries use Monday (1) as first day, US uses Sunday (0)
    const sundayFirst = ['en-US', 'en-CA', 'ja-JP', 'ko-KR', 'he-IL', 'ar-SA']
    return sundayFirst.includes(locale) || locale.startsWith('en-US') ? 0 : 1
  }

  /**
   * Format percentage according to locale
   */
  static formatPercentage(
    value: number, 
    locale: string, 
    options?: Intl.NumberFormatOptions
  ): string {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
      })
      return formatter.format(value)
    } catch (error) {
      console.warn(`Percentage formatting failed for locale ${locale}:`, error)
      return new Intl.NumberFormat('en', {
        style: 'percent',
        ...options
      }).format(value)
    }
  }

  /**
   * Format decimal numbers with locale-specific separators
   */
  static formatDecimal(
    value: number, 
    locale: string, 
    options?: Intl.NumberFormatOptions
  ): string {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
      })
      return formatter.format(value)
    } catch (error) {
      console.warn(`Decimal formatting failed for locale ${locale}:`, error)
      return new Intl.NumberFormat('en', {
        style: 'decimal',
        ...options
      }).format(value)
    }
  }

  /**
   * Format compact numbers (1K, 1M, etc.) according to locale
   */
  static formatCompactNumber(
    value: number, 
    locale: string, 
    notation: 'compact' | 'scientific' | 'engineering' = 'compact'
  ): string {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        notation,
        compactDisplay: 'short'
      })
      return formatter.format(value)
    } catch (error) {
      console.warn(`Compact number formatting failed for locale ${locale}:`, error)
      // Fallback for older browsers
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      return value.toString()
    }
  }

  /**
   * Get locale-specific decimal and thousands separators
   */
  static getNumberSeparators(locale: string): { decimal: string; thousands: string } {
    try {
      const formatter = new Intl.NumberFormat(locale)
      const parts = formatter.formatToParts(1234.5)
      
      const decimal = parts.find(part => part.type === 'decimal')?.value || '.'
      const thousands = parts.find(part => part.type === 'group')?.value || ','
      
      return { decimal, thousands }
    } catch (error) {
      console.warn(`Number separators detection failed for locale ${locale}:`, error)
      return { decimal: '.', thousands: ',' }
    }
  }

  /**
   * Format measurement units according to locale (metric vs imperial)
   */
  static formatMeasurement(
    value: number, 
    unit: 'length' | 'weight' | 'temperature' | 'volume',
    locale: string
  ): string {
    const usesImperial = ['en-US', 'en-LR', 'en-MM'].includes(locale)
    
    try {
      let unitCode: string
      let convertedValue = value
      
      switch (unit) {
        case 'length':
          unitCode = usesImperial ? 'foot' : 'meter'
          if (usesImperial && unit === 'length') {
            convertedValue = value * 3.28084 // meters to feet
          }
          break
        case 'weight':
          unitCode = usesImperial ? 'pound' : 'kilogram'
          if (usesImperial && unit === 'weight') {
            convertedValue = value * 2.20462 // kg to pounds
          }
          break
        case 'temperature':
          unitCode = usesImperial ? 'fahrenheit' : 'celsius'
          if (usesImperial && unit === 'temperature') {
            convertedValue = (value * 9/5) + 32 // celsius to fahrenheit
          }
          break
        case 'volume':
          unitCode = usesImperial ? 'gallon' : 'liter'
          if (usesImperial && unit === 'volume') {
            convertedValue = value * 0.264172 // liters to gallons
          }
          break
        default:
          return value.toString()
      }

      const formatter = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: unitCode,
        unitDisplay: 'short'
      })
      
      return formatter.format(convertedValue)
    } catch (error) {
      console.warn(`Measurement formatting failed for locale ${locale}:`, error)
      return `${value} ${unit}`
    }
  }

  /**
   * Get regional currency preferences based on locale
   */
  static getRegionalCurrencies(locale: string): string[] {
    const language = getLanguageByCode(locale.split('-')[0])
    if (language?.currencyFormats.supported) {
      return language.currencyFormats.supported
    }

    // Fallback regional currencies
    const region = locale.split('-')[1]
    const regionCurrencies: Record<string, string[]> = {
      'US': ['USD', 'CAD', 'MXN'],
      'GB': ['GBP', 'EUR', 'USD'],
      'EU': ['EUR', 'USD', 'GBP'],
      'JP': ['JPY', 'USD', 'EUR'],
      'CN': ['CNY', 'USD', 'EUR'],
      'IN': ['INR', 'USD', 'EUR'],
      'BR': ['BRL', 'USD', 'EUR'],
      'RU': ['RUB', 'USD', 'EUR'],
      'KR': ['KRW', 'USD', 'EUR'],
      'AU': ['AUD', 'USD', 'EUR'],
      'CA': ['CAD', 'USD', 'EUR'],
      'MX': ['MXN', 'USD', 'EUR'],
      'SA': ['SAR', 'USD', 'EUR'],
      'AE': ['AED', 'USD', 'EUR'],
      'ZA': ['ZAR', 'USD', 'EUR'],
      'NG': ['NGN', 'USD', 'EUR'],
      'KE': ['KES', 'USD', 'EUR'],
      'EG': ['EGP', 'USD', 'EUR'],
      'TR': ['TRY', 'USD', 'EUR'],
      'IL': ['ILS', 'USD', 'EUR'],
      'PK': ['PKR', 'USD', 'EUR'],
      'BD': ['BDT', 'USD', 'EUR'],
      'VN': ['VND', 'USD', 'EUR'],
      'TH': ['THB', 'USD', 'EUR'],
      'ID': ['IDR', 'USD', 'EUR'],
      'MY': ['MYR', 'USD', 'EUR'],
      'PH': ['PHP', 'USD', 'EUR'],
      'SG': ['SGD', 'USD', 'EUR']
    }

    return regionCurrencies[region] || ['USD', 'EUR']
  }

  /**
   * Format time duration according to locale
   */
  static formatDuration(
    seconds: number, 
    locale: string, 
    style: 'long' | 'short' | 'narrow' = 'long'
  ): string {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { 
        numeric: 'always',
        style 
      })
      
      if (seconds < 60) {
        return rtf.format(Math.round(seconds), 'second')
      } else if (seconds < 3600) {
        return rtf.format(Math.round(seconds / 60), 'minute')
      } else if (seconds < 86400) {
        return rtf.format(Math.round(seconds / 3600), 'hour')
      } else if (seconds < 2592000) {
        return rtf.format(Math.round(seconds / 86400), 'day')
      } else if (seconds < 31536000) {
        return rtf.format(Math.round(seconds / 2592000), 'month')
      } else {
        return rtf.format(Math.round(seconds / 31536000), 'year')
      }
    } catch (error) {
      console.warn(`Duration formatting failed for locale ${locale}:`, error)
      // Simple fallback
      if (seconds < 60) return `${Math.round(seconds)}s`
      if (seconds < 3600) return `${Math.round(seconds / 60)}m`
      if (seconds < 86400) return `${Math.round(seconds / 3600)}h`
      return `${Math.round(seconds / 86400)}d`
    }
  }

  /**
   * Check if locale uses metric system
   */
  static usesMetricSystem(locale: string): boolean {
    const imperialLocales = ['en-US', 'en-LR', 'en-MM']
    return !imperialLocales.includes(locale)
  }

  /**
   * Get locale-specific date/time patterns
   */
  static getDateTimePatterns(locale: string): {
    datePattern: string
    timePattern: string
    dateTimePattern: string
  } {
    try {
      const dateFormatter = new Intl.DateTimeFormat(locale)
      const timeFormatter = new Intl.DateTimeFormat(locale, { 
        hour: 'numeric', 
        minute: 'numeric' 
      })
      const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })

      return {
        datePattern: dateFormatter.format(new Date()).replace(/\d+/g, 'X'),
        timePattern: timeFormatter.format(new Date()).replace(/\d+/g, 'X'),
        dateTimePattern: dateTimeFormatter.format(new Date()).replace(/\d+/g, 'X')
      }
    } catch (error) {
      console.warn(`Date/time pattern detection failed for locale ${locale}:`, error)
      return {
        datePattern: 'X/X/X',
        timePattern: 'X:X',
        dateTimePattern: 'X/X/X X:X'
      }
    }
  }
}