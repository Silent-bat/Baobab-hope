#!/usr/bin/env node

/**
 * Test Translation Loading
 * 
 * This script tests if translations are loading correctly for different languages
 */

const { TranslationLoader } = require('../lib/i18n/translation-loader')

async function testTranslations() {
  console.log('🧪 Testing translation loading...\n')
  
  const languages = ['en', 'fr', 'es', 'de']
  
  for (const lang of languages) {
    try {
      console.log(`📖 Loading ${lang} translations...`)
      const translations = await TranslationLoader.loadTranslationFile(lang)
      
      // Test some key translations
      const testKeys = [
        'nav.home',
        'nav.about.title', 
        'home.hero.title',
        'footer.mission'
      ]
      
      console.log(`✅ ${lang} translations loaded successfully`)
      console.log(`   Total chunks: ${Object.keys(translations).length}`)
      
      // Test specific keys
      for (const key of testKeys) {
        const value = getNestedValue(translations, key)
        if (value) {
          console.log(`   ✓ ${key}: "${value}"`)
        } else {
          console.log(`   ❌ Missing: ${key}`)
        }
      }
      
      console.log('')
    } catch (error) {
      console.error(`❌ Failed to load ${lang} translations:`, error.message)
      console.log('')
    }
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

// Run the test
testTranslations().catch(console.error)