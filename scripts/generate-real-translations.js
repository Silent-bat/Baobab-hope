const fs = require('fs');
const path = require('path');
const { translationDictionaries } = require('./translation-dictionaries');

const localesDir = path.join(__dirname, '../public/locales');
const referenceLanguage = 'en';
const namespaces = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'];

// Fonction pour remplacer récursivement les traductions
function replaceTranslations(obj, translations, path = '') {
  const result = { ...obj };

  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
        // Objet imbriqué - traiter récursivement
        result[key] = replaceTranslations(result[key], translations, currentPath);
      } else if (typeof result[key] === 'string') {
        // Chaîne de caractères - essayer de traduire
        const translated = translations[result[key]];
        if (translated) {
          result[key] = translated;
        }
      }
    }
  }

  return result;
}

// Fonction pour traiter une langue spécifique
async function processLanguage(langCode) {
  console.log(`🌍 Traitement de ${langCode.toUpperCase()}...`);

  const langDir = path.join(localesDir, langCode);
  if (!fs.existsSync(langDir)) {
    console.log(`   ❌ Dossier ${langCode} n'existe pas`);
    return false;
  }

  const dictionary = translationDictionaries[langCode];
  if (!dictionary) {
    console.log(`   ⚠️  Aucun dictionnaire trouvé pour ${langCode}`);
    return false;
  }

  let filesProcessed = 0;
  let translationsReplaced = 0;

  for (const namespace of namespaces) {
    const filePath = path.join(langDir, `${namespace}.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  Fichier manquant: ${namespace}.json`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // Sauvegarder l'original pour comparaison
      const originalData = JSON.stringify(data);

      // Remplacer les traductions dans le namespace 'common' si disponible
      if (namespace === 'common' && dictionary.common) {
        const newData = replaceTranslations(data, dictionary.common);
        const newContent = JSON.stringify(newData, null, 2);

        if (originalData !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          translationsReplaced++;
          console.log(`   ✅ ${namespace}.json - ${Object.keys(dictionary.common).length} traductions remplacées`);
        } else {
          console.log(`   ✓ ${namespace}.json - Aucune traduction à remplacer`);
        }
      } else {
        console.log(`   - ${namespace}.json - Pas de traductions disponibles pour ce namespace`);
      }

      filesProcessed++;

    } catch (error) {
      console.log(`   ❌ Erreur dans ${namespace}.json: ${error.message}`);
    }
  }

  console.log(`   📊 ${filesProcessed} fichiers traités, ${translationsReplaced} avec traductions remplacées`);
  return filesProcessed > 0;
}

// Fonction pour traiter toutes les nouvelles langues
async function processAllLanguages() {
  console.log('🚀 Génération de traductions réelles pour toutes les langues...\n');
  console.log('='.repeat(70));

  const newLanguages = Object.keys(translationDictionaries);
  const results = [];

  for (const lang of newLanguages) {
    const success = await processLanguage(lang);
    results.push({
      language: lang,
      success,
      dictionary: translationDictionaries[lang].name
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 Résumé de la génération:');
  console.log(`   - Langues traitées: ${results.length}`);
  console.log(`   - Succès: ${results.filter(r => r.success).length}`);
  console.log(`   - Échecs: ${results.filter(r => !r.success).length}`);

  console.log('\n📋 Détail par langue:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`   ${status} ${result.language.toUpperCase().padEnd(3)} - ${result.dictionary}`);
  });

  return results;
}

// Fonction pour vérifier les traductions générées
function verifyTranslations() {
  console.log('\n🔍 Vérification des traductions générées...\n');

  const newLanguages = Object.keys(translationDictionaries);
  let totalFiles = 0;
  let filesWithTranslations = 0;

  newLanguages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const dictionary = translationDictionaries[lang];

    if (!fs.existsSync(langDir)) {
      console.log(`   ❌ ${lang.toUpperCase()}: Dossier manquant`);
      return;
    }

    console.log(`   🌍 ${lang.toUpperCase()} (${dictionary.name}):`);

    namespaces.forEach(namespace => {
      const filePath = path.join(langDir, `${namespace}.json`);

      if (fs.existsSync(filePath)) {
        totalFiles++;

        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);

          // Vérifier si des traductions ont été appliquées
          let hasTranslations = false;
          const translations = dictionary[namespace] || dictionary.common || {};

          function checkForTranslations(obj) {
            for (const key in obj) {
              if (typeof obj[key] === 'string' && translations[obj[key]]) {
                hasTranslations = true;
                return;
              }
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                checkForTranslations(obj[key]);
              }
            }
          }

          checkForTranslations(data);

          if (hasTranslations) {
            filesWithTranslations++;
            console.log(`      ✅ ${namespace}.json - Traductions appliquées`);
          } else {
            console.log(`      ⚠️  ${namespace}.json - Aucune traduction trouvée`);
          }

        } catch (error) {
          console.log(`      ❌ ${namespace}.json - Erreur: ${error.message}`);
        }
      } else {
        console.log(`      ❌ ${namespace}.json - Fichier manquant`);
      }
    });
  });

  console.log(`\n📈 Résultat: ${filesWithTranslations}/${totalFiles} fichiers avec traductions`);
  return filesWithTranslations > 0;
}

// Exécuter si appelé directement
if (require.main === module) {
  processAllLanguages()
    .then(() => {
      verifyTranslations();
    })
    .catch(error => {
      console.error('Erreur lors de la génération:', error);
      process.exit(1);
    });
}

module.exports = { processAllLanguages, processLanguage, verifyTranslations };