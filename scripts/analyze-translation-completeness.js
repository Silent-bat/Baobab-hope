const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const referenceNamespaces = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'];

function analyzeTranslationCompleteness() {
  const languages = fs.readdirSync(localesDir).filter(item => {
    const itemPath = path.join(localesDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  console.log('📊 Analyse de la complétude des traductions\n');
  console.log('='.repeat(60));

  const results = [];

  languages.forEach(lang => {
    const langPath = path.join(localesDir, lang);
    const files = fs.readdirSync(langPath).filter(file => file.endsWith('.json'));

    const missingFiles = referenceNamespaces.filter(ns => !files.includes(`${ns}.json`));
    const hasAllFiles = missingFiles.length === 0;

    results.push({
      language: lang,
      totalFiles: files.length,
      missingFiles,
      isComplete: hasAllFiles
    });

    console.log(`${lang.padEnd(8)} | ${files.length.toString().padStart(2)}/7 fichiers | ${hasAllFiles ? '✅ Complet' : '❌ Incomplet'}`);
    if (missingFiles.length > 0) {
      console.log(`         | Fichiers manquants: ${missingFiles.join(', ')}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`📈 Résumé:`);
  console.log(`   - Total des langues: ${languages.length}`);
  console.log(`   - Langues complètes: ${results.filter(r => r.isComplete).length}`);
  console.log(`   - Langues incomplètes: ${results.filter(r => !r.isComplete).length}`);

  return results;
}

if (require.main === module) {
  analyzeTranslationCompleteness();
}

module.exports = { analyzeTranslationCompleteness };