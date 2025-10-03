const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const LOCALES_DIR = 'public/locales';
const SOURCE_DIR = 'app';
const TRANSLATION_FUNCTIONS = ['t(', 'useTranslation', 't\\(', '__\\('];

// Fonction pour extraire les clés de traduction d'un fichier
function extractTranslationKeys(filePath) {
  const keys = new Set();

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Chercher les appels à t() et __()
    const tMatches = content.match(/t\(['"`]([^'"`]+)['"`]/g) || [];
    const underscoreMatches = content.match(/__\(['"`]([^'"`]+)['"`]/g) || [];

    [...tMatches, ...underscoreMatches].forEach(match => {
      const key = match.match(/['"`]([^'"`]+)['"`]/)[1];
      keys.add(key);
    });

    // Chercher les clés dans les objets de traduction
    const objectMatches = content.match(/['"`]([a-zA-Z_][a-zA-Z0-9_.]*)['"`]\s*:/g) || [];
    objectMatches.forEach(match => {
      const key = match.match(/['"`]([a-zA-Z_][a-zA-Z0-9_.]*)['"`]/)[1];
      if (key.length > 2 && !key.includes(' ')) { // Filtrer les clés courtes et invalides
        keys.add(key);
      }
    });

  } catch (error) {
    console.log(`Erreur lors de la lecture de ${filePath}: ${error.message}`);
  }

  return Array.from(keys);
}

// Fonction pour analyser récursivement un répertoire
function analyzeDirectory(dirPath, fileExtensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const allKeys = new Set();

  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(itemPath);
      } else if (stat.isFile() && fileExtensions.some(ext => item.endsWith(ext))) {
        const keys = extractTranslationKeys(itemPath);
        keys.forEach(key => allKeys.add(key));
      }
    }
  }

  scanDirectory(dirPath);
  return Array.from(allKeys).sort();
}

// Fonction pour analyser les fichiers de traduction existants
function analyzeTranslationFiles() {
  const translationData = {};

  if (!fs.existsSync(LOCALES_DIR)) {
    console.log(`Dossier ${LOCALES_DIR} non trouvé`);
    return translationData;
  }

  const languages = fs.readdirSync(LOCALES_DIR).filter(item => {
    const itemPath = path.join(LOCALES_DIR, item);
    return fs.statSync(itemPath).isDirectory();
  });

  for (const lang of languages) {
    const langPath = path.join(LOCALES_DIR, lang);
    translationData[lang] = {};

    const files = fs.readdirSync(langPath).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(langPath, file);
      const fileName = file.replace('.json', '');

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        translationData[lang][fileName] = data;
      } catch (error) {
        console.log(`Erreur lors de la lecture de ${filePath}: ${error.message}`);
      }
    }
  }

  return translationData;
}

// Fonction pour extraire toutes les clés d'un objet de traduction
function extractKeysFromObject(obj, prefix = '') {
  const keys = new Set();

  function traverse(currentObj, currentPrefix) {
    for (const [key, value] of Object.entries(currentObj)) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        traverse(value, fullKey);
      } else {
        keys.add(fullKey);
      }
    }
  }

  traverse(obj, prefix);
  return Array.from(keys);
}

// Fonction principale
function main() {
  console.log('🔍 ANALYSE DES TRADUCTIONS MANQUANTES');
  console.log('='.repeat(50));

  // 1. Analyser les clés utilisées dans le code source
  console.log('📝 Analyse des clés dans le code source...');
  const sourceKeys = analyzeDirectory(SOURCE_DIR);
  console.log(`✅ Trouvé ${sourceKeys.length} clés dans le code source`);

  // 2. Analyser les fichiers de traduction existants
  console.log('📚 Analyse des fichiers de traduction...');
  const translationData = analyzeTranslationFiles();
  const availableLanguages = Object.keys(translationData);
  console.log(`✅ Trouvé ${availableLanguages.length} langues: ${availableLanguages.join(', ')}`);

  // 3. Analyser les clés disponibles pour chaque langue
  const translationKeys = {};
  for (const [lang, files] of Object.entries(translationData)) {
    translationKeys[lang] = new Set();

    for (const [fileName, data] of Object.entries(files)) {
      const keys = extractKeysFromObject(data);
      keys.forEach(key => translationKeys[lang].add(key));
    }
  }

  // 4. Identifier les clés manquantes pour chaque langue
  console.log('\n🔎 ANALYSE DES CLÉS MANQUANTES');
  console.log('='.repeat(50));

  const missingKeysReport = {};

  for (const lang of availableLanguages) {
    const existingKeys = translationKeys[lang];
    const missingKeys = sourceKeys.filter(key => !existingKeys.has(key));

    missingKeysReport[lang] = {
      totalSourceKeys: sourceKeys.length,
      existingKeys: existingKeys.size,
      missingKeys: missingKeys.length,
      missingKeysList: missingKeys.slice(0, 20) // Limiter l'affichage
    };

    console.log(`\n🌐 ${lang.toUpperCase()}:`);
    console.log(`   📊 Total clés source: ${sourceKeys.length}`);
    console.log(`   ✅ Clés existantes: ${existingKeys.size}`);
    console.log(`   ❌ Clés manquantes: ${missingKeys.length}`);

    if (missingKeys.length > 0) {
      console.log(`   📝 Exemples de clés manquantes:`);
      missingKeys.slice(0, 10).forEach(key => {
        console.log(`      - ${key}`);
      });

      if (missingKeys.length > 10) {
        console.log(`      ... et ${missingKeys.length - 10} autres`);
      }
    }
  }

  // 5. Générer un rapport détaillé
  console.log('\n📋 RAPPORT DÉTAILLÉ');
  console.log('='.repeat(50));

  const enKeys = translationKeys['en'] || new Set();
  const enMissingKeys = sourceKeys.filter(key => !enKeys.has(key));

  if (enMissingKeys.length > 0) {
    console.log(`\n🇺🇸 ANGLAIS - Clés manquantes (${enMissingKeys.length}):`);
    enMissingKeys.forEach(key => {
      console.log(`   - ${key}`);
    });
  } else {
    console.log('\n✅ Anglais: Toutes les clés sont présentes');
  }

  // 6. Générer des suggestions pour les autres langues
  console.log('\n🔄 SUGGESTIONS POUR LES AUTRES LANGUES');
  console.log('='.repeat(50));

  for (const lang of availableLanguages) {
    if (lang === 'en') continue;

    const langMissingKeys = sourceKeys.filter(key => !translationKeys[lang].has(key));
    const completionRate = ((sourceKeys.length - langMissingKeys.length) / sourceKeys.length * 100).toFixed(1);

    console.log(`\n🌐 ${lang.toUpperCase()}:`);
    console.log(`   📊 Taux de complétion: ${completionRate}%`);
    console.log(`   ❌ Clés manquantes: ${langMissingKeys.length}`);

    if (langMissingKeys.length > 0 && langMissingKeys.length <= 5) {
      console.log(`   📝 Clés à ajouter:`);
      langMissingKeys.forEach(key => {
        console.log(`      - ${key}`);
      });
    }
  }

  // 7. Sauvegarder le rapport
  const reportPath = 'translation-analysis-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    sourceKeys: sourceKeys,
    availableLanguages: availableLanguages,
    missingKeysReport: missingKeysReport,
    summary: {
      totalSourceKeys: sourceKeys.length,
      languagesAnalyzed: availableLanguages.length,
      mostCompleteLanguage: availableLanguages.reduce((best, lang) => {
        const currentCompletion = ((sourceKeys.length - missingKeysReport[lang].missingKeys) / sourceKeys.length * 100);
        const bestCompletion = ((sourceKeys.length - missingKeysReport[best].missingKeys) / sourceKeys.length * 100);
        return currentCompletion > bestCompletion ? lang : best;
      }, availableLanguages[0])
    }
  }, null, 2));

  console.log(`\n💾 Rapport sauvegardé dans: ${reportPath}`);

  return {
    sourceKeys,
    translationData,
    missingKeysReport
  };
}

// Exécuter l'analyse
if (require.main === module) {
  main();
}

module.exports = {
  extractTranslationKeys,
  analyzeDirectory,
  analyzeTranslationFiles,
  extractKeysFromObject,
  main
};