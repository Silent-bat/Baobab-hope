// Language configuration registry with support for 50+ languages

import { Language } from './types'

export const SUPPORTED_LANGUAGES: Language[] = [
  // UN Official Languages (Priority 1)
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    region: 'Global',
    flag: '🇺🇸',
    enabled: true,
    priority: 1,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'USD',
      supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    region: 'Europe/Africa',
    flag: '🇫🇷',
    enabled: true,
    priority: 2,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 0,1' },
      { rule: 'other', condition: 'n > 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'XOF', 'XAF', 'CHF']
    }
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    region: 'Americas/Europe',
    flag: '🇪🇸',
    enabled: true,
    priority: 3,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'MXN', 'ARS', 'COP']
    }
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    region: 'Middle East/North Africa',
    flag: '🇸🇦',
    enabled: true,
    priority: 4,
    fallback: 'en',
    pluralRules: [
      { rule: 'zero', condition: 'n = 0' },
      { rule: 'one', condition: 'n = 1' },
      { rule: 'two', condition: 'n = 2' },
      { rule: 'few', condition: 'n % 100 = 3..10' },
      { rule: 'many', condition: 'n % 100 = 11..99' },
      { rule: 'other', condition: 'n != 0,1,2 and n % 100 != 3..10 and n % 100 != 11..99' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'SAR',
      supported: ['SAR', 'AED', 'EGP', 'USD', 'EUR']
    }
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    direction: 'ltr',
    region: 'East Asia',
    flag: '🇨🇳',
    enabled: true,
    priority: 5,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'CNY',
      supported: ['CNY', 'USD', 'EUR', 'HKD']
    }
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    region: 'Eastern Europe/Asia',
    flag: '🇷🇺',
    enabled: true,
    priority: 6,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11' },
      { rule: 'few', condition: 'n % 10 = 2..4 and n % 100 != 12..14' },
      { rule: 'many', condition: 'n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14' },
      { rule: 'other', condition: 'n != 1,2,3,4' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'RUB',
      supported: ['RUB', 'USD', 'EUR']
    }
  },
  // Major World Languages (Priority 2)
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    region: 'Americas/Europe/Africa',
    flag: '🇵🇹',
    enabled: true,
    priority: 7,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'BRL', 'USD', 'AOA', 'MZN']
    }
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇩🇪',
    enabled: true,
    priority: 8,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'CHF']
    }
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    region: 'East Asia',
    flag: '🇯🇵',
    enabled: true,
    priority: 9,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'JPY',
      supported: ['JPY', 'USD', 'EUR']
    }
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    region: 'South Asia',
    flag: '🇮🇳',
    enabled: true,
    priority: 10,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 0,1' },
      { rule: 'other', condition: 'n > 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'INR',
      supported: ['INR', 'USD', 'EUR']
    }
  },
  // Major European Languages
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇮🇹',
    enabled: true,
    priority: 11,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'CHF']
    }
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇳🇱',
    enabled: true,
    priority: 12,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    region: 'East Asia',
    flag: '🇰🇷',
    enabled: true,
    priority: 13,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'KRW',
      supported: ['KRW', 'USD', 'EUR']
    }
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: 'ltr',
    region: 'Europe/Asia',
    flag: '🇹🇷',
    enabled: true,
    priority: 14,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'TRY',
      supported: ['TRY', 'USD', 'EUR']
    }
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇵🇱',
    enabled: true,
    priority: 15,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'few', condition: 'n % 10 = 2..4 and n % 100 != 12..14' },
      { rule: 'many', condition: 'n % 10 = 0,1 or n % 10 = 5..9 or n % 100 = 12..14' },
      { rule: 'other', condition: 'n != 1,2,3,4' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'PLN',
      supported: ['PLN', 'EUR', 'USD']
    }
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇺🇦',
    enabled: false,
    priority: 16,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11' },
      { rule: 'few', condition: 'n % 10 = 2..4 and n % 100 != 12..14' },
      { rule: 'many', condition: 'n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14' },
      { rule: 'other', condition: 'n != 1,2,3,4' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'UAH',
      supported: ['UAH', 'USD', 'EUR']
    }
  },
  // Southeast Asian Languages
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    direction: 'ltr',
    region: 'Southeast Asia',
    flag: '🇻🇳',
    enabled: true,
    priority: 17,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'VND',
      supported: ['VND', 'USD', 'EUR']
    }
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    direction: 'ltr',
    region: 'Southeast Asia',
    flag: '🇹🇭',
    enabled: true,
    priority: 18,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'THB',
      supported: ['THB', 'USD', 'EUR']
    }
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    direction: 'ltr',
    region: 'Southeast Asia',
    flag: '🇮🇩',
    enabled: true,
    priority: 19,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'IDR',
      supported: ['IDR', 'USD', 'EUR']
    }
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    direction: 'ltr',
    region: 'Southeast Asia',
    flag: '🇲🇾',
    enabled: true,
    priority: 20,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'MYR',
      supported: ['MYR', 'USD', 'EUR']
    }
  },
  // African Languages
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    direction: 'ltr',
    region: 'East Africa',
    flag: '🇰🇪',
    enabled: true,
    priority: 21,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'KES',
      supported: ['KES', 'TZS', 'UGX', 'USD', 'EUR']
    }
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    direction: 'ltr',
    region: 'East Africa',
    flag: '🇪🇹',
    enabled: true,
    priority: 22,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 0,1' },
      { rule: 'other', condition: 'n > 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'ETB',
      supported: ['ETB', 'USD', 'EUR']
    }
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    direction: 'ltr',
    region: 'West Africa',
    flag: '🇳🇬',
    enabled: true,
    priority: 23,
    fallback: 'en',
    pluralRules: [
      { rule: 'other', condition: 'n >= 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'NGN',
      supported: ['NGN', 'USD', 'EUR']
    }
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    direction: 'ltr',
    region: 'West Africa',
    flag: '🇳🇬',
    enabled: true,
    priority: 24,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'NGN',
      supported: ['NGN', 'USD', 'EUR']
    }
  },
  // South Asian Languages
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
    region: 'South Asia',
    flag: '🇧🇩',
    enabled: true,
    priority: 25,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 0,1' },
      { rule: 'other', condition: 'n > 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'BDT',
      supported: ['BDT', 'INR', 'USD', 'EUR']
    }
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    direction: 'rtl',
    region: 'South Asia',
    flag: '🇵🇰',
    enabled: true,
    priority: 26,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'PKR',
      supported: ['PKR', 'USD', 'EUR']
    }
  },
  // Middle Eastern Languages
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    direction: 'rtl',
    region: 'Middle East',
    flag: '🇮🇷',
    enabled: true,
    priority: 27,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 0,1' },
      { rule: 'other', condition: 'n > 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'IRR',
      supported: ['IRR', 'USD', 'EUR']
    }
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    region: 'Middle East',
    flag: '🇮🇱',
    enabled: true,
    priority: 28,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'two', condition: 'n = 2' },
      { rule: 'many', condition: 'n % 10 = 0 and n != 0' },
      { rule: 'other', condition: 'n != 1,2 and n % 10 != 0' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'ILS',
      supported: ['ILS', 'USD', 'EUR']
    }
  },
  // Additional European Languages
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇬🇷',
    enabled: true,
    priority: 29,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'cs',
    name: 'Czech',
    nativeName: 'Čeština',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇨🇿',
    enabled: true,
    priority: 30,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'few', condition: 'n = 2..4' },
      { rule: 'many', condition: 'n != 1,2,3,4' },
      { rule: 'other', condition: 'n != 1,2,3,4' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'CZK',
      supported: ['CZK', 'EUR', 'USD']
    }
  },
  {
    code: 'hu',
    name: 'Hungarian',
    nativeName: 'Magyar',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇭🇺',
    enabled: true,
    priority: 31,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'HUF',
      supported: ['HUF', 'EUR', 'USD']
    }
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇷🇴',
    enabled: true,
    priority: 32,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'few', condition: 'n = 0 or n % 100 = 1..19' },
      { rule: 'other', condition: 'n != 1 and n % 100 != 1..19' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'RON',
      supported: ['RON', 'EUR', 'USD']
    }
  },
  {
    code: 'bg',
    name: 'Bulgarian',
    nativeName: 'Български',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇧🇬',
    enabled: true,
    priority: 33,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'BGN',
      supported: ['BGN', 'EUR', 'USD']
    }
  },
  {
    code: 'hr',
    name: 'Croatian',
    nativeName: 'Hrvatski',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇭🇷',
    enabled: true,
    priority: 34,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11' },
      { rule: 'few', condition: 'n % 10 = 2..4 and n % 100 != 12..14' },
      { rule: 'other', condition: 'n % 10 = 0,5..9 or n % 100 = 11..14' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'sr',
    name: 'Serbian',
    nativeName: 'Српски',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇷🇸',
    enabled: true,
    priority: 35,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11' },
      { rule: 'few', condition: 'n % 10 = 2..4 and n % 100 != 12..14' },
      { rule: 'other', condition: 'n % 10 = 0,5..9 or n % 100 = 11..14' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'RSD',
      supported: ['RSD', 'EUR', 'USD']
    }
  },
  {
    code: 'sk',
    name: 'Slovak',
    nativeName: 'Slovenčina',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇸🇰',
    enabled: true,
    priority: 36,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'few', condition: 'n = 2..4' },
      { rule: 'other', condition: 'n != 1,2,3,4' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'sl',
    name: 'Slovenian',
    nativeName: 'Slovenščina',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇸🇮',
    enabled: true,
    priority: 37,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 100 = 1' },
      { rule: 'two', condition: 'n % 100 = 2' },
      { rule: 'few', condition: 'n % 100 = 3,4' },
      { rule: 'other', condition: 'n % 100 != 1,2,3,4' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  // Nordic Languages
  {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇫🇮',
    enabled: true,
    priority: 38,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇸🇪',
    enabled: true,
    priority: 39,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'SEK',
      supported: ['SEK', 'EUR', 'USD']
    }
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇳🇴',
    enabled: true,
    priority: 40,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'NOK',
      supported: ['NOK', 'EUR', 'USD']
    }
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇩🇰',
    enabled: true,
    priority: 41,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'DKK',
      supported: ['DKK', 'EUR', 'USD']
    }
  },
  {
    code: 'is',
    name: 'Icelandic',
    nativeName: 'Íslenska',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇮🇸',
    enabled: true,
    priority: 42,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11' },
      { rule: 'other', condition: 'n % 10 != 1 or n % 100 = 11' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'ISK',
      supported: ['ISK', 'EUR', 'USD']
    }
  },
  // Celtic and Regional Languages
  {
    code: 'ga',
    name: 'Irish',
    nativeName: 'Gaeilge',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇮🇪',
    enabled: true,
    priority: 43,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'two', condition: 'n = 2' },
      { rule: 'few', condition: 'n = 3..6' },
      { rule: 'many', condition: 'n = 7..10' },
      { rule: 'other', condition: 'n != 1,2,3,4,5,6,7,8,9,10' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD', 'GBP']
    }
  },
  {
    code: 'cy',
    name: 'Welsh',
    nativeName: 'Cymraeg',
    direction: 'ltr',
    region: 'Europe',
    flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    enabled: true,
    priority: 44,
    fallback: 'en',
    pluralRules: [
      { rule: 'zero', condition: 'n = 0' },
      { rule: 'one', condition: 'n = 1' },
      { rule: 'two', condition: 'n = 2' },
      { rule: 'few', condition: 'n = 3' },
      { rule: 'many', condition: 'n = 6' },
      { rule: 'other', condition: 'n != 0,1,2,3,6' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'GBP',
      supported: ['GBP', 'EUR', 'USD']
    }
  },
  {
    code: 'ca',
    name: 'Catalan',
    nativeName: 'Català',
    direction: 'ltr',
    region: 'Europe',
    flag: '🏴󠁥󠁳󠁣󠁴󠁿',
    enabled: false,
    priority: 45,
    fallback: 'es',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'eu',
    name: 'Basque',
    nativeName: 'Euskera',
    direction: 'ltr',
    region: 'Europe',
    flag: '🏴󠁥󠁳󠁰󠁶󠁿',
    enabled: false,
    priority: 46,
    fallback: 'es',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'gl',
    name: 'Galician',
    nativeName: 'Galego',
    direction: 'ltr',
    region: 'Europe',
    flag: '🏴󠁥󠁳󠁧󠁡󠁿',
    enabled: false,
    priority: 47,
    fallback: 'es',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  // Baltic Languages
  {
    code: 'et',
    name: 'Estonian',
    nativeName: 'Eesti',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇪🇪',
    enabled: false,
    priority: 48,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'lv',
    name: 'Latvian',
    nativeName: 'Latviešu',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇱🇻',
    enabled: false,
    priority: 49,
    fallback: 'en',
    pluralRules: [
      { rule: 'zero', condition: 'n % 10 = 0 or n % 100 = 11..19' },
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11' },
      { rule: 'other', condition: 'n % 10 != 0,1 or n % 100 = 11..19' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'lt',
    name: 'Lithuanian',
    nativeName: 'Lietuvių',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇱🇹',
    enabled: false,
    priority: 50,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n % 10 = 1 and n % 100 != 11..19' },
      { rule: 'few', condition: 'n % 10 = 2..9 and n % 100 != 11..19' },
      { rule: 'other', condition: 'n % 10 = 0 or n % 100 = 11..19' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  // Additional Languages to reach 50+
  {
    code: 'mt',
    name: 'Maltese',
    nativeName: 'Malti',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇲🇹',
    enabled: false,
    priority: 51,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'few', condition: 'n = 0 or n % 100 = 2..10' },
      { rule: 'many', condition: 'n % 100 = 11..19' },
      { rule: 'other', condition: 'n != 1 and n % 100 != 2..10 and n % 100 != 11..19' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'EUR',
      supported: ['EUR', 'USD']
    }
  },
  {
    code: 'sq',
    name: 'Albanian',
    nativeName: 'Shqip',
    direction: 'ltr',
    region: 'Europe',
    flag: '🇦🇱',
    enabled: false,
    priority: 52,
    fallback: 'en',
    pluralRules: [
      { rule: 'one', condition: 'n = 1' },
      { rule: 'other', condition: 'n != 1' }
    ],
    dateFormats: {
      short: { dateStyle: 'short' },
      medium: { dateStyle: 'medium' },
      long: { dateStyle: 'long' },
      full: { dateStyle: 'full' }
    },
    numberFormats: {
      decimal: { style: 'decimal' },
      currency: { style: 'currency' },
      percent: { style: 'percent' }
    },
    currencyFormats: {
      primary: 'ALL',
      supported: ['ALL', 'EUR', 'USD']
    }
  }
]

// Helper functions for language management
export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

export function getEnabledLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.enabled).sort((a, b) => a.priority - b.priority)
}

export function getRTLLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.direction === 'rtl')
}

