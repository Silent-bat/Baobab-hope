const fs = require('fs');
const path = require('path');

function fixJsonComprehensively(filePath) {
  console.log(`🔧 CORRECTION COMPLÈTE JSON: ${filePath}`);
  console.log('='.repeat(50));

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    console.log(`📄 Taille originale: ${content.length} caractères`);

    // Corrections multiples en une seule passe
    let corrections = 0;

    // 1. Corriger les virgules finales après objets
    const regex1 = /}\s*,\s*\n\s*([}\]])/g;
    content = content.replace(regex1, '}\n$1');
    corrections += (content.match(regex1) || []).length;

    // 2. Corriger les virgules finales avant fermeture d'objet
    const regex2 = /,\s*\n\s*}/g;
    content = content.replace(regex2, '\n}');
    corrections += (content.match(regex2) || []).length;

    // 3. Corriger les doubles accolades
    const regex3 = /\{\s*\{/g;
    content = content.replace(regex3, '{');
    corrections += (content.match(regex3) || []).length;

    // 4. Corriger les virgules isolées
    const regex4 = /^\s*,\s*$/gm;
    content = content.replace(regex4, '');
    corrections += (content.match(regex4) || []).length;

    // 5. Corriger les virgules finales en fin de ligne
    const regex5 = /,\s*$/gm;
    content = content.replace(regex5, '');
    corrections += (content.match(regex5) || []).length;

    console.log(`✅ Corrections appliquées: ${corrections}`);

    // Vérifier si le contenu a changé
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`💾 Fichier sauvegardé avec corrections`);
    } else {
      console.log(`ℹ️  Aucune correction nécessaire`);
    }

    // Valider le JSON corrigé
    try {
      JSON.parse(content);
      console.log(`✅ JSON maintenant valide`);
      return true;
    } catch (e) {
      console.log(`❌ JSON toujours invalide: ${e.message}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ ERREUR: ${error.message}`);
    return false;
  }
}

// Corriger le fichier problématique
const filePath = 'public/locales/ig/forms.json';
const success = fixJsonComprehensively(filePath);

if (success) {
  console.log(`\n🎉 CORRECTION RÉUSSIE!`);
} else {
  console.log(`\n⚠️  CORRECTION PARTIELLE - Vérification manuelle recommandée`);
}