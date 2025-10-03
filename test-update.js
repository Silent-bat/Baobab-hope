#!/usr/bin/env node

/**
 * Test Translation Update Script
 *
 * This script safely executes the translation update process
 * and validates the results.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🧪 Starting Translation Update Test');
console.log('===================================');

// Function to run a command and return promise
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n💻 Executing: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'pipe',
      cwd: process.cwd(),
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log(output.trim());
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      console.error(output.trim());
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Command failed with code ${code}\nStderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Function to check file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to count files in directory
function countFilesInDir(dirPath, extension = '.json') {
  if (!fs.existsSync(dirPath)) return 0;
  return fs.readdirSync(dirPath).filter(file => file.endsWith(extension)).length;
}

// Function to get language directories
function getLanguageDirectories() {
  const localesDir = path.join(process.cwd(), 'public', 'locales');
  if (!fs.existsSync(localesDir)) return [];

  return fs.readdirSync(localesDir)
    .filter(dir => {
      const dirPath = path.join(localesDir, dir);
      return fs.statSync(dirPath).isDirectory();
    })
    .filter(dir => dir !== 'en'); // Exclude English
}

// Function to validate JSON file
function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Main test function
async function runTest() {
  try {
    console.log('\n📋 Pre-flight Checks');
    console.log('---------------------');

    // Check if update script exists
    const updateScript = path.join(process.cwd(), 'scripts', 'update-all-languages.js');
    if (!fileExists(updateScript)) {
      throw new Error('Update script not found: scripts/update-all-languages.js');
    }
    console.log('✅ Update script found');

    // Check if English locales exist
    const enDir = path.join(process.cwd(), 'public', 'locales', 'en');
    if (!fs.existsSync(enDir)) {
      throw new Error('English locales directory not found');
    }
    console.log('✅ English locales directory found');

    // Count English files
    const enFileCount = countFilesInDir(enDir);
    console.log(`✅ English files found: ${enFileCount}`);

    // Get language directories
    const languages = getLanguageDirectories();
    console.log(`✅ Language directories found: ${languages.length}`);
    console.log(`   Languages: ${languages.slice(0, 10).join(', ')}${languages.length > 10 ? '...' : ''}`);

    console.log('\n🧪 Running Test Mode Update');
    console.log('-----------------------------');

    // Run in test mode first
    try {
      await runCommand('node', ['scripts/update-all-languages.js', '--test', '--verbose']);
      console.log('✅ Test mode completed successfully');
    } catch (error) {
      console.error('❌ Test mode failed:', error.message);
      throw error;
    }

    console.log('\n🚀 Running Actual Update');
    console.log('-------------------------');

    // Run the actual update
    try {
      await runCommand('node', ['scripts/update-all-languages.js', '--verbose']);
      console.log('✅ Update completed successfully');
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      throw error;
    }

    console.log('\n🔍 Post-Update Validation');
    console.log('--------------------------');

    // Validate results
    let validationErrors = 0;
    let totalFiles = 0;

    for (const lang of languages) {
      const langDir = path.join(process.cwd(), 'public', 'locales', lang);
      const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));

      for (const file of files) {
        const filePath = path.join(langDir, file);
        const validation = validateJsonFile(filePath);
        totalFiles++;

        if (!validation.valid) {
          console.error(`❌ ${lang}/${file}: ${validation.error}`);
          validationErrors++;
        }
      }
    }

    if (validationErrors === 0) {
      console.log(`✅ All ${totalFiles} translation files are valid JSON`);
    } else {
      console.log(`❌ ${validationErrors} files have JSON errors out of ${totalFiles} total files`);
    }

    // Run validation script if available
    const validationScript = path.join(process.cwd(), 'scripts', 'validate-translations.js');
    if (fileExists(validationScript)) {
      console.log('\n📊 Running Detailed Validation');
      console.log('-------------------------------');

      try {
        await runCommand('node', ['scripts/validate-translations.js']);
        console.log('✅ Detailed validation completed');
      } catch (error) {
        console.warn('⚠️ Validation script had issues but continuing...');
      }
    }

    // Generate final report
    console.log('\n📋 Final Report');
    console.log('================');
    console.log(`✅ Languages processed: ${languages.length}`);
    console.log(`✅ Total translation files: ${totalFiles}`);
    console.log(`✅ JSON validation errors: ${validationErrors}`);
    console.log(`✅ English source files: ${enFileCount}`);

    // Check for generated reports
    const reports = [
      'translation-update-summary.json',
      'translation-validation-report.json'
    ];

    console.log('\n📊 Generated Reports:');
    for (const report of reports) {
      if (fileExists(report)) {
        console.log(`✅ ${report}`);
        // Show first few lines of the report
        try {
          const content = JSON.parse(fs.readFileSync(report, 'utf8'));
          if (content.summary) {
            console.log(`   Summary: ${JSON.stringify(content.summary, null, 2)}`);
          }
        } catch (e) {
          console.log(`   (Report exists but couldn't read summary)`);
        }
      } else {
        console.log(`⚠️ ${report} not generated`);
      }
    }

    console.log('\n🎉 Translation update test completed successfully!');

    if (validationErrors === 0) {
      console.log('🌍 All language files are ready for production use.');
    } else {
      console.log('⚠️ Some validation errors found - review the files mentioned above.');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runTest();
