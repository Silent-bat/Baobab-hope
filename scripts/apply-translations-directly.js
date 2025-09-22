const fs = require('fs');
const path = require('path');
const { translationDictionaries } = require('./translation-dictionaries');

const localesDir = path.join(__dirname, '../public/locales');

// Fonction pour appliquer directement les traductions
function applyTranslationsDirectly(langCode) {
  console.log(`🔄 Application directe des traductions pour ${langCode.toUpperCase()}...`);

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
  let translationsApplied = 0;

  // Charger le fichier common.json de référence pour voir la structure
  const refFilePath = path.join(localesDir, 'en', 'common.json');
  if (!fs.existsSync(refFilePath)) {
    console.log(`   ❌ Fichier de référence manquant`);
    return false;
  }

  try {
    const refContent = fs.readFileSync(refFilePath, 'utf8');
    const refData = JSON.parse(refContent);

    // Appliquer les traductions disponibles
    const translations = dictionary.common || {};

    function replaceInObject(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            replaceInObject(obj[key]);
          } else if (typeof obj[key] === 'string') {
            // Chercher une correspondance exacte
            if (translations[obj[key]]) {
              obj[key] = translations[obj[key]];
            }
          }
        }
      }
    }

    // Créer une copie avec les traductions appliquées
    const translatedData = JSON.parse(JSON.stringify(refData));
    replaceInObject(translatedData);

    // Mettre à jour les métadonnées
    translatedData.language = langCode;
    translatedData.lastUpdated = new Date().toISOString();

    // Écrire le fichier traduit
    const targetFilePath = path.join(langDir, 'common.json');
    fs.writeFileSync(targetFilePath, JSON.stringify(translatedData, null, 2), 'utf8');

    // Compter les traductions appliquées
    let appliedCount = 0;
    function countApplied(obj, originalObj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            countApplied(obj[key], originalObj[key]);
          } else if (typeof obj[key] === 'string' && originalObj[key] !== obj[key]) {
            appliedCount++;
          }
        }
      }
    }
    countApplied(translatedData, refData);

    filesProcessed++;
    translationsApplied += appliedCount;

    console.log(`   ✅ common.json - ${appliedCount} traductions appliquées`);

  } catch (error) {
    console.log(`   ❌ Erreur lors de l'application: ${error.message}`);
    return false;
  }

  console.log(`   📊 ${filesProcessed} fichier traité, ${translationsApplied} traductions appliquées`);
  return translationsApplied > 0;
}

// Fonction pour traiter toutes les langues
async function applyAllTranslations() {
  console.log('🚀 Application directe des traductions pour toutes les langues...\n');
  console.log('='.repeat(70));

  const newLanguages = Object.keys(translationDictionaries);
  const results = [];

  for (const lang of newLanguages) {
    const success = applyTranslationsDirectly(lang);
    results.push({
      language: lang,
      success,
      dictionary: translationDictionaries[lang].name
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 Résumé de l\'application:');
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

// Fonction pour vérifier les résultats
function verifyResults() {
  console.log('\n🔍 Vérification des résultats...\n');

  const newLanguages = Object.keys(translationDictionaries);
  let totalTranslations = 0;

  newLanguages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const dictionary = translationDictionaries[lang];

    if (!fs.existsSync(langDir)) {
      console.log(`   ❌ ${lang.toUpperCase()}: Dossier manquant`);
      return;
    }

    console.log(`   🌍 ${lang.toUpperCase()} (${dictionary.name}):`);

    const filePath = path.join(langDir, 'common.json');
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        let foundTranslations = 0;
        const translations = dictionary.common || {};

        function checkTranslations(obj) {
          for (const key in obj) {
            if (typeof obj[key] === 'string' && translations[obj[key]]) {
              foundTranslations++;
            }
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              checkTranslations(obj[key]);
            }
          }
        }

        checkTranslations(data);

        if (foundTranslations > 0) {
          console.log(`      ✅ common.json - ${foundTranslations} traductions trouvées`);
          totalTranslations += foundTranslations;
        } else {
          console.log(`      ⚠️  common.json - Aucune traduction trouvée`);
        }

      } catch (error) {
        console.log(`      ❌ common.json - Erreur: ${error.message}`);
      }
    } else {
      console.log(`      ❌ common.json - Fichier manquant`);
    }
  });

  console.log(`\n📈 Total des traductions appliquées: ${totalTranslations}`);
  return totalTranslations > 0;
}

// Exécuter si appelé directement
if (require.main === module) {
  applyAllTranslations()
    .then(() => {
      return verifyResults();
    })
    .then(success => {
      if (success) {
        console.log('\n🎉 Traductions appliquées avec succès !');
      } else {
        console.log('\n⚠️  Aucune traduction n\'a été appliquée.');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'application:', error);
      process.exit(1);
    });
}

module.exports = { applyAllTranslations, applyTranslationsDirectly, verifyResults };