const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// Nouvelles langues ajoutées
const newLanguages = [
  'sw', 'am', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'th', 'vi',
  'tl', 'ms', 'id', 'cs', 'sk', 'hu', 'fi', 'et', 'lv', 'lt'
];

const namespaces = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'];

async function testNewLanguages() {
  console.log('🧪 Test d\'intégration des nouvelles langues...\n');
  console.log('='.repeat(60));

  const results = [];
  let totalTests = 0;
  let passedTests = 0;

  for (const lang of newLanguages) {
    console.log(`\n🌍 Test de ${lang.toUpperCase()}:`);
    console.log('-'.repeat(40));

    const langResults = {
      language: lang,
      totalFiles: 0,
      existingFiles: 0,
      validFiles: 0,
      errors: []
    };

    for (const namespace of namespaces) {
      totalTests++;
      langResults.totalFiles++;

      const filePath = path.join(localesDir, lang, `${namespace}.json`);

      if (fs.existsSync(filePath)) {
        langResults.existingFiles++;

        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);

          // Vérifications de base
          if (data.language === lang) {
            langResults.validFiles++;
            passedTests++;
            console.log(`   ✅ ${namespace}.json - Langue: ${data.language}`);
          } else {
            langResults.errors.push(`${namespace}: langue incorrecte (${data.language})`);
            console.log(`   ❌ ${namespace}.json - Langue incorrecte: ${data.language}`);
          }

          // Vérifier les métadonnées
          if (!data.version) {
            langResults.errors.push(`${namespace}: version manquante`);
          }
          if (!data.lastUpdated) {
            langResults.errors.push(`${namespace}: date de mise à jour manquante`);
          }

        } catch (error) {
          langResults.errors.push(`${namespace}: erreur de parsing JSON - ${error.message}`);
          console.log(`   ❌ ${namespace}.json - Erreur JSON: ${error.message}`);
        }
      } else {
        langResults.errors.push(`${namespace}: fichier manquant`);
        console.log(`   ❌ ${namespace}.json - Fichier manquant`);
      }
    }

    // Résumé pour cette langue
    const successRate = Math.round((langResults.validFiles / langResults.totalFiles) * 100);
    console.log(`   📊 Résultat: ${langResults.validFiles}/${langResults.totalFiles} fichiers valides (${successRate}%)`);

    if (langResults.errors.length > 0) {
      console.log(`   ⚠️  Erreurs: ${langResults.errors.length}`);
    }

    results.push(langResults);
  }

  // Résumé global
  console.log('\n' + '='.repeat(60));
  console.log('📈 Résumé global des tests:');
  console.log(`   - Langues testées: ${newLanguages.length}`);
  console.log(`   - Tests totaux: ${totalTests}`);
  console.log(`   - Tests réussis: ${passedTests}`);
  console.log(`   - Taux de succès: ${Math.round((passedTests / totalTests) * 100)}%`);

  // Détail par langue
  console.log('\n📋 Détail par langue:');
  results.forEach(result => {
    const status = result.validFiles === result.totalFiles ? '✅' : '⚠️';
    const successRate = Math.round((result.validFiles / result.totalFiles) * 100);
    console.log(`   ${status} ${result.language.toUpperCase().padEnd(3)}: ${successRate}% (${result.validFiles}/${result.totalFiles})`);

    if (result.errors.length > 0) {
      console.log(`       Erreurs: ${result.errors.length}`);
    }
  });

  // Vérifier la configuration i18n
  console.log('\n🔧 Vérification de la configuration i18n...');
  try {
    const configPath = path.join(__dirname, '../lib/i18n/config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');

    const allSupportedLanguages = [];
    const langMatches = configContent.match(/'(\w{2})'/g);
    if (langMatches) {
      langMatches.forEach(match => {
        const lang = match.replace(/'/g, '');
        if (lang.length === 2 && !allSupportedLanguages.includes(lang)) {
          allSupportedLanguages.push(lang);
        }
      });
    }

    const missingInConfig = newLanguages.filter(lang => !allSupportedLanguages.includes(lang));
    const extraInConfig = allSupportedLanguages.filter(lang => !newLanguages.includes(lang) && lang !== 'en' && lang !== 'fr');

    console.log(`   - Langues dans la config: ${allSupportedLanguages.length}`);
    console.log(`   - Nouvelles langues trouvées: ${newLanguages.length}`);

    if (missingInConfig.length === 0) {
      console.log('   ✅ Toutes les nouvelles langues sont dans la configuration');
    } else {
      console.log(`   ❌ Langues manquantes dans la config: ${missingInConfig.join(', ')}`);
    }

    if (extraInConfig.length > 0) {
      console.log(`   ℹ️  Langues supplémentaires dans la config: ${extraInConfig.join(', ')}`);
    }

  } catch (error) {
    console.log(`   ❌ Erreur lors de la lecture de la configuration: ${error.message}`);
  }

  // Conclusion
  const overallSuccess = passedTests === totalTests;
  console.log('\n' + '='.repeat(60));
  if (overallSuccess) {
    console.log('🎉 Tous les tests sont passés !');
    console.log('✅ L\'intégration des nouvelles langues est réussie.');
  } else {
    console.log('⚠️  Certains tests ont échoué.');
    console.log('🔧 Veuillez vérifier les erreurs ci-dessus et corriger les problèmes.');
  }

  return {
    success: overallSuccess,
    totalTests,
    passedTests,
    results
  };
}

// Exécuter les tests si appelé directement
if (require.main === module) {
  testNewLanguages().catch(error => {
    console.error('Erreur lors des tests:', error);
    process.exit(1);
  });
}

module.exports = { testNewLanguages };