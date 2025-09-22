const fs = require('fs');
const path = require('path');

function fixJsonCommas(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Try to parse as JSON first
    try {
      JSON.parse(content);
      return; // Already valid
    } catch (error) {
      console.log(`Fixing ${filePath}: ${error.message}`);
    }

    let fixedContent = content;

    // Fix missing commas between properties (when we have "key": "value" "key2": "value2")
    fixedContent = fixedContent.replace(/"\s*\n\s*"([^"]+)"\s*:/g, '",\n    "$1":');

    // Fix trailing commas before closing braces/brackets
    fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');

    // Fix missing closing braces - count opening and closing braces
    const openBraces = (fixedContent.match(/\{/g) || []).length;
    const closeBraces = (fixedContent.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      fixedContent += '\n}'.repeat(openBraces - closeBraces);
    }

    // Fix missing closing brackets
    const openBrackets = (fixedContent.match(/\[/g) || []).length;
    const closeBrackets = (fixedContent.match(/\]/g) || []).length;
    if (openBrackets > closeBrackets) {
      fixedContent += '\n]'.repeat(openBrackets - closeBrackets);
    }

    // Fix specific pattern: "key": "value" } should be "key": "value"}
    fixedContent = fixedContent.replace(/"\s*\n\s*\}/g, '",');

    // Fix specific pattern: "key": "value" , } should be "key": "value"}
    fixedContent = fixedContent.replace(/"\s*,\s*\}/g, '"}');

    // Try to parse again
    try {
      JSON.parse(fixedContent);
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
      return true;
    } catch (error) {
      console.log(`❌ Could not fix ${filePath}: ${error.message}`);
      return false;
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findAllJsonFiles(dir) {
  const files = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(dir);
  return files;
}

// Fix all JSON files in public/locales
console.log('🔧 Starting to fix JSON comma and structure errors...\n');

const jsonFiles = findAllJsonFiles('public/locales');
let fixedCount = 0;
let failedCount = 0;

jsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    try {
      JSON.parse(content);
    } catch (error) {
      if (fixJsonCommas(file)) {
        fixedCount++;
      } else {
        failedCount++;
      }
    }
  } catch (error) {
    failedCount++;
  }
});

console.log(`\n📊 Results:`);
console.log(`✅ Successfully fixed: ${fixedCount} files`);
console.log(`❌ Failed to fix: ${failedCount} files`);
console.log(`📁 Total files processed: ${jsonFiles.length}`);