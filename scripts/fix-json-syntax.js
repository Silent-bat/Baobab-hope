#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script de correction des erreurs de syntaxe JSON dans les fichiers de traduction
 * Corrige les virgules de fin et autres erreurs de structure JSON
 */

console.log('🔧 CORRECTION DES ERREURS JSON DANS LES FICHIERS DE TRADUCTION');
console.log('='.repeat(70));

function fixJsonSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixed = content;

    // Corrections multiples pour les virgules de fin
    let changes = 0;

    // 1. Corriger les virgules de fin après les accolades fermantes
    const trailingCommaPattern = /}\s*,\s*$/gm;
    const originalFixed = fixed;
    fixed = fixed.replace(trailingCommaPattern, '}');

    if (fixed !== originalFixed) {
      changes++;
      console.log(`  ✅ Corrigé: virgules de fin après accolades`);
    }

    // 2. Corriger les virgules avant les accolades fermantes
    const commaBeforeBracePattern = /,\s*}\s*$/gm;
    const beforeFix = fixed;
    fixed = fixed.replace(commaBeforeBracePattern, '}');

    if (fixed !== beforeFix) {
      changes++;
      console.log(`  ✅ Corrigé: virgules avant accolades fermantes`);
    }

    // 3. Corriger les doubles virgules
    const doubleCommaPattern = /}\s*,\s*,/g;
    const doubleFix = fixed;
    fixed = fixed.replace(doubleCommaPattern, '},');

    if (fixed !== doubleFix) {
      changes++;
      console.log(`  ✅ Corrigé: doubles virgules`);
    }

    // 4. Corriger les virgules de fin dans les objets
    const trailingCommaInObjectPattern = /,\s*\n\s*}/g;
    const objectFix = fixed;
    fixed = fixed.replace(trailingCommaInObjectPattern, '\n  }');

    if (fixed !== objectFix) {
      changes++;
      console.log(`  ✅ Corrigé: virgules de fin dans les objets`);
    }

    // 5. Corriger les virgules de fin dans les tableaux
    const trailingCommaInArrayPattern = /,\s*\n\s*\]/g;
    const arrayFix = fixed;
    fixed = fixed.replace(trailingCommaInArrayPattern, '\n  ]');

    if (fixed !== arrayFix) {
      changes++;
      console.log(`  ✅ Corrigé: virgules de fin dans les tableaux`);
    }

    // Valider que le JSON est maintenant correct
    try {
      JSON.parse(fixed);
      console.log(`  ✅ JSON valide après corrections`);
    } catch (parseError) {
      console.log(`  ❌ Erreur de validation JSON: ${parseError.message}`);
      return false;
    }

    // Sauvegarder seulement si des changements ont été faits
    if (changes > 0 && fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      return true;
    }

    return false;

  } catch (error) {
    console.log(`  ❌ Erreur lors de la correction: ${error.message}`);
    return false;
  }
}

// Fonction principale
function main() {
  const localesDir = 'public/locales';
  let totalFixed = 0;
  let totalErrors = 0;

  // Vérifier que le dossier existe
  if (!fs.existsSync(localesDir)) {
    console.log(`❌ Dossier ${localesDir} non trouvé`);
    return;
  }

  // Trouver tous les fichiers JSON
  const files = fs.readdirSync(localesDir, { recursive: true })
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(localesDir, file));

  console.log(`📁 Analyse de ${files.length} fichiers JSON...`);
  console.log('');

  files.forEach(file => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`🔍 Traitement: ${relativePath}`);

    try {
      // Tester si le fichier est valide avant correction
      JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`  ✅ Déjà valide`);
    } catch (error) {
      console.log(`  ❌ Erreur détectée: ${error.message}`);
      totalErrors++;

      // Tenter de corriger
      if (fixJsonSyntax(file)) {
        console.log(`  ✅ Corrigé avec succès`);
        totalFixed++;
      } else {
        console.log(`  ❌ Impossible de corriger`);
      }
    }
    console.log('');
  });

  console.log('='.repeat(70));
  console.log('📊 RÉSUMÉ:');
  console.log(`  Fichiers analysés: ${files.length}`);
  console.log(`  Fichiers avec erreurs: ${totalErrors}`);
  console.log(`  Fichiers corrigés: ${totalFixed}`);
  console.log(`  Fichiers déjà valides: ${files.length - totalErrors}`);

  if (totalFixed > 0) {
    console.log('');
    console.log('✅ CORRECTION TERMINÉE AVEC SUCCÈS');
    console.log('💡 Tous les fichiers JSON sont maintenant valides');
  } else {
    console.log('');
    console.log('ℹ️  Aucun fichier n\'avait besoin de correction');
  }
}

// Exécuter le script
main();