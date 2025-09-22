/**
 * Language Analytics Service
 * Tracks language usage patterns, performance metrics, and user behavior
 */

export interface LanguageUsageEvent {
  type: 'language_selected' | 'language_switched' | 'page_view' | 'translation_loaded' | 'translation_error'
  language: string
  previousLanguage?: string
  timestamp: number
  userId?: string
  sessionId: string
  page: string
  userAgent: string
  country?: string
  loadTime?: number
  errorType?: string
  errorMessage?: string
}

export interface LanguageUsageMetrics {
  totalSessions: number
  uniqueUsers: number
  languageDistribution: Record<string, number>
  switchingPatterns: Record<string, Record<string, number>>
  averageLoadTime: Record<string, number>
  errorRates: Record<string, number>
  pageViews: Record<string, Record<string, number>>
  userEngagement: Record<string, {
    averageSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }>
  geographicDistribution: Record<string, Record<string, number>>
  timeBasedUsage: Record<string, Record<string, number>>
}

export interface LanguagePerformanceMetrics {
  language: string
  averageLoadTime: number
  cacheHitRate: number
  errorRate: number
  translationCompleteness: number
  userSatisfactionScore: number
  popularPages: Array<{
    page: string
    views: number
    averageTime: number
  }>
}

export interface UserLanguagePreferences {
  userId: string
  primaryLanguage: string
  secondaryLanguages: string[]
  detectionMethod: 'browser' | 'geolocation' | 'manual' | 'previous_session'
  switchingFrequency: number
  preferredRegion?: string
  lastUpdated: number
}

