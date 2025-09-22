// Translation file management system with validation, versioning, and import/export

import { TranslationData, TranslationFile, PluralTranslation } from './types'
import { getLanguageByCode, getAllLanguages } from './languages'

export interface TranslationFileMetadata {
  language: string
  version: string
  lastUpdated: Date
  namespace: string
  checksum: string
  keyCount: number
  completionRate: number
}

export interface TranslationValidationResult {
  isValid: boolean
  errors: TranslationValidationError[]
  warnings: TranslationValidationWarning[]
  metadata: TranslationFileMetadata
}

export interface TranslationValidationError {
  type: 'missing_key' | 'invalid_format' | 'invalid_plural' | 'invalid_interpolation'
  key: string
  message: string
  severity: 'error' | 'warning'
}

export interface TranslationValidationWarning {
  type: 'unused_key' | 'inconsistent_format' | 'missing_plural_form'
  key: string
  message: string
}

export interface TranslationChangeRecord {
  id: string
  timestamp: Date
  language: string
  key: string
  oldValue: string | null
  newValue: string | null
  action: 'create' | 'update' | 'delete'
  author: string
  approved: boolean
  approvedBy?: string
  approvedAt?: Date
}

export interface TranslationExportOptions {
  languages?: string[]
  namespaces?: string[]
  format: 'json' | 'csv' | 'xlsx' | 'po' | 'yaml'
  includeMetadata: boolean
  includeEmpty: boolean
}

export interface TranslationImportOptions {
  format: 'json' | 'csv' | 'xlsx' | 'po' | 'yaml'
  overwriteExisting: boolean
  validateBeforeImport: boolean
  createBackup: boolean
}

export interface TranslationImportResult {
  success: boolean
  imported: number
  updated: number
  errors: string[]
  warnings: string[]
  backupPath?: string
}

export class TranslationFileManager {
  private static instance: TranslationFileManager
  private changeHistory: TranslationChangeRecord[] = []
  private readonly BACKUP_DIR = '.kiro/i18n/backups'
  private readonly TRANSLATIONS_DIR = 'public/locales'

  private constructor() {}

  static getInstance(): TranslationFileManager {
    if (!TranslationFileManager.instance) {
      TranslationFileManager.instance = new TranslationFileManager()
    }
    return TranslationFileManager.instance
  }

  /**
   * Create a new translation file with proper structure and namespacing
   */
  async createTranslationFile(
    language: string,
    namespace: string = 'default',
    initialData: TranslationData = {}
  ): Promise<TranslationFile> {
    const languageConfig = getLanguageByCode(language)
    if (!languageConfig) {
      throw new Error(`Unsupported language: ${language}`)
    }

    const translationFile: TranslationFile = {
      language,
      version: '1.0.0',
      lastUpdated: new Date(),
      namespace,
      translations: this.normalizeTranslationData(initialData)
    }

    // Validate the file structure
    const validation = await this.validateTranslationFile(translationFile)
    if (!validation.isValid) {
      throw new Error(`Invalid translation file: ${validation.errors.map(e => e.message).join(', ')}`)
    }

    return translationFile
  }

  /**
   * Load translation file with metadata
   */
  async loadTranslationFile(language: string, namespace: string = 'default'): Promise<TranslationFile | null> {
    try {
      const filePath = this.getTranslationFilePath(language, namespace)
      
      // In a real implementation, this would read from the file system
      // For now, we'll simulate loading from the existing structure
      const response = await fetch(`/locales/${language}.json`)
      if (!response.ok) {
        return null
      }

      const data = await response.json()
      
      return {
        language,
        version: data._metadata?.version || '1.0.0',
        lastUpdated: new Date(data._metadata?.lastUpdated || Date.now()),
        namespace,
        translations: this.extractTranslationsFromData(data)
      }
    } catch (error) {
      console.error(`Failed to load translation file for ${language}:`, error)
      return null
    }
  }

  /**
   * Save translation file with versioning and backup
   */
  async saveTranslationFile(
    translationFile: TranslationFile,
    createBackup: boolean = true
  ): Promise<void> {
    // Create backup if requested
    if (createBackup) {
      await this.createBackup(translationFile.language, translationFile.namespace)
    }

    // Increment version
    translationFile.version = this.incrementVersion(translationFile.version)
    translationFile.lastUpdated = new Date()

    // Validate before saving
    const validation = await this.validateTranslationFile(translationFile)
    if (!validation.isValid) {
      throw new Error(`Cannot save invalid translation file: ${validation.errors.map(e => e.message).join(', ')}`)
    }

    // Prepare file content with metadata
    const fileContent = this.prepareFileContent(translationFile)
    
    // In a real implementation, this would write to the file system
    console.log(`Saving translation file for ${translationFile.language}:`, fileContent)
  }