export function getLanguagesByRegion(region: string): Language[] {
  return SUPPORTED_LANGUAGES.filter(lang => lang.region.includes(region))
}

export function getSupportedLanguageCodes(): string[] {
  return getEnabledLanguages().map(lang => lang.code)
}

export function isLanguageSupported(code: string): boolean {
  return getSupportedLanguageCodes().includes(code)
}

export function getLanguageFallback(code: string): string {
  const language = getLanguageByCode(code)
  return language?.fallback || 'en'
}

export const DEFAULT_LANGUAGE = 'en'
export const FALLBACK_LANGUAGE = 'en'

// Language priority and fallback logic
export function getLanguagePriority(code: string): number {
  const language = getLanguageByCode(code)
  return language?.priority || 999
}

export function buildFallbackChain(code: string): string[] {
  const chain: string[] = []
  const visited = new Set<string>()
  let current = code

  while (current && !visited.has(current)) {
    visited.add(current)
    chain.push(current)
    
    const language = getLanguageByCode(current)
    if (!language || language.fallback === current) {
      break
    }
    current = language.fallback
  }

  // Ensure fallback language is always at the end
  if (!chain.includes(FALLBACK_LANGUAGE)) {
    chain.push(FALLBACK_LANGUAGE)
  }

  return chain
}

export function getHighestPriorityLanguage(codes: string[]): string {
  const supportedCodes = codes.filter(code => isLanguageSupported(code))
  if (supportedCodes.length === 0) {
    return DEFAULT_LANGUAGE
  }

  return supportedCodes.reduce((highest, current) => {
    const currentPriority = getLanguagePriority(current)
    const highestPriority = getLanguagePriority(highest)
    return currentPriority < highestPriority ? current : highest
  })
}

export function getLanguagesByPriority(): Language[] {
  return getEnabledLanguages().sort((a, b) => a.priority - b.priority)
}

export function isRTLLanguage(code: string): boolean {
  const language = getLanguageByCode(code)
  return language?.direction === 'rtl' || false
}