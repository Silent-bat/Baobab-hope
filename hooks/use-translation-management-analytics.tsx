'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  useTranslationManagementAnalytics,
  TranslationAnalyticsReport,
  MissingTranslationReport,
  TranslationCompletionMetrics,
  TranslationTeamProductivity,
  TranslationQualityMetrics,
  TranslationAlert
} from '@/lib/i18n/translation-management-analytics'

export interface TranslationManagementAnalyticsHook {
  // Data
  report: TranslationAnalyticsReport | null
  missingTranslations: MissingTranslationReport[]
  completionMetrics: TranslationCompletionMetrics[]
  teamProductivity: TranslationTeamProductivity[]
  qualityMetrics: TranslationQualityMetrics[]
  activeAlerts: TranslationAlert[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null

  // Actions
  refreshData: () => Promise<void>
  exportReport: () => void
  clearData: () => void
  setTimeRange: (days: number) => void
  
  // Alert management
  acknowledgeAlert: (alertId: string) => void
  resolveAlert: (alertId: string) => void
  
  // Filtering and search
  filterByLanguage: (language: string) => void
  filterByPriority: (priority: 'high' | 'medium' | 'low' | 'all') => void
  searchTranslations: (query: string) => void
  
  // Statistics
  getOverviewStats: () => {
    totalLanguages: number
    averageCompletion: number
    totalMissing: number
    averageQuality: number
    criticalAlerts: number
  }
}

export function useTranslationManagementAnalytics(initialTimeRange: number = 30): TranslationManagementAnalyticsHook {
  const analytics = useTranslationManagementAnalytics()
  
  // State
  const [report, setReport] = useState<TranslationAnalyticsReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [timeRange, setTimeRangeState] = useState(initialTimeRange)
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<'high' | 'medium' | 'low' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load data function
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const analyticsReport = analytics.generateAnalyticsReport(timeRange)
      setReport(analyticsReport)
      setLastUpdated(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load translation management analytics'
      setError(errorMessage)
      console.error('Translation management analytics loading error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [analytics, timeRange])

  // Initial data load and refresh on time range change
  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh data every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        loadData()
      }
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(interval)
  }, [loadData, isLoading])

