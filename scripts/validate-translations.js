const fs = require('fs');
const path = require('path');

// Fonction pour valider la syntaxe JSON d'un fichier
function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      position: error.message.match(/position (\d+)/) ? parseInt(error.message.match(/position (\d+)/)[1]) : null
    };
  }
}

// Fonction pour analyser la structure des traductions
function analyzeTranslationStructure(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    const stats = {
      totalKeys: 0,
      nestedObjects: 0,
      arrays: 0,
      stringValues: 0,
      numberValues: 0,
      booleanValues: 0,
      nullValues: 0,
      emptyStrings: 0,
      maxDepth: 0
    };

    function analyzeObject(obj, depth = 0) {
      stats.maxDepth = Math.max(stats.maxDepth, depth);

      for (const [key, value] of Object.entries(obj)) {
        stats.totalKeys++;

        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            stats.arrays++;
          } else {
            stats.nestedObjects++;
            analyzeObject(value, depth + 1);
          }
        } else {
          if (typeof value === 'string') {
            stats.stringValues++;
            if (value.trim() === '') {
              stats.emptyStrings++;
            }
          } else if (typeof value === 'number') {
            stats.numberValues++;
          } else if (typeof value === 'boolean') {
            stats.booleanValues++;
          } else if (value === null) {
            stats.nullValues++;
          }
        }
      }
    }

    analyzeObject(data);
    return stats;

  } catch (error) {
    return { error: error.message };
  }
}

