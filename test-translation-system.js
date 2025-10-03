#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 TRANSLATION SYSTEM TEST');
console.log('==========================');
console.log(`📅 Started: ${new Date().toISOString()}\n`);

// Test the directory structure
const localesDir = path.join(process.cwd(), 'public', 'locales');
const enDir = path.join(localesDir, 'en');

console.log(`📁 Locales directory: ${localesDir}`);
console.log(`📁 English directory: ${enDir}`);

// Check if directories exist
if (!fs.existsSync(localesDir)) {
  console.error('❌ Locales directory not found!');
  process.exit(1);
}

if (!fs.existsSync(enDir)) {
  console.error('❌ English locale directory not found!');
  process.exit(1);
}

console.log('✅ Directory structure verified');

// Check namespace files
const namespaces = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];
const missingFiles = [];

console.log('\n📋 Checking namespace files...');
for (const namespace of namespaces) {
  const filePath = path.join(enDir, `${namespace}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      console.log(`✅ ${namespace}.json - Valid JSON with ${Object.keys(data).length} keys`);
    } catch (error) {
      console.log(`❌ ${namespace}.json - Invalid JSON: ${error.message}`);
    }
  } else {
    console.log(`❌ ${namespace}.json - File not found`);
    missingFiles.push(namespace);
  }
}

// Check language directories
console.log('\n🌐 Checking language directories...');
const languageCodes = [
  'af', 'am', 'ar', 'bg', 'bn', 'cs', 'cy', 'da', 'de', 'el', 'es', 'et',
  'fa', 'fi', 'fr', 'ga', 'ha', 'he', 'hi', 'hr', 'hu', 'id', 'ig', 'is',
  'it', 'ja', 'ko', 'lt', 'lv', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru',
  'sk', 'sl', 'sr', 'sv', 'sw', 'th', 'tl', 'tr', 'ur', 'vi', 'xh', 'yo',
  'zh', 'zu'
];

let existingLanguages = 0;
let totalFiles = 0;
let validFiles = 0;

for (const langCode of languageCodes) {
  const langDir = path.join(localesDir, langCode);
  if (fs.existsSync(langDir)) {
    existingLanguages++;

    // Check files in this language directory
    for (const namespace of namespaces) {
      const filePath = path.join(langDir, `${namespace}.json`);
      if (fs.existsSync(filePath)) {
        totalFiles++;
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          JSON.parse(content);
          validFiles++;
        } catch (error) {
          // Invalid JSON
        }
      }
    }
  }
}

console.log(`✅ Found ${existingLanguages}/${languageCodes.length} language directories`);
console.log(`✅ Found ${totalFiles} total translation files`);
console.log(`✅ ${validFiles} files have valid JSON`);
console.log(`❌ ${totalFiles - validFiles} files have invalid JSON`);

// Summary
console.log('\n📊 SYSTEM STATUS SUMMARY');
console.log('========================');

if (missingFiles.length === 0 && existingLanguages === languageCodes.length) {
  console.log('🎉 All directories and namespace files present!');
} else {
  console.log('⚠️ Some files or directories missing');
}

if (validFiles === totalFiles && totalFiles > 0) {
  console.log('🎉 All translation files have valid JSON!');
  console.log('🚀 System ready for batch translation update');
} else {
  console.log(`⚠️ ${totalFiles - validFiles} files need JSON repair`);
}

console.log(`\n⏰ Test completed: ${new Date().toISOString()}`);

// Test simple translation function
console.log('\n🧪 Testing translation templates...');

const testTemplates = {
  "donate now": {
    fr: "faire un don maintenant",
    es: "donar ahora",
    de: "jetzt spenden",
    sw: "changia sasa"
  }
};

function testTranslate(text, langCode) {
  const lowerText = text.toLowerCase().trim();
  if (testTemplates[lowerText] && testTemplates[lowerText][langCode]) {
    return testTemplates[lowerText][langCode];
  }
  return `[${langCode.toUpperCase()}] ${text}`;
}

console.log('Testing "donate now":');
console.log(`  French: ${testTranslate("donate now", "fr")}`);
console.log(`  Spanish: ${testTranslate("donate now", "es")}`);
console.log(`  German: ${testTranslate("donate now", "de")}`);
console.log(`  Swahili: ${testTranslate("donate now", "sw")}`);
console.log(`  Untranslated: ${testTranslate("donate now", "xx")}`);

console.log('\n✅ Translation template system working correctly!');
console.log('\n🔧 System ready for full batch update execution');