  /**
   * Validate translation file structure and content
   */
  async validateTranslationFile(translationFile: TranslationFile): Promise<TranslationValidationResult> {
    const errors: TranslationValidationError[] = []
    const warnings: TranslationValidationWarning[] = []

    // Validate language code
    const languageConfig = getLanguageByCode(translationFile.language)
    if (!languageConfig) {
      errors.push({
        type: 'invalid_format',
        key: 'language',
        message: `Invalid language code: ${translationFile.language}`,
        severity: 'error'
      })
    }

    // Validate translation structure
    this.validateTranslationStructure(translationFile.translations, '', errors, warnings)

    // Calculate metadata
    const metadata: TranslationFileMetadata = {
      language: translationFile.language,
      version: translationFile.version,
      lastUpdated: translationFile.lastUpdated,
      namespace: translationFile.namespace,
      checksum: this.calculateChecksum(translationFile.translations),
      keyCount: this.countTranslationKeys(translationFile.translations),
      completionRate: this.calculateCompletionRate(translationFile.translations)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata
    }
  }

  /**
   * Get translation file integrity status
   */
  async getFileIntegrity(language: string, namespace: string = 'default'): Promise<{
    exists: boolean
    isValid: boolean
    lastModified: Date | null
    checksum: string | null
    keyCount: number
  }> {
    const translationFile = await this.loadTranslationFile(language, namespace)
    
    if (!translationFile) {
      return {
        exists: false,
        isValid: false,
        lastModified: null,
        checksum: null,
        keyCount: 0
      }
    }

    const validation = await this.validateTranslationFile(translationFile)
    
    return {
      exists: true,
      isValid: validation.isValid,
      lastModified: translationFile.lastUpdated,
      checksum: validation.metadata.checksum,
      keyCount: validation.metadata.keyCount
    }
  }

  /**
   * Track changes to translations
   */
  recordChange(
    language: string,
    key: string,
    oldValue: string | null,
    newValue: string | null,
    author: string,
    action: 'create' | 'update' | 'delete' = 'update'
  ): void {
    const changeRecord: TranslationChangeRecord = {
      id: this.generateChangeId(),
      timestamp: new Date(),
      language,
      key,
      oldValue,
      newValue,
      action,
      author,
      approved: false
    }

    this.changeHistory.push(changeRecord)
  }

  /**
   * Get change history for a language or key
   */
  getChangeHistory(language?: string, key?: string): TranslationChangeRecord[] {
    return this.changeHistory.filter(record => {
      if (language && record.language !== language) return false
      if (key && record.key !== key) return false
      return true
    })
  }

