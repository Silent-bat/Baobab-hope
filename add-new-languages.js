#!/usr/bin/env node

/**
 * Add new languages to the translation system
 * Creates language structure based on English, with placeholder translations
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, 'public', 'locales', 'translations.json');

// New languages to add
const NEW_LANGUAGES = [
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

console.log('🌍 Adding new languages to translation system...\n');

// Read existing translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// Function to deep copy with language marker
function createLanguageCopy(obj, langCode, langName, path = '') {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        // For leaf values, add language marker
        if (typeof obj === 'string') {
            return `[${langCode.toUpperCase()}] ${obj}`;
        }
        return obj;
    }

    const copy = {};
    for (const key in obj) {
        copy[key] = createLanguageCopy(obj[key], langCode, langName, path ? `${path}.${key}` : key);
    }
    return copy;
}

// Add each new language
for (const { code, name, nativeName } of NEW_LANGUAGES) {
    if (translations[code]) {
        console.log(`⚠️  ${name} (${code}) already exists, skipping...`);
        continue;
    }

    console.log(`➕ Adding ${name} (${code}) - ${nativeName}...`);

    // Create structure based on English
    translations[code] = createLanguageCopy(translations.en, code, name);

    // Update metadata
    if (translations[code].language) {
        translations[code].language = code;
    }

    console.log(`   ✓ Created ${name} with ${Object.keys(translations[code]).length} top-level keys`);
}

// Write updated translations
fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf8');

const stats = fs.statSync(TRANSLATIONS_FILE);
console.log(`\n✅ Updated translations file`);
console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`🌐 Total languages: ${Object.keys(translations).length}`);
console.log(`   ${Object.keys(translations).join(', ')}`);

console.log(`\n💡 Note: New languages have placeholder translations marked with [LANG] prefix.`);
console.log(`   Use a translation service or manual translation to complete them.`);
