const fs = require('fs');
const path = require('path');

// Fonction pour créer des traductions anglaises par défaut
function generateEnglishTranslation(key) {
  // Nettoyer la clé pour créer une traduction lisible
  const cleanKey = key
    .replace(/^\.\//, '') // Supprimer les préfixes de chemin
    .replace(/@/g, '') // Supprimer les @ pour les imports
    .replace(/^\$/, '') // Supprimer les $
    .replace(/\$\{[^}]+\}/g, '[VAR]') // Remplacer les variables par [VAR]
    .replace(/[^a-zA-Z0-9\s]/g, ' ') // Remplacer les caractères spéciaux par des espaces
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim();

  // Capitaliser la première lettre et ajouter une ponctuation si nécessaire
  if (cleanKey.length === 0) {
    return key; // Retourner la clé originale si elle est vide
  }

  let translation = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);

  // Ajouter une ponctuation si la traduction n'en a pas
  if (translation.length > 0 && !/[.!?]$/.test(translation)) {
    translation += '.';
  }

  return translation;
}

// Fonction pour ajouter les traductions manquantes à un objet
function addMissingKeysToObject(obj, missingKeys, fileName) {
  let addedCount = 0;

  for (const key of missingKeys) {
    // Diviser la clé en parties (ex: "about.hero.badge" -> ["about", "hero", "badge"])
    const keyParts = key.split('.');
    let currentObj = obj;

    // Naviguer jusqu'au bon niveau (créer les objets intermédiaires si nécessaire)
    for (let i = 0; i < keyParts.length - 1; i++) {
      const part = keyParts[i];
      if (!currentObj[part]) {
        currentObj[part] = {};
      }
      currentObj = currentObj[part];
    }

    // Ajouter la clé finale si elle n'existe pas
    const finalKey = keyParts[keyParts.length - 1];
    if (!currentObj[finalKey]) {
      currentObj[finalKey] = generateEnglishTranslation(key);
      addedCount++;
    }
  }

  return addedCount;
}

// Fonction pour sauvegarder un objet JSON formaté
function saveFormattedJSON(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
}

// Fonction principale
function addMissingTranslations() {
  console.log('🔧 AJOUT DES TRADUCTIONS MANQUANTES EN ANGLAIS');
  console.log('='.repeat(60));

  // Lire le rapport d'analyse
  const reportPath = 'translation-analysis-report.json';
  if (!fs.existsSync(reportPath)) {
    console.log('❌ Rapport d\'analyse non trouvé. Exécutez d\'abord l\'analyse.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const missingKeys = report.missingKeysReport.en.missingKeysList || [];

  console.log(`📝 ${missingKeys.length} clés manquantes à ajouter en anglais`);

  if (missingKeys.length === 0) {
    console.log('✅ Aucune clé manquante trouvée en anglais');
    return;
  }

  // Analyser les fichiers de traduction anglais existants
  const enDir = 'public/locales/en';
  if (!fs.existsSync(enDir)) {
    console.log(`❌ Dossier anglais non trouvé: ${enDir}`);
    return;
  }

  const files = fs.readdirSync(enDir).filter(file => file.endsWith('.json'));
  console.log(`📁 Fichiers trouvés: ${files.join(', ')}`);

  let totalAdded = 0;

  for (const file of files) {
    const filePath = path.join(enDir, file);
    const fileName = file.replace('.json', '');

    try {
      console.log(`\n🔄 Traitement de ${file}...`);
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      const addedCount = addMissingKeysToObject(data, missingKeys, fileName);
      totalAdded += addedCount;

      if (addedCount > 0) {
        saveFormattedJSON(filePath, data);
        console.log(`✅ Ajouté ${addedCount} traductions dans ${file}`);
      } else {
        console.log(`ℹ️  Aucune nouvelle traduction ajoutée dans ${file}`);
      }

    } catch (error) {
      console.log(`❌ Erreur lors du traitement de ${file}: ${error.message}`);
    }
  }

  console.log(`\n🎉 RÉSUMÉ:`);
  console.log(`   📊 Total des traductions ajoutées: ${totalAdded}`);
  console.log(`   📁 Fichiers modifiés: ${files.length}`);
  console.log(`   ✅ Taux de complétion: ${((report.sourceKeys.length - missingKeys.length + totalAdded) / report.sourceKeys.length * 100).toFixed(1)}%`);

  // Générer un nouveau rapport
  const newReportPath = 'translation-completion-report.json';
  const completionReport = {
    timestamp: new Date().toISOString(),
    language: 'en',
    totalSourceKeys: report.sourceKeys.length,
    previouslyMissing: missingKeys.length,
    newlyAdded: totalAdded,
    remainingMissing: missingKeys.length - totalAdded,
    completionRate: ((report.sourceKeys.length - (missingKeys.length - totalAdded)) / report.sourceKeys.length * 100).toFixed(1) + '%',
    filesModified: files,
    summary: `Ajouté ${totalAdded} traductions manquantes en anglais`
  };

  fs.writeFileSync(newReportPath, JSON.stringify(completionReport, null, 2), 'utf8');
  console.log(`💾 Rapport de complétion sauvegardé: ${newReportPath}`);

  return totalAdded;
}

// Exécuter si appelé directement
if (require.main === module) {
  addMissingTranslations();
}

module.exports = {
  addMissingTranslations,
  generateEnglishTranslation,
  addMissingKeysToObject
};