  /**
   * Export translations in various formats
   */
  async exportTranslations(options: TranslationExportOptions): Promise<string | Buffer> {
    const languages = options.languages || getAllLanguages().map(l => l.code)
    const exportData: Record<string, any> = {}

    // Collect translation data
    for (const language of languages) {
      const translationFile = await this.loadTranslationFile(language)
      if (translationFile) {
        exportData[language] = translationFile.translations
        
        if (options.includeMetadata) {
          exportData[language]._metadata = {
            version: translationFile.version,
            lastUpdated: translationFile.lastUpdated,
            namespace: translationFile.namespace
          }
        }
      }
    }

    // Format based on requested format
    switch (options.format) {
      case 'json':
        return JSON.stringify(exportData, null, 2)
      
      case 'csv':
        return this.exportToCSV(exportData, options)
      
      case 'yaml':
        return this.exportToYAML(exportData)
      
      case 'po':
        return this.exportToPO(exportData, languages[0] || 'en')
      
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  /**
   * Import translations from various formats
   */
  async importTranslations(
    data: string | Buffer,
    options: TranslationImportOptions
  ): Promise<TranslationImportResult> {
    const result: TranslationImportResult = {
      success: false,
      imported: 0,
      updated: 0,
      errors: [],
      warnings: []
    }

    try {
      // Create backup if requested
      if (options.createBackup) {
        result.backupPath = await this.createFullBackup()
      }

      // Parse data based on format
      let parsedData: Record<string, TranslationData>
      
      switch (options.format) {
        case 'json':
          parsedData = JSON.parse(data.toString())
          break
        
        case 'csv':
          parsedData = this.parseCSV(data.toString())
          break
        
        case 'yaml':
          parsedData = this.parseYAML(data.toString())
          break
        
        default:
          throw new Error(`Unsupported import format: ${options.format}`)
      }

      // Process each language
      for (const [language, translations] of Object.entries(parsedData)) {
        if (language.startsWith('_')) continue // Skip metadata

        try {
          // Validate if requested
          if (options.validateBeforeImport) {
            const tempFile: TranslationFile = {
              language,
              version: '1.0.0',
              lastUpdated: new Date(),
              namespace: 'default',
              translations
            }
            
            const validation = await this.validateTranslationFile(tempFile)
            if (!validation.isValid) {
              result.errors.push(`Validation failed for ${language}: ${validation.errors.map(e => e.message).join(', ')}`)
              continue
            }
          }

          // Load existing file
          const existingFile = await this.loadTranslationFile(language)
          
          if (existingFile && !options.overwriteExisting) {
            // Merge with existing
            const mergedTranslations = this.mergeTranslations(existingFile.translations, translations)
            existingFile.translations = mergedTranslations
            await this.saveTranslationFile(existingFile, false)
            result.updated++
          } else {
            // Create new or overwrite
            const newFile = await this.createTranslationFile(language, 'default', translations)
            await this.saveTranslationFile(newFile, false)
            result.imported++
          }
        } catch (error) {
          result.errors.push(`Failed to import ${language}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      result.success = result.errors.length === 0
      return result
    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return result
    }
  }

  /**
   * Create backup of translation file
   */
  private async createBackup(language: string, namespace: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = `${this.BACKUP_DIR}/${language}-${namespace}-${timestamp}.json`
    
    const translationFile = await this.loadTranslationFile(language, namespace)
    if (translationFile) {
      const backupContent = JSON.stringify(translationFile, null, 2)
      // In a real implementation, write to file system
      console.log(`Creating backup at ${backupPath}:`, backupContent)
    }
    
    return backupPath
  }

  /**
   * Create full backup of all translation files
   */
  private async createFullBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = `${this.BACKUP_DIR}/full-backup-${timestamp}`
    
    // In a real implementation, backup all translation files
    console.log(`Creating full backup at ${backupPath}`)
    
    return backupPath
  }

  /**
   * Validate translation structure recursively
   */
  private validateTranslationStructure(
    data: TranslationData,
    keyPath: string,
    errors: TranslationValidationError[],
    warnings: TranslationValidationWarning[]
  ): void {
    for (const [key, value] of Object.entries(data)) {
      const fullKey = keyPath ? `${keyPath}.${key}` : key

      if (typeof value === 'string') {
        // Validate interpolation syntax
        this.validateInterpolation(fullKey, value, errors)
      } else if (typeof value === 'object' && value !== null) {
        if (this.isPluralTranslation(value)) {
          // Validate plural translation
          this.validatePluralTranslation(fullKey, value as PluralTranslation, errors, warnings)
        } else {
          // Recurse into nested object
          this.validateTranslationStructure(value as TranslationData, fullKey, errors, warnings)
        }
      } else {
        errors.push({
          type: 'invalid_format',
          key: fullKey,
          message: `Invalid value type for key ${fullKey}`,
          severity: 'error'
        })
      }
    }
  }

  /**
   * Validate interpolation syntax in translation strings
   */
  private validateInterpolation(key: string, value: string, errors: TranslationValidationError[]): void {
    // Check for unmatched braces
    const openBraces = (value.match(/\{/g) || []).length
    const closeBraces = (value.match(/\}/g) || []).length
    
    if (openBraces !== closeBraces) {
      errors.push({
        type: 'invalid_interpolation',
        key,
        message: `Unmatched braces in interpolation for key ${key}`,
        severity: 'error'
      })
    }

    // Check for invalid interpolation patterns
    const invalidPatterns = value.match(/\{[^}]*\{|\}[^{]*\}/g)
    if (invalidPatterns) {
      errors.push({
        type: 'invalid_interpolation',
        key,
        message: `Invalid interpolation pattern in key ${key}: ${invalidPatterns.join(', ')}`,
        severity: 'error'
      })
    }
  }

  /**
   * Validate plural translation structure
   */
  private validatePluralTranslation(
    key: string,
    plural: PluralTranslation,
    errors: TranslationValidationError[],
    warnings: TranslationValidationWarning[]
  ): void {
    // Check required forms
    if (!plural.one || !plural.other) {
      errors.push({
        type: 'invalid_plural',
        key,
        message: `Plural translation missing required forms (one, other) for key ${key}`,
        severity: 'error'
      })
    }

    // Check for unused forms
    const usedForms = Object.keys(plural)
    const standardForms = ['zero', 'one', 'two', 'few', 'many', 'other']
    const unusedForms = usedForms.filter(form => !standardForms.includes(form))
    
    if (unusedForms.length > 0) {
      warnings.push({
        type: 'inconsistent_format',
        key,
        message: `Unknown plural forms in key ${key}: ${unusedForms.join(', ')}`
      })
    }
  }

  /**
   * Check if object is a plural translation
   */
  private isPluralTranslation(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false
    
    const keys = Object.keys(obj)
    const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
    
    return keys.some(key => pluralKeys.includes(key)) && 
           keys.every(key => pluralKeys.includes(key) && typeof obj[key] === 'string')
  }

  /**
   * Calculate checksum for translation data
   */
  private calculateChecksum(data: TranslationData): string {
    const content = JSON.stringify(data, Object.keys(data).sort())
    
    // Simple hash function (in production, use a proper hash like SHA-256)
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return hash.toString(16)
  }

  /**
   * Count total translation keys
   */
  private countTranslationKeys(data: TranslationData): number {
    let count = 0
    
    for (const value of Object.values(data)) {
      if (typeof value === 'string') {
        count++
      } else if (typeof value === 'object' && value !== null) {
        if (this.isPluralTranslation(value)) {
          count++
        } else {
          count += this.countTranslationKeys(value as TranslationData)
        }
      }
    }
    
    return count
  }

  /**
   * Calculate completion rate (non-empty translations)
   */
  private calculateCompletionRate(data: TranslationData): number {
    let total = 0
    let completed = 0
    
    const countCompletions = (obj: TranslationData) => {
      for (const value of Object.values(obj)) {
        if (typeof value === 'string') {
          total++
          if (value.trim().length > 0) {
            completed++
          }
        } else if (typeof value === 'object' && value !== null) {
          if (this.isPluralTranslation(value)) {
            total++
            const pluralValue = value as PluralTranslation
            if (pluralValue.one?.trim() && pluralValue.other?.trim()) {
              completed++
            }
          } else {
            countCompletions(value as TranslationData)
          }
        }
      }
    }
    
    countCompletions(data)
    return total > 0 ? (completed / total) * 100 : 0
  }

  /**
   * Normalize translation data structure
   */
  private normalizeTranslationData(data: TranslationData): TranslationData {
    const normalized: TranslationData = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        normalized[key] = value.trim()
      } else if (typeof value === 'object' && value !== null) {
        if (this.isPluralTranslation(value)) {
          normalized[key] = value
        } else {
          normalized[key] = this.normalizeTranslationData(value as TranslationData)
        }
      }
    }
    
    return normalized
  }

  /**
   * Extract translations from loaded data (removing metadata)
   */
  private extractTranslationsFromData(data: any): TranslationData {
    const { _metadata, ...translations } = data
    return translations
  }

  /**
   * Prepare file content with metadata
   */
  private prepareFileContent(translationFile: TranslationFile): any {
    return {
      _metadata: {
        version: translationFile.version,
        lastUpdated: translationFile.lastUpdated.toISOString(),
        namespace: translationFile.namespace,
        language: translationFile.language
      },
      ...translationFile.translations
    }
  }

  /**
   * Get file path for translation file
   */
  private getTranslationFilePath(language: string, namespace: string): string {
    return `${this.TRANSLATIONS_DIR}/${language}${namespace !== 'default' ? `-${namespace}` : ''}.json`
  }

  /**
   * Increment version number
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number)
    parts[2] = (parts[2] || 0) + 1
    return parts.join('.')
  }

  /**
   * Generate unique change ID
   */
  private generateChangeId(): string {
    return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Merge translation objects
   */
  private mergeTranslations(existing: TranslationData, incoming: TranslationData): TranslationData {
    const merged = { ...existing }
    
    for (const [key, value] of Object.entries(incoming)) {
      if (typeof value === 'object' && value !== null && !this.isPluralTranslation(value)) {
        if (typeof merged[key] === 'object' && merged[key] !== null && !this.isPluralTranslation(merged[key])) {
          merged[key] = this.mergeTranslations(merged[key] as TranslationData, value as TranslationData)
        } else {
          merged[key] = value
        }
      } else {
        merged[key] = value
      }
    }
    
    return merged
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(data: Record<string, any>, options: TranslationExportOptions): string {
    const rows: string[] = []
    const languages = Object.keys(data)
    
    // Header
    rows.push(['Key', ...languages].join(','))
    
    // Collect all keys
    const allKeys = new Set<string>()
    const collectKeys = (obj: any, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('_')) continue
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'string') {
          allKeys.add(fullKey)
        } else if (typeof value === 'object' && value !== null) {
          collectKeys(value, fullKey)
        }
      }
    }
    
    languages.forEach(lang => collectKeys(data[lang]))
    
    // Data rows
    for (const key of Array.from(allKeys).sort()) {
      const values = [key]
      for (const lang of languages) {
        const value = this.getNestedValue(data[lang], key) || ''
        values.push(`"${value.replace(/"/g, '""')}"`)
      }
      rows.push(values.join(','))
    }
    
    return rows.join('\n')
  }

  /**
   * Export to YAML format
   */
  private exportToYAML(data: Record<string, any>): string {
    // Simple YAML export (in production, use a proper YAML library)
    const yamlLines: string[] = []
    
    for (const [language, translations] of Object.entries(data)) {
      yamlLines.push(`${language}:`)
      yamlLines.push(...this.objectToYAML(translations, 1))
    }
    
    return yamlLines.join('\n')
  }

  /**
   * Export to PO format
   */
  private exportToPO(data: Record<string, any>, sourceLanguage: string): string {
    const lines: string[] = []
    
    lines.push('# Translation file generated by BAOBAB HOPE Translation Manager')
    lines.push(`# Source language: ${sourceLanguage}`)
    lines.push('')
    
    const sourceData = data[sourceLanguage] || {}
    
    for (const [targetLang, translations] of Object.entries(data)) {
      if (targetLang === sourceLanguage) continue
      
      lines.push(`# Target language: ${targetLang}`)
      lines.push('')
      
      this.addPOEntries(sourceData, translations, '', lines)
    }
    
    return lines.join('\n')
  }

  /**
   * Parse CSV format
   */
  private parseCSV(csvData: string): Record<string, TranslationData> {
    const lines = csvData.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('Invalid CSV format')
    
    const headers = lines[0].split(',').map(h => h.trim())
    const keyColumn = headers[0]
    const languages = headers.slice(1)
    
    const result: Record<string, TranslationData> = {}
    languages.forEach(lang => result[lang] = {})
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i])
      const key = values[0]
      
      for (let j = 1; j < values.length && j <= languages.length; j++) {
        const lang = languages[j - 1]
        const value = values[j]
        if (value) {
          this.setNestedValue(result[lang], key, value)
        }
      }
    }
    
    return result
  }

  /**
   * Parse YAML format
   */
  private parseYAML(yamlData: string): Record<string, TranslationData> {
    // Simple YAML parser (in production, use a proper YAML library)
    throw new Error('YAML parsing not implemented in this demo')
  }

  /**
   * Helper methods for nested object operations
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  private objectToYAML(obj: any, indent: number): string[] {
    const lines: string[] = []
    const spaces = '  '.repeat(indent)
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        lines.push(`${spaces}${key}: "${value}"`)
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`${spaces}${key}:`)
        lines.push(...this.objectToYAML(value, indent + 1))
      }
    }
    
    return lines
  }

  private addPOEntries(source: any, target: any, prefix: string, lines: string[]): void {
    for (const [key, value] of Object.entries(source)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string') {
        const targetValue = this.getNestedValue(target, fullKey) || ''
        lines.push(`msgid "${value}"`)
        lines.push(`msgstr "${targetValue}"`)
        lines.push('')
      } else if (typeof value === 'object' && value !== null) {
        this.addPOEntries(value, target, fullKey, lines)
      }
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }
}

// Export singleton instance
export const translationFileManager = TranslationFileManager.getInstance()