  // Refresh data manually
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])

  // Export report
  const exportReport = useCallback(() => {
    if (!report) return
    
    try {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `translation-management-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export report:', err)
      setError('Failed to export report')
    }
  }, [report])

  // Clear data
  const clearData = useCallback(() => {
    try {
      analytics.clearAllData()
      setReport(null)
      setLastUpdated(null)
    } catch (err) {
      console.error('Failed to clear data:', err)
      setError('Failed to clear data')
    }
  }, [analytics])

  // Set time range
  const setTimeRange = useCallback((days: number) => {
    setTimeRangeState(days)
  }, [])

  // Alert management
  const acknowledgeAlert = useCallback((alertId: string) => {
    analytics.acknowledgeAlert(alertId)
    loadData() // Refresh data after acknowledging
  }, [analytics, loadData])

  const resolveAlert = useCallback((alertId: string) => {
    analytics.resolveAlert(alertId)
    loadData() // Refresh data after resolving
  }, [analytics, loadData])

  // Filtering functions
  const filterByLanguage = useCallback((language: string) => {
    setLanguageFilter(language)
  }, [])

  const filterByPriority = useCallback((priority: 'high' | 'medium' | 'low' | 'all') => {
    setPriorityFilter(priority)
  }, [])

  const searchTranslations = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Apply filters to data
  const applyFilters = useCallback(<T extends { language?: string; priority?: string; key?: string; message?: string }>(
    data: T[]
  ): T[] => {
    return data.filter(item => {
      // Language filter
      if (languageFilter !== 'all' && item.language && item.language !== languageFilter) {
        return false
      }
      
      // Priority filter
      if (priorityFilter !== 'all' && item.priority && item.priority !== priorityFilter) {
        return false
      }
      
      // Search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const searchableText = [
          item.key,
          item.message,
          item.language
        ].filter(Boolean).join(' ').toLowerCase()
        
        if (!searchableText.includes(searchLower)) {
          return false
        }
      }
      
      return true
    })
  }, [languageFilter, priorityFilter, searchQuery])

  // Filtered data
  const missingTranslations = report ? applyFilters(report.missingTranslations) : []
  const completionMetrics = report ? 
    (languageFilter === 'all' ? report.completionMetrics : 
     report.completionMetrics.filter(m => m.language === languageFilter)) : []
  const teamProductivity = report ? report.teamProductivity : []
  const qualityMetrics = report ? 
    (languageFilter === 'all' ? report.qualityMetrics : 
     report.qualityMetrics.filter(q => q.language === languageFilter)) : []
  const activeAlerts = report ? applyFilters(report.alerts) : []

  // Overview statistics
  const getOverviewStats = useCallback(() => {
    if (!report) {
      return {
        totalLanguages: 0,
        averageCompletion: 0,
        totalMissing: 0,
        averageQuality: 0,
        criticalAlerts: 0
      }
    }

    const criticalAlerts = report.alerts.filter(a => a.severity === 'critical').length

    return {
      totalLanguages: report.overview.totalLanguages,
      averageCompletion: report.overview.averageCompletionRate,
      totalMissing: report.overview.totalMissingTranslations,
      averageQuality: report.overview.qualityScore,
      criticalAlerts
    }
  }, [report])

  return {
    // Data
    report,
    missingTranslations,
    completionMetrics,
    teamProductivity,
    qualityMetrics,
    activeAlerts,
    isLoading,
    error,
    lastUpdated,

    // Actions
    refreshData,
    exportReport,
    clearData,
    setTimeRange,
    
    // Alert management
    acknowledgeAlert,
    resolveAlert,
    
    // Filtering and search
    filterByLanguage,
    filterByPriority,
    searchTranslations,
    
    // Statistics
    getOverviewStats
  }
}

// Hook for tracking translation team activities
export function useTranslationTeamTracking() {
  const analytics = useTranslationManagementAnalytics()

  const trackTranslationAdded = useCallback((contributor: string, language: string, key: string) => {
    analytics.trackTeamActivity(contributor, 'translation_added', { language, key })
  }, [analytics])

  const trackTranslationUpdated = useCallback((contributor: string, language: string, key: string) => {
    analytics.trackTeamActivity(contributor, 'translation_updated', { language, key })
  }, [analytics])

  const trackTranslationApproved = useCallback((contributor: string, language: string, key: string) => {
    analytics.trackTeamActivity(contributor, 'translation_approved', { language, key })
  }, [analytics])

  const trackTranslationRejected = useCallback((contributor: string, language: string, key: string, reason: string) => {
    analytics.trackTeamActivity(contributor, 'translation_rejected', { language, key, reason })
  }, [analytics])

  const trackQualityReview = useCallback((contributor: string, language: string, qualityScore: number) => {
    analytics.trackTeamActivity(contributor, 'quality_review', { language, qualityScore })
  }, [analytics])

  return {
    trackTranslationAdded,
    trackTranslationUpdated,
    trackTranslationApproved,
    trackTranslationRejected,
    trackQualityReview
  }
}

// Hook for real-time translation management monitoring
export function useRealTimeTranslationMonitoring(refreshInterval: number = 60000) {
  const analytics = useTranslationManagementAnalytics()
  const [realtimeData, setRealtimeData] = useState<{
    criticalAlerts: TranslationAlert[]
    recentMissing: MissingTranslationReport[]
    activeContributors: number
    completionTrend: number
  } | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const updateRealtimeData = () => {
      try {
        const report = analytics.generateAnalyticsReport(1) // Last 24 hours
        
        const criticalAlerts = report.alerts.filter(a => a.severity === 'critical')
        const recentMissing = report.missingTranslations
          .filter(m => (Date.now() - m.firstReported) < 24 * 60 * 60 * 1000) // Last 24 hours
          .slice(0, 10)
        
        const activeContributors = new Set(
          report.teamProductivity.map(p => p.contributor)
        ).size
        
        const completionTrend = report.trends.completionTrend.length > 1 ?
          report.trends.completionTrend[report.trends.completionTrend.length - 1].completion -
          report.trends.completionTrend[report.trends.completionTrend.length - 2].completion : 0

        setRealtimeData({
          criticalAlerts,
          recentMissing,
          activeContributors,
          completionTrend
        })
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to update real-time translation data:', error)
        setIsConnected(false)
      }
    }

    // Initial load
    updateRealtimeData()

    // Set up interval for updates
    const interval = setInterval(updateRealtimeData, refreshInterval)

    return () => clearInterval(interval)
  }, [analytics, refreshInterval])

  return {
    data: realtimeData,
    isConnected,
    criticalAlerts: realtimeData?.criticalAlerts || [],
    recentMissing: realtimeData?.recentMissing || [],
    activeContributors: realtimeData?.activeContributors || 0,
    completionTrend: realtimeData?.completionTrend || 0
  }
}