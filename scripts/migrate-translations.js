#!/usr/bin/env node

/**
 * Translation Migration Script
 * 
 * This script migrates the existing bilingual system (English/French) to the new
 * enhanced translation system with proper namespacing and structure.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const BACKUP_DIR = path.join(process.cwd(), 'public', 'locales-backup');
const SUPPORTED_LANGUAGES = ['en', 'fr'];

// Translation namespaces mapping
const NAMESPACE_MAPPING = {
  'nav': 'navigation',
  'common': 'common',
  'home': 'pages',
  'about': 'pages',
  'contact': 'pages',
  'donate': 'pages',
  'projects': 'pages',
  'blog': 'pages',
  'information': 'pages',
  'footer': 'common',
  'project': 'pages',
  'slogan': 'common'
};

// Additional namespaces to create
const ADDITIONAL_NAMESPACES = {
  'forms': {},
  'actions': {},
  'misc': {},
  'manifest': {}
};

/**
 * Create backup of existing translation files
 */
function createBackup() {
  console.log('Creating backup of existing translations...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Copy existing files to backup
  const files = fs.readdirSync(LOCALES_DIR);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const sourcePath = path.join(LOCALES_DIR, file);
      const backupPath = path.join(BACKUP_DIR, file);
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`Backed up: ${file}`);
    }
  });

  // Also backup structured files if they exist
  SUPPORTED_LANGUAGES.forEach(lang => {
    const langDir = path.join(LOCALES_DIR, lang);
    if (fs.existsSync(langDir)) {
      const backupLangDir = path.join(BACKUP_DIR, lang);
      if (!fs.existsSync(backupLangDir)) {
        fs.mkdirSync(backupLangDir, { recursive: true });
      }
      
      const langFiles = fs.readdirSync(langDir);
      langFiles.forEach(file => {
        if (file.endsWith('.json')) {
          const sourcePath = path.join(langDir, file);
          const backupPath = path.join(backupLangDir, file);
          fs.copyFileSync(sourcePath, backupPath);
          console.log(`Backed up: ${lang}/${file}`);
        }
      });
    }
  });
}

/**
 * Load existing translation file
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
 * Save translation file with proper formatting
 */
function saveTranslationFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Saved: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
  }
}

/**
 * Migrate translations for a specific language
 */
function migrateLanguage(language) {
  console.log(`\nMigrating ${language} translations...`);
  
  // Load existing monolithic translation file
  const monolithicPath = path.join(LOCALES_DIR, `${language}.json`);
  const existingTranslations = loadTranslationFile(monolithicPath);
  
  // Load existing structured files
  const structuredDir = path.join(LOCALES_DIR, language);
  const existingStructured = {};
  
  if (fs.existsSync(structuredDir)) {
    const files = fs.readdirSync(structuredDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const namespace = file.replace('.json', '');
        const filePath = path.join(structuredDir, file);
        existingStructured[namespace] = loadTranslationFile(filePath);
      }
    });
  }

  // Create namespace-based structure
  const namespacedTranslations = {
    common: {},
    navigation: {},
    pages: {},
    forms: {},
    actions: {},
    misc: {},
    manifest: {}
  };

  // Migrate from monolithic structure
  Object.keys(existingTranslations).forEach(topLevelKey => {
    const namespace = NAMESPACE_MAPPING[topLevelKey] || 'misc';
    namespacedTranslations[namespace][topLevelKey] = existingTranslations[topLevelKey];
  });

  // Merge with existing structured translations
  Object.keys(existingStructured).forEach(namespace => {
    if (namespacedTranslations[namespace]) {
      namespacedTranslations[namespace] = {
        ...namespacedTranslations[namespace],
        ...existingStructured[namespace]
      };
    } else {
      namespacedTranslations[namespace] = existingStructured[namespace];
    }
  });

  // Add missing common translations if not present
  if (!namespacedTranslations.common.accessibility) {
    namespacedTranslations.common.accessibility = {
      languageChanged: language === 'en' ? 'Language changed to {{language}}' : 'Langue changée vers {{language}}',
      languageSelector: language === 'en' ? 'Select language' : 'Sélectionner la langue',
      currentLanguage: language === 'en' ? 'Current language: {{language}}' : 'Langue actuelle : {{language}}',
      availableLanguages: language === 'en' ? 'Available languages' : 'Langues disponibles',
      searchLanguages: language === 'en' ? 'Search languages' : 'Rechercher des langues',
      languageOptions: language === 'en' ? 'Use arrow keys to navigate, Enter to select, Escape to close' : 'Utilisez les flèches pour naviguer, Entrée pour sélectionner, Échap pour fermer',
      skipToContent: language === 'en' ? 'Skip to main content' : 'Aller au contenu principal',
      skipToNavigation: language === 'en' ? 'Skip to navigation' : 'Aller à la navigation',
      mainContent: language === 'en' ? 'Main content' : 'Contenu principal',
      navigation: language === 'en' ? 'Navigation' : 'Navigation',
      languageMenu: language === 'en' ? 'Language menu' : 'Menu des langues',
      closeLanguageMenu: language === 'en' ? 'Close language menu' : 'Fermer le menu des langues',
      openLanguageMenu: language === 'en' ? 'Open language menu' : 'Ouvrir le menu des langues'
    };
  }

  // Save each namespace as a separate file
  Object.keys(namespacedTranslations).forEach(namespace => {
    if (Object.keys(namespacedTranslations[namespace]).length > 0) {
      const namespacePath = path.join(LOCALES_DIR, language, `${namespace}.json`);
      saveTranslationFile(namespacePath, namespacedTranslations[namespace]);
    }
  });

  // Create manifest file for the language
  const manifestData = {
    language: language,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    namespaces: Object.keys(namespacedTranslations).filter(ns => 
      Object.keys(namespacedTranslations[ns]).length > 0
    ),
    totalKeys: Object.values(namespacedTranslations).reduce((total, ns) => 
      total + countKeys(ns), 0
    )
  };

  const manifestPath = path.join(LOCALES_DIR, language, 'manifest.json');
  saveTranslationFile(manifestPath, manifestData);
}

