#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 TRANSLATION SYSTEM STATUS CHECK');
console.log('==================================');
console.log(`📅 Started: ${new Date().toISOString()}\n`);

// Configuration
const languageConfig = {
  af: { name: "Afrikaans", nativeName: "Afrikaans", direction: "ltr", region: "africa" },
  am: { name: "Amharic", nativeName: "አማርኛ", direction: "ltr", region: "africa" },
  ar: { name: "Arabic", nativeName: "العربية", direction: "rtl", region: "middle-east" },
  bg: { name: "Bulgarian", nativeName: "Български", direction: "ltr", region: "europe" },
  bn: { name: "Bengali", nativeName: "বাংলা", direction: "ltr", region: "asia" },
  cs: { name: "Czech", nativeName: "Čeština", direction: "ltr", region: "europe" },
  cy: { name: "Welsh", nativeName: "Cymraeg", direction: "ltr", region: "europe" },
  da: { name: "Danish", nativeName: "Dansk", direction: "ltr", region: "europe" },
  de: { name: "German", nativeName: "Deutsch", direction: "ltr", region: "europe" },
  el: { name: "Greek", nativeName: "Ελληνικά", direction: "ltr", region: "europe" },
  es: { name: "Spanish", nativeName: "Español", direction: "ltr", region: "europe" },
  et: { name: "Estonian", nativeName: "Eesti", direction: "ltr", region: "europe" },
  fa: { name: "Persian", nativeName: "فارسی", direction: "rtl", region: "middle-east" },
  fi: { name: "Finnish", nativeName: "Suomi", direction: "ltr", region: "europe" },
  fr: { name: "French", nativeName: "Français", direction: "ltr", region: "europe" },
  ga: { name: "Irish", nativeName: "Gaeilge", direction: "ltr", region: "europe" },
  ha: { name: "Hausa", nativeName: "Hausa", direction: "ltr", region: "africa" },
  he: { name: "Hebrew", nativeName: "עברית", direction: "rtl", region: "middle-east" },
  hi: { name: "Hindi", nativeName: "हिन्दी", direction: "ltr", region: "asia" },
  hr: { name: "Croatian", nativeName: "Hrvatski", direction: "ltr", region: "europe" },
  hu: { name: "Hungarian", nativeName: "Magyar", direction: "ltr", region: "europe" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia", direction: "ltr", region: "asia" },
  ig: { name: "Igbo", nativeName: "Igbo", direction: "ltr", region: "africa" },
  is: { name: "Icelandic", nativeName: "Íslenska", direction: "ltr", region: "europe" },
  it: { name: "Italian", nativeName: "Italiano", direction: "ltr", region: "europe" },
  ja: { name: "Japanese", nativeName: "日本語", direction: "ltr", region: "asia" },
  ko: { name: "Korean", nativeName: "한국어", direction: "ltr", region: "asia" },
  lt: { name: "Lithuanian", nativeName: "Lietuvių", direction: "ltr", region: "europe" },
  lv: { name: "Latvian", nativeName: "Latviešu", direction: "ltr", region: "europe" },
  ms: { name: "Malay", nativeName: "Bahasa Melayu", direction: "ltr", region: "asia" },
  nl: { name: "Dutch", nativeName: "Nederlands", direction: "ltr", region: "europe" },
  no: { name: "Norwegian", nativeName: "Norsk", direction: "ltr", region: "europe" },
  pl: { name: "Polish", nativeName: "Polski", direction: "ltr", region: "europe" },
  pt: { name: "Portuguese", nativeName: "Português", direction: "ltr", region: "europe" },
  ro: { name: "Romanian", nativeName: "Română", direction: "ltr", region: "europe" },
  ru: { name: "Russian", nativeName: "Русский", direction: "ltr", region: "europe" },
  sk: { name: "Slovak", nativeName: "Slovenčina", direction: "ltr", region: "europe" },
  sl: { name: "Slovenian", nativeName: "Slovenščina", direction: "ltr", region: "europe" },
  sr: { name: "Serbian", nativeName: "Српски", direction: "ltr", region: "europe" },
  sv: { name: "Swedish", nativeName: "Svenska", direction: "ltr", region: "europe" },
  sw: { name: "Swahili", nativeName: "Kiswahili", direction: "ltr", region: "africa" },
  th: { name: "Thai", nativeName: "ไทย", direction: "ltr", region: "asia" },
  tl: { name: "Filipino", nativeName: "Filipino", direction: "ltr", region: "asia" },
  tr: { name: "Turkish", nativeName: "Türkçe", direction: "ltr", region: "middle-east" },
  ur: { name: "Urdu", nativeName: "اردو", direction: "rtl", region: "asia" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt", direction: "ltr", region: "asia" },
  xh: { name: "Xhosa", nativeName: "isiXhosa", direction: "ltr", region: "africa" },
  yo: { name: "Yoruba", nativeName: "Yorùbá", direction: "ltr", region: "africa" },
  zh: { name: "Chinese", nativeName: "中文", direction: "ltr", region: "asia" },
  zu: { name: "Zulu", nativeName: "isiZulu", direction: "ltr", region: "africa" }
};

const namespaces = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];
const languageCodes = Object.keys(languageConfig);

// Helper functions
function countKeys(obj, prefix = '') {
  if (typeof obj !== 'object' || obj === null) {
    return 1;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((count, item, index) => {
      return count + countKeys(item, `${prefix}[${index}]`);
    }, 0);
  }

  return Object.keys(obj).reduce((count, key) => {
    return count + countKeys(obj[key], prefix ? `${prefix}.${key}` : key);
  }, 0);
}

function isGoodTranslation(text, langCode) {
  if (typeof text !== 'string') return true;

  // Check for placeholder patterns
  if (text.includes(`[${langCode.toUpperCase()}]`)) return false;
  if (text.includes('[EN]') && langCode !== 'en') return false;

  // Check for untranslated English patterns (basic heuristics)
  if (langCode !== 'en') {
    const englishWords = ['Loading...', 'Error', 'Submit', 'Cancel', 'Save', 'Download'];
    if (englishWords.some(word => text === word)) return false;
  }

  return true;
}

function analyzeTranslationQuality(obj, langCode, path = '') {
  let total = 0;
  let good = 0;
  let issues = [];

  if (typeof obj === 'string') {
    total = 1;
    if (isGoodTranslation(obj, langCode)) {
      good = 1;
    } else {
      issues.push({
        path: path,
        value: obj,
        issue: 'placeholder_or_untranslated'
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const result = analyzeTranslationQuality(item, langCode, `${path}[${index}]`);
      total += result.total;
      good += result.good;
      issues = issues.concat(result.issues);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const result = analyzeTranslationQuality(obj[key], langCode, currentPath);
      total += result.total;
      good += result.good;
      issues = issues.concat(result.issues);
    });
  }

  return { total, good, issues };
}

// Main status check
async function checkTranslationStatus() {
  const localesDir = path.join(process.cwd(), 'public', 'locales');
  const enDir = path.join(localesDir, 'en');

  console.log(`📁 Locales directory: ${localesDir}`);

  // Check basic structure
  if (!fs.existsSync(localesDir)) {
    console.error('❌ Locales directory not found!');
    return;
  }

  if (!fs.existsSync(enDir)) {
    console.error('❌ English reference directory not found!');
    return;
  }

  console.log('✅ Basic directory structure exists\n');

  // Load English reference files
  console.log('📖 Loading English reference files...');
  const englishFiles = {};
  const englishKeyCounts = {};

  for (const namespace of namespaces) {
    const filePath = path.join(enDir, `${namespace}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        englishFiles[namespace] = data;
        englishKeyCounts[namespace] = countKeys(data);
        console.log(`  ✅ ${namespace}.json - ${englishKeyCounts[namespace]} keys`);
      } catch (error) {
        console.log(`  ❌ ${namespace}.json - Invalid JSON: ${error.message}`);
      }
    } else {
      console.log(`  ❌ ${namespace}.json - File not found`);
    }
  }

  const totalEnglishKeys = Object.values(englishKeyCounts).reduce((sum, count) => sum + count, 0);
  console.log(`\n📊 Total English keys: ${totalEnglishKeys}\n`);

  // Check each language
  console.log('🌐 Analyzing all languages...\n');

  const results = {
    totalLanguages: languageCodes.length,
    completedLanguages: 0,
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    missingFiles: 0,
    languageDetails: {},
    summary: {
      perfect: [],
      good: [],
      needsWork: [],
      broken: []
    }
  };

  for (const langCode of languageCodes) {
    const langConfig = languageConfig[langCode];
    const langDir = path.join(localesDir, langCode);

    const languageResult = {
      name: langConfig.name,
      nativeName: langConfig.nativeName,
      direction: langConfig.direction,
      region: langConfig.region,
      files: {},
      totalKeys: 0,
      validFiles: 0,
      invalidFiles: 0,
      missingFiles: 0,
      translationQuality: {
        total: 0,
        good: 0,
        percentage: 0,
        issues: []
      }
    };

    if (!fs.existsSync(langDir)) {
      console.log(`❌ ${langConfig.name} (${langCode}) - Directory missing`);
      results.summary.broken.push(langCode);
      results.languageDetails[langCode] = languageResult;
      continue;
    }

    // Check each namespace file
    for (const namespace of namespaces) {
      const filePath = path.join(langDir, `${namespace}.json`);
      results.totalFiles++;

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          const keyCount = countKeys(data);

          results.validFiles++;
          languageResult.validFiles++;
          languageResult.totalKeys += keyCount;
          languageResult.files[namespace] = {
            status: 'valid',
            keys: keyCount,
            expectedKeys: englishKeyCounts[namespace] || 0
          };

          // Analyze translation quality
          if (langCode !== 'en' && englishFiles[namespace]) {
            const qualityAnalysis = analyzeTranslationQuality(data, langCode);
            languageResult.translationQuality.total += qualityAnalysis.total;
            languageResult.translationQuality.good += qualityAnalysis.good;
            languageResult.translationQuality.issues = languageResult.translationQuality.issues.concat(
              qualityAnalysis.issues.map(issue => ({
                ...issue,
                namespace: namespace
              }))
            );
          }

        } catch (error) {
          results.invalidFiles++;
          languageResult.invalidFiles++;
          languageResult.files[namespace] = {
            status: 'invalid',
            error: error.message
          };
        }
      } else {
        results.missingFiles++;
        languageResult.missingFiles++;
        languageResult.files[namespace] = {
          status: 'missing'
        };
      }
    }

    // Calculate translation quality percentage
    if (languageResult.translationQuality.total > 0) {
      languageResult.translationQuality.percentage = Math.round(
        (languageResult.translationQuality.good / languageResult.translationQuality.total) * 100
      );
    }

    // Categorize language quality
    const hasAllFiles = languageResult.validFiles === namespaces.length;
    const qualityPercentage = languageResult.translationQuality.percentage;

    if (hasAllFiles && qualityPercentage >= 95) {
      results.summary.perfect.push(langCode);
    } else if (hasAllFiles && qualityPercentage >= 80) {
      results.summary.good.push(langCode);
    } else if (languageResult.validFiles > 0) {
      results.summary.needsWork.push(langCode);
    } else {
      results.summary.broken.push(langCode);
    }

    if (hasAllFiles) {
      results.completedLanguages++;
    }

    results.languageDetails[langCode] = languageResult;

    // Progress indicator
    const status = hasAllFiles
      ? qualityPercentage >= 95
        ? '🎉'
        : qualityPercentage >= 80
          ? '✅'
          : '⚠️'
      : '❌';

    console.log(`${status} ${langConfig.name} (${langCode}) - Files: ${languageResult.validFiles}/${namespaces.length}, Quality: ${qualityPercentage}%`);
  }

  // Final summary
  console.log('\n📊 COMPREHENSIVE STATUS SUMMARY');
  console.log('===============================');
  console.log(`📈 Overall Progress: ${results.completedLanguages}/${results.totalLanguages} languages (${Math.round(results.completedLanguages / results.totalLanguages * 100)}%)`);
  console.log(`📁 File Statistics: ${results.validFiles} valid, ${results.invalidFiles} invalid, ${results.missingFiles} missing`);
  console.log(`🎯 Total Files: ${results.totalFiles} (Expected: ${results.totalLanguages * namespaces.length})`);

  console.log('\n🏆 QUALITY BREAKDOWN:');
  console.log(`🎉 Perfect (95%+): ${results.summary.perfect.length} languages`);
  if (results.summary.perfect.length > 0) {
    console.log(`   ${results.summary.perfect.map(code => languageConfig[code].name).join(', ')}`);
  }

  console.log(`✅ Good (80-94%): ${results.summary.good.length} languages`);
  if (results.summary.good.length > 0) {
    console.log(`   ${results.summary.good.map(code => languageConfig[code].name).join(', ')}`);
  }

  console.log(`⚠️ Needs Work (1-79%): ${results.summary.needsWork.length} languages`);
  if (results.summary.needsWork.length > 0) {
    console.log(`   ${results.summary.needsWork.map(code => languageConfig[code].name).join(', ')}`);
  }

  console.log(`❌ Broken (0%): ${results.summary.broken.length} languages`);
  if (results.summary.broken.length > 0) {
    console.log(`   ${results.summary.broken.map(code => languageConfig[code].name).join(', ')}`);
  }

  // System readiness assessment
  console.log('\n🚀 SYSTEM READINESS ASSESSMENT:');
  const readinessScore = (results.summary.perfect.length + results.summary.good.length) / results.totalLanguages * 100;
  console.log(`📊 Readiness Score: ${Math.round(readinessScore)}%`);

  if (readinessScore >= 95) {
    console.log('🎉 PRODUCTION READY! All major languages are well-translated.');
  } else if (readinessScore >= 80) {
    console.log('✅ MOSTLY READY! Minor improvements needed for some languages.');
  } else if (readinessScore >= 60) {
    console.log('⚠️ NEEDS WORK! Several languages require attention.');
  } else {
    console.log('❌ NOT READY! Significant translation work needed.');
  }

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (results.summary.broken.length > 0) {
    console.log(`🔧 Priority 1: Fix ${results.summary.broken.length} broken language(s)`);
  }
  if (results.summary.needsWork.length > 0) {
    console.log(`📝 Priority 2: Improve ${results.summary.needsWork.length} language(s) needing work`);
  }
  if (results.summary.good.length > 0) {
    console.log(`✨ Priority 3: Polish ${results.summary.good.length} good language(s) to perfect`);
  }

  if (results.invalidFiles > 0 || results.missingFiles > 0) {
    console.log('🔧 Run the batch translation update to fix structural issues');
  }

  // Save detailed report
  try {
    const reportPath = 'translation-status-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📋 Detailed report saved: ${reportPath}`);
  } catch (error) {
    console.warn('⚠️ Could not save detailed report:', error.message);
  }

  console.log(`\n⏰ Status check completed: ${new Date().toISOString()}`);

  return results;
}

// Execute if run directly
if (require.main === module) {
  checkTranslationStatus().catch(error => {
    console.error('❌ Status check failed:', error);
    process.exit(1);
  });
}

module.exports = { checkTranslationStatus };
