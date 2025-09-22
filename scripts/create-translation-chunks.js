#!/usr/bin/env node

// Script to create translation chunks from monolithic translation files

const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales')
const CHUNK_SIZE_THRESHOLD = 50 // Maximum keys per chunk

// Namespace definitions for chunking
const NAMESPACE_PATTERNS = {
  common: ['common', 'button', 'label', 'title', 'subtitle'],
  navigation: ['nav', 'menu', 'breadcrumb', 'link'],
  forms: ['form', 'input', 'validation', 'submit', 'field'],
  errors: ['error', 'warning', 'alert', 'message'],
  pages: ['page', 'home', 'about', 'contact', 'donate'],
  components: ['component', 'card', 'modal', 'tooltip', 'dropdown'],
  actions: ['action', 'act', 'volunteer', 'campaign', 'project'],
  content: ['content', 'description', 'text', 'paragraph', 'article']
}

function createTranslationChunks() {
  console.log('Creating translation chunks...')

  // Get all language directories
  const languages = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.json'))
    .map(dirent => dirent.name.replace('.json', ''))

  for (const language of languages) {
    console.log(`Processing language: ${language}`)
    
    const translationFile = path.join(LOCALES_DIR, `${language}.json`)
    
    if (!fs.existsSync(translationFile)) {
      console.warn(`Translation file not found: ${translationFile}`)
      continue
    }

    try {
      const translations = JSON.parse(fs.readFileSync(translationFile, 'utf8'))
      const chunks = chunkTranslations(translations)
      
      // Create language directory
      const languageDir = path.join(LOCALES_DIR, language)
      if (!fs.existsSync(languageDir)) {
        fs.mkdirSync(languageDir, { recursive: true })
      }

      // Write chunks
      for (const [namespace, chunkData] of Object.entries(chunks)) {
        const chunkFile = path.join(languageDir, `${namespace}.json`)
        fs.writeFileSync(chunkFile, JSON.stringify(chunkData, null, 2))
        console.log(`  Created chunk: ${namespace}.json (${Object.keys(chunkData).length} keys)`)
      }

      // Create manifest file
      const manifest = {
        language,
        chunks: Object.keys(chunks),
        totalKeys: Object.keys(translations).length,
        createdAt: new Date().toISOString()
      }
      
      const manifestFile = path.join(languageDir, 'manifest.json')
      fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))
      
      console.log(`  Created manifest for ${language}`)
      
    } catch (error) {
      console.error(`Error processing ${language}:`, error.message)
    }
  }

  console.log('Translation chunking complete!')
}

function chunkTranslations(translations) {
  const chunks = {}
  
  // Initialize chunks
  for (const namespace of Object.keys(NAMESPACE_PATTERNS)) {
    chunks[namespace] = {}
  }
  chunks.misc = {} // For keys that don't match any pattern

  // Categorize translations into chunks
  for (const [key, value] of Object.entries(translations)) {
    const namespace = categorizeKey(key)
    chunks[namespace][key] = value
  }

  // Remove empty chunks
  for (const [namespace, chunkData] of Object.entries(chunks)) {
    if (Object.keys(chunkData).length === 0) {
      delete chunks[namespace]
    }
  }

  // Split large chunks if needed
  const finalChunks = {}
  for (const [namespace, chunkData] of Object.entries(chunks)) {
    if (Object.keys(chunkData).length > CHUNK_SIZE_THRESHOLD) {
      const splitChunks = splitLargeChunk(namespace, chunkData)
      Object.assign(finalChunks, splitChunks)
    } else {
      finalChunks[namespace] = chunkData
    }
  }

  return finalChunks
}

function categorizeKey(key) {
  const lowerKey = key.toLowerCase()
  
  for (const [namespace, patterns] of Object.entries(NAMESPACE_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerKey.includes(pattern)) {
        return namespace
      }
    }
  }
  
  return 'misc'
}

function splitLargeChunk(namespace, chunkData) {
  const chunks = {}
  const keys = Object.keys(chunkData)
  const chunkCount = Math.ceil(keys.length / CHUNK_SIZE_THRESHOLD)
  
  for (let i = 0; i < chunkCount; i++) {
    const chunkName = chunkCount > 1 ? `${namespace}-${i + 1}` : namespace
    const startIndex = i * CHUNK_SIZE_THRESHOLD
    const endIndex = Math.min(startIndex + CHUNK_SIZE_THRESHOLD, keys.length)
    
    chunks[chunkName] = {}
    for (let j = startIndex; j < endIndex; j++) {
      const key = keys[j]
      chunks[chunkName][key] = chunkData[key]
    }
  }
  
  return chunks
}

function validateChunks() {
  console.log('Validating translation chunks...')
  
  const languages = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const language of languages) {
    const languageDir = path.join(LOCALES_DIR, language)
    const manifestFile = path.join(languageDir, 'manifest.json')
    
    if (!fs.existsSync(manifestFile)) {
      console.warn(`Manifest not found for ${language}`)
      continue
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
      let totalKeys = 0
      
      for (const chunkName of manifest.chunks) {
        const chunkFile = path.join(languageDir, `${chunkName}.json`)
        if (fs.existsSync(chunkFile)) {
          const chunkData = JSON.parse(fs.readFileSync(chunkFile, 'utf8'))
          totalKeys += Object.keys(chunkData).length
        } else {
          console.warn(`Chunk file missing: ${chunkFile}`)
        }
      }
      
      console.log(`${language}: ${totalKeys} keys across ${manifest.chunks.length} chunks`)
      
    } catch (error) {
      console.error(`Error validating ${language}:`, error.message)
    }
  }
  
  console.log('Validation complete!')
}

function cleanupOldChunks() {
  console.log('Cleaning up old chunks...')
  
  const languages = fs.readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const language of languages) {
    const languageDir = path.join(LOCALES_DIR, language)
    
    if (fs.existsSync(languageDir)) {
      fs.rmSync(languageDir, { recursive: true, force: true })
      console.log(`Cleaned up ${language} directory`)
    }
  }
  
  console.log('Cleanup complete!')
}

// CLI interface
const command = process.argv[2]

switch (command) {
  case 'create':
    createTranslationChunks()
    break
  case 'validate':
    validateChunks()
    break
  case 'clean':
    cleanupOldChunks()
    break
  default:
    console.log('Usage: node create-translation-chunks.js [create|validate|clean]')
    console.log('  create   - Create translation chunks from monolithic files')
    console.log('  validate - Validate existing chunks')
    console.log('  clean    - Clean up old chunk directories')
    process.exit(1)
}