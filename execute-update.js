#!/usr/bin/env node

/**
 * Direct Translation Update Executor
 *
 * This script directly executes the translation update by requiring
 * the update script and running it in the current process.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Direct Translation Update Execution');
console.log('======================================');
console.log(`📅 Started at: ${new Date().toISOString()}`);

// Change process arguments to simulate command line flags
const originalArgv = process.argv;

async function executeUpdate() {
  try {
    // First run in test mode
    console.log('\n🧪 PHASE 1: Test Mode (Dry Run)');
    console.log('================================');

    process.argv = ['node', 'update-all-languages.js', '--test', '--verbose'];

    // Clear require cache to ensure fresh execution
    const updateScriptPath = path.resolve('./scripts/update-all-languages.js');
    delete require.cache[updateScriptPath];

    // Import and run the update script
    const updateScript = require('./scripts/update-all-languages.js');

    console.log('✅ Test mode completed successfully');

    // Now run the actual update
    console.log('\n🌍 PHASE 2: Actual Update');
    console.log('=========================');

    process.argv = ['node', 'update-all-languages.js', '--verbose'];

    // Clear cache again for fresh execution
    delete require.cache[updateScriptPath];

    // Run actual update
    require('./scripts/update-all-languages.js');

    console.log('✅ Update completed successfully');

    // Validation phase
    console.log('\n🔍 PHASE 3: Validation');
    console.log('======================');

    await validateResults();

    console.log('\n🎉 All phases completed successfully!');

  } catch (error) {
    console.error('❌ Execution failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    // Restore original argv
    process.argv = originalArgv;
  }
}

async function validateResults() {
  const localesDir = path.join(process.cwd(), 'public', 'locales');

  if (!fs.existsSync(localesDir)) {
    console.error('❌ Locales directory not found');
    return;
  }

  const languages = fs.readdirSync(localesDir)
    .filter(dir => {
      const dirPath = path.join(localesDir, dir);
      return fs.statSync(dirPath).isDirectory();
    })
    .filter(dir => dir !== 'en');

  console.log(`📊 Validating ${languages.length} language directories...`);

  let totalFiles = 0;
  let validFiles = 0;
  let errorFiles = 0;

  const namespaces = ['actions', 'common', 'forms', 'manifest', 'misc', 'navigation', 'pages'];

  for (const lang of languages) {
    const langDir = path.join(localesDir, lang);

    for (const namespace of namespaces) {
      const filePath = path.join(langDir, `${namespace}.json`);
      totalFiles++;

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          JSON.parse(content);
          validFiles++;
        } catch (error) {
          console.error(`❌ ${lang}/${namespace}.json: Invalid JSON - ${error.message}`);
          errorFiles++;
        }
      } else {
        console.warn(`⚠️ Missing file: ${lang}/${namespace}.json`);
        errorFiles++;
      }
    }
  }

  console.log(`\n📋 Validation Summary:`);
  console.log(`   Total expected files: ${totalFiles}`);
  console.log(`   Valid files: ${validFiles}`);
  console.log(`   Files with errors: ${errorFiles}`);
  console.log(`   Success rate: ${Math.round((validFiles / totalFiles) * 100)}%`);

  // Check for generated reports
  const reports = [
    'translation-update-summary.json',
    'translation-validation-report.json'
  ];

  console.log(`\n📊 Generated Reports:`);
  for (const report of reports) {
    if (fs.existsSync(report)) {
      console.log(`✅ ${report} created`);

      try {
        const content = JSON.parse(fs.readFileSync(report, 'utf8'));
        if (report.includes('update-summary') && content.summary) {
          console.log(`   Languages updated: ${content.languagesUpdated || 'N/A'}`);
          console.log(`   Files processed: ${content.totalFilesProcessed || 'N/A'}`);
          console.log(`   Translation entries: ${content.totalTranslationEntries || 'N/A'}`);
        }
      } catch (e) {
        console.log(`   (Report exists but couldn't parse summary)`);
      }
    } else {
      console.log(`⚠️ ${report} not found`);
    }
  }

  if (errorFiles === 0) {
    console.log(`\n✅ All translation files are valid and ready for use!`);
  } else {
    console.log(`\n⚠️ ${errorFiles} files need attention (see errors above)`);
  }
}

// Execute the update
executeUpdate().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
