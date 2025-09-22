// React hook for translation quality assurance integration

import { useState, useEffect, useCallback } from 'react'
import { 
  translationQA, 
  QualityReport, 
  QualityMetrics, 
  QualityIssue, 
  UserFeedback 
} from './quality-assurance'
import { i18nErrorHandler, I18nError } from './error-handler'
import { useLanguage } from '@/components/language-provider'

export interface TranslationQualityState {
  qualityReport: QualityReport | null
  qualityMetrics: QualityMetrics | null
  userFeedback: UserFeedback[]
  errors: I18nError[]
  isLoading: boolean
  lastUpdated: number | null
}

export interface TranslationQualityActions {
  validateLanguage: (language?: string) => Promise<void>
  validateAllLanguages: () => Promise<void>
  submitFeedback: (feedback: Omit<UserFeedback, 'id' | 'timestamp' | 'status'>) => Promise<string>
  clearErrors: () => void
  refreshData: () => Promise<void>
  exportReport: () => void
}

export function useTranslationQuality(targetLanguage?: string): TranslationQualityState & TranslationQualityActions {
  const { language: currentLanguage } = useLanguage()
  const language = targetLanguage || currentLanguage

  const [state, setState] = useState<TranslationQualityState>({
    qualityReport: null,
    qualityMetrics: null,
    userFeedback: [],
    errors: [],
    isLoading: false,
    lastUpdated: null
  })

  // Load initial data
  useEffect(() => {
    refreshData()
  }, [language])

  // Set up error listener
  useEffect(() => {
    const unsubscribe = i18nErrorHandler.addErrorListener((error: I18nError) => {
      if (error.language === language) {
        setState(prev => ({
          ...prev,
          errors: [...prev.errors, error].slice(-50) // Keep last 50 errors
        }))
      }
    })

    return unsubscribe
  }, [language])

  const validateLanguage = useCallback(async (targetLang?: string) => {
    const lang = targetLang || language
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      // Load translations for the language
      const { TranslationLoader } = await import('./translation-loader')
      const translations = await TranslationLoader.loadTranslationFile(lang)
      
      // Validate the language
      const report = await translationQA.validateLanguage(lang, translations)
      
      setState(prev => ({
        ...prev,
        qualityReport: report,
        lastUpdated: Date.now(),
        isLoading: false
      }))
    } catch (error) {
      console.error('Failed to validate language:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [language])

  const validateAllLanguages = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await translationQA.validateAllLanguages()
      const metrics = translationQA.getQualityMetrics()
      
      setState(prev => ({
        ...prev,
        qualityMetrics: metrics,
        lastUpdated: Date.now(),
        isLoading: false
      }))
    } catch (error) {
      console.error('Failed to validate all languages:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const submitFeedback = useCallback(async (
    feedback: Omit<UserFeedback, 'id' | 'timestamp' | 'status'>
  ): Promise<string> => {
    const feedbackId = translationQA.submitUserFeedback(feedback)
    
    // Update local state
    const fullFeedback: UserFeedback = {
      ...feedback,
      id: feedbackId,
      timestamp: Date.now(),
      status: 'open'
    }

    setState(prev => ({
      ...prev,
      userFeedback: [fullFeedback, ...prev.userFeedback]
    }))

    return feedbackId
  }, [])

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }))
    i18nErrorHandler.clearErrors(language)
  }, [language])

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      // Load quality report for current language
      await validateLanguage(language)
      
      // Load user feedback
      const feedback = translationQA.getUserFeedback(language)
      
      // Load errors
      const errors = i18nErrorHandler.getErrorsForLanguage(language)
      
      setState(prev => ({
        ...prev,
        userFeedback: feedback,
        errors,
        lastUpdated: Date.now(),
        isLoading: false
      }))
    } catch (error) {
      console.error('Failed to refresh quality data:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [language, validateLanguage])

  const exportReport = useCallback(() => {
    const reportData = {
      language,
      qualityReport: state.qualityReport,
      qualityMetrics: state.qualityMetrics,
      userFeedback: state.userFeedback,
      errors: state.errors,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translation-quality-${language}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [language, state])

  return {
    ...state,
    validateLanguage,
    validateAllLanguages,
    submitFeedback,
    clearErrors,
    refreshData,
    exportReport
  }
}

// Hook for monitoring translation quality in real-time
export function useTranslationQualityMonitor() {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null)
  const [recentIssues, setRecentIssues] = useState<QualityIssue[]>([])
  const [recentFeedback, setRecentFeedback] = useState<UserFeedback[]>([])

  useEffect(() => {
    const updateMetrics = () => {
      const currentMetrics = translationQA.getQualityMetrics()
      setMetrics(currentMetrics)
    }

    const updateRecentData = () => {
      // Get recent issues from error handler
      const errorStats = i18nErrorHandler.getErrorStats()
      setRecentIssues(errorStats.recentErrors.map(error => ({
        id: `error_${error.timestamp}`,
        type: 'missing' as const,
        severity: error.severity,
        language: error.language,
        key: error.key || 'unknown',
        message: error.message,
        timestamp: error.timestamp
      })))

      // Get recent feedback (would need to be implemented in QA system)
      // For now, we'll leave this empty
      setRecentFeedback([])
    }

    // Initial load
    updateMetrics()
    updateRecentData()

    // Set up periodic updates
    const metricsInterval = setInterval(updateMetrics, 30000) // Every 30 seconds
    const dataInterval = setInterval(updateRecentData, 10000) // Every 10 seconds

    return () => {
      clearInterval(metricsInterval)
      clearInterval(dataInterval)
    }
  }, [])

  return {
    metrics,
    recentIssues,
    recentFeedback,
    isHealthy: metrics ? metrics.averageQuality > 80 && metrics.overallCompletion > 90 : false
  }
}

// Hook for specific translation key quality monitoring
export function useTranslationKeyQuality(key: string) {
  const { language } = useLanguage()
  const [issues, setIssues] = useState<QualityIssue[]>([])
  const [feedback, setFeedback] = useState<UserFeedback[]>([])

  useEffect(() => {
    // Get issues for this specific key
    const languageFeedback = translationQA.getUserFeedback(language)
    const keyFeedback = languageFeedback.filter(f => f.key === key)
    setFeedback(keyFeedback)

    // Listen for new errors related to this key
    const unsubscribe = i18nErrorHandler.addErrorListener((error: I18nError) => {
      if (error.language === language && error.key === key) {
        const qualityIssue: QualityIssue = {
          id: `error_${error.timestamp}`,
          type: 'missing',
          severity: error.severity,
          language: error.language,
          key: error.key,
          message: error.message,
          timestamp: error.timestamp
        }
        setIssues(prev => [qualityIssue, ...prev.slice(0, 9)]) // Keep last 10 issues
      }
    })

    return unsubscribe
  }, [key, language])

  const reportIssue = useCallback(async (
    type: UserFeedback['type'],
    message: string,
    priority: UserFeedback['priority'] = 'medium'
  ) => {
    const feedbackData: Omit<UserFeedback, 'id' | 'timestamp' | 'status'> = {
      language,
      key,
      type,
      message,
      priority,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }

    const feedbackId = translationQA.submitUserFeedback(feedbackData)
    
    // Update local state
    const fullFeedback: UserFeedback = {
      ...feedbackData,
      id: feedbackId,
      timestamp: Date.now(),
      status: 'open'
    }

    setFeedback(prev => [fullFeedback, ...prev])
    return feedbackId
  }, [key, language])

  return {
    issues,
    feedback,
    hasIssues: issues.length > 0 || feedback.some(f => f.status === 'open'),
    reportIssue
  }
}