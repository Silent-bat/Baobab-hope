#!/usr/bin/env node

/**
 * Translation Update Runner
 *
 * This script safely executes the update-all-languages.js script
 * and handles any errors that may occur during the process.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting language files update...');
console.log(`📅 Started at: ${new Date().toISOString()}`);

// Check prerequisites
function checkPrerequisites() {
  const checks = [
    {
      name: 'Update script exists',
      check: () => fs.existsSync(path.join(process.cwd(), 'scripts', 'update-all-languages.js')),
      error: 'Update script not found: scripts/update-all-languages.js'
    },
    {
      name: 'Locales directory exists',
      check: () => fs.existsSync(path.join(process.cwd(), 'public', 'locales')),
      error: 'Locales directory not found: public/locales'
    },
    {
      name: 'English locales exist',
      check: () => fs.existsSync(path.join(process.cwd(), 'public', 'locales', 'en')),
      error: 'English locales directory not found: public/locales/en'
    }
  ];

  console.log('🔍 Checking prerequisites...');

  for (const check of checks) {
    if (check.check()) {
      console.log(`✅ ${check.name}`);
    } else {
      console.error(`❌ ${check.error}`);
      process.exit(1);
    }
  }

  console.log('✅ All prerequisites passed\n');
}

// Run the update script
async function runUpdateScript() {
  return new Promise((resolve, reject) => {
    console.log('🌍 Executing translation update...\n');

    const child = spawn('node', ['scripts/update-all-languages.js'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Update script exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Run validation if available
async function runValidation() {
  const validationScript = path.join(process.cwd(), 'scripts', 'validate-translations.js');

  if (fs.existsSync(validationScript)) {
    console.log('\n🔍 Running translation validation...\n');

    return new Promise((resolve, reject) => {
      const child = spawn('node', ['scripts/validate-translations.js'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      child.on('close', (code) => {
        resolve(code);
      });

      child.on('error', (error) => {
        console.warn(`⚠️ Validation failed: ${error.message}`);
        resolve(1);
      });
    });
  } else {
    console.log('\n⚠️ Validation script not found, skipping validation');
    return Promise.resolve(0);
  }
}

// Main execution
async function main() {
  try {
    // Check prerequisites
    checkPrerequisites();

    // Run the update script
    await runUpdateScript();

    console.log('\n✅ Language update completed successfully!');
    console.log(`📅 Finished at: ${new Date().toISOString()}`);

    // Run validation
    const validationCode = await runValidation();

    if (validationCode === 0) {
      console.log('\n🎉 All translations updated and validated successfully!');
    } else {
      console.log('\n⚠️ Translations updated but validation found issues. Check the validation report.');
    }

    // Display summary
    console.log('\n📋 SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Translation update: COMPLETED');
    console.log(`🔍 Validation: ${validationCode === 0 ? 'PASSED' : 'ISSUES FOUND'}`);

    // Check for generated reports
    const summaryReport = path.join(process.cwd(), 'translation-update-summary.json');
    const validationReport = path.join(process.cwd(), 'translation-validation-report.json');

    if (fs.existsSync(summaryReport)) {
      console.log('📊 Update summary: translation-update-summary.json');
    }

    if (fs.existsSync(validationReport)) {
      console.log('📋 Validation report: translation-validation-report.json');
    }

  } catch (error) {
    console.error('\n❌ Translation update failed!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n\n⚠️ Update interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️ Update terminated');
  process.exit(1);
});

// Run if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { main, checkPrerequisites, runUpdateScript, runValidation };