/**
 * Count total translation keys recursively
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
 * Update components to use new translation system
 */
function updateComponents() {
  console.log('\nUpdating components to use new translation system...');
  
  // This would typically involve updating import statements and translation calls
  // For now, we'll create a compatibility layer
  const compatibilityLayer = `
/**
 * Translation Compatibility Layer
 * 
 * This module provides backward compatibility for components that haven't been
 * updated to use the new namespaced translation system yet.
 */

import { useTranslation } from 'react-i18next';

export function useCompatibleTranslation() {
  const { t: tCommon } = useTranslation('common');
  const { t: tNav } = useTranslation('navigation');
  const { t: tPages } = useTranslation('pages');
  const { t: tForms } = useTranslation('forms');
  const { t: tActions } = useTranslation('actions');
  const { t: tMisc } = useTranslation('misc');

  // Legacy translation function that maps old keys to new namespaced structure
  const t = (key, options = {}) => {
    // Try to determine namespace from key structure
    if (key.startsWith('nav.')) {
      return tNav(key, options);
    } else if (key.startsWith('common.')) {
      return tCommon(key, options);
    } else if (['home.', 'about.', 'contact.', 'donate.', 'projects.', 'blog.', 'information.'].some(prefix => key.startsWith(prefix))) {
      return tPages(key, options);
    } else if (key.startsWith('footer.')) {
      return tCommon(key, options);
    } else {
      // Try each namespace until we find the key
      for (const tFunc of [tPages, tCommon, tNav, tForms, tActions, tMisc]) {
        try {
          const result = tFunc(key, options);
          if (result !== key) return result;
        } catch (e) {
          // Continue to next namespace
        }
      }
      
      // Fallback to misc namespace
      return tMisc(key, options);
    }
  };

  return { t };
}
`;

  const compatibilityPath = path.join(process.cwd(), 'lib', 'i18n', 'compatibility.ts');
  fs.writeFileSync(compatibilityPath, compatibilityLayer.trim());
  console.log('Created compatibility layer at lib/i18n/compatibility.ts');
}

/**
 * Generate migration report
 */
function generateReport() {
  console.log('\n=== Migration Report ===');
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    console.log(`\n${lang.toUpperCase()} Language:`);
    
    const langDir = path.join(LOCALES_DIR, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
      console.log(`  Namespaces: ${files.length}`);
      
      let totalKeys = 0;
      files.forEach(file => {
        if (file !== 'manifest.json') {
          const filePath = path.join(langDir, file);
          const data = loadTranslationFile(filePath);
          const keyCount = countKeys(data);
          totalKeys += keyCount;
          console.log(`    ${file.replace('.json', '')}: ${keyCount} keys`);
        }
      });
      
      console.log(`  Total keys: ${totalKeys}`);
    }
  });
  
  console.log('\n=== Migration Complete ===');
  console.log('✅ Backup created in public/locales-backup/');
  console.log('✅ Translations restructured with namespaces');
  console.log('✅ Compatibility layer created');
  console.log('✅ Manifest files generated');
  console.log('\nNext steps:');
  console.log('1. Update components to use new translation hooks');
  console.log('2. Test all pages for missing translations');
  console.log('3. Remove old monolithic translation files when ready');
}

/**
 * Main migration function
 */
function main() {
  console.log('Starting translation migration...\n');
  
  try {
    // Step 1: Create backup
    createBackup();
    
    // Step 2: Migrate each supported language
    SUPPORTED_LANGUAGES.forEach(migrateLanguage);
    
    // Step 3: Update components
    updateComponents();
    
    // Step 4: Generate report
    generateReport();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  main();
}

module.exports = {
  main,
  migrateLanguage,
  createBackup
};