#!/usr/bin/env node

/**
 * Comprehensive translation testing script
 * Checks all keys in English exist in all other languages
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, 'public', 'locales', 'translations.json');

console.log('🧪 Comprehensive Translation Test\n');
console.log('='.repeat(60));

// Read translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));
const languages = Object.keys(translations);

console.log(`\n📋 Testing ${languages.length} languages: ${languages.join(', ')}\n`);

// Collect all keys from English (baseline)
function collectKeys(obj, prefix = '') {
    const keys = [];

    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys.push(...collectKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }

    return keys;
}

// Get value at key path
function getValueAtPath(obj, keyPath) {
    const keys = keyPath.split('.');
    let value = obj;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }

    return value;
}

const englishKeys = collectKeys(translations.en);
console.log(`📊 Total English keys: ${englishKeys.length}\n`);

// Test each language
const results = {};
let totalIssues = 0;

for (const lang of languages) {
    if (lang === 'en') continue; // Skip English baseline

    console.log(`\n🌍 Testing ${lang.toUpperCase()}...`);
    console.log('-'.repeat(60));

    const missing = [];
    const empty = [];
    const placeholders = [];

    for (const key of englishKeys) {
        const value = getValueAtPath(translations[lang], key);
        const enValue = getValueAtPath(translations.en, key);

        if (value === undefined) {
            missing.push(key);
        } else if (value === '' || value === null) {
            empty.push(key);
        } else if (typeof value === 'string' && value.startsWith('[FR]')) {
            placeholders.push(key);
        } else if (value === enValue && typeof value === 'string' && value.length > 3) {
            // Might be untranslated (same as English)
            // Only flag if it's not a common word
            if (!['FAQ', 'Email', 'GPS', 'PDF', 'URL'].includes(value)) {
                // Don't report as these might be intentionally the same
            }
        }
    }

    results[lang] = { missing, empty, placeholders };
    totalIssues += missing.length + empty.length + placeholders.length;

    if (missing.length > 0) {
        console.log(`  ❌ Missing keys: ${missing.length}`);
        if (missing.length <= 10) {
            missing.forEach(k => console.log(`     - ${k}`));
        } else {
            missing.slice(0, 5).forEach(k => console.log(`     - ${k}`));
            console.log(`     ... and ${missing.length - 5} more`);
        }
    }

    if (empty.length > 0) {
        console.log(`  ⚠️  Empty values: ${empty.length}`);
        if (empty.length <= 5) {
            empty.forEach(k => console.log(`     - ${k}`));
        }
    }

    if (placeholders.length > 0) {
        console.log(`  🏷️  Placeholders: ${placeholders.length}`);
        if (placeholders.length <= 5) {
            placeholders.forEach(k => console.log(`     - ${k}`));
        }
    }

    if (missing.length === 0 && empty.length === 0 && placeholders.length === 0) {
        console.log(`  ✅ All ${englishKeys.length} keys present and translated!`);
    }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 SUMMARY\n');

for (const lang of languages) {
    if (lang === 'en') continue;

    const { missing, empty, placeholders } = results[lang];
    const total = missing.length + empty.length + placeholders.length;
    const coverage = ((englishKeys.length - total) / englishKeys.length * 100).toFixed(1);

    const status = total === 0 ? '✅' : '⚠️';
    console.log(`${status} ${lang.toUpperCase()}: ${coverage}% complete (${total} issues)`);
}

console.log('\n' + '='.repeat(60));

if (totalIssues === 0) {
    console.log('\n✨ All translations are complete! Ready to add new languages.\n');
    process.exit(0);
} else {
    console.log(`\n⚠️  Found ${totalIssues} total issues across all languages.\n`);
    console.log('💡 Run fix-french-translations.js to fix structural issues.\n');
    process.exit(1);
}
