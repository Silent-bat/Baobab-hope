const fs = require('fs');
const path = require('path');

function diagnoseJsonIssues(filePath) {
  console.log(`🔍 DIAGNOSTIC JSON: ${filePath}`);
  console.log('='.repeat(50));

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Vérifier la syntaxe JSON de base
    let isValidJson = true;
    try {
      JSON.parse(content);
    } catch (e) {
      isValidJson = false;
      console.log(`❌ ERREUR JSON: ${e.message}`);
    }

    if (isValidJson) {
      console.log('✅ Syntaxe JSON de base valide');
    }

    // Analyser les problèmes spécifiques
    const lines = content.split('\n');

    console.log('\n📋 ANALYSE LIGNE PAR LIGNE:');
    console.log('-'.repeat(30));

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Détecter les virgules problématiques
      if (trimmed === ',' && lineNum === 109) {
        console.log(`⚠️  Ligne ${lineNum}: Virgule isolée détectée`);
      }

      // Détecter les accolades doubles
      if (trimmed === '{{') {
        console.log(`⚠️  Ligne ${lineNum}: Doubles accolades détectées`);
      }

      // Détecter les virgules finales problématiques
      if (trimmed.endsWith(',}') || trimmed.endsWith(',]')) {
        console.log(`⚠️  Ligne ${lineNum}: Virgule avant fermeture détectée`);
      }

      // Vérifier les lignes autour de 109
      if (lineNum >= 105 && lineNum <= 115) {
        console.log(`📄 Ligne ${lineNum}: ${line.trim()}`);
      }
    });

    // Analyser la structure générale
    console.log('\n🏗️  ANALYSE STRUCTURELLE:');
    console.log('-'.repeat(30));

    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;

    console.log(`📊 Comptage des accolades: { = ${openBraces}, } = ${closeBraces}`);
    console.log(`📊 Comptage des crochets: [ = ${openBrackets}, ] = ${closeBrackets}`);

    if (openBraces !== closeBraces) {
      console.log(`❌ DÉSÉQUILIBRE: ${Math.abs(openBraces - closeBraces)} accolade(s) manquante(s)`);
    } else {
      console.log('✅ Accolades équilibrées');
    }

    // Rechercher les virgules problématiques
    const trailingCommas = content.match(/,\s*\n\s*\}/g);
    if (trailingCommas) {
      console.log(`⚠️  Virgules finales détectées: ${trailingCommas.length}`);
    }

  } catch (error) {
    console.log(`❌ ERREUR LECTURE: ${error.message}`);
  }
}

// Diagnostiquer le fichier problématique
const filePath = 'public/locales/ig/forms.json';
diagnoseJsonIssues(filePath);