class LanguageAnalyticsService {
  private events: LanguageUsageEvent[] = []
  private sessionId: string
  private userId?: string
  private startTime: number
  private currentLanguage: string = 'en'
  private pageStartTime: number = Date.now()

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.loadStoredEvents()
    this.setupBeforeUnloadHandler()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadStoredEvents(): void {
    // Only load on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      const stored = localStorage.getItem('language_analytics_events')
      if (stored) {
        const parsedEvents = JSON.parse(stored)
        // Only keep events from the last 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        this.events = parsedEvents.filter((event: LanguageUsageEvent) => 
          event.timestamp > thirtyDaysAgo
        )
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error)
      this.events = []
    }
  }

  private persistEvents(): void {
    // Only persist on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      localStorage.setItem('language_analytics_events', JSON.stringify(this.events))
    } catch (error) {
      console.warn('Failed to persist analytics events:', error)
    }
  }

  private setupBeforeUnloadHandler(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.persistEvents()
      })
    }
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  trackLanguageSelection(language: string, detectionMethod: 'browser' | 'geolocation' | 'manual' = 'manual'): void {
    const event: LanguageUsageEvent = {
      type: 'language_selected',
      language,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      country: this.getCountryFromBrowser()
    }

    this.events.push(event)
    this.currentLanguage = language
    this.persistEvents()

    // Track user preferences
    this.updateUserPreferences(language, detectionMethod)
  }

  trackLanguageSwitch(newLanguage: string, previousLanguage: string): void {
    const event: LanguageUsageEvent = {
      type: 'language_switched',
      language: newLanguage,
      previousLanguage,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      country: this.getCountryFromBrowser()
    }

    this.events.push(event)
    this.currentLanguage = newLanguage
    this.persistEvents()

    // Update switching patterns
    this.updateSwitchingPatterns(previousLanguage, newLanguage)
  }

  trackPageView(language: string, page: string): void {
    const event: LanguageUsageEvent = {
      type: 'page_view',
      language,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      page,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      country: this.getCountryFromBrowser()
    }

    this.events.push(event)
    this.pageStartTime = Date.now()
    this.persistEvents()
  }

  trackTranslationLoaded(language: string, loadTime: number): void {
    const event: LanguageUsageEvent = {
      type: 'translation_loaded',
      language,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      loadTime,
      country: this.getCountryFromBrowser()
    }

    this.events.push(event)
    this.persistEvents()
  }

  trackTranslationError(language: string, errorType: string, errorMessage: string): void {
    const event: LanguageUsageEvent = {
      type: 'translation_error',
      language,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      errorType,
      errorMessage,
      country: this.getCountryFromBrowser()
    }

    this.events.push(event)
    this.persistEvents()
  }

  private getCountryFromBrowser(): string | undefined {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const parts = navigator.language.split('-')
      return parts.length > 1 ? parts[1].toUpperCase() : undefined
    }
    return undefined
  }

  private updateUserPreferences(language: string, detectionMethod: string): void {
    // Only update on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      const stored = localStorage.getItem('user_language_preferences')
      let preferences: UserLanguagePreferences

      if (stored) {
        preferences = JSON.parse(stored)
      } else {
        preferences = {
          userId: this.userId || 'anonymous',
          primaryLanguage: language,
          secondaryLanguages: [],
          detectionMethod: detectionMethod as any,
          switchingFrequency: 0,
          lastUpdated: Date.now()
        }
      }

      // Update preferences
      if (preferences.primaryLanguage !== language) {
        if (!preferences.secondaryLanguages.includes(preferences.primaryLanguage)) {
          preferences.secondaryLanguages.unshift(preferences.primaryLanguage)
        }
        preferences.primaryLanguage = language
        preferences.switchingFrequency += 1
      }

      preferences.lastUpdated = Date.now()
      localStorage.setItem('user_language_preferences', JSON.stringify(preferences))
    } catch (error) {
      console.warn('Failed to update user preferences:', error)
    }
  }

  private updateSwitchingPatterns(from: string, to: string): void {
    // Only update on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      const stored = localStorage.getItem('language_switching_patterns')
      let patterns: Record<string, Record<string, number>> = stored ? JSON.parse(stored) : {}

      if (!patterns[from]) {
        patterns[from] = {}
      }
      patterns[from][to] = (patterns[from][to] || 0) + 1

      localStorage.setItem('language_switching_patterns', JSON.stringify(patterns))
    } catch (error) {
      console.warn('Failed to update switching patterns:', error)
    }
  }

  getLanguageUsageMetrics(timeRange: number = 30): LanguageUsageMetrics {
    const cutoffTime = Date.now() - (timeRange * 24 * 60 * 60 * 1000)
    const relevantEvents = this.events.filter(event => event.timestamp > cutoffTime)

    const sessions = new Set(relevantEvents.map(e => e.sessionId))
    const users = new Set(relevantEvents.filter(e => e.userId).map(e => e.userId))

    // Language distribution
    const languageDistribution: Record<string, number> = {}
    relevantEvents.forEach(event => {
      languageDistribution[event.language] = (languageDistribution[event.language] || 0) + 1
    })

    // Switching patterns
    const switchingPatterns: Record<string, Record<string, number>> = {}
    relevantEvents
      .filter(event => event.type === 'language_switched')
      .forEach(event => {
        if (event.previousLanguage) {
          if (!switchingPatterns[event.previousLanguage]) {
            switchingPatterns[event.previousLanguage] = {}
          }
          switchingPatterns[event.previousLanguage][event.language] = 
            (switchingPatterns[event.previousLanguage][event.language] || 0) + 1
        }
      })

    // Average load times
    const loadTimes: Record<string, number[]> = {}
    relevantEvents
      .filter(event => event.type === 'translation_loaded' && event.loadTime)
      .forEach(event => {
        if (!loadTimes[event.language]) {
          loadTimes[event.language] = []
        }
        loadTimes[event.language].push(event.loadTime!)
      })

    const averageLoadTime: Record<string, number> = {}
    Object.keys(loadTimes).forEach(lang => {
      const times = loadTimes[lang]
      averageLoadTime[lang] = times.reduce((sum, time) => sum + time, 0) / times.length
    })

    // Error rates
    const errorCounts: Record<string, number> = {}
    const totalRequests: Record<string, number> = {}
    
    relevantEvents.forEach(event => {
      if (event.type === 'translation_error') {
        errorCounts[event.language] = (errorCounts[event.language] || 0) + 1
      }
      if (event.type === 'translation_loaded' || event.type === 'translation_error') {
        totalRequests[event.language] = (totalRequests[event.language] || 0) + 1
      }
    })

    const errorRates: Record<string, number> = {}
    Object.keys(totalRequests).forEach(lang => {
      errorRates[lang] = (errorCounts[lang] || 0) / totalRequests[lang]
    })

    // Page views by language
    const pageViews: Record<string, Record<string, number>> = {}
    relevantEvents
      .filter(event => event.type === 'page_view')
      .forEach(event => {
        if (!pageViews[event.language]) {
          pageViews[event.language] = {}
        }
        pageViews[event.language][event.page] = 
          (pageViews[event.language][event.page] || 0) + 1
      })

    // Geographic distribution
    const geographicDistribution: Record<string, Record<string, number>> = {}
    relevantEvents
      .filter(event => event.country)
      .forEach(event => {
        if (!geographicDistribution[event.language]) {
          geographicDistribution[event.language] = {}
        }
        geographicDistribution[event.language][event.country!] = 
          (geographicDistribution[event.language][event.country!] || 0) + 1
      })

    // Time-based usage (by hour)
    const timeBasedUsage: Record<string, Record<string, number>> = {}
    relevantEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours().toString()
      if (!timeBasedUsage[event.language]) {
        timeBasedUsage[event.language] = {}
      }
      timeBasedUsage[event.language][hour] = 
        (timeBasedUsage[event.language][hour] || 0) + 1
    })

    // User engagement metrics (simplified)
    const userEngagement: Record<string, {
      averageSessionDuration: number
      bounceRate: number
      pagesPerSession: number
    }> = {}

    // Calculate session durations and page counts per language
    const sessionData: Record<string, {
      sessions: Record<string, { start: number, end: number, pages: number }>
    }> = {}

    relevantEvents.forEach(event => {
      if (!sessionData[event.language]) {
        sessionData[event.language] = { sessions: {} }
      }
      
      const session = sessionData[event.language].sessions[event.sessionId] || {
        start: event.timestamp,
        end: event.timestamp,
        pages: 0
      }

      session.start = Math.min(session.start, event.timestamp)
      session.end = Math.max(session.end, event.timestamp)
      
      if (event.type === 'page_view') {
        session.pages += 1
      }

      sessionData[event.language].sessions[event.sessionId] = session
    })

    Object.keys(sessionData).forEach(lang => {
      const sessions = Object.values(sessionData[lang].sessions)
      const durations = sessions.map(s => s.end - s.start)
      const pageCounts = sessions.map(s => s.pages)
      
      userEngagement[lang] = {
        averageSessionDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
        bounceRate: sessions.filter(s => s.pages <= 1).length / sessions.length,
        pagesPerSession: pageCounts.reduce((sum, p) => sum + p, 0) / pageCounts.length
      }
    })

    return {
      totalSessions: sessions.size,
      uniqueUsers: users.size,
      languageDistribution,
      switchingPatterns,
      averageLoadTime,
      errorRates,
      pageViews,
      userEngagement,
      geographicDistribution,
      timeBasedUsage
    }
  }

  getLanguagePerformanceMetrics(language: string, timeRange: number = 30): LanguagePerformanceMetrics {
    const cutoffTime = Date.now() - (timeRange * 24 * 60 * 60 * 1000)
    const relevantEvents = this.events.filter(event => 
      event.timestamp > cutoffTime && event.language === language
    )

    // Average load time
    const loadEvents = relevantEvents.filter(e => e.type === 'translation_loaded' && e.loadTime)
    const averageLoadTime = loadEvents.length > 0 
      ? loadEvents.reduce((sum, e) => sum + e.loadTime!, 0) / loadEvents.length
      : 0

    // Error rate
    const errorEvents = relevantEvents.filter(e => e.type === 'translation_error')
    const totalRequests = relevantEvents.filter(e => 
      e.type === 'translation_loaded' || e.type === 'translation_error'
    ).length
    const errorRate = totalRequests > 0 ? errorEvents.length / totalRequests : 0

    // Popular pages
    const pageViewCounts: Record<string, number> = {}
    const pageViewTimes: Record<string, number[]> = {}
    
    relevantEvents
      .filter(e => e.type === 'page_view')
      .forEach(event => {
        pageViewCounts[event.page] = (pageViewCounts[event.page] || 0) + 1
        // Simulate average time on page (in a real app, this would be tracked)
        if (!pageViewTimes[event.page]) {
          pageViewTimes[event.page] = []
        }
        pageViewTimes[event.page].push(Math.random() * 300000 + 30000) // 30s to 5min
      })

    const popularPages = Object.entries(pageViewCounts)
      .map(([page, views]) => ({
        page,
        views,
        averageTime: pageViewTimes[page] 
          ? pageViewTimes[page].reduce((sum, time) => sum + time, 0) / pageViewTimes[page].length
          : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return {
      language,
      averageLoadTime,
      cacheHitRate: Math.random() * 0.3 + 0.7, // Simulated cache hit rate
      errorRate,
      translationCompleteness: Math.random() * 0.2 + 0.8, // Simulated completeness
      userSatisfactionScore: Math.random() * 20 + 80, // Simulated satisfaction score
      popularPages
    }
  }

  getUserLanguagePreferences(): UserLanguagePreferences | null {
    // Only access on client side
    if (typeof window === 'undefined') {
      return null
    }
    
    try {
      const stored = localStorage.getItem('user_language_preferences')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to get user preferences:', error)
      return null
    }
  }

  exportAnalyticsData(): {
    events: LanguageUsageEvent[]
    metrics: LanguageUsageMetrics
    userPreferences: UserLanguagePreferences | null
  } {
    return {
      events: this.events,
      metrics: this.getLanguageUsageMetrics(),
      userPreferences: this.getUserLanguagePreferences()
    }
  }

  clearAnalyticsData(): void {
    this.events = []
    
    // Only clear on client side
    if (typeof window !== 'undefined') {
      localStorage.removeItem('language_analytics_events')
      localStorage.removeItem('user_language_preferences')
      localStorage.removeItem('language_switching_patterns')
    }
  }

  // Real-time analytics dashboard data
  getDashboardData(timeRange: number = 7): {
    currentUsers: number
    topLanguages: Array<{ language: string, users: number, percentage: number }>
    recentSwitches: Array<{ from: string, to: string, timestamp: number }>
    performanceAlerts: Array<{ language: string, issue: string, severity: 'low' | 'medium' | 'high' }>
  } {
    const cutoffTime = Date.now() - (timeRange * 24 * 60 * 60 * 1000)
    const recentEvents = this.events.filter(event => event.timestamp > cutoffTime)

    // Current active users (last 30 minutes)
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000)
    const recentSessions = new Set(
      this.events
        .filter(event => event.timestamp > thirtyMinutesAgo)
        .map(event => event.sessionId)
    )

    // Top languages
    const languageCounts: Record<string, Set<string>> = {}
    recentEvents.forEach(event => {
      if (!languageCounts[event.language]) {
        languageCounts[event.language] = new Set()
      }
      languageCounts[event.language].add(event.sessionId)
    })

    const totalUsers = new Set(recentEvents.map(e => e.sessionId)).size
    const topLanguages = Object.entries(languageCounts)
      .map(([language, sessions]) => ({
        language,
        users: sessions.size,
        percentage: totalUsers > 0 ? (sessions.size / totalUsers) * 100 : 0
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 5)

    // Recent language switches
    const recentSwitches = recentEvents
      .filter(event => event.type === 'language_switched')
      .map(event => ({
        from: event.previousLanguage!,
        to: event.language,
        timestamp: event.timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)

    // Performance alerts
    const performanceAlerts: Array<{ language: string, issue: string, severity: 'low' | 'medium' | 'high' }> = []
    
    Object.keys(languageCounts).forEach(language => {
      const metrics = this.getLanguagePerformanceMetrics(language, timeRange)
      
      if (metrics.errorRate > 0.1) {
        performanceAlerts.push({
          language,
          issue: `High error rate: ${(metrics.errorRate * 100).toFixed(1)}%`,
          severity: metrics.errorRate > 0.2 ? 'high' : 'medium'
        })
      }
      
      if (metrics.averageLoadTime > 2000) {
        performanceAlerts.push({
          language,
          issue: `Slow loading: ${metrics.averageLoadTime.toFixed(0)}ms`,
          severity: metrics.averageLoadTime > 5000 ? 'high' : 'medium'
        })
      }
    })

    return {
      currentUsers: recentSessions.size,
      topLanguages,
      recentSwitches,
      performanceAlerts
    }
  }
}

// Singleton instance
export const languageAnalytics = new LanguageAnalyticsService()

// React hook for using language analytics
export function useLanguageAnalytics() {
  return {
    trackLanguageSelection: languageAnalytics.trackLanguageSelection.bind(languageAnalytics),
    trackLanguageSwitch: languageAnalytics.trackLanguageSwitch.bind(languageAnalytics),
    trackPageView: languageAnalytics.trackPageView.bind(languageAnalytics),
    trackTranslationLoaded: languageAnalytics.trackTranslationLoaded.bind(languageAnalytics),
    trackTranslationError: languageAnalytics.trackTranslationError.bind(languageAnalytics),
    getLanguageUsageMetrics: languageAnalytics.getLanguageUsageMetrics.bind(languageAnalytics),
    getLanguagePerformanceMetrics: languageAnalytics.getLanguagePerformanceMetrics.bind(languageAnalytics),
    getUserLanguagePreferences: languageAnalytics.getUserLanguagePreferences.bind(languageAnalytics),
    getDashboardData: languageAnalytics.getDashboardData.bind(languageAnalytics),
    exportAnalyticsData: languageAnalytics.exportAnalyticsData.bind(languageAnalytics),
    setUserId: languageAnalytics.setUserId.bind(languageAnalytics)
  }
}