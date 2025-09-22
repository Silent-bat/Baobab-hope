#!/usr/bin/env node

/**
 * Test Migration Script
 * 
 * This script tests the migrated translation system to ensure all translations
 * are accessible and the new namespaced structure works correctly.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const SUPPORTED_LANGUAGES = ['en', 'fr'];

/**
 * Load translation file
 */
function loadTranslationFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
  return {};
}

/**
 * Count translation keys recursively
 */
function countKeys(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countKeys(obj[key]);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Test namespace structure
 */
function testNamespaceStructure(language) {
  console.log(`\nTesting ${language.toUpperCase()} namespace structure...`);
  
  const langDir = path.join(LOCALES_DIR, language);
  if (!fs.existsSync(langDir)) {
    console.error(`❌ Language directory not found: ${langDir}`);
    return false;
  }

  const expectedNamespaces = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'];
  const actualFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  const actualNamespaces = actualFiles.map(f => f.replace('.json', ''));

  let allPassed = true;

  // Check if all expected namespaces exist
  expectedNamespaces.forEach(namespace => {
    if (actualNamespaces.includes(namespace)) {
      console.log(`✅ ${namespace}.json exists`);
    } else {
      console.log(`❌ ${namespace}.json missing`);
      allPassed = false;
    }
  });

  return allPassed;
}

/**
 * Test translation content
 */
function testTranslationContent(language) {
  console.log(`\nTesting ${language.toUpperCase()} translation content...`);
  
  const langDir = path.join(LOCALES_DIR, language);
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  
  let totalKeys = 0;
  let allPassed = true;

  files.forEach(file => {
    const filePath = path.join(langDir, file);
    const data = loadTranslationFile(filePath);
    const keyCount = countKeys(data);
    totalKeys += keyCount;
    
    if (keyCount > 0) {
      console.log(`✅ ${file}: ${keyCount} keys`);
    } else {
      console.log(`❌ ${file}: No keys found`);
      allPassed = false;
    }
  });

  console.log(`Total keys: ${totalKeys}`);
  return allPassed && totalKeys > 0;
}

/**
 * Test manifest file
 */
function testManifest(language) {
  console.log(`\nTesting ${language.toUpperCase()} manifest...`);
  
  const manifestPath = path.join(LOCALES_DIR, language, 'manifest.json');
  const manifest = loadTranslationFile(manifestPath);
  
  if (!manifest.language) {
    console.log('❌ Manifest missing language field');
    return false;
  }
  
  if (!manifest.version) {
    console.log('❌ Manifest missing version field');
    return false;
  }
  
  if (!manifest.namespaces || !Array.isArray(manifest.namespaces)) {
    console.log('❌ Manifest missing or invalid namespaces field');
    return false;
  }
  
  if (typeof manifest.totalKeys !== 'number') {
    console.log('❌ Manifest missing or invalid totalKeys field');
    return false;
  }
  
  console.log(`✅ Manifest valid: ${manifest.namespaces.length} namespaces, ${manifest.totalKeys} total keys`);
  return true;
}

/**
 * Test backward compatibility
 */
function testBackwardCompatibility(language) {
  console.log(`\nTesting ${language.toUpperCase()} backward compatibility...`);
  
  // Test that key translation keys still exist in the new structure
  const testKeys = [
    'nav.home',
    'common.loading',
    'home.hero.title',
    'about.title',
    'contact.form.name',
    'donate.title'
  ];

  let allPassed = true;

  // Load all namespaces
  const langDir = path.join(LOCALES_DIR, language);
  const allTranslations = {};
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  files.forEach(file => {
    const filePath = path.join(langDir, file);
    const data = loadTranslationFile(filePath);
    Object.assign(allTranslations, data);
  });

  // Test each key
  testKeys.forEach(key => {
    const value = getNestedValue(allTranslations, key);
    if (value) {
      console.log(`✅ ${key}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
    } else {
      console.log(`❌ ${key}: Not found`);
      allPassed = false;
    }
  });

  return allPassed;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, key) {
  return key.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : null;
  }, obj);
}

/**
 * Test language consistency
 */
function testLanguageConsistency() {
  console.log('\nTesting language consistency...');
  
  const languageStructures = {};
  
  // Load structure for each language
  SUPPORTED_LANGUAGES.forEach(language => {
    const langDir = path.join(LOCALES_DIR, language);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');
    
    languageStructures[language] = {};
    files.forEach(file => {
      const filePath = path.join(langDir, file);
      const data = loadTranslationFile(filePath);
      languageStructures[language][file] = getKeyStructure(data);
    });
  });

  // Compare structures
  const baseLanguage = SUPPORTED_LANGUAGES[0];
  let allConsistent = true;

  SUPPORTED_LANGUAGES.slice(1).forEach(language => {
    console.log(`\nComparing ${language} with ${baseLanguage}:`);
    
    Object.keys(languageStructures[baseLanguage]).forEach(namespace => {
      const baseKeys = languageStructures[baseLanguage][namespace];
      const langKeys = languageStructures[language][namespace] || new Set();
      
      const missingKeys = [...baseKeys].filter(key => !langKeys.has(key));
      const extraKeys = [...langKeys].filter(key => !baseKeys.has(key));
      
      if (missingKeys.length === 0 && extraKeys.length === 0) {
        console.log(`✅ ${namespace}: Consistent (${baseKeys.size} keys)`);
      } else {
        console.log(`❌ ${namespace}: Inconsistent`);
        if (missingKeys.length > 0) {
          console.log(`   Missing: ${missingKeys.slice(0, 3).join(', ')}${missingKeys.length > 3 ? '...' : ''}`);
        }
        if (extraKeys.length > 0) {
          console.log(`   Extra: ${extraKeys.slice(0, 3).join(', ')}${extraKeys.length > 3 ? '...' : ''}`);
        }
        allConsistent = false;
      }
    });
  });

  return allConsistent;
}

/**
 * Get all keys from translation object as a flat set
 */
function getKeyStructure(obj, prefix = '') {
  const keys = new Set();
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nestedKeys = getKeyStructure(obj[key], fullKey);
      nestedKeys.forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  
  return keys;
}

/**
 * Main test function
 */
function runTests() {
  console.log('🧪 Running Translation Migration Tests...\n');
  
  let allTestsPassed = true;
  const results = {};

  SUPPORTED_LANGUAGES.forEach(language => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing ${language.toUpperCase()} Language`);
    console.log(`${'='.repeat(50)}`);
    
    const structureTest = testNamespaceStructure(language);
    const contentTest = testTranslationContent(language);
    const manifestTest = testManifest(language);
    const compatibilityTest = testBackwardCompatibility(language);
    
    results[language] = {
      structure: structureTest,
      content: contentTest,
      manifest: manifestTest,
      compatibility: compatibilityTest,
      overall: structureTest && contentTest && manifestTest && compatibilityTest
    };
    
    if (!results[language].overall) {
      allTestsPassed = false;
    }
  });

  // Test cross-language consistency
  const consistencyTest = testLanguageConsistency();
  if (!consistencyTest) {
    allTestsPassed = false;
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  
  SUPPORTED_LANGUAGES.forEach(language => {
    const result = results[language];
    console.log(`\n${language.toUpperCase()}:`);
    console.log(`  Structure: ${result.structure ? '✅' : '❌'}`);
    console.log(`  Content: ${result.content ? '✅' : '❌'}`);
    console.log(`  Manifest: ${result.manifest ? '✅' : '❌'}`);
    console.log(`  Compatibility: ${result.compatibility ? '✅' : '❌'}`);
    console.log(`  Overall: ${result.overall ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  console.log(`\nConsistency: ${consistencyTest ? '✅' : '❌'}`);
  console.log(`\nFinal Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 Migration successful! The new translation system is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Update components to use new translation hooks');
    console.log('2. Test the application thoroughly');
    console.log('3. Remove old monolithic translation files when ready');
  } else {
    console.log('\n⚠️  Migration needs attention. Please fix the failing tests before proceeding.');
  }
  
  return allTestsPassed;
}

// Run tests if called directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };