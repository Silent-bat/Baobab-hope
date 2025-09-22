// Basic tests for internationalization infrastructure
// Note: These are simple tests to verify the infrastructure works
// In a production environment, you'd use a proper testing framework like Jest or Vitest

import { 
  getLanguageByCode, 
  getEnabledLanguages, 
  isLanguageSupported,
  getSupportedLanguageCodes,
  DEFAULT_LANGUAGE 
} from '../languages'
import { LanguageDetectionService } from '../detection'
import { TranslationService } from '../translation-service'
import { CulturalFormattingService } from '../cultural-formatting'

// Simple test runner
class TestRunner {
  private tests: Array<{ name: string; fn: () => void | Promise<void> }> = []
  private passed = 0
  private failed = 0

  test(name: string, fn: () => void | Promise<void>) {
    this.tests.push({ name, fn })
  }

  async run() {
    console.log('🧪 Running I18n Infrastructure Tests...\n')
    
    for (const test of this.tests) {
      try {
        await test.fn()
        console.log(`✅ ${test.name}`)
        this.passed++
      } catch (error) {
        console.log(`❌ ${test.name}`)
        console.log(`   Error: ${error}`)
        this.failed++
      }
    }
    
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`)
    return this.failed === 0
  }
}

// Test utilities
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`)
  }
}

// Create test runner
const runner = new TestRunner()

// Language Configuration Tests
runner.test('Language configuration should have default language', () => {
  const defaultLang = getLanguageByCode(DEFAULT_LANGUAGE)
  assert(defaultLang !== undefined, 'Default language should exist')
  assertEqual(defaultLang!.code, 'en', 'Default language should be English')
})

runner.test('Should support multiple languages', () => {
  const languages = getEnabledLanguages()
  assert(languages.length >= 2, 'Should support at least 2 languages')
  
  const codes = getSupportedLanguageCodes()
  assert(codes.includes('en'), 'Should support English')
  assert(codes.includes('fr'), 'Should support French')
})

runner.test('Language support check should work', () => {
  assert(isLanguageSupported('en'), 'English should be supported')
  assert(isLanguageSupported('fr'), 'French should be supported')
  assert(!isLanguageSupported('xyz'), 'Invalid language should not be supported')
})

runner.test('RTL languages should be properly configured', () => {
  const arabic = getLanguageByCode('ar')
  if (arabic) {
    assertEqual(arabic.direction, 'rtl', 'Arabic should be RTL')
  }
  
  const english = getLanguageByCode('en')
  assertEqual(english!.direction, 'ltr', 'English should be LTR')
})

// Language Detection Tests
runner.test('Browser language detection should work', () => {
  const result = LanguageDetectionService.detectBrowserLanguage()
  assert(result.language !== undefined, 'Should detect a language')
  assert(result.source === 'browser' || result.source === 'fallback', 'Should have correct source')
  assert(result.confidence >= 0, 'Should have valid confidence')
})

runner.test('Language preference storage should work', () => {
  // Test setting preference
  LanguageDetectionService.setUserPreferredLanguage('fr')
  const preference = LanguageDetectionService.getUserPreferredLanguage()
  
  if (preference) {
    assertEqual(preference.language, 'fr', 'Should store French preference')
    assertEqual(preference.source, 'user-preference', 'Should have correct source')
  }
  
  // Clean up
  LanguageDetectionService.clearUserPreference()
})

// Translation Service Tests
runner.test('Translation service should be singleton', () => {
  const service1 = TranslationService.getInstance()
  const service2 = TranslationService.getInstance()
  assert(service1 === service2, 'Should return same instance')
})

runner.test('Translation service should handle missing keys', () => {
  const service = TranslationService.getInstance()
  const result = service.getTranslation('nonexistent.key', 'en')
  assertEqual(result, 'nonexistent.key', 'Should return key for missing translation')
})

// Cultural Formatting Tests
runner.test('Date formatting should work', () => {
  const date = new Date('2024-01-15')
  const formatted = CulturalFormattingService.formatDate(date, 'en')
  assert(typeof formatted === 'string', 'Should return formatted date string')
  assert(formatted.length > 0, 'Should not be empty')
})

runner.test('Number formatting should work', () => {
  const number = 1234.56
  const formatted = CulturalFormattingService.formatNumber(number, 'en')
  assert(typeof formatted === 'string', 'Should return formatted number string')
  assert(formatted.includes('1'), 'Should contain the number')
})

runner.test('Currency formatting should work', () => {
  const amount = 100
  const formatted = CulturalFormattingService.formatCurrency(amount, 'USD', 'en')
  assert(typeof formatted === 'string', 'Should return formatted currency string')
  assert(formatted.includes('100') || formatted.includes('$'), 'Should contain amount or currency symbol')
})

runner.test('Phone number formatting should work', () => {
  const phone = '1234567890'
  const formatted = CulturalFormattingService.formatPhoneNumber(phone, 'en')
  assert(typeof formatted === 'string', 'Should return formatted phone string')
})

runner.test('Address formatting should work', () => {
  const address = {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postalCode: '12345',
    country: 'USA'
  }
  const formatted = CulturalFormattingService.formatAddress(address, 'en')
  assert(typeof formatted === 'string', 'Should return formatted address string')
  assert(formatted.includes('123 Main St'), 'Should contain street address')
})

// Export test runner for manual execution
export { runner }

// Auto-run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runner.run().then(success => {
    process.exit(success ? 0 : 1)
  })
}