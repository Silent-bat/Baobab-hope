const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

// Nouvelles langues à ajouter avec leurs noms natifs
const newLanguages = [
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ha', name: 'Hausa', nativeName: 'هَوُسَ' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' }
];

// Fonction pour copier les fichiers de traduction anglaise vers une nouvelle langue
function generateLanguageFiles(langCode) {
  const sourceDir = path.join(localesDir, 'en');
  const targetDir = path.join(localesDir, langCode);

  // Créer le dossier de la langue
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Créé le dossier: ${targetDir}`);
  }

  // Copier tous les fichiers JSON de l'anglais
  const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

  files.forEach(file => {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);

    // Lire le contenu du fichier source
    const content = fs.readFileSync(sourceFile, 'utf8');
    const data = JSON.parse(content);

    // Mettre à jour les métadonnées pour la nouvelle langue
    data.language = langCode;
    data.lastUpdated = new Date().toISOString();

    // Écrire le fichier dans la nouvelle langue
    fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Copié: ${file} -> ${langCode}/${file}`);
  });

  return files.length;
}

// Fonction principale
function generateAllNewLanguages() {
  console.log('🚀 Génération de 20 nouvelles langues...\n');
  console.log('='.repeat(60));

  let totalFiles = 0;
  const results = [];

  newLanguages.forEach((lang, index) => {
    console.log(`\n🌍 ${index + 1}/${newLanguages.length} - ${lang.name} (${lang.nativeName})`);
    console.log(`   Code: ${lang.code}`);

    try {
      const filesCount = generateLanguageFiles(lang.code);
      totalFiles += filesCount;
      results.push({
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        files: filesCount,
        success: true
      });
    } catch (error) {
      console.error(`❌ Erreur pour ${lang.code}:`, error.message);
      results.push({
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        success: false,
        error: error.message
      });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('📊 Résumé de la génération:');
  console.log(`   - Langues traitées: ${results.length}`);
  console.log(`   - Succès: ${results.filter(r => r.success).length}`);
  console.log(`   - Échecs: ${results.filter(r => !r.success).length}`);
  console.log(`   - Fichiers créés: ${totalFiles}`);

  if (results.filter(r => !r.success).length > 0) {
    console.log('\n❌ Langues en échec:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.code}: ${r.error}`);
    });
  }

  return results;
}

// Exécuter si appelé directement
if (require.main === module) {
  generateAllNewLanguages();
}

module.exports = { generateAllNewLanguages, generateLanguageFiles };