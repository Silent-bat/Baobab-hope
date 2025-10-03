const fs = require('fs');
const path = require('path');

console.log('🔍 BAOBAB HOPE Quick Translation Status Check');
console.log('============================================');
console.log(`📅 Generated: ${new Date().toISOString()}\n`);

// Language configuration for all 51 supported languages
const languageConfig = {
  af: { name: "Afrikaans", nativeName: "Afrikaans" },
  am: { name: "Amharic", nativeName: "አማরኛ" },
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

function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function assessTranslationQuality(content) {
  const englishIndicators = [
    'An error occurred',
    'Back to Top',
    'Learn More',
    'Contact Us',
    'Join Us',
    'Follow Us',
    'Get Started',
    'Success Rate',
    'One Heart, One Hand'
  ];

  let englishCount = 0;
  const contentStr = JSON.stringify(content).toLowerCase();

  englishIndicators.forEach(indicator => {
    if (contentStr.includes(indicator.toLowerCase())) {
      englishCount++;
    }
  });

  if (englishCount === 0) return 'excellent';
  if (englishCount < 3) return 'good';
  if (englishCount < 6) return 'needs-work';
  return 'poor';
}

async function quickValidation() {
  const localesDir = path.join(process.cwd(), 'public', 'locales');

  if (!fs.existsSync(localesDir)) {
    console.error('❌ Locales directory not found');
    return;
  }

  const summary = {
    totalLanguages: 0,
    validLanguages: 0,
    totalFiles: 0,
    validFiles: 0,
    qualityDistribution: {
      excellent: 0,
      good: 0,
      'needs-work': 0,
      poor: 0
    }
  };

  console.log('🌐 Checking translation status for all languages:\n');

  const languageDirs = fs.readdirSync(localesDir)
    .filter(dir => fs.statSync(path.join(localesDir, dir)).isDirectory())
    .filter(dir => languageConfig[dir])
    .sort();

  for (const langCode of languageDirs) {
    const langConfig = languageConfig[langCode];
    const langDir = path.join(localesDir, langCode);

    summary.totalLanguages++;
    let langValid = true;
    let langFiles = 0;
    let validLangFiles = 0;

    // Check common.json for quality assessment
    const commonFile = path.join(langDir, 'common.json');
    let quality = 'unknown';

    if (fs.existsSync(commonFile)) {
      const validation = validateJsonFile(commonFile);
      if (validation.valid) {
        const content = JSON.parse(fs.readFileSync(commonFile, 'utf8'));
        quality = assessTranslationQuality(content);
      }
    }

    // Count all files
    for (const namespace of namespaces) {
      const filePath = path.join(langDir, `${namespace}.json`);
      langFiles++;
      summary.totalFiles++;

      if (fs.existsSync(filePath)) {
        const validation = validateJsonFile(filePath);
        if (validation.valid) {
          validLangFiles++;
          summary.validFiles++;
        } else {
          langValid = false;
        }
      } else {
        langValid = false;
      }
    }

    if (langValid && validLangFiles === langFiles) {
      summary.validLanguages++;
    }

    // Track quality distribution
    if (quality !== 'unknown') {
      summary.qualityDistribution[quality]++;
    }

    // Display status
    const statusIcon = langValid ? '✅' : '❌';
    const qualityIcon = {
      'excellent': '🌟',
      'good': '👍',
      'needs-work': '⚠️',
      'poor': '🔧',
      'unknown': '❓'
    }[quality];

    console.log(`${statusIcon} ${qualityIcon} ${langConfig.name} (${langCode}): ${validLangFiles}/${langFiles} files, quality: ${quality}`);
  }

  // Summary report
  console.log('\n📊 QUICK VALIDATION SUMMARY');
  console.log('===========================');
  console.log(`🌐 Total languages: ${summary.totalLanguages}`);
  console.log(`✅ Valid languages: ${summary.validLanguages}`);
  console.log(`📁 Total files: ${summary.totalFiles}`);
  console.log(`✅ Valid files: ${summary.validFiles}`);
  console.log(`📈 Success rate: ${Math.round((summary.validFiles / summary.totalFiles) * 100)}%`);

  console.log('\n🎯 Translation Quality Distribution:');
  console.log(`🌟 Excellent: ${summary.qualityDistribution.excellent} languages`);
  console.log(`👍 Good: ${summary.qualityDistribution.good} languages`);
  console.log(`⚠️ Needs work: ${summary.qualityDistribution['needs-work']} languages`);
  console.log(`🔧 Poor: ${summary.qualityDistribution.poor} languages`);

  // Final assessment
  console.log('\n🏆 FINAL ASSESSMENT:');
  const overallScore = (summary.validFiles / summary.totalFiles) * 100;
  const excellentRatio = (summary.qualityDistribution.excellent / summary.totalLanguages) * 100;

  if (overallScore >= 95 && excellentRatio >= 60) {
    console.log('🎉 EXCELLENT - Translation system is production-ready!');
  } else if (overallScore >= 90 && excellentRatio >= 40) {
    console.log('👍 GOOD - Translation system is functional with minor improvements needed');
  } else if (overallScore >= 80) {
    console.log('⚠️ FAIR - Translation system needs significant improvements');
  } else {
    console.log('🔧 NEEDS MAJOR WORK - Translation system requires substantial updates');
  }

  // Save quick report
  const quickReport = {
    timestamp: new Date().toISOString(),
    summary,
    overallScore: Math.round(overallScore),
    excellentRatio: Math.round(excellentRatio),
    totalLanguagesSupported: Object.keys(languageConfig).length,
    languagesProcessed: summary.totalLanguages
  };

  try {
    fs.writeFileSync('quick-translation-report.json', JSON.stringify(quickReport, null, 2));
    console.log('\n📋 Quick report saved: quick-translation-report.json');
  } catch (error) {
    console.warn(`⚠️ Could not save report: ${error.message}`);
  }

  return summary;
}

// Execute validation
if (require.main === module) {
  quickValidation().catch(error => {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  });
}

module.exports = { quickValidation };
