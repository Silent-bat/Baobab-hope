#!/usr/bin/env node

/**
 * Improved consolidation script that properly merges nested objects
 */

const fs = require('fs');
const path = require('path');

// Extract backup first
const BACKUP_DIR = path.join(__dirname, 'backup-old-translations');
const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const OUTPUT_FILE = path.join(LOCALES_DIR, 'translations.json');
const TMP_DIR = '/tmp/translations-restore';
const NAMESPACES = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];
const LANGUAGES = ['en', 'fr'];

console.log('🔄 Starting improved translation consolidation...\n');

// Extract backup
console.log('📦 Extracting backup...');
const { execSync } = require('child_process');
try {
    execSync(`mkdir -p ${TMP_DIR}`);
    const backupFile = fs.readdirSync(BACKUP_DIR).find(f => f.endsWith('.tar.gz'));
    if (backupFile) {
        execSync(`tar -xzf "${path.join(BACKUP_DIR, backupFile)}" -C ${TMP_DIR} 2>/dev/null || true`);
        console.log('✓ Backup extracted\n');
    }
} catch (err) {
    console.error('⚠️  Backup extraction had warnings, continuing...\n');
}

/**
 * Deep merge objects, preserving all nested structures
 */
function deepMerge(target, source) {
    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

const consolidatedTranslations = {};

// Read and merge all namespace files for each language
for (const lang of LANGUAGES) {
    console.log(`📖 Reading ${lang.toUpperCase()} translations...`);
    consolidatedTranslations[lang] = {};

    for (const namespace of NAMESPACES) {
        const filePath = path.join(TMP_DIR, lang, `${namespace}.json`);

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);

                // Deep merge instead of Object.assign
                consolidatedTranslations[lang] = deepMerge(consolidatedTranslations[lang], data);

                const keyCount = Object.keys(data).length;
                console.log(`  ✓ Merged ${namespace}.json (${keyCount} keys)`);
            } else {
                console.log(`  ⚠ Missing ${namespace}.json`);
            }
        } catch (error) {
            console.error(`  ✗ Error reading ${namespace}.json:`, error.message);
        }
    }

    const totalKeys = Object.keys(consolidatedTranslations[lang]).length;
    console.log(`  ✓ Completed ${lang.toUpperCase()}: ${totalKeys} top-level keys\n`);
}

// Verify critical keys exist
console.log('🔍 Verifying critical translation keys...');
const criticalKeys = ['nav.home', 'nav.about.title', 'common.loading', 'footer.mission'];
let allKeysPresent = true;

for (const keyPath of criticalKeys) {
    const keys = keyPath.split('.');
    let value = consolidatedTranslations.en;

    for (const key of keys) {
        if (value && typeof value === 'object') {
            value = value[key];
        } else {
            value = undefined;
            break;
        }
    }

    if (value !== undefined) {
        console.log(`  ✓ ${keyPath}: "${value}"`);
    } else {
        console.log(`  ✗ ${keyPath}: MISSING`);
        allKeysPresent = false;
    }
}

if (!allKeysPresent) {
    console.log('\n⚠️  Some critical keys are missing!\n');
}

// Write the consolidated translations
try {
    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(consolidatedTranslations, null, 2),
        'utf8'
    );

    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`\n✅ Successfully created ${OUTPUT_FILE}`);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📦 Languages: ${LANGUAGES.join(', ')}`);
    console.log(`🔑 English keys: ${Object.keys(consolidatedTranslations.en).length}`);
    console.log(`🔑 French keys: ${Object.keys(consolidatedTranslations.fr).length}`);

} catch (error) {
    console.error('❌ Error writing consolidated file:', error.message);
    process.exit(1);
}

// Cleanup
try {
    execSync(`rm -rf ${TMP_DIR}`);
} catch (err) {
    // Ignore cleanup errors
}

console.log('\n✨ Translation consolidation complete!');
console.log('\n💡 Next steps:');
console.log('  1. Verify the translations.json file');
console.log('  2. Test the application: npm run dev');
console.log('  3. Check for console errors in browser');
