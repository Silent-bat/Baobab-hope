#!/usr/bin/env node

/**
 * Fix missing keys in French translations by ensuring structure matches English
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_FILE = path.join(__dirname, 'public', 'locales', 'translations.json');

console.log('🔧 Fixing French translation structure...\n');

// Read current translations
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));

// Recursive function to ensure FR has all keys from EN
function ensureStructure(enObj, frObj, path = '') {
    let fixed = 0;

    for (const key in enObj) {
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key]) && enObj[key] !== null) {
            // It's a nested object
            if (!frObj[key] || typeof frObj[key] !== 'object') {
                console.log(`  ⚠️  Creating missing object: ${currentPath}`);
                frObj[key] = {};
                fixed++;
            }
            fixed += ensureStructure(enObj[key], frObj[key], currentPath);
        } else {
            // It's a value
            if (!(key in frObj)) {
                // Use French equivalent if we can guess, otherwise use English as placeholder
                const placeholder = `[FR] ${enObj[key]}`;
                frObj[key] = placeholder;
                console.log(`  ➕ Added missing key: ${currentPath} = "${placeholder}"`);
                fixed++;
            }
        }
    }

    return fixed;
}

// Manual fixes for known translations
const manualFixes = {
    'nav.about.title': 'À Propos',
    'nav.information.title': 'Information',
    'nav.act.title': 'Agir'
};

console.log('📝 Applying manual fixes...');
for (const [keyPath, value] of Object.entries(manualFixes)) {
    const keys = keyPath.split('.');
    let target = translations.fr;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) {
            target[keys[i]] = {};
        }
        target = target[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (target[lastKey] !== value) {
        console.log(`  ✓ ${keyPath}: "${target[lastKey]}" → "${value}"`);
        target[lastKey] = value;
    }
}

console.log('\n🔍 Checking for missing keys...');
const fixedCount = ensureStructure(translations.en, translations.fr);

if (fixedCount > 0) {
    console.log(`\n✅ Fixed ${fixedCount} missing keys`);

    // Write back
    fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`📝 Updated ${TRANSLATIONS_FILE}`);
} else {
    console.log('\n✨ No missing keys found - structure is complete!');
}

//  Verify critical keys
console.log('\n🔍 Verifying critical navigation keys...');
const criticalKeys = [
    'nav.home',
    'nav.about.title',
    'nav.about.history',
    'nav.actions',
    'nav.information.title',
    'nav.act.title',
    'nav.contact',
    'nav.donate'
];

let allPresent = true;
for (const keyPath of criticalKeys) {
    const keys = keyPath.split('.');
    let enValue = translations.en;
    let frValue = translations.fr;

    for (const k of keys) {
        enValue = enValue?.[k];
        frValue = frValue?.[k];
    }

    if (enValue && frValue) {
        console.log(`  ✓ ${keyPath}: "${enValue}" → "${frValue}"`);
    } else {
        console.log(`  ✗ ${keyPath}: MISSING`);
        allPresent = false;
    }
}

if (allPresent) {
    console.log('\n✨ All critical keys are present!');
} else {
    console.log('\n⚠️  Some critical keys are still missing');
}

console.log('\n🎉 French translation structure fix complete!');
