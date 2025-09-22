// Translation quality assurance system with validation, reporting, and metrics

import { TranslationData, Language } from './types'
import { getSupportedLanguageCodes, DEFAULT_LANGUAGE } from './languages'
import { i18nErrorHandler } from './error-handler'

export interface QualityIssue {
  id: string
  type: 'missing' | 'empty' | 'inconsistent' | 'formatting' | 'length' | 'placeholder' | 'encoding'
  severity: 'low' | 'medium' | 'high' | 'critical'
  language: string
  key: string
  message: string
  suggestion?: string
  context?: Record<string, any>
  timestamp: number
}

export interface QualityReport {
  language: string
  totalKeys: number
  translatedKeys: number
  missingKeys: number
  emptyKeys: number
  issues: QualityIssue[]
  completionPercentage: number
  qualityScore: number
  lastUpdated: number
}

export interface QualityMetrics {
  overallCompletion: number
  averageQuality: number
  totalIssues: number
  issuesByType: Record<string, number>
  issuesBySeverity: Record<string, number>
  languageRankings: Array<{
    language: string
    completion: number
    quality: number
    issues: number
  }>
}

export interface ValidationRule {
  id: string
  name: string
  description: string
  severity: QualityIssue['severity']
  enabled: boolean
  validate: (key: string, value: string, language: string, context?: any) => QualityIssue | null
}

export interface UserFeedback {
  id: string
  language: string
  key: string
  type: 'incorrect' | 'unclear' | 'missing' | 'suggestion' | 'cultural'
  message: string
  userAgent?: string
  url?: string
  timestamp: number
  status: 'open' | 'reviewed' | 'resolved' | 'dismissed'
  priority: 'low' | 'medium' | 'high'
}

export class TranslationQualityAssurance {
  private static instance: TranslationQualityAssurance
  private validationRules: Map<string, ValidationRule> = new Map()
  private qualityReports: Map<string, QualityReport> = new Map()
  private userFeedback: Map<string, UserFeedback[]> = new Map()
  private feedbackListeners: Array<(feedback: UserFeedback) => void> = []

  private constructor() {
    this.initializeValidationRules()
  }

  static getInstance(): TranslationQualityAssurance {
    if (!TranslationQualityAssurance.instance) {
      TranslationQualityAssurance.instance = new TranslationQualityAssurance()
    }
    return TranslationQualityAssurance.instance
  }

