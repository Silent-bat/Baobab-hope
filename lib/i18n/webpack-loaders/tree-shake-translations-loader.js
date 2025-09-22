// Custom webpack loader for tree shaking unused translations

const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')

const schema = {
  type: 'object',
  properties: {
    usedKeys: {
      type: 'array',
      items: { type: 'string' }
    },
    keepUnused: {
      type: 'boolean'
    },
    minificationLevel: {
      type: 'string',
      enum: ['none', 'basic', 'aggressive']
    }
  },
  additionalProperties: false
}

module.exports = function treeShakeTranslationsLoader(source) {
  const options = getOptions(this) || {}
  validate(schema, options, { name: 'Tree Shake Translations Loader' })

  const {
    usedKeys = [],
    keepUnused = false,
    minificationLevel = 'basic'
  } = options

  try {
    const translations = JSON.parse(source)
    const optimized = treeShakeTranslations(translations, usedKeys, keepUnused, minificationLevel)
    
    // Add webpack comment for chunk naming
    const chunkName = this.resourcePath.match(/locales[/\\]([^/\\]+)[/\\]([^/\\]+)\.json$/)?.[2] || 'translations'
    const result = `/* webpackChunkName: "i18n-${chunkName}" */ export default ${JSON.stringify(optimized, null, minificationLevel === 'none' ? 2 : 0)}`
    
    return result
  } catch (error) {
    this.emitError(new Error(`Failed to process translation file: ${error.message}`))
    return source
  }
}

function treeShakeTranslations(translations, usedKeys, keepUnused, minificationLevel) {
  if (keepUnused || usedKeys.length === 0) {
    return minifyTranslations(translations, minificationLevel)
  }

  const usedKeySet = new Set(usedKeys)
  const optimized = {}

  function processObject(obj, keyPath = '') {
    const result = {}
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = keyPath ? `${keyPath}.${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Handle nested objects
        const nestedResult = processObject(value, fullKey)
        if (Object.keys(nestedResult).length > 0) {
          result[key] = nestedResult
        }
      } else if (usedKeySet.has(fullKey) || shouldKeepKey(key, fullKey, usedKeySet)) {
        result[key] = value
      }
    }
    
    return result
  }

  const result = processObject(translations)
  return minifyTranslations(result, minificationLevel)
}

function shouldKeepKey(key, fullKey, usedKeySet) {
  // Keep keys that are prefixes of used keys
  for (const usedKey of usedKeySet) {
    if (usedKey.startsWith(fullKey + '.')) {
      return true
    }
  }
  
  // Keep common keys that are likely to be used
  const commonKeys = ['common', 'error', 'success', 'loading', 'cancel', 'ok', 'yes', 'no']
  if (commonKeys.includes(key.toLowerCase())) {
    return true
  }
  
  return false
}

function minifyTranslations(translations, level) {
  if (level === 'none') {
    return translations
  }
  
  if (level === 'basic') {
    // Remove empty strings and null values
    return removeEmptyValues(translations)
  }
  
  if (level === 'aggressive') {
    // Remove empty values and compress similar strings
    const cleaned = removeEmptyValues(translations)
    return compressSimilarStrings(cleaned)
  }
  
  return translations
}

function removeEmptyValues(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  
  const result = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      const cleaned = removeEmptyValues(value)
      if (Object.keys(cleaned).length > 0) {
        result[key] = cleaned
      }
    } else if (value !== '' && value !== null && value !== undefined) {
      result[key] = value
    }
  }
  
  return result
}

function compressSimilarStrings(obj) {
  // This is a placeholder for more advanced compression
  // Could implement string deduplication, common prefix extraction, etc.
  return obj
}

module.exports.raw = false