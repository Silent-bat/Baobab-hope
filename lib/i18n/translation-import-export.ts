// Translation import/export functionality supporting multiple formats

import { TranslationData, TranslationFile, PluralTranslation } from './types'
import { translationFileManager } from './translation-file-manager'

export interface ExportFormat {
  name: string
  extension: string
  mimeType: string
  description: string
}

export interface ImportExportOptions {
  includeMetadata?: boolean
  includeEmpty?: boolean
  flattenStructure?: boolean
  keyPrefix?: string
  keySeparator?: string
  pluralSeparator?: string
  encoding?: 'utf-8' | 'utf-16' | 'ascii'
}

export interface ExportResult {
  success: boolean
  data: string | Buffer
  filename: string
  format: ExportFormat
  metadata: {
    languages: string[]
    keyCount: number
    fileSize: number
    exportedAt: Date
  }
}

export interface ImportResult {
  success: boolean
  imported: number
  updated: number
  skipped: number
  errors: string[]
  warnings: string[]
  languages: string[]
}

export class TranslationImportExport {
  private static instance: TranslationImportExport
  
  private readonly supportedFormats: Record<string, ExportFormat> = {
    json: {
      name: 'JSON',
      extension: 'json',
      mimeType: 'application/json',
      description: 'JavaScript Object Notation - structured format'
    },
    csv: {
      name: 'CSV',
      extension: 'csv',
      mimeType: 'text/csv',
      description: 'Comma Separated Values - spreadsheet compatible'
    },
    xlsx: {
      name: 'Excel',
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      description: 'Microsoft Excel format'
    },
    po: {
      name: 'Gettext PO',
      extension: 'po',
      mimeType: 'text/plain',
      description: 'GNU Gettext Portable Object format'
    },
    yaml: {
      name: 'YAML',
      extension: 'yaml',
      mimeType: 'text/yaml',
      description: 'YAML Ain\'t Markup Language - human readable'
    },
    xml: {
      name: 'XML',
      extension: 'xml',
      mimeType: 'application/xml',
      description: 'Extensible Markup Language'
    },
    properties: {
      name: 'Properties',
      extension: 'properties',
      mimeType: 'text/plain',
      description: 'Java Properties format'
    },
    resx: {
      name: 'ResX',
      extension: 'resx',
      mimeType: 'application/xml',
      description: '.NET Resource format'
    }
  }

  private constructor() {}

  static getInstance(): TranslationImportExport {
    if (!TranslationImportExport.instance) {
      TranslationImportExport.instance = new TranslationImportExport()
    }
    return TranslationImportExport.instance
  }

  /**
   * Get supported export formats
   */
  getSupportedFormats(): ExportFormat[] {
    return Object.values(this.supportedFormats)
  }