// Fonction pour comparer les structures entre l'anglais et les autres langues
function compareLanguageStructures() {
  const localesDir = 'public/locales';
  const comparison = {
    en: null,
    others: {}
  };

  if (!fs.existsSync(localesDir)) {
    return { error: 'Locales directory not found' };
  }

  const languages = fs.readdirSync(localesDir).filter(item => {
    const itemPath = path.join(localesDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  console.log(`🔍 Analyse de ${languages.length} langues trouvées`);

  for (const lang of languages) {
    const langPath = path.join(localesDir, lang);
    const files = fs.readdirSync(langPath).filter(file => file.endsWith('.json'));

    console.log(`\n🌐 ${lang.toUpperCase()}:`);

    for (const file of files) {
      const filePath = path.join(langPath, file);
      const validation = validateJsonFile(filePath);

      if (validation.valid) {
        const structure = analyzeTranslationStructure(filePath);
        console.log(`  ✅ ${file}: ${structure.totalKeys} clés, profondeur max: ${structure.maxDepth}`);

        if (lang === 'en') {
          if (!comparison.en) comparison.en = {};
          comparison.en[file] = structure;
        } else {
          if (!comparison.others[lang]) comparison.others[lang] = {};
          comparison.others[lang][file] = structure;
        }
      } else {
        console.log(`  ❌ ${file}: ${validation.error}`);
      }
    }
  }

  return comparison;
}

// Fonction pour identifier les problèmes potentiels
function identifyPotentialIssues() {
  const issues = {
    jsonSyntaxErrors: [],
    inconsistentStructures: [],
    emptyTranslations: [],
    placeholderTranslations: [],
    veryShortTranslations: []
  };

  const localesDir = 'public/locales';

  if (!fs.existsSync(localesDir)) {
    return issues;
  }

  const languages = fs.readdirSync(localesDir).filter(item => {
    const itemPath = path.join(localesDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  for (const lang of languages) {
    const langPath = path.join(localesDir, lang);
    const files = fs.readdirSync(langPath).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(langPath, file);

      // Vérifier la syntaxe JSON
      const validation = validateJsonFile(filePath);
      if (!validation.valid) {
        issues.jsonSyntaxErrors.push({
          language: lang,
          file: file,
          error: validation.error
        });
      } else {
        // Analyser le contenu
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);

          function checkObject(obj, path = '') {
            for (const [key, value] of Object.entries(obj)) {
              const currentPath = path ? `${path}.${key}` : key;

              if (typeof value === 'object' && value !== null) {
                checkObject(value, currentPath);
              } else if (typeof value === 'string') {
                if (value.trim() === '') {
                  issues.emptyTranslations.push({
                    language: lang,
                    file: file,
                    key: currentPath,
                    value: value
                  });
                } else if (value.includes('TODO') || value.includes('FIXME') || value.includes('PLACEHOLDER')) {
                  issues.placeholderTranslations.push({
                    language: lang,
                    file: file,
                    key: currentPath,
                    value: value
                  });
                } else if (value.length < 3) {
                  issues.veryShortTranslations.push({
                    language: lang,
                    file: file,
                    key: currentPath,
                    value: value
                  });
                }
              }
            }
          }

          checkObject(data);

        } catch (error) {
          issues.jsonSyntaxErrors.push({
            language: lang,
            file: file,
            error: error.message
          });
        }
      }
    }
  }

  return issues;
}

// Fonction principale
function main() {
  console.log('🔍 VALIDATION DES TRADUCTIONS');
  console.log('='.repeat(50));

  // 1. Comparer les structures entre langues
  console.log('📊 Comparaison des structures...');
  const comparison = compareLanguageStructures();

  if (comparison.error) {
    console.log(`❌ Erreur: ${comparison.error}`);
    return;
  }

  // 2. Identifier les problèmes potentiels
  console.log('\n🔎 Recherche des problèmes potentiels...');
  const issues = identifyPotentialIssues();

  // 3. Afficher le résumé
  console.log('\n📋 RÉSUMÉ DES PROBLÈMES TROUVÉS');
  console.log('='.repeat(50));

  console.log(`\n❌ Erreurs de syntaxe JSON: ${issues.jsonSyntaxErrors.length}`);
  if (issues.jsonSyntaxErrors.length > 0) {
    issues.jsonSyntaxErrors.forEach(issue => {
      console.log(`  - ${issue.language}/${issue.file}: ${issue.error}`);
    });
  }

  console.log(`\n⚠️  Traductions vides: ${issues.emptyTranslations.length}`);
  if (issues.emptyTranslations.length > 0) {
    issues.emptyTranslations.slice(0, 5).forEach(issue => {
      console.log(`  - ${issue.language}/${issue.file}:${issue.key} = "${issue.value}"`);
    });
    if (issues.emptyTranslations.length > 5) {
      console.log(`  ... et ${issues.emptyTranslations.length - 5} autres`);
    }
  }

  console.log(`\n🔧 Traductions placeholder: ${issues.placeholderTranslations.length}`);
  if (issues.placeholderTranslations.length > 0) {
    issues.placeholderTranslations.forEach(issue => {
      console.log(`  - ${issue.language}/${issue.file}:${issue.key} = "${issue.value}"`);
    });
  }

  console.log(`\n📝 Traductions très courtes: ${issues.veryShortTranslations.length}`);
  if (issues.veryShortTranslations.length > 0) {
    issues.veryShortTranslations.slice(0, 5).forEach(issue => {
      console.log(`  - ${issue.language}/${issue.file}:${issue.key} = "${issue.value}"`);
    });
    if (issues.veryShortTranslations.length > 5) {
      console.log(`  ... et ${issues.veryShortTranslations.length - 5} autres`);
    }
  }

  // 4. Générer un rapport
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: issues.jsonSyntaxErrors.length + issues.emptyTranslations.length + issues.placeholderTranslations.length + issues.veryShortTranslations.length,
      jsonSyntaxErrors: issues.jsonSyntaxErrors.length,
      emptyTranslations: issues.emptyTranslations.length,
      placeholderTranslations: issues.placeholderTranslations.length,
      veryShortTranslations: issues.veryShortTranslations.length
    },
    details: issues
  };

  fs.writeFileSync('translation-validation-report.json', JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n💾 Rapport de validation sauvegardé: translation-validation-report.json`);

  // 5. Recommandations
  console.log('\n💡 RECOMMANDATIONS');
  console.log('='.repeat(50));

  if (issues.jsonSyntaxErrors.length > 0) {
    console.log('🔧 Priorité haute: Corriger les erreurs de syntaxe JSON');
  }

  if (issues.emptyTranslations.length > 0) {
    console.log('📝 Priorité moyenne: Remplir les traductions vides');
  }

  if (issues.placeholderTranslations.length > 0) {
    console.log('🔄 Priorité moyenne: Remplacer les traductions placeholder');
  }

  if (issues.veryShortTranslations.length > 0) {
    console.log('✏️  Priorité basse: Vérifier les traductions très courtes');
  }

  if (issues.jsonSyntaxErrors.length === 0 && issues.emptyTranslations.length === 0) {
    console.log('✅ Toutes les traductions semblent en bon état!');
  }

  return report;
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  validateJsonFile,
  analyzeTranslationStructure,
  compareLanguageStructures,
  identifyPotentialIssues,
  main
};