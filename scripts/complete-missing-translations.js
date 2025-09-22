const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const referenceLanguage = 'en';
const namespaces = ['common', 'navigation', 'pages', 'forms', 'actions', 'misc', 'manifest'];

function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        // Ne remplacer que si la clé n'existe pas ou est vide
        if (!target[key] || target[key] === '' || target[key] === key) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
}

function completeLanguageTranslations(langCode) {
  console.log(`🔧 Complétion des traductions pour ${langCode.toUpperCase()}...`);

  const langDir = path.join(localesDir, langCode);
  if (!fs.existsSync(langDir)) {
    console.log(`   ❌ Dossier ${langCode} n'existe pas`);
    return false;
  }

  let completedFiles = 0;
  let totalFiles = 0;

  namespaces.forEach(ns => {
    const filePath = path.join(langDir, `${ns}.json`);
    const refFilePath = path.join(localesDir, referenceLanguage, `${ns}.json`);

    if (!fs.existsSync(refFilePath)) {
      console.log(`   ⚠️  Fichier de référence manquant: ${ns}.json`);
      return;
    }

    if (!fs.existsSync(filePath)) {
      // Créer le fichier manquant avec le contenu anglais
      const refContent = fs.readFileSync(refFilePath, 'utf8');
      const refData = JSON.parse(refContent);

      // Mettre à jour les métadonnées
      refData.language = langCode;
      refData.lastUpdated = new Date().toISOString();

      fs.writeFileSync(filePath, JSON.stringify(refData, null, 2), 'utf8');
      console.log(`   ✅ Créé fichier manquant: ${ns}.json`);
      completedFiles++;
    } else {
      // Compléter le fichier existant
      try {
        const currentContent = fs.readFileSync(filePath, 'utf8');
        const currentData = JSON.parse(currentContent);
        const refContent = fs.readFileSync(refFilePath, 'utf8');
        const refData = JSON.parse(refContent);

        const originalKeys = JSON.stringify(currentData);
        deepMerge(currentData, refData);

        // Mettre à jour les métadonnées
        currentData.language = langCode;
        currentData.lastUpdated = new Date().toISOString();

        // Ne réécrire que si des changements ont été faits
        if (originalKeys !== JSON.stringify(currentData)) {
          fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
          console.log(`   🔄 Complété: ${ns}.json`);
          completedFiles++;
        } else {
          console.log(`   ✓ Déjà complet: ${ns}.json`);
        }
      } catch (error) {
        console.log(`   ❌ Erreur dans ${ns}.json: ${error.message}`);
      }
    }
    totalFiles++;
  });

  console.log(`   📊 ${completedFiles}/${totalFiles} fichiers complétés`);
  return completedFiles > 0;
}

function completeAllLanguages() {
  console.log('🚀 Complétion de toutes les traductions manquantes...\n');
  console.log('='.repeat(60));

  const languages = fs.readdirSync(localesDir).filter(item => {
    const itemPath = path.join(localesDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== referenceLanguage;
  });

  const results = [];

  languages.forEach((lang, index) => {
    console.log(`\n🌍 ${index + 1}/${languages.length} - Traitement de ${lang.toUpperCase()}`);
    const success = completeLanguageTranslations(lang);
    results.push({
      language: lang,
      success,
      completed: success
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 Résumé de la complétion:');
  console.log(`   - Langues traitées: ${results.length}`);
  console.log(`   - Succès: ${results.filter(r => r.success).length}`);
  console.log(`   - Échecs: ${results.filter(r => !r.success).length}`);

  return results;
}

// Fonction pour vérifier la complétude après traitement
function verifyCompletion() {
  console.log('\n🔍 Vérification de la complétude après traitement...\n');

  const languages = fs.readdirSync(localesDir).filter(item => {
    const itemPath = path.join(localesDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== referenceLanguage;
  });

  let totalComplete = 0;

  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));

    if (files.length === namespaces.length) {
      console.log(`   ✅ ${lang.toUpperCase()}: ${files.length}/${namespaces.length} fichiers`);
      totalComplete++;
    } else {
      console.log(`   ❌ ${lang.toUpperCase()}: ${files.length}/${namespaces.length} fichiers`);
    }
  });

  console.log(`\n📈 Résultat: ${totalComplete}/${languages.length} langues maintenant complètes`);
  return totalComplete === languages.length;
}

if (require.main === module) {
  completeAllLanguages();
  verifyCompletion();
}

module.exports = { completeAllLanguages, completeLanguageTranslations, verifyCompletion };