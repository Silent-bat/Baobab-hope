'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  useLanguageAnalytics, 
  LanguageUsageMetrics, 
  LanguagePerformanceMetrics,
  UserLanguagePreferences 
} from '@/lib/i18n/language-analytics'

export interface LanguageUsageAnalyticsHook {
  // Data
  metrics: LanguageUsageMetrics | null
  dashboardData: any | null
  userPreferences: UserLanguagePreferences | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null

  // Actions
  refreshData: () => Promise<void>
  exportData: () => void
  clearData: () => void
  setTimeRange: (days: number) => void
  
  // Language-specific metrics
  getLanguageMetrics: (language: string) => LanguagePerformanceMetrics | null
  
  // Real-time data
  currentUsers: number
  topLanguages: Array<{ language: string, users: number, percentage: number }>
  recentSwitches: Array<{ from: string, to: string, timestamp: number }>
  performanceAlerts: Array<{ language: string, issue: string, severity: 'low' | 'medium' | 'high' }>
}

export function useLanguageUsageAnalytics(initialTimeRange: number = 7): LanguageUsageAnalyticsHook {
  const analytics = useLanguageAnalytics()
  
  // State
  const [metrics, setMetrics] = useState<LanguageUsageMetrics | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [userPreferences, setUserPreferences] = useState<UserLanguagePreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [timeRange, setTimeRangeState] = useState(initialTimeRange)
  const [languageMetricsCache, setLanguageMetricsCache] = useState<Record<string, LanguagePerformanceMetrics>>({})

  // Load data function
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Load usage metrics
      const usageMetrics = analytics.getLanguageUsageMetrics(timeRange)
      setMetrics(usageMetrics)
      
      // Load dashboard data
      const dashboard = analytics.getDashboardData(timeRange)
      setDashboardData(dashboard)
      
      // Load user preferences
      const preferences = analytics.getUserLanguagePreferences()
      setUserPreferences(preferences)
      
      // Clear language metrics cache when time range changes
      setLanguageMetricsCache({})
      
      setLastUpdated(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data'
      setError(errorMessage)
      console.error('Analytics data loading error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [analytics, timeRange])

  // Initial data load and refresh on time range change
  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        loadData()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [loadData, isLoading])

  // Refresh data manually
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])

  // Export analytics data
  const exportData = useCallback(() => {
    try {
      const data = analytics.exportAnalyticsData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `language-analytics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export analytics data:', err)
      setError('Failed to export data')
    }
  }, [analytics])

  // Clear analytics data
  const clearData = useCallback(() => {
    try {
      analytics.clearAnalyticsData()
      setMetrics(null)
      setDashboardData(null)
      setUserPreferences(null)
      setLanguageMetricsCache({})
      setLastUpdated(null)
    } catch (err) {
      console.error('Failed to clear analytics data:', err)
      setError('Failed to clear data')
    }
  }, [analytics])

  // Set time range
  const setTimeRange = useCallback((days: number) => {
    setTimeRangeState(days)
  }, [])

  // Get language-specific metrics with caching
  const getLanguageMetrics = useCallback((language: string): LanguagePerformanceMetrics | null => {
    if (languageMetricsCache[language]) {
      return languageMetricsCache[language]
    }

    try {
      const languageMetrics = analytics.getLanguagePerformanceMetrics(language, timeRange)
      setLanguageMetricsCache(prev => ({
        ...prev,
        [language]: languageMetrics
      }))
      return languageMetrics
    } catch (err) {
      console.error(`Failed to get metrics for language ${language}:`, err)
      return null
    }
  }, [analytics, timeRange, languageMetricsCache])

  // Extract real-time data from dashboard
  const currentUsers = dashboardData?.currentUsers || 0
  const topLanguages = dashboardData?.topLanguages || []
  const recentSwitches = dashboardData?.recentSwitches || []
  const performanceAlerts = dashboardData?.performanceAlerts || []

  return {
    // Data
    metrics,
    dashboardData,
    userPreferences,
    isLoading,
    error,
    lastUpdated,

    // Actions
    refreshData,
    exportData,
    clearData,
    setTimeRange,
    
    // Language-specific metrics
    getLanguageMetrics,
    
    // Real-time data
    currentUsers,
    topLanguages,
    recentSwitches,
    performanceAlerts
  }
}

// Hook for tracking user interactions
export function useLanguageInteractionTracking() {
  const analytics = useLanguageAnalytics()

  const trackLanguageSelection = useCallback((language: string, method: 'browser' | 'geolocation' | 'manual' = 'manual') => {
    analytics.trackLanguageSelection(language, method)
  }, [analytics])

  const trackLanguageSwitch = useCallback((newLanguage: string, previousLanguage: string) => {
    analytics.trackLanguageSwitch(newLanguage, previousLanguage)
  }, [analytics])

  const trackPageView = useCallback((language: string, page: string) => {
    analytics.trackPageView(language, page)
  }, [analytics])

  const trackTranslationLoaded = useCallback((language: string, loadTime: number) => {
    analytics.trackTranslationLoaded(language, loadTime)
  }, [analytics])

  const trackTranslationError = useCallback((language: string, errorType: string, errorMessage: string) => {
    analytics.trackTranslationError(language, errorType, errorMessage)
  }, [analytics])

  const setUserId = useCallback((userId: string) => {
    analytics.setUserId(userId)
  }, [analytics])

  return {
    trackLanguageSelection,
    trackLanguageSwitch,
    trackPageView,
    trackTranslationLoaded,
    trackTranslationError,
    setUserId
  }
}

// Hook for real-time analytics monitoring
export function useRealTimeLanguageAnalytics(refreshInterval: number = 30000) {
  const analytics = useLanguageAnalytics()
  const [realtimeData, setRealtimeData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const updateRealtimeData = () => {
      try {
        const data = analytics.getDashboardData(1) // Last 24 hours for real-time
        setRealtimeData(data)
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to update real-time data:', error)
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
    currentUsers: realtimeData?.currentUsers || 0,
    topLanguages: realtimeData?.topLanguages || [],
    recentActivity: realtimeData?.recentSwitches || [],
    alerts: realtimeData?.performanceAlerts || []
  }
}