  /**
   * Export translations to specified format
   */
  async exportTranslations(
    languages: string[],
    format: string,
    options: ImportExportOptions = {}
  ): Promise<ExportResult> {
    const exportFormat = this.supportedFormats[format.toLowerCase()]
    if (!exportFormat) {
      throw new Error(`Unsupported export format: ${format}`)
    }

    // Collect translation data
    const translationData: Record<string, TranslationData> = {}
    let totalKeys = 0

    for (const language of languages) {
      const translationFile = await translationFileManager.loadTranslationFile(language)
      if (translationFile) {
        translationData[language] = translationFile.translations
        totalKeys += this.countKeys(translationFile.translations)
      }
    }

    // Export based on format
    let exportedData: string | Buffer
    let filename: string

    switch (format.toLowerCase()) {
      case 'json':
        exportedData = this.exportToJSON(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.json`
        break

      case 'csv':
        exportedData = this.exportToCSV(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'xlsx':
        exportedData = await this.exportToExcel(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.xlsx`
        break

      case 'po':
        exportedData = this.exportToPO(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.po`
        break

      case 'yaml':
        exportedData = this.exportToYAML(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.yaml`
        break

      case 'xml':
        exportedData = this.exportToXML(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.xml`
        break

      case 'properties':
        exportedData = this.exportToProperties(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.properties`
        break

      case 'resx':
        exportedData = this.exportToResX(translationData, options)
        filename = `translations-${new Date().toISOString().split('T')[0]}.resx`
        break

      default:
        throw new Error(`Export format ${format} not implemented`)
    }

    const fileSize = typeof exportedData === 'string' ? 
      new Blob([exportedData]).size : 
      exportedData.length

    return {
      success: true,
      data: exportedData,
      filename,
      format: exportFormat,
      metadata: {
        languages,
        keyCount: totalKeys,
        fileSize,
        exportedAt: new Date()
      }
    }
  }

  /**
   * Import translations from various formats
   */
  async importTranslations(
    data: string | Buffer,
    format: string,
    options: ImportExportOptions = {}
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      warnings: [],
      languages: []
    }

    try {
      let parsedData: Record<string, TranslationData>

      // Parse data based on format
      switch (format.toLowerCase()) {
        case 'json':
          parsedData = this.parseJSON(data.toString(), options)
          break

        case 'csv':
          parsedData = this.parseCSV(data.toString(), options)
          break

        case 'xlsx':
          parsedData = await this.parseExcel(data as Buffer, options)
          break

        case 'po':
          parsedData = this.parsePO(data.toString(), options)
          break

        case 'yaml':
          parsedData = this.parseYAML(data.toString(), options)
          break

        case 'xml':
          parsedData = this.parseXML(data.toString(), options)
          break

        case 'properties':
          parsedData = this.parseProperties(data.toString(), options)
          break

        case 'resx':
          parsedData = this.parseResX(data.toString(), options)
          break

        default:
          throw new Error(`Import format ${format} not supported`)
      }

      // Process each language
      for (const [language, translations] of Object.entries(parsedData)) {
        if (language.startsWith('_')) continue // Skip metadata

        try {
          result.languages.push(language)

          // Check if language file exists
          const existingFile = await translationFileManager.loadTranslationFile(language)
          
          if (existingFile) {
            // Update existing file
            const mergedTranslations = this.mergeTranslations(existingFile.translations, translations)
            existingFile.translations = mergedTranslations
            await translationFileManager.saveTranslationFile(existingFile)
            result.updated++
          } else {
            // Create new file
            const newFile = await translationFileManager.createTranslationFile(language, 'default', translations)
            await translationFileManager.saveTranslationFile(newFile)
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
   * Export to JSON format
   */
  private exportToJSON(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const exportData: any = {}

    if (options.includeMetadata) {
      exportData._metadata = {
        exportedAt: new Date().toISOString(),
        format: 'json',
        languages: Object.keys(data),
        keyCount: Object.values(data).reduce((sum, translations) => sum + this.countKeys(translations), 0)
      }
    }

    for (const [language, translations] of Object.entries(data)) {
      if (options.flattenStructure) {
        exportData[language] = this.flattenTranslations(translations, options.keySeparator || '.')
      } else {
        exportData[language] = this.filterEmptyTranslations(translations, options.includeEmpty || false)
      }
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Export to CSV format
   */
  private exportToCSV(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const languages = Object.keys(data)
    const allKeys = new Set<string>()
    const flattenedData: Record<string, Record<string, string>> = {}

    // Flatten all translations and collect keys
    for (const [language, translations] of Object.entries(data)) {
      flattenedData[language] = this.flattenTranslations(translations, options.keySeparator || '.')
      Object.keys(flattenedData[language]).forEach(key => allKeys.add(key))
    }

    const sortedKeys = Array.from(allKeys).sort()
    const rows: string[] = []

    // Header row
    rows.push(['Key', ...languages].map(this.escapeCSVValue).join(','))

    // Data rows
    for (const key of sortedKeys) {
      const values = [key]
      for (const language of languages) {
        const value = flattenedData[language][key] || ''
        if (!options.includeEmpty && !value.trim()) {
          continue
        }
        values.push(value)
      }
      
      if (values.length > 1) { // Only include rows with at least one translation
        rows.push(values.map(this.escapeCSVValue).join(','))
      }
    }

    return rows.join('\n')
  }

  /**
   * Export to Excel format (simplified - in production use a proper Excel library)
   */
  private async exportToExcel(data: Record<string, TranslationData>, options: ImportExportOptions): Promise<Buffer> {
    // This is a placeholder - in production, use libraries like 'xlsx' or 'exceljs'
    const csvData = this.exportToCSV(data, options)
    return Buffer.from(csvData, 'utf-8')
  }

  /**
   * Export to PO format
   */
  private exportToPO(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const lines: string[] = []
    const languages = Object.keys(data)
    const sourceLanguage = languages[0] || 'en'
    
    lines.push('# Translation file generated by BAOBAB HOPE Translation Manager')
    lines.push(`# Generated on: ${new Date().toISOString()}`)
    lines.push('msgid ""')
    lines.push('msgstr ""')
    lines.push('"Content-Type: text/plain; charset=UTF-8\\n"')
    lines.push('')

    const sourceData = data[sourceLanguage] || {}
    const flattenedSource = this.flattenTranslations(sourceData, options.keySeparator || '.')

    for (const [key, value] of Object.entries(flattenedSource)) {
      if (!options.includeEmpty && !value.trim()) continue

      lines.push(`#: ${key}`)
      lines.push(`msgid "${this.escapePOString(value)}"`)
      
      // Add translations for other languages as comments
      for (const language of languages.slice(1)) {
        const translationValue = this.getNestedValue(data[language], key) || ''
        if (translationValue) {
          lines.push(`# ${language}: "${this.escapePOString(translationValue)}"`)
        }
      }
      
      lines.push('msgstr ""')
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Export to YAML format
   */
  private exportToYAML(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const lines: string[] = []
    
    if (options.includeMetadata) {
      lines.push('# Translation file generated by BAOBAB HOPE Translation Manager')
      lines.push(`# Generated on: ${new Date().toISOString()}`)
      lines.push('')
    }

    for (const [language, translations] of Object.entries(data)) {
      lines.push(`${language}:`)
      lines.push(...this.objectToYAML(translations, 1, options))
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Export to XML format
   */
  private exportToXML(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const lines: string[] = []
    
    lines.push('<?xml version="1.0" encoding="UTF-8"?>')
    lines.push('<translations>')
    
    if (options.includeMetadata) {
      lines.push('  <metadata>')
      lines.push(`    <exportedAt>${new Date().toISOString()}</exportedAt>`)
      lines.push(`    <format>xml</format>`)
      lines.push('  </metadata>')
    }

    for (const [language, translations] of Object.entries(data)) {
      lines.push(`  <language code="${language}">`)
      lines.push(...this.objectToXML(translations, 2, options))
      lines.push('  </language>')
    }

    lines.push('</translations>')
    return lines.join('\n')
  }

  /**
   * Export to Properties format
   */
  private exportToProperties(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const lines: string[] = []
    
    if (options.includeMetadata) {
      lines.push(`# Translation file generated by BAOBAB HOPE Translation Manager`)
      lines.push(`# Generated on: ${new Date().toISOString()}`)
      lines.push('')
    }

    for (const [language, translations] of Object.entries(data)) {
      lines.push(`# Language: ${language}`)
      const flattened = this.flattenTranslations(translations, options.keySeparator || '.')
      
      for (const [key, value] of Object.entries(flattened)) {
        if (!options.includeEmpty && !value.trim()) continue
        const prefixedKey = options.keyPrefix ? `${options.keyPrefix}.${key}` : key
        lines.push(`${prefixedKey}=${this.escapePropertiesValue(value)}`)
      }
      
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Export to ResX format (.NET resources)
   */
  private exportToResX(data: Record<string, TranslationData>, options: ImportExportOptions): string {
    const lines: string[] = []
    
    lines.push('<?xml version="1.0" encoding="utf-8"?>')
    lines.push('<root>')
    lines.push('  <resheader name="resmimetype">')
    lines.push('    <value>text/microsoft-resx</value>')
    lines.push('  </resheader>')
    lines.push('  <resheader name="version">')
    lines.push('    <value>2.0</value>')
    lines.push('  </resheader>')

    // For ResX, we'll export the first language or combine all
    const firstLanguage = Object.keys(data)[0]
    if (firstLanguage) {
      const flattened = this.flattenTranslations(data[firstLanguage], options.keySeparator || '.')
      
      for (const [key, value] of Object.entries(flattened)) {
        if (!options.includeEmpty && !value.trim()) continue
        
        lines.push(`  <data name="${this.escapeXMLAttribute(key)}" xml:space="preserve">`)
        lines.push(`    <value>${this.escapeXMLContent(value)}</value>`)
        lines.push('  </data>')
      }
    }

    lines.push('</root>')
    return lines.join('\n')
  }

  /**
   * Parse JSON format
   */
  private parseJSON(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    const parsed = JSON.parse(data)
    const result: Record<string, TranslationData> = {}

    for (const [key, value] of Object.entries(parsed)) {
      if (key.startsWith('_')) continue // Skip metadata
      
      if (options.flattenStructure && typeof value === 'object') {
        result[key] = this.unflattenTranslations(value as Record<string, string>, options.keySeparator || '.')
      } else {
        result[key] = value as TranslationData
      }
    }

    return result
  }

  /**
   * Parse CSV format
   */
  private parseCSV(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    const lines = data.split('\n').filter(line => line.trim())
    if (lines.length < 2) throw new Error('Invalid CSV format')

    const headers = this.parseCSVLine(lines[0])
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
        
        if (value && (options.includeEmpty || value.trim())) {
          this.setNestedValue(result[lang], key, value)
        }
      }
    }

    return result
  }

  /**
   * Parse Excel format (placeholder)
   */
  private async parseExcel(data: Buffer, options: ImportExportOptions): Promise<Record<string, TranslationData>> {
    // This is a placeholder - in production, use libraries like 'xlsx'
    throw new Error('Excel parsing not implemented in this demo')
  }

  /**
   * Parse PO format
   */
  private parsePO(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    const result: Record<string, TranslationData> = {}
    const lines = data.split('\n')
    
    let currentKey = ''
    let currentValue = ''
    let inMsgStr = false
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('msgid ')) {
        if (currentKey && currentValue) {
          this.setNestedValue(result['default'] = result['default'] || {}, currentKey, currentValue)
        }
        currentKey = this.unescapePOString(trimmed.substring(6))
        currentValue = ''
        inMsgStr = false
      } else if (trimmed.startsWith('msgstr ')) {
        currentValue = this.unescapePOString(trimmed.substring(7))
        inMsgStr = true
      } else if (trimmed.startsWith('"') && inMsgStr) {
        currentValue += this.unescapePOString(trimmed)
      }
    }
    
    // Handle last entry
    if (currentKey && currentValue) {
      this.setNestedValue(result['default'] = result['default'] || {}, currentKey, currentValue)
    }

    return result
  }

  /**
   * Parse YAML format (simplified)
   */
  private parseYAML(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    // This is a simplified YAML parser - in production, use a proper YAML library
    throw new Error('YAML parsing not implemented in this demo')
  }

  /**
   * Parse XML format
   */
  private parseXML(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    // This is a simplified XML parser - in production, use a proper XML library
    throw new Error('XML parsing not implemented in this demo')
  }

  /**
   * Parse Properties format
   */
  private parseProperties(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    const result: Record<string, TranslationData> = { default: {} }
    const lines = data.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const equalIndex = trimmed.indexOf('=')
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim()
          const value = this.unescapePropertiesValue(trimmed.substring(equalIndex + 1).trim())
          
          if (options.includeEmpty || value.trim()) {
            this.setNestedValue(result.default, key, value)
          }
        }
      }
    }

    return result
  }

  /**
   * Parse ResX format
   */
  private parseResX(data: string, options: ImportExportOptions): Record<string, TranslationData> {
    // This is a simplified ResX parser - in production, use a proper XML library
    throw new Error('ResX parsing not implemented in this demo')
  }

  /**
   * Helper methods
   */
  private countKeys(data: TranslationData): number {
    let count = 0
    for (const value of Object.values(data)) {
      if (typeof value === 'string') {
        count++
      } else if (typeof value === 'object' && value !== null) {
        if (this.isPluralTranslation(value)) {
          count++
        } else {
          count += this.countKeys(value as TranslationData)
        }
      }
    }
    return count
  }

  private flattenTranslations(data: TranslationData, separator: string = '.'): Record<string, string> {
    const flattened: Record<string, string> = {}
    
    const flatten = (obj: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}${separator}${key}` : key
        
        if (typeof value === 'string') {
          flattened[fullKey] = value
        } else if (this.isPluralTranslation(value)) {
          flattened[fullKey] = JSON.stringify(value)
        } else if (typeof value === 'object' && value !== null) {
          flatten(value, fullKey)
        }
      }
    }
    
    flatten(data)
    return flattened
  }

  private unflattenTranslations(flattened: Record<string, string>, separator: string = '.'): TranslationData {
    const result: TranslationData = {}
    
    for (const [key, value] of Object.entries(flattened)) {
      this.setNestedValue(result, key.split(separator), value)
    }
    
    return result
  }

  private filterEmptyTranslations(data: TranslationData, includeEmpty: boolean): TranslationData {
    if (includeEmpty) return data
    
    const filtered: TranslationData = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        if (value.trim()) {
          filtered[key] = value
        }
      } else if (typeof value === 'object' && value !== null) {
        if (this.isPluralTranslation(value)) {
          const plural = value as PluralTranslation
          if (plural.one?.trim() || plural.other?.trim()) {
            filtered[key] = value
          }
        } else {
          const nestedFiltered = this.filterEmptyTranslations(value as TranslationData, includeEmpty)
          if (Object.keys(nestedFiltered).length > 0) {
            filtered[key] = nestedFiltered
          }
        }
      }
    }
    
    return filtered
  }

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

  private isPluralTranslation(value: any): boolean {
    if (typeof value !== 'object' || value === null) return false
    
    const keys = Object.keys(value)
    const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
    
    return keys.some(key => pluralKeys.includes(key)) && 
           keys.every(key => pluralKeys.includes(key) && typeof value[key] === 'string')
  }

  private setNestedValue(obj: any, path: string | string[], value: any): void {
    const keys = Array.isArray(path) ? path : path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private objectToYAML(obj: any, indent: number, options: ImportExportOptions): string[] {
    const lines: string[] = []
    const spaces = '  '.repeat(indent)
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        if (!options.includeEmpty && !value.trim()) continue
        lines.push(`${spaces}${key}: "${this.escapeYAMLString(value)}"`)
      } else if (this.isPluralTranslation(value)) {
        lines.push(`${spaces}${key}:`)
        for (const [pluralKey, pluralValue] of Object.entries(value as PluralTranslation)) {
          if (pluralValue) {
            lines.push(`${spaces}  ${pluralKey}: "${this.escapeYAMLString(pluralValue)}"`)
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`${spaces}${key}:`)
        lines.push(...this.objectToYAML(value, indent + 1, options))
      }
    }
    
    return lines
  }

  private objectToXML(obj: any, indent: number, options: ImportExportOptions): string[] {
    const lines: string[] = []
    const spaces = '  '.repeat(indent)
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        if (!options.includeEmpty && !value.trim()) continue
        lines.push(`${spaces}<entry key="${this.escapeXMLAttribute(key)}">${this.escapeXMLContent(value)}</entry>`)
      } else if (this.isPluralTranslation(value)) {
        lines.push(`${spaces}<plural key="${this.escapeXMLAttribute(key)}">`)
        for (const [pluralKey, pluralValue] of Object.entries(value as PluralTranslation)) {
          if (pluralValue) {
            lines.push(`${spaces}  <form type="${pluralKey}">${this.escapeXMLContent(pluralValue)}</form>`)
          }
        }
        lines.push(`${spaces}</plural>`)
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`${spaces}<group key="${this.escapeXMLAttribute(key)}">`)
        lines.push(...this.objectToXML(value, indent + 1, options))
        lines.push(`${spaces}</group>`)
      }
    }
    
    return lines
  }

  // Escape functions for different formats
  private escapeCSVValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  private escapePOString(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
  }

  private unescapePOString(value: string): string {
    return value.replace(/^"|"$/g, '').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\n/g, '\n')
  }

  private escapeYAMLString(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
  }

  private escapeXMLContent(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  private escapeXMLAttribute(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  private escapePropertiesValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/=/g, '\\=').replace(/:/g, '\\:').replace(/\n/g, '\\n')
  }

  private unescapePropertiesValue(value: string): string {
    return value.replace(/\\=/g, '=').replace(/\\:/g, ':').replace(/\\\\/g, '\\').replace(/\\n/g, '\n')
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
export const translationImportExport = TranslationImportExport.getInstance()