  /**
   * Initialize default validation rules
   */
  private initializeValidationRules(): void {
    const rules: ValidationRule[] = [
      {
        id: 'missing_translation',
        name: 'Missing Translation',
        description: 'Translation key exists in default language but missing in target language',
        severity: 'high',
        enabled: true,
        validate: (key, value, language) => {
          if (!value || value.trim() === '') {
            return {
              id: `missing_${language}_${key}_${Date.now()}`,
              type: 'missing',
              severity: 'high',
              language,
              key,
              message: `Missing translation for key "${key}" in language "${language}"`,
              suggestion: 'Add translation for this key',
              timestamp: Date.now()
            }
          }
          return null
        }
      },
      {
        id: 'empty_translation',
        name: 'Empty Translation',
        description: 'Translation exists but is empty or contains only whitespace',
        severity: 'medium',
        enabled: true,
        validate: (key, value, language) => {
          if (value && value.trim() === '') {
            return {
              id: `empty_${language}_${key}_${Date.now()}`,
              type: 'empty',
              severity: 'medium',
              language,
              key,
              message: `Empty translation for key "${key}" in language "${language}"`,
              suggestion: 'Provide meaningful translation content',
              timestamp: Date.now()
            }
          }
          return null
        }
      },
      {
        id: 'placeholder_mismatch',
        name: 'Placeholder Mismatch',
        description: 'Placeholders in translation do not match the default language',
        severity: 'high',
        enabled: true,
        validate: (key, value, language, context) => {
          if (!value || !context?.defaultValue) return null

          const defaultPlaceholders = this.extractPlaceholders(context.defaultValue)
          const translationPlaceholders = this.extractPlaceholders(value)

          const missingPlaceholders = defaultPlaceholders.filter(p => !translationPlaceholders.includes(p))
          const extraPlaceholders = translationPlaceholders.filter(p => !defaultPlaceholders.includes(p))

          if (missingPlaceholders.length > 0 || extraPlaceholders.length > 0) {
            return {
              id: `placeholder_${language}_${key}_${Date.now()}`,
              type: 'placeholder',
              severity: 'high',
              language,
              key,
              message: `Placeholder mismatch in "${key}" for language "${language}"`,
              suggestion: `Expected placeholders: ${defaultPlaceholders.join(', ')}. Found: ${translationPlaceholders.join(', ')}`,
              context: { missingPlaceholders, extraPlaceholders },
              timestamp: Date.now()
            }
          }
          return null
        }
      },
      {
        id: 'length_discrepancy',
        name: 'Length Discrepancy',
        description: 'Translation length significantly differs from default language',
        severity: 'low',
        enabled: true,
        validate: (key, value, language, context) => {
          if (!value || !context?.defaultValue) return null

          const defaultLength = context.defaultValue.length
          const translationLength = value.length
          const ratio = translationLength / defaultLength

          // Flag if translation is more than 3x longer or less than 0.3x the original
          if (ratio > 3 || ratio < 0.3) {
            return {
              id: `length_${language}_${key}_${Date.now()}`,
              type: 'length',
              severity: 'low',
              language,
              key,
              message: `Unusual length difference in "${key}" for language "${language}"`,
              suggestion: `Original: ${defaultLength} chars, Translation: ${translationLength} chars (ratio: ${ratio.toFixed(2)})`,
              context: { defaultLength, translationLength, ratio },
              timestamp: Date.now()
            }
          }
          return null
        }
      },
      {
        id: 'encoding_issues',
        name: 'Encoding Issues',
        description: 'Translation contains encoding issues or invalid characters',
        severity: 'medium',
        enabled: true,
        validate: (key, value, language) => {
          if (!value) return null

          // Check for common encoding issues
          const encodingIssues = [
            /�/g, // Replacement character
            /\uFFFD/g, // Unicode replacement character
            /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g // Control characters
          ]

          for (const pattern of encodingIssues) {
            if (pattern.test(value)) {
              return {
                id: `encoding_${language}_${key}_${Date.now()}`,
                type: 'encoding',
                severity: 'medium',
                language,
                key,
                message: `Encoding issues detected in "${key}" for language "${language}"`,
                suggestion: 'Check for proper UTF-8 encoding and remove invalid characters',
                timestamp: Date.now()
              }
            }
          }
          return null
        }
      },
      {
        id: 'formatting_consistency',
        name: 'Formatting Consistency',
        description: 'Translation formatting is inconsistent with default language',
        severity: 'low',
        enabled: true,
        validate: (key, value, language, context) => {
          if (!value || !context?.defaultValue) return null

          const defaultFormatting = this.analyzeFormatting(context.defaultValue)
          const translationFormatting = this.analyzeFormatting(value)

          const inconsistencies = this.compareFormatting(defaultFormatting, translationFormatting)

          if (inconsistencies.length > 0) {
            return {
              id: `formatting_${language}_${key}_${Date.now()}`,
              type: 'formatting',
              severity: 'low',
              language,
              key,
              message: `Formatting inconsistencies in "${key}" for language "${language}"`,
              suggestion: `Inconsistencies: ${inconsistencies.join(', ')}`,
              context: { inconsistencies },
              timestamp: Date.now()
            }
          }
          return null
        }
      }
    ]

    for (const rule of rules) {
      this.validationRules.set(rule.id, rule)
    }
  }

