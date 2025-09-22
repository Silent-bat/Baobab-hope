const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const referenceLanguage = 'en';
const namespaces = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'];

function countKeys(obj, prefix = '') {
  let count = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += countKeys(obj[key], fullKey);
      } else {
        count++;
      }
    }
  }
  return count;
}

function analyzeTranslationContent() {
  console.log('🔍 Analyse approfondie du contenu des traductions\n');
  console.log('='.repeat(80));

  // Charger les traductions anglaises comme référence
  const referenceTranslations = {};
  namespaces.forEach(ns => {
    const filePath = path.join(localesDir, referenceLanguage, `${ns}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      referenceTranslations[ns] = JSON.parse(content);
    }
  });

  const referenceKeyCounts = {};
  namespaces.forEach(ns => {
    if (referenceTranslations[ns]) {
      referenceKeyCounts[ns] = countKeys(referenceTranslations[ns]);
    }
  });

  console.log('📊 Clés de référence par namespace:');
  Object.entries(referenceKeyCounts).forEach(([ns, count]) => {
    console.log(`   ${ns.padEnd(10)}: ${count} clés`);
  });

  // Analyser chaque langue
  const languages = fs.readdirSync(localesDir).filter(item => {
    const itemPath = path.join(localesDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== referenceLanguage;
  });

  const results = [];

  languages.forEach(lang => {
    console.log(`\n🌍 Analyse de ${lang.toUpperCase()}:`);
    console.log('-'.repeat(40));

    const langTranslations = {};
    const missingFiles = [];
    const incompleteFiles = [];

    namespaces.forEach(ns => {
      const filePath = path.join(localesDir, lang, `${ns}.json`);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(ns);
      } else {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          langTranslations[ns] = data;

          const keyCount = countKeys(data);
          const referenceCount = referenceKeyCounts[ns] || 0;

          if (keyCount !== referenceCount) {
            incompleteFiles.push(`${ns} (${keyCount}/${referenceCount})`);
          }
        } catch (error) {
          incompleteFiles.push(`${ns} (erreur de parsing)`);
        }
      }
    });

    const totalFiles = namespaces.length;
    const presentFiles = totalFiles - missingFiles.length;
    const completeFiles = presentFiles - incompleteFiles.length;

    results.push({
      language: lang,
      totalFiles,
      presentFiles,
      completeFiles,
      missingFiles,
      incompleteFiles,
      completeness: Math.round((completeFiles / totalFiles) * 100)
    });

    console.log(`   Fichiers présents: ${presentFiles}/${totalFiles}`);
    console.log(`   Fichiers complets: ${completeFiles}/${totalFiles}`);
    console.log(`   Complétude: ${Math.round((completeFiles / totalFiles) * 100)}%`);

    if (missingFiles.length > 0) {
      console.log(`   ❌ Fichiers manquants: ${missingFiles.join(', ')}`);
    }

    if (incompleteFiles.length > 0) {
      console.log(`   ⚠️  Fichiers incomplets: ${incompleteFiles.join(', ')}`);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('📈 Résumé global:');
  console.log(`   - Langues analysées: ${languages.length}`);
  console.log(`   - Langues 100% complètes: ${results.filter(r => r.completeness === 100).length}`);
  console.log(`   - Langues partielles: ${results.filter(r => r.completeness > 0 && r.completeness < 100).length}`);
  console.log(`   - Langues vides: ${results.filter(r => r.completeness === 0).length}`);

  console.log('\n📋 Détail par langue:');
  results.sort((a, b) => b.completeness - a.completeness).forEach(result => {
    const status = result.completeness === 100 ? '✅' : result.completeness === 0 ? '❌' : '⚠️';
    console.log(`   ${status} ${result.language.padEnd(8)}: ${result.completeness}% complet`);
  });

  return results;
}

if (require.main === module) {
  analyzeTranslationContent();
}

module.exports = { analyzeTranslationContent };