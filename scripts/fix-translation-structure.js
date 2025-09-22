#!/usr/bin/env node

/**
 * Fix Translation Structure Script
 * 
 * This script resolves conflicts between single translation files (en.json) 
 * and chunked translation files (en/common.json) by:
 * 1. Reading complete translations from single files
 * 2. Properly organizing them into logical chunks
 * 3. Removing conflicting single files
 * 4. Creating comprehensive chunked structure
 */

const fs = require('fs').promises
const path = require('path')

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales')

// Define how to organize translations into chunks
const CHUNK_MAPPING = {
  common: [
    'common',
    'accessibility',
    'slogan'
  ],
  navigation: [
    'nav',
    'footer'
  ],
  pages: [
    'home',
    'about',
    'contact',
    'donate',
    'projects',
    'blog',
    'information'
  ],
  forms: [
    'form',
    'validation',
    'errors'
  ],
  actions: [
    'project',
    'cta',
    'impact'
  ]
}

async function getLanguagesWithConflicts() {
  try {
    const entries = await fs.readdir(LOCALES_DIR, { withFileTypes: true })
    const conflicts = []
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        const langCode = entry.name.replace('.json', '')
        const dirPath = path.join(LOCALES_DIR, langCode)
        
        try {
          const stat = await fs.stat(dirPath)
          if (stat.isDirectory()) {
            conflicts.push(langCode)
          }
        } catch (error) {
          // Directory doesn't exist, no conflict
        }
      }
    }
    
    return conflicts
  } catch (error) {
    console.error('Error reading locales directory:', error)
    return []
  }
}

async function readSingleFile(langCode) {
  try {
    const filePath = path.join(LOCALES_DIR, `${langCode}.json`)
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading single file for ${langCode}:`, error)
    return null
  }
}

async function readChunkedFiles(langCode) {
  try {
    const langDir = path.join(LOCALES_DIR, langCode)
    const files = await fs.readdir(langDir)
    const chunks = {}
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const chunkName = file.replace('.json', '')
        const filePath = path.join(langDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        chunks[chunkName] = JSON.parse(content)
      }
    }
    
    return chunks
  } catch (error) {
    console.error(`Error reading chunked files for ${langCode}:`, error)
    return {}
  }
}

function organizeTranslationsIntoChunks(translations) {
  const chunks = {}
  
  // Initialize chunks
  for (const chunkName of Object.keys(CHUNK_MAPPING)) {
    chunks[chunkName] = {}
  }
  
  // Organize translations into chunks
  for (const [key, value] of Object.entries(translations)) {
    let assigned = false
    
    // Find which chunk this key belongs to
    for (const [chunkName, keys] of Object.entries(CHUNK_MAPPING)) {
      if (keys.includes(key)) {
        chunks[chunkName][key] = value
        assigned = true
        break
      }
    }
    
    // If not assigned to any specific chunk, put in common
    if (!assigned) {
      chunks.common[key] = value
    }
  }
  
  // Remove empty chunks
  for (const [chunkName, chunkData] of Object.entries(chunks)) {
    if (Object.keys(chunkData).length === 0) {
      delete chunks[chunkName]
    }
  }
  
  return chunks
}

async function writeChunkedFiles(langCode, chunks) {
  const langDir = path.join(LOCALES_DIR, langCode)
  
  // Ensure directory exists
  try {
    await fs.mkdir(langDir, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
  
  // Write each chunk
  for (const [chunkName, chunkData] of Object.entries(chunks)) {
    const filePath = path.join(langDir, `${chunkName}.json`)
    await fs.writeFile(filePath, JSON.stringify(chunkData, null, 2), 'utf8')
    console.log(`✓ Created ${langCode}/${chunkName}.json`)
  }
}

async function removeSingleFile(langCode) {
  try {
    const filePath = path.join(LOCALES_DIR, `${langCode}.json`)
    await fs.unlink(filePath)
    console.log(`✓ Removed conflicting single file: ${langCode}.json`)
  } catch (error) {
    console.error(`Error removing single file for ${langCode}:`, error)
  }
}

async function mergeTranslations(singleFileData, chunkedData) {
  // Start with single file data (most complete)
  const merged = { ...singleFileData }
  
  // Merge in any additional data from chunks
  for (const chunkData of Object.values(chunkedData)) {
    for (const [key, value] of Object.entries(chunkData)) {
      if (!merged[key]) {
        merged[key] = value
      } else if (typeof merged[key] === 'object' && typeof value === 'object') {
        merged[key] = { ...merged[key], ...value }
      }
    }
  }
  
  return merged
}

async function fixLanguageStructure(langCode) {
  console.log(`\n🔧 Fixing structure for ${langCode}...`)
  
  // Read both single file and chunked files
  const singleFileData = await readSingleFile(langCode)
  const chunkedData = await readChunkedFiles(langCode)
  
  if (!singleFileData) {
    console.log(`⚠️  No single file found for ${langCode}, skipping...`)
    return
  }
  
  // Merge translations (single file takes precedence as it's more complete)
  const mergedTranslations = await mergeTranslations(singleFileData, chunkedData)
  
  // Organize into proper chunks
  const organizedChunks = organizeTranslationsIntoChunks(mergedTranslations)
  
  // Write chunked files
  await writeChunkedFiles(langCode, organizedChunks)
  
  // Remove conflicting single file
  await removeSingleFile(langCode)
  
  console.log(`✅ Fixed structure for ${langCode}`)
}

async function getAllLanguageCodes() {
  try {
    const entries = await fs.readdir(LOCALES_DIR, { withFileTypes: true })
    const languages = new Set()
    
    // Get languages from single files
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        languages.add(entry.name.replace('.json', ''))
      }
    }
    
    // Get languages from directories
    for (const entry of entries) {
      if (entry.isDirectory()) {
        languages.add(entry.name)
      }
    }
    
    return Array.from(languages)
  } catch (error) {
    console.error('Error getting language codes:', error)
    return []
  }
}

async function main() {
  console.log('🚀 Starting translation structure fix...')
  
  // Get all languages that need fixing
  const allLanguages = await getAllLanguageCodes()
  const conflictingLanguages = await getLanguagesWithConflicts()
  
  console.log(`Found ${allLanguages.length} languages total`)
  console.log(`Found ${conflictingLanguages.length} languages with conflicts:`, conflictingLanguages)
  
  if (conflictingLanguages.length === 0) {
    console.log('✅ No conflicts found! All translation files are properly organized.')
    return
  }
  
  // Fix each conflicting language
  for (const langCode of conflictingLanguages) {
    await fixLanguageStructure(langCode)
  }
  
  console.log('\n🎉 Translation structure fix completed!')
  console.log('\n📋 Summary:')
  console.log(`- Fixed ${conflictingLanguages.length} languages`)
  console.log('- Removed conflicting single files')
  console.log('- Created organized chunk structure')
  console.log('- All translations preserved and properly organized')
  
  console.log('\n📁 New structure:')
  console.log('public/locales/')
  for (const lang of conflictingLanguages) {
    console.log(`├── ${lang}/`)
    for (const chunk of Object.keys(CHUNK_MAPPING)) {
      console.log(`│   ├── ${chunk}.json`)
    }
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  fixLanguageStructure,
  getLanguagesWithConflicts,
  organizeTranslationsIntoChunks
}