  /**
   * Validate translations for a specific language
   */
  async validateLanguage(language: string, translations: TranslationData): Promise<QualityReport> {
    const defaultTranslations = await this.getDefaultTranslations()
    const issues: QualityIssue[] = []
    
    const allKeys = this.getAllTranslationKeys(defaultTranslations)
    const translatedKeys = this.getAllTranslationKeys(translations)
    
    let translatedCount = 0
    let emptyCount = 0

    // Validate each key
    for (const key of allKeys) {
      const defaultValue = this.getNestedValue(defaultTranslations, key)
      const translatedValue = this.getNestedValue(translations, key)

      if (translatedValue) {
        translatedCount++
        
        if (typeof translatedValue === 'string' && translatedValue.trim() === '') {
          emptyCount++
        }
      }

      // Run validation rules
      for (const rule of this.validationRules.values()) {
        if (!rule.enabled) continue

        try {
          const issue = rule.validate(key, translatedValue as string, language, {
            defaultValue: defaultValue as string,
            allKeys,
            translatedKeys
          })

          if (issue) {
            issues.push(issue)
          }
        } catch (error) {
          console.warn(`Validation rule ${rule.id} failed for key ${key}:`, error)
        }
      }
    }

    // Calculate metrics
    const totalKeys = allKeys.length
    const missingKeys = totalKeys - translatedCount
    const completionPercentage = totalKeys > 0 ? (translatedCount / totalKeys) * 100 : 0
    const qualityScore = this.calculateQualityScore(issues, totalKeys)

    const report: QualityReport = {
      language,
      totalKeys,
      translatedKeys: translatedCount,
      missingKeys,
      emptyKeys: emptyCount,
      issues,
      completionPercentage,
      qualityScore,
      lastUpdated: Date.now()
    }

    this.qualityReports.set(language, report)
    return report
  }

  /**
   * Validate all supported languages
   */
  async validateAllLanguages(): Promise<Map<string, QualityReport>> {
    const languages = getSupportedLanguageCodes()
    const reports = new Map<string, QualityReport>()

    for (const language of languages) {
      try {
        const translations = await this.loadTranslations(language.code)
        const report = await this.validateLanguage(language.code, translations)
        reports.set(language.code, report)
      } catch (error) {
        console.error(`Failed to validate language ${language.code}:`, error)
      }
    }

    return reports
  }

  /**
   * Get quality metrics across all languages
   */
  getQualityMetrics(): QualityMetrics {
    const reports = Array.from(this.qualityReports.values())
    
    if (reports.length === 0) {
      return {
        overallCompletion: 0,
        averageQuality: 0,
        totalIssues: 0,
        issuesByType: {},
        issuesBySeverity: {},
        languageRankings: []
      }
    }

    const overallCompletion = reports.reduce((sum, report) => sum + report.completionPercentage, 0) / reports.length
    const averageQuality = reports.reduce((sum, report) => sum + report.qualityScore, 0) / reports.length
    const totalIssues = reports.reduce((sum, report) => sum + report.issues.length, 0)

    const issuesByType: Record<string, number> = {}
    const issuesBySeverity: Record<string, number> = {}

    for (const report of reports) {
      for (const issue of report.issues) {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1
        issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1
      }
    }

    const languageRankings = reports
      .map(report => ({
        language: report.language,
        completion: report.completionPercentage,
        quality: report.qualityScore,
        issues: report.issues.length
      }))
      .sort((a, b) => b.quality - a.quality)

    return {
      overallCompletion,
      averageQuality,
      totalIssues,
      issuesByType,
      issuesBySeverity,
      languageRankings
    }
  }

  /**
   * Submit user feedback about translation quality
   */
  submitUserFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp' | 'status'>): string {
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullFeedback: UserFeedback = {
      ...feedback,
      id: feedbackId,
      timestamp: Date.now(),
      status: 'open'
    }

    const languageFeedback = this.userFeedback.get(feedback.language) || []
    languageFeedback.push(fullFeedback)
    this.userFeedback.set(feedback.language, languageFeedback)

    // Notify listeners
    this.notifyFeedbackListeners(fullFeedback)

    // Log to analytics
    this.logFeedbackToAnalytics(fullFeedback)

    return feedbackId
  }

  /**
   * Get user feedback for a language
   */
  getUserFeedback(language: string, status?: UserFeedback['status']): UserFeedback[] {
    const feedback = this.userFeedback.get(language) || []
    
    if (status) {
      return feedback.filter(f => f.status === status)
    }
    
    return feedback
  }

  /**
   * Update feedback status
   */
  updateFeedbackStatus(feedbackId: string, status: UserFeedback['status']): boolean {
    for (const [language, feedbackList] of this.userFeedback.entries()) {
      const feedback = feedbackList.find(f => f.id === feedbackId)
      if (feedback) {
        feedback.status = status
        return true
      }
    }
    return false
  }

  /**
   * Get missing translation detection report
   */
  getMissingTranslationReport(): Record<string, string[]> {
    const report: Record<string, string[]> = {}
    
    for (const [language, qualityReport] of this.qualityReports.entries()) {
      const missingKeys = qualityReport.issues
        .filter(issue => issue.type === 'missing')
        .map(issue => issue.key)
      
      if (missingKeys.length > 0) {
        report[language] = missingKeys
      }
    }
    
    return report
  }

  /**
   * Get translation consistency report
   */
  getConsistencyReport(): Array<{
    key: string
    issues: Array<{ language: string; issue: string }>
  }> {
    const consistencyIssues = new Map<string, Array<{ language: string; issue: string }>>()
    
    for (const [language, qualityReport] of this.qualityReports.entries()) {
      for (const issue of qualityReport.issues) {
        if (issue.type === 'inconsistent' || issue.type === 'placeholder' || issue.type === 'formatting') {
          const keyIssues = consistencyIssues.get(issue.key) || []
          keyIssues.push({ language, issue: issue.message })
          consistencyIssues.set(issue.key, keyIssues)
        }
      }
    }
    
    return Array.from(consistencyIssues.entries()).map(([key, issues]) => ({
      key,
      issues
    }))
  }

  /**
   * Add custom validation rule
   */
  addValidationRule(rule: ValidationRule): void {
    this.validationRules.set(rule.id, rule)
  }

  /**
   * Remove validation rule
   */
  removeValidationRule(ruleId: string): boolean {
    return this.validationRules.delete(ruleId)
  }

  /**
   * Enable/disable validation rule
   */
  toggleValidationRule(ruleId: string, enabled: boolean): boolean {
    const rule = this.validationRules.get(ruleId)
    if (rule) {
      rule.enabled = enabled
      return true
    }
    return false
  }

  /**
   * Get all validation rules
   */
  getValidationRules(): ValidationRule[] {
    return Array.from(this.validationRules.values())
  }

  /**
   * Add feedback listener
   */
  addFeedbackListener(listener: (feedback: UserFeedback) => void): () => void {
    this.feedbackListeners.push(listener)
    
    return () => {
      const index = this.feedbackListeners.indexOf(listener)
      if (index > -1) {
        this.feedbackListeners.splice(index, 1)
      }
    }
  }

  /**
   * Generate automated quality metrics
   */
  generateAutomatedMetrics(): {
    translationVelocity: Record<string, number>
    qualityTrends: Record<string, Array<{ date: string; score: number }>>
    priorityLanguages: string[]
    criticalIssues: QualityIssue[]
  } {
    const reports = Array.from(this.qualityReports.values())
    
    // Calculate translation velocity (translations per day)
    const translationVelocity: Record<string, number> = {}
    
    // Quality trends (would need historical data)
    const qualityTrends: Record<string, Array<{ date: string; score: number }>> = {}
    
    // Priority languages (lowest completion first)
    const priorityLanguages = reports
      .sort((a, b) => a.completionPercentage - b.completionPercentage)
      .slice(0, 5)
      .map(report => report.language)
    
    // Critical issues across all languages
    const criticalIssues = reports
      .flatMap(report => report.issues)
      .filter(issue => issue.severity === 'critical' || issue.severity === 'high')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20)
    
    return {
      translationVelocity,
      qualityTrends,
      priorityLanguages,
      criticalIssues
    }
  }

  // Private helper methods

  private async getDefaultTranslations(): Promise<TranslationData> {
    return this.loadTranslations(DEFAULT_LANGUAGE)
  }

  private async loadTranslations(language: string): Promise<TranslationData> {
    // This would integrate with the translation loader
    const { TranslationLoader } = await import('./translation-loader')
    return TranslationLoader.loadTranslationFile(language)
  }

  private getAllTranslationKeys(translations: TranslationData, prefix = ''): string[] {
    const keys: string[] = []
    
    for (const [key, value] of Object.entries(translations)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string') {
        keys.push(fullKey)
      } else if (typeof value === 'object' && value !== null) {
        keys.push(...this.getAllTranslationKeys(value as TranslationData, fullKey))
      }
    }
    
    return keys
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private extractPlaceholders(text: string): string[] {
    const patterns = [
      /\{(\w+)\}/g,      // {placeholder}
      /\{\{(\w+)\}\}/g,  // {{placeholder}}
      /\$\{(\w+)\}/g     // ${placeholder}
    ]
    
    const placeholders = new Set<string>()
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        placeholders.add(match[1])
      }
    }
    
    return Array.from(placeholders)
  }

  private analyzeFormatting(text: string): {
    hasCapitalization: boolean
    hasPunctuation: boolean
    hasNumbers: boolean
    hasSpecialChars: boolean
  } {
    return {
      hasCapitalization: /[A-Z]/.test(text),
      hasPunctuation: /[.!?,:;]/.test(text),
      hasNumbers: /\d/.test(text),
      hasSpecialChars: /[^\w\s.!?,:;]/.test(text)
    }
  }

  private compareFormatting(defaultText: any, translation: any): string[] {
    const inconsistencies: string[] = []
    
    if (defaultText.hasCapitalization !== translation.hasCapitalization) {
      inconsistencies.push('capitalization')
    }
    if (defaultText.hasPunctuation !== translation.hasPunctuation) {
      inconsistencies.push('punctuation')
    }
    if (defaultText.hasNumbers !== translation.hasNumbers) {
      inconsistencies.push('numbers')
    }
    if (defaultText.hasSpecialChars !== translation.hasSpecialChars) {
      inconsistencies.push('special characters')
    }
    
    return inconsistencies
  }

  private calculateQualityScore(issues: QualityIssue[], totalKeys: number): number {
    if (totalKeys === 0) return 100
    
    const severityWeights = {
      low: 1,
      medium: 3,
      high: 7,
      critical: 15
    }
    
    const totalPenalty = issues.reduce((sum, issue) => {
      return sum + severityWeights[issue.severity]
    }, 0)
    
    const maxPossiblePenalty = totalKeys * severityWeights.critical
    const score = Math.max(0, 100 - (totalPenalty / maxPossiblePenalty) * 100)
    
    return Math.round(score * 100) / 100
  }

  private notifyFeedbackListeners(feedback: UserFeedback): void {
    for (const listener of this.feedbackListeners) {
      try {
        listener(feedback)
      } catch (error) {
        console.error('Error in feedback listener:', error)
      }
    }
  }

  private logFeedbackToAnalytics(feedback: UserFeedback): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'translation_feedback', {
        language: feedback.language,
        feedback_type: feedback.type,
        translation_key: feedback.key,
        priority: feedback.priority,
        custom_map: {
          feedback_message: feedback.message
        }
      })
    }
  }
}

// Export singleton instance
export const translationQA = TranslationQualityAssurance.getInstance()

// Type declarations for global analytics
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters: Record<string, any>) => void
  }
}