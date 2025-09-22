// Translation validation service with comprehensive integrity checking

import { TranslationData, TranslationFile, PluralTranslation, Language } from './types'
import { getLanguageByCode, getAllLanguages } from './languages'

export interface ValidationRule {
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  check: (data: TranslationData, language: string, context?: ValidationContext) => ValidationIssue[]
}

export interface ValidationIssue {
  rule: string
  severity: 'error' | 'warning' | 'info'
  key: string
  message: string
  suggestion?: string
  context?: any
}

export interface ValidationContext {
  referenceLanguage?: string
  referenceData?: TranslationData
  namespace?: string
  strictMode?: boolean
}

export interface ValidationReport {
  language: string
  namespace: string
  timestamp: Date
  summary: {
    totalKeys: number
    errors: number
    warnings: number
    infos: number
    completionRate: number
  }
  issues: ValidationIssue[]
  suggestions: string[]
}

export class TranslationValidator {
  private static instance: TranslationValidator
  private validationRules: ValidationRule[] = []

  private constructor() {
    this.initializeDefaultRules()
  }

  static getInstance(): TranslationValidator {
    if (!TranslationValidator.instance) {
      TranslationValidator.instance = new TranslationValidator()
    }
    return TranslationValidator.instance
  }

  /**
   * Validate translation file with comprehensive checks
   */
  async validateTranslationFile(
    translationFile: TranslationFile,
    context?: ValidationContext
  ): Promise<ValidationReport> {
    const issues: ValidationIssue[] = []
    
    // Run all validation rules
    for (const rule of this.validationRules) {
      try {
        const ruleIssues = rule.check(translationFile.translations, translationFile.language, context)
        issues.push(...ruleIssues)
      } catch (error) {
        console.error(`Validation rule ${rule.name} failed:`, error)
        issues.push({
          rule: rule.name,
          severity: 'error',
          key: '_system',
          message: `Validation rule failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
      }
    }

    // Calculate summary
    const summary = {
      totalKeys: this.countKeys(translationFile.translations),
      errors: issues.filter(i => i.severity === 'error').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
      infos: issues.filter(i => i.severity === 'info').length,
      completionRate: this.calculateCompletionRate(translationFile.translations)
    }

    // Generate suggestions
    const suggestions = this.generateSuggestions(issues, translationFile.language)

    return {
      language: translationFile.language,
      namespace: translationFile.namespace,
      timestamp: new Date(),
      summary,
      issues,
      suggestions
    }
  }

  /**
   * Validate multiple translation files for consistency
   */
  async validateTranslationConsistency(
    translationFiles: TranslationFile[],
    referenceLanguage: string = 'en'
  ): Promise<ValidationReport[]> {
    const referenceFile = translationFiles.find(f => f.language === referenceLanguage)
    if (!referenceFile) {
      throw new Error(`Reference language ${referenceLanguage} not found`)
    }

    const reports: ValidationReport[] = []

    for (const file of translationFiles) {
      const context: ValidationContext = {
        referenceLanguage,
        referenceData: referenceFile.translations,
        namespace: file.namespace,
        strictMode: true
      }

      const report = await this.validateTranslationFile(file, context)
      reports.push(report)
    }

    return reports
  }

  /**
   * Add custom validation rule
   */
  addValidationRule(rule: ValidationRule): void {
    this.validationRules.push(rule)
  }

  /**
   * Remove validation rule by name
   */
  removeValidationRule(name: string): void {
    this.validationRules = this.validationRules.filter(rule => rule.name !== name)
  }

  /**
   * Get all validation rules
   */
  getValidationRules(): ValidationRule[] {
    return [...this.validationRules]
  }

  /**
   * Initialize default validation rules
   */
  private initializeDefaultRules(): void {
    // Rule: Check for empty translations
    this.addValidationRule({
      name: 'empty-translations',
      description: 'Check for empty or whitespace-only translations',
      severity: 'warning',
      check: (data, language) => {
        const issues: ValidationIssue[] = []
        this.traverseTranslations(data, (key, value) => {
          if (typeof value === 'string' && value.trim().length === 0) {
            issues.push({
              rule: 'empty-translations',
              severity: 'warning',
              key,
              message: `Empty translation for key: ${key}`,
              suggestion: 'Provide a translation or mark as intentionally empty'
            })
          }
        })
        return issues
      }
    })

    // Rule: Check for missing keys compared to reference
    this.addValidationRule({
      name: 'missing-keys',
      description: 'Check for keys missing compared to reference language',
      severity: 'error',
      check: (data, language, context) => {
        const issues: ValidationIssue[] = []
        if (!context?.referenceData) return issues

        const currentKeys = this.getAllKeys(data)
        const referenceKeys = this.getAllKeys(context.referenceData)

        for (const refKey of referenceKeys) {
          if (!currentKeys.has(refKey)) {
            issues.push({
              rule: 'missing-keys',
              severity: 'error',
              key: refKey,
              message: `Missing translation key: ${refKey}`,
              suggestion: `Add translation for key: ${refKey}`
            })
          }
        }

        return issues
      }
    })

    // Rule: Check for extra keys not in reference
    this.addValidationRule({
      name: 'extra-keys',
      description: 'Check for keys not present in reference language',
      severity: 'warning',
      check: (data, language, context) => {
        const issues: ValidationIssue[] = []
        if (!context?.referenceData) return issues

        const currentKeys = this.getAllKeys(data)
        const referenceKeys = this.getAllKeys(context.referenceData)

        for (const currentKey of currentKeys) {
          if (!referenceKeys.has(currentKey)) {
            issues.push({
              rule: 'extra-keys',
              severity: 'warning',
              key: currentKey,
              message: `Extra translation key not in reference: ${currentKey}`,
              suggestion: `Remove key or add to reference language: ${currentKey}`
            })
          }
        }

        return issues
      }
    })

    // Rule: Check interpolation syntax
    this.addValidationRule({
      name: 'interpolation-syntax',
      description: 'Check for valid interpolation syntax',
      severity: 'error',
      check: (data, language) => {
        const issues: ValidationIssue[] = []
        this.traverseTranslations(data, (key, value) => {
          if (typeof value === 'string') {
            // Check for unmatched braces
            const openBraces = (value.match(/\{/g) || []).length
            const closeBraces = (value.match(/\}/g) || []).length
            
            if (openBraces !== closeBraces) {
              issues.push({
                rule: 'interpolation-syntax',
                severity: 'error',
                key,
                message: `Unmatched braces in interpolation: ${key}`,
                suggestion: 'Ensure all { have matching }'
              })
            }

            // Check for nested braces
            if (value.includes('{{') || value.includes('}}')) {
              issues.push({
                rule: 'interpolation-syntax',
                severity: 'warning',
                key,
                message: `Nested braces detected in: ${key}`,
                suggestion: 'Use single braces for interpolation'
              })
            }
          }
        })
        return issues
      }
    })

    // Rule: Check plural forms
    this.addValidationRule({
      name: 'plural-forms',
      description: 'Check for correct plural forms based on language',
      severity: 'error',
      check: (data, language) => {
        const issues: ValidationIssue[] = []
        const languageConfig = getLanguageByCode(language)
        
        this.traverseTranslations(data, (key, value) => {
          if (this.isPluralTranslation(value)) {
            const plural = value as PluralTranslation
            
            // Check required forms
            if (!plural.one || !plural.other) {
              issues.push({
                rule: 'plural-forms',
                severity: 'error',
                key,
                message: `Missing required plural forms (one, other) for: ${key}`,
                suggestion: 'Add required plural forms: one, other'
              })
            }

            // Check language-specific requirements
            if (languageConfig) {
              const requiredForms = languageConfig.pluralRules.map(rule => rule.rule)
              for (const requiredForm of requiredForms) {
                if (requiredForm !== 'other' && !plural[requiredForm]) {
                  issues.push({
                    rule: 'plural-forms',
                    severity: 'warning',
                    key,
                    message: `Missing recommended plural form '${requiredForm}' for language ${language}: ${key}`,
                    suggestion: `Consider adding plural form: ${requiredForm}`
                  })
                }
              }
            }
          }
        })
        return issues
      }
    })

    // Rule: Check for consistent interpolation parameters
    this.addValidationRule({
      name: 'interpolation-consistency',
      description: 'Check for consistent interpolation parameters across languages',
      severity: 'warning',
      check: (data, language, context) => {
        const issues: ValidationIssue[] = []
        if (!context?.referenceData) return issues

        this.traverseTranslations(data, (key, value) => {
          if (typeof value === 'string') {
            const currentParams = this.extractInterpolationParams(value)
            const referenceValue = this.getNestedValue(context.referenceData!, key)
            
            if (typeof referenceValue === 'string') {
              const referenceParams = this.extractInterpolationParams(referenceValue)
              
              // Check for missing parameters
              for (const refParam of referenceParams) {
                if (!currentParams.includes(refParam)) {
                  issues.push({
                    rule: 'interpolation-consistency',
                    severity: 'warning',
                    key,
                    message: `Missing interpolation parameter '${refParam}' in: ${key}`,
                    suggestion: `Add parameter: {${refParam}}`
                  })
                }
              }

              // Check for extra parameters
              for (const currentParam of currentParams) {
                if (!referenceParams.includes(currentParam)) {
                  issues.push({
                    rule: 'interpolation-consistency',
                    severity: 'warning',
                    key,
                    message: `Extra interpolation parameter '${currentParam}' in: ${key}`,
                    suggestion: `Remove parameter or add to reference: {${currentParam}}`
                  })
                }
              }
            }
          }
        })
        return issues
      }
    })

    // Rule: Check for HTML/markup consistency
    this.addValidationRule({
      name: 'markup-consistency',
      description: 'Check for consistent HTML markup across languages',
      severity: 'warning',
      check: (data, language, context) => {
        const issues: ValidationIssue[] = []
        if (!context?.referenceData) return issues

        this.traverseTranslations(data, (key, value) => {
          if (typeof value === 'string') {
            const currentTags = this.extractHTMLTags(value)
            const referenceValue = this.getNestedValue(context.referenceData!, key)
            
            if (typeof referenceValue === 'string') {
              const referenceTags = this.extractHTMLTags(referenceValue)
              
              if (JSON.stringify(currentTags.sort()) !== JSON.stringify(referenceTags.sort())) {
                issues.push({
                  rule: 'markup-consistency',
                  severity: 'warning',
                  key,
                  message: `Inconsistent HTML markup in: ${key}`,
                  suggestion: `Ensure HTML tags match reference language`,
                  context: { current: currentTags, reference: referenceTags }
                })
              }
            }
          }
        })
        return issues
      }
    })

    // Rule: Check for translation length consistency
    this.addValidationRule({
      name: 'length-consistency',
      description: 'Check for reasonable translation length compared to reference',
      severity: 'info',
      check: (data, language, context) => {
        const issues: ValidationIssue[] = []
        if (!context?.referenceData) return issues

        this.traverseTranslations(data, (key, value) => {
          if (typeof value === 'string') {
            const referenceValue = this.getNestedValue(context.referenceData!, key)
            
            if (typeof referenceValue === 'string') {
              const lengthRatio = value.length / referenceValue.length
              
              // Flag if translation is significantly longer or shorter
              if (lengthRatio > 3 || lengthRatio < 0.3) {
                issues.push({
                  rule: 'length-consistency',
                  severity: 'info',
                  key,
                  message: `Translation length significantly different from reference: ${key}`,
                  suggestion: 'Review translation for accuracy and completeness',
                  context: { 
                    currentLength: value.length, 
                    referenceLength: referenceValue.length,
                    ratio: Math.round(lengthRatio * 100) / 100
                  }
                })
              }
            }
          }
        })
        return issues
      }
    })
  }

  /**
   * Helper methods
   */
  private traverseTranslations(
    data: TranslationData,
    callback: (key: string, value: any) => void,
    prefix: string = ''
  ): void {
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string' || this.isPluralTranslation(value)) {
        callback(fullKey, value)
      } else if (typeof value === 'object' && value !== null) {
        this.traverseTranslations(value as TranslationData, callback, fullKey)
      }
    }
  }

  private getAllKeys(data: TranslationData, prefix: string = ''): Set<string> {
    const keys = new Set<string>()
    
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string' || this.isPluralTranslation(value)) {
        keys.add(fullKey)
      } else if (typeof value === 'object' && value !== null) {
        const nestedKeys = this.getAllKeys(value as TranslationData, fullKey)
        nestedKeys.forEach(k => keys.add(k))
      }
    }
    
    return keys
  }

  private countKeys(data: TranslationData): number {
    return this.getAllKeys(data).size
  }

  private calculateCompletionRate(data: TranslationData): number {
    let total = 0
    let completed = 0
    
    this.traverseTranslations(data, (key, value) => {
      total++
      if (typeof value === 'string' && value.trim().length > 0) {
        completed++
      } else if (this.isPluralTranslation(value)) {
        const plural = value as PluralTranslation
        if (plural.one?.trim() && plural.other?.trim()) {
          completed++
        }
      }
    })
    
    return total > 0 ? (completed / total) * 100 : 0
  }

  private isPluralTranslation(value: any): boolean {
    if (typeof value !== 'object' || value === null) return false
    
    const keys = Object.keys(value)
    const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
    
    return keys.some(key => pluralKeys.includes(key)) && 
           keys.every(key => pluralKeys.includes(key) && typeof value[key] === 'string')
  }

  private extractInterpolationParams(text: string): string[] {
    const params: string[] = []
    const matches = text.match(/\{(\w+)(?::\w+)?\}/g)
    
    if (matches) {
      for (const match of matches) {
        const param = match.replace(/[{}]/g, '').split(':')[0]
        if (!params.includes(param)) {
          params.push(param)
        }
      }
    }
    
    return params
  }

  private extractHTMLTags(text: string): string[] {
    const tags: string[] = []
    const matches = text.match(/<\/?[\w\s="/.':;#-\/\?]+>/gi)
    
    if (matches) {
      for (const match of matches) {
        const tag = match.toLowerCase().replace(/\s+/g, ' ').trim()
        tags.push(tag)
      }
    }
    
    return tags
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private generateSuggestions(issues: ValidationIssue[], language: string): string[] {
    const suggestions: string[] = []
    const errorCount = issues.filter(i => i.severity === 'error').length
    const warningCount = issues.filter(i => i.severity === 'warning').length
    
    if (errorCount > 0) {
      suggestions.push(`Fix ${errorCount} critical error${errorCount > 1 ? 's' : ''} before deployment`)
    }
    
    if (warningCount > 0) {
      suggestions.push(`Review ${warningCount} warning${warningCount > 1 ? 's' : ''} for quality improvement`)
    }
    
    // Language-specific suggestions
    const languageConfig = getLanguageByCode(language)
    if (languageConfig?.direction === 'rtl') {
      suggestions.push('Ensure RTL layout compatibility for this language')
    }
    
    if (issues.some(i => i.rule === 'missing-keys')) {
      suggestions.push('Consider using translation management tools for key synchronization')
    }
    
    if (issues.some(i => i.rule === 'interpolation-syntax')) {
      suggestions.push('Review interpolation syntax documentation')
    }
    
    return suggestions
  }
}

// Export singleton instance
export const translationValidator = TranslationValidator.getInstance()