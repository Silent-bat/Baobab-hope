const fs = require('fs');
const path = require('path');

console.log('🔍 BAOBAB HOPE Translation Validation Report');
console.log('============================================');
console.log(`📅 Generated: ${new Date().toISOString()}\n`);

// Language configuration for all 51 supported languages
const languageConfig = {
  af: { name: "Afrikaans", nativeName: "Afrikaans" },
  am: { name: "Amharic", nativeName: "አማርኛ" },
  ar: { name: "Arabic", nativeName: "العربية" },
  bg: { name: "Bulgarian", nativeName: "Български" },
  bn: { name: "Bengali", nativeName: "বাংলা" },
  cs: { name: "Czech", nativeName: "Čeština" },
  cy: { name: "Welsh", nativeName: "Cymraeg" },
  da: { name: "Danish", nativeName: "Dansk" },
  de: { name: "German", nativeName: "Deutsch" },
  el: { name: "Greek", nativeName: "Ελληνικά" },
  es: { name: "Spanish", nativeName: "Español" },
  et: { name: "Estonian", nativeName: "Eesti" },
  fa: { name: "Persian", nativeName: "فارسی" },
  fi: { name: "Finnish", nativeName: "Suomi" },
  fr: { name: "French", nativeName: "Français" },
  ga: { name: "Irish", nativeName: "Gaeilge" },
  ha: { name: "Hausa", nativeName: "Hausa" },
  he: { name: "Hebrew", nativeName: "עברית" },
  hi: { name: "Hindi", nativeName: "हिन्दी" },
  hr: { name: "Croatian", nativeName: "Hrvatski" },
  hu: { name: "Hungarian", nativeName: "Magyar" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia" },
  ig: { name: "Igbo", nativeName: "Igbo" },
  is: { name: "Icelandic", nativeName: "Íslenska" },
  it: { name: "Italian", nativeName: "Italiano" },
  ja: { name: "Japanese", nativeName: "日本語" },
  ko: { name: "Korean", nativeName: "한국어" },
  lt: { name: "Lithuanian", nativeName: "Lietuvių" },
  lv: { name: "Latvian", nativeName: "Latviešu" },
  ms: { name: "Malay", nativeName: "Bahasa Melayu" },
  nl: { name: "Dutch", nativeName: "Nederlands" },
  no: { name: "Norwegian", nativeName: "Norsk" },
  pl: { name: "Polish", nativeName: "Polski" },
  pt: { name: "Portuguese", nativeName: "Português" },
  ro: { name: "Romanian", nativeName: "Română" },
  ru: { name: "Russian", nativeName: "Русский" },
  sk: { name: "Slovak", nativeName: "Slovenčina" },
  sl: { name: "Slovenian", nativeName: "Slovenščina" },
  sr: { name: "Serbian", nativeName: "Српски" },
  sv: { name: "Swedish", nativeName: "Svenska" },
  sw: { name: "Swahili", nativeName: "Kiswahili" },
  th: { name: "Thai", nativeName: "ไทย" },
  tl: { name: "Filipino", nativeName: "Filipino" },
  tr: { name: "Turkish", nativeName: "Türkçe" },
  ur: { name: "Urdu", nativeName: "اردو" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt" },
  xh: { name: "Xhosa", nativeName: "isiXhosa" },
  yo: { name: "Yoruba", nativeName: "Yorùbá" },
  zh: { name: "Chinese", nativeName: "中文" },
  zu: { name: "Zulu", nativeName: "isiZulu" }
};

const namespaces = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];

// Validation functions
function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    return { valid: true, data: parsed };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function countKeys(obj, prefix = '') {
  let count = 0;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      count += countKeys(value, prefix ? `${prefix}.${key}` : key);
    } else {
      count++;
    }
  }
  return count;
}

function checkTranslationQuality(text) {
  if (typeof text !== 'string') return 'non-string';
  if (text.trim() === '') return 'empty';
  if (text.includes('[') && text.includes(']')) return 'placeholder';
  if (text.length < 2) return 'too-short';
  return 'good';
}

function analyzeTranslations(obj, issues = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      analyzeTranslations(value, issues);
    } else if (typeof value === 'string') {
      const quality = checkTranslationQuality(value);
      if (quality !== 'good') {
        issues.push({ key, value, issue: quality });
      }
    }
  }
  return issues;
}

async function runValidation() {
  const localesDir = path.join(process.cwd(), 'public', 'locales');

  if (!fs.existsSync(localesDir)) {
    console.error('❌ Locales directory not found');
    return;
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalLanguages: 0,
      validLanguages: 0,
      totalFiles: 0,
      validFiles: 0,
      totalKeys: 0,
      translationIssues: 0
    },
    languages: {},
    issues: [],
    recommendations: []
  };

  // Read English reference
  const enDir = path.join(localesDir, 'en');
  const englishData = {};
  let englishKeyCount = 0;

  console.log('📖 Reading English reference files:');
  for (const namespace of namespaces) {
    const filePath = path.join(enDir, `${namespace}.json`);
    if (fs.existsSync(filePath)) {
      const validation = validateJsonFile(filePath);
      if (validation.valid) {
        englishData[namespace] = validation.data;
        const keyCount = countKeys(validation.data);
        englishKeyCount += keyCount;
        console.log(`  ✅ ${namespace}.json (${keyCount} keys)`);
      } else {
        console.log(`  ❌ ${namespace}.json: ${validation.error}`);
      }
    }
  }

  console.log(`📊 English reference: ${englishKeyCount} total keys\n`);

  // Check all language directories
  const languageDirs = fs.readdirSync(localesDir)
    .filter(dir => fs.statSync(path.join(localesDir, dir)).isDirectory())
    .filter(dir => languageConfig[dir])
    .sort();

  console.log(`🌐 Validating ${languageDirs.length} languages:\n`);

  for (const langCode of languageDirs) {
    const langConfig = languageConfig[langCode];
    const langDir = path.join(localesDir, langCode);

    report.summary.totalLanguages++;
    report.languages[langCode] = {
      name: langConfig.name,
      nativeName: langConfig.nativeName,
      files: {},
      totalKeys: 0,
      validFiles: 0,
      issues: []
    };

    console.log(`📝 ${langConfig.name} (${langCode}):`);

    let languageValid = true;
    let langKeyCount = 0;

    for (const namespace of namespaces) {
      const filePath = path.join(langDir, `${namespace}.json`);
      report.summary.totalFiles++;

      if (fs.existsSync(filePath)) {
        const validation = validateJsonFile(filePath);

        if (validation.valid) {
          report.summary.validFiles++;
          report.languages[langCode].validFiles++;

          const keyCount = countKeys(validation.data);
          langKeyCount += keyCount;

          // Analyze translation quality
          const issues = analyzeTranslations(validation.data);

          report.languages[langCode].files[namespace] = {
            valid: true,
            keys: keyCount,
            issues: issues.length
          };

          if (issues.length > 0) {
            report.languages[langCode].issues.push(...issues.map(issue => ({
              namespace,
              ...issue
            })));
            report.summary.translationIssues += issues.length;
          }

          console.log(`  ✅ ${namespace}.json (${keyCount} keys, ${issues.length} issues)`);
        } else {
          report.languages[langCode].files[namespace] = {
            valid: false,
            error: validation.error
          };

          console.log(`  ❌ ${namespace}.json: ${validation.error}`);
          languageValid = false;
        }
      } else {
        report.languages[langCode].files[namespace] = {
          valid: false,
          error: 'File missing'
        };

        console.log(`  ⚠️ ${namespace}.json: Missing`);
        languageValid = false;
      }
    }

    report.languages[langCode].totalKeys = langKeyCount;
    report.summary.totalKeys += langKeyCount;

    if (languageValid) {
      report.summary.validLanguages++;
      const completeness = Math.round((langKeyCount / englishKeyCount) * 100);
      console.log(`  🎯 Completeness: ${completeness}% (${langKeyCount}/${englishKeyCount} keys)`);
    }

    console.log('');
  }

  // Generate recommendations
  if (report.summary.translationIssues > 0) {
    report.recommendations.push('Review and fix placeholder translations marked with [LANG] prefix');
  }

  if (report.summary.validFiles < report.summary.totalFiles) {
    report.recommendations.push('Fix JSON syntax errors in invalid files');
  }

  const avgCompleteness = report.summary.totalKeys / (report.summary.totalLanguages * englishKeyCount) * 100;
  if (avgCompleteness < 90) {
    report.recommendations.push('Update incomplete language files to match English key structure');
  }

  // Summary output
  console.log('📊 VALIDATION SUMMARY');
  console.log('====================');
  console.log(`✅ Languages processed: ${report.summary.validLanguages}/${report.summary.totalLanguages}`);
  console.log(`✅ Files validated: ${report.summary.validFiles}/${report.summary.totalFiles}`);
  console.log(`🔑 Total translation keys: ${report.summary.totalKeys}`);
  console.log(`⚠️ Translation issues: ${report.summary.translationIssues}`);
  console.log(`📈 Average completeness: ${Math.round(avgCompleteness)}%`);

  // Top issues by language
  console.log('\n🚨 LANGUAGES WITH MOST ISSUES:');
  const languageIssues = Object.entries(report.languages)
    .map(([code, data]) => ({ code, name: data.name, issues: data.issues.length }))
    .sort((a, b) => b.issues - a.issues)
    .slice(0, 5);

  for (const lang of languageIssues) {
    if (lang.issues > 0) {
      console.log(`  ${lang.name} (${lang.code}): ${lang.issues} issues`);
    }
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  // Save detailed report
  const reportPath = 'translation-validation-detailed-report.json';
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📋 Detailed report saved: ${reportPath}`);
  } catch (error) {
    console.warn(`⚠️ Could not save detailed report: ${error.message}`);
  }

  // Final status
  console.log('\n🎯 FINAL STATUS:');
  if (report.summary.validFiles === report.summary.totalFiles && report.summary.translationIssues === 0) {
    console.log('🎉 All translations are valid and complete!');
    console.log('🌍 Your multilingual charity website is ready for production!');
  } else if (report.summary.validFiles === report.summary.totalFiles) {
    console.log('✅ All files have valid JSON syntax');
    console.log(`⚠️ ${report.summary.translationIssues} translation quality issues need attention`);
    console.log('🔧 Consider reviewing placeholder translations for better user experience');
  } else {
    console.log('❌ Some files have validation errors that need to be fixed');
    console.log('🛠️ Run the translation update script to fix structural issues');
  }

  return report;
}

// Execute validation
if (require.main === module) {
  runValidation().catch(error => {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runValidation };
