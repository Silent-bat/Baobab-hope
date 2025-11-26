#!/usr/bin/env node

/**
 * Consolidate all translation files into a single translations.json file
 * Only keeping English and French languages
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'public', 'locales');
const OUTPUT_FILE = path.join(LOCALES_DIR, 'translations.json');
const NAMESPACES = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];
const LANGUAGES = ['en', 'fr'];

console.log('🔄 Starting translation consolidation...\n');

const consolidatedTranslations = {};

// Read and merge all namespace files for each language
for (const lang of LANGUAGES) {
    console.log(`📖 Reading ${lang.toUpperCase()} translations...`);
    consolidatedTranslations[lang] = {};

    for (const namespace of NAMESPACES) {
        const filePath = path.join(LOCALES_DIR, lang, `${namespace}.json`);

        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);

                // Merge the namespace data into the consolidated object
                Object.assign(consolidatedTranslations[lang], data);
                console.log(`  ✓ Loaded ${namespace}.json`);
            } else {
                console.log(`  ⚠ Missing ${namespace}.json`);
            }
        } catch (error) {
            console.error(`  ✗ Error reading ${namespace}.json:`, error.message);
        }
    }

    console.log(`  ✓ Completed ${lang.toUpperCase()}: ${Object.keys(consolidatedTranslations[lang]).length} top-level keys\n`);
}

// Write the consolidated translations to a single file
try {
    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(consolidatedTranslations, null, 2),
        'utf8'
    );

    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`✅ Successfully created ${OUTPUT_FILE}`);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📦 Languages: ${LANGUAGES.join(', ')}`);
    console.log(`🔑 English keys: ${Object.keys(consolidatedTranslations.en).length}`);
    console.log(`🔑 French keys: ${Object.keys(consolidatedTranslations.fr).length}`);

} catch (error) {
    console.error('❌ Error writing consolidated file:', error.message);
    process.exit(1);
}

console.log('\n✨ Translation consolidation complete!');
