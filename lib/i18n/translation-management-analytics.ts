/**
 * Translation Management Analytics Service
 * Tracks missing translations, completion rates, team productivity, and quality metrics
 */

export interface TranslationUsageData {
  key: string
  namespace: string
  language: string
  usageCount: number
  lastUsed: number
  contexts: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface MissingTranslationReport {
  key: string
  namespace: string
  language: string
  firstReported: number
  reportCount: number
  priority: 'high' | 'medium' | 'low'
  contexts: string[]
  affectedPages: string[]
  userImpact: number
}

export interface TranslationCompletionMetrics {
  language: string
  totalKeys: number
  translatedKeys: number
  completionRate: number
  missingKeys: string[]
  recentlyAdded: number
  recentlyUpdated: number
  lastUpdated: number
  trend: 'improving' | 'declining' | 'stable'
}

export interface TranslationTeamProductivity {
  contributor: string
  period: { start: number, end: number }
  translationsAdded: number
  translationsUpdated: number
  translationsApproved: number
  translationsRejected: number
  averageQualityScore: number
  languagesWorkedOn: string[]
  productivity: number // translations per day
}

export interface TranslationQualityMetrics {
  language: string
  totalTranslations: number
  qualityScore: number
  errorTypes: Record<string, number>
  warningTypes: Record<string, number>
  userFeedbackScore: number
  automatedQualityChecks: {
    passed: number
    failed: number
    warnings: number
  }
  humanReviewMetrics: {
    approved: number
    rejected: number
    pendingReview: number
  }
}

export interface TranslationAlert {
  id: string
  type: 'missing_translation' | 'quality_issue' | 'performance_issue' | 'completion_threshold'
  severity: 'low' | 'medium' | 'high' | 'critical'
  language?: string
  message: string
  details: any
  timestamp: number
  acknowledged: boolean
  resolvedAt?: number
}

export interface TranslationAnalyticsReport {
  period: { start: number, end: number }
  overview: {
    totalLanguages: number
    totalKeys: number
    averageCompletionRate: number
    totalMissingTranslations: number
    qualityScore: number
  }
  completionMetrics: TranslationCompletionMetrics[]
  missingTranslations: MissingTranslationReport[]
  qualityMetrics: TranslationQualityMetrics[]
  teamProductivity: TranslationTeamProductivity[]
  alerts: TranslationAlert[]
  trends: {
    completionTrend: Array<{ date: string, completion: number }>
    qualityTrend: Array<{ date: string, quality: number }>
    productivityTrend: Array<{ date: string, productivity: number }>
  }
}

class TranslationManagementAnalyticsService {
  private translationUsage: Map<string, TranslationUsageData> = new Map()
  private missingTranslations: Map<string, MissingTranslationReport> = new Map()
  private completionHistory: Array<{ timestamp: number, metrics: TranslationCompletionMetrics[] }> = []
  private teamActivity: Array<{ timestamp: number, contributor: string, action: string, details: any }> = []
  private qualityHistory: Array<{ timestamp: number, language: string, metrics: TranslationQualityMetrics }> = []
  private alerts: TranslationAlert[] = []

  constructor() {
    this.loadStoredData()
    this.setupPeriodicTasks()
  }

  private loadStoredData(): void {
    // Only load on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      // Load translation usage data
      const usageData = localStorage.getItem('translation_usage_data')
      if (usageData) {
        const parsed = JSON.parse(usageData)
        this.translationUsage = new Map(parsed)
      }

      // Load missing translations
      const missingData = localStorage.getItem('missing_translations_data')
      if (missingData) {
        const parsed = JSON.parse(missingData)
        this.missingTranslations = new Map(parsed)
      }

      // Load completion history
      const completionData = localStorage.getItem('completion_history_data')
      if (completionData) {
        this.completionHistory = JSON.parse(completionData)
      }

      // Load team activity
      const teamData = localStorage.getItem('team_activity_data')
      if (teamData) {
        this.teamActivity = JSON.parse(teamData)
      }

      // Load quality history
      const qualityData = localStorage.getItem('quality_history_data')
      if (qualityData) {
        this.qualityHistory = JSON.parse(qualityData)
      }

      // Load alerts
      const alertsData = localStorage.getItem('translation_alerts_data')
      if (alertsData) {
        this.alerts = JSON.parse(alertsData)
      }
    } catch (error) {
      console.warn('Failed to load stored translation analytics data:', error)
    }
  }

  private persistData(): void {
    // Only persist on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      localStorage.setItem('translation_usage_data', JSON.stringify([...this.translationUsage]))
      localStorage.setItem('missing_translations_data', JSON.stringify([...this.missingTranslations]))
      localStorage.setItem('completion_history_data', JSON.stringify(this.completionHistory))
      localStorage.setItem('team_activity_data', JSON.stringify(this.teamActivity))
      localStorage.setItem('quality_history_data', JSON.stringify(this.qualityHistory))
      localStorage.setItem('translation_alerts_data', JSON.stringify(this.alerts))
    } catch (error) {
      console.warn('Failed to persist translation analytics data:', error)
    }
  }

  private setupPeriodicTasks(): void {
    // Clean up old data every hour
    setInterval(() => {
      this.cleanupOldData()
    }, 60 * 60 * 1000)

    // Generate daily reports
    setInterval(() => {
      this.generateDailyReport()
    }, 24 * 60 * 60 * 1000)
  }

  private cleanupOldData(): void {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    // Clean up old completion history
    this.completionHistory = this.completionHistory.filter(entry => entry.timestamp > thirtyDaysAgo)
    
    // Clean up old team activity
    this.teamActivity = this.teamActivity.filter(entry => entry.timestamp > thirtyDaysAgo)
    
    // Clean up old quality history
    this.qualityHistory = this.qualityHistory.filter(entry => entry.timestamp > thirtyDaysAgo)
    
    // Clean up resolved alerts older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    this.alerts = this.alerts.filter(alert => 
      !alert.resolvedAt || alert.resolvedAt > sevenDaysAgo
    )

    this.persistData()
  }

  // Track translation usage
  trackTranslationUsage(key: string, namespace: string, language: string, context: string): void {
    const usageKey = `${language}:${namespace}:${key}`
    const existing = this.translationUsage.get(usageKey)

    if (existing) {
      existing.usageCount += 1
      existing.lastUsed = Date.now()
      if (!existing.contexts.includes(context)) {
        existing.contexts.push(context)
      }
    } else {
      this.translationUsage.set(usageKey, {
        key,
        namespace,
        language,
        usageCount: 1,
        lastUsed: Date.now(),
        contexts: [context],
        priority: 'medium'
      })
    }

    this.updateTranslationPriority(usageKey)
    this.persistData()
  }

  // Report missing translation
  reportMissingTranslation(key: string, namespace: string, language: string, context: string, page: string): void {
    const missingKey = `${language}:${namespace}:${key}`
    const existing = this.missingTranslations.get(missingKey)

    if (existing) {
      existing.reportCount += 1
      if (!existing.contexts.includes(context)) {
        existing.contexts.push(context)
      }
      if (!existing.affectedPages.includes(page)) {
        existing.affectedPages.push(page)
      }
    } else {
      this.missingTranslations.set(missingKey, {
        key,
        namespace,
        language,
        firstReported: Date.now(),
        reportCount: 1,
        priority: 'medium',
        contexts: [context],
        affectedPages: [page],
        userImpact: 1
      })
    }

    this.updateMissingTranslationPriority(missingKey)
    this.createMissingTranslationAlert(key, namespace, language)
    this.persistData()
  }

  // Update translation completion metrics
  updateCompletionMetrics(metrics: TranslationCompletionMetrics[]): void {
    this.completionHistory.push({
      timestamp: Date.now(),
      metrics: [...metrics]
    })

    // Check for completion threshold alerts
    metrics.forEach(metric => {
      if (metric.completionRate < 80) {
        this.createAlert({
          type: 'completion_threshold',
          severity: metric.completionRate < 50 ? 'high' : 'medium',
          language: metric.language,
          message: `${metric.language} completion rate is ${metric.completionRate.toFixed(1)}%`,
          details: metric
        })
      }
    })

    this.persistData()
  }

  // Track team activity
  trackTeamActivity(contributor: string, action: string, details: any): void {
    this.teamActivity.push({
      timestamp: Date.now(),
      contributor,
      action,
      details
    })

    this.persistData()
  }

  // Update quality metrics
  updateQualityMetrics(language: string, metrics: TranslationQualityMetrics): void {
    this.qualityHistory.push({
      timestamp: Date.now(),
      language,
      metrics
    })

    // Check for quality issues
    if (metrics.qualityScore < 70) {
      this.createAlert({
        type: 'quality_issue',
        severity: metrics.qualityScore < 50 ? 'high' : 'medium',
        language,
        message: `${language} quality score is ${metrics.qualityScore.toFixed(1)}`,
        details: metrics
      })
    }

    this.persistData()
  }

  private updateTranslationPriority(usageKey: string): void {
    const usage = this.translationUsage.get(usageKey)
    if (!usage) return

    // Calculate priority based on usage frequency and recency
    const daysSinceLastUse = (Date.now() - usage.lastUsed) / (24 * 60 * 60 * 1000)
    const usageFrequency = usage.usageCount
    const contextDiversity = usage.contexts.length

    let priority: 'high' | 'medium' | 'low' = 'low'
    
    if (usageFrequency > 100 || (usageFrequency > 10 && daysSinceLastUse < 1)) {
      priority = 'high'
    } else if (usageFrequency > 10 || contextDiversity > 3) {
      priority = 'medium'
    }

    usage.priority = priority
  }

  private updateMissingTranslationPriority(missingKey: string): void {
    const missing = this.missingTranslations.get(missingKey)
    if (!missing) return

    // Calculate priority based on report frequency, affected pages, and user impact
    const reportFrequency = missing.reportCount
    const pageImpact = missing.affectedPages.length
    const contextDiversity = missing.contexts.length

    let priority: 'high' | 'medium' | 'low' = 'low'
    
    if (reportFrequency > 50 || pageImpact > 10) {
      priority = 'high'
    } else if (reportFrequency > 10 || pageImpact > 3 || contextDiversity > 2) {
      priority = 'medium'
    }

    missing.priority = priority
    missing.userImpact = reportFrequency * pageImpact
  }

  private createMissingTranslationAlert(key: string, namespace: string, language: string): void {
    const alertId = `missing_${language}_${namespace}_${key}`
    
    // Don't create duplicate alerts
    if (this.alerts.some(alert => alert.id === alertId && !alert.acknowledged)) {
      return
    }

    this.createAlert({
      type: 'missing_translation',
      severity: 'medium',
      language,
      message: `Missing translation: ${namespace}.${key} in ${language}`,
      details: { key, namespace, language }
    }, alertId)
  }

  private createAlert(alertData: Omit<TranslationAlert, 'id' | 'timestamp' | 'acknowledged'>, id?: string): void {
    const alert: TranslationAlert = {
      id: id || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      timestamp: Date.now(),
      acknowledged: false
    }

    this.alerts.push(alert)
    this.persistData()
  }

  // Get missing translations prioritized by usage
  getMissingTranslationsByPriority(language?: string): MissingTranslationReport[] {
    let missing = Array.from(this.missingTranslations.values())
    
    if (language) {
      missing = missing.filter(m => m.language === language)
    }

    return missing.sort((a, b) => {
      // Sort by priority first, then by user impact
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      
      if (priorityDiff !== 0) return priorityDiff
      return b.userImpact - a.userImpact
    })
  }

  // Get completion rates by language
  getCompletionRates(timeRange: number = 30): TranslationCompletionMetrics[] {
    const cutoffTime = Date.now() - (timeRange * 24 * 60 * 60 * 1000)
    const recentHistory = this.completionHistory.filter(entry => entry.timestamp > cutoffTime)
    
    if (recentHistory.length === 0) return []

    // Get the most recent metrics for each language
    const latestMetrics = new Map<string, TranslationCompletionMetrics>()
    
    recentHistory.forEach(entry => {
      entry.metrics.forEach(metric => {
        const existing = latestMetrics.get(metric.language)
        if (!existing || metric.lastUpdated > existing.lastUpdated) {
          latestMetrics.set(metric.language, metric)
        }
      })
    })

    return Array.from(latestMetrics.values()).sort((a, b) => b.completionRate - a.completionRate)
  }

  // Get team productivity metrics
  getTeamProductivity(timeRange: number = 30): TranslationTeamProductivity[] {
    const cutoffTime = Date.now() - (timeRange * 24 * 60 * 60 * 1000)
    const recentActivity = this.teamActivity.filter(entry => entry.timestamp > cutoffTime)
    
    const contributorMetrics = new Map<string, TranslationTeamProductivity>()
    
    recentActivity.forEach(activity => {
      const existing = contributorMetrics.get(activity.contributor) || {
        contributor: activity.contributor,
        period: { start: cutoffTime, end: Date.now() },
        translationsAdded: 0,
        translationsUpdated: 0,
        translationsApproved: 0,
        translationsRejected: 0,
        averageQualityScore: 0,
        languagesWorkedOn: [],
        productivity: 0
      }

      switch (activity.action) {
        case 'translation_added':
          existing.translationsAdded += 1
          break
        case 'translation_updated':
          existing.translationsUpdated += 1
          break
        case 'translation_approved':
          existing.translationsApproved += 1
          break
        case 'translation_rejected':
          existing.translationsRejected += 1
          break
      }

      if (activity.details?.language && !existing.languagesWorkedOn.includes(activity.details.language)) {
        existing.languagesWorkedOn.push(activity.details.language)
      }

      contributorMetrics.set(activity.contributor, existing)
    })

    // Calculate productivity (translations per day)
    const daysInPeriod = timeRange
    contributorMetrics.forEach(metrics => {
      const totalTranslations = metrics.translationsAdded + metrics.translationsUpdated
      metrics.productivity = totalTranslations / daysInPeriod
    })

    return Array.from(contributorMetrics.values()).sort((a, b) => b.productivity - a.productivity)
  }

  // Get quality metrics by language
  getQualityMetrics(language?: string): TranslationQualityMetrics[] {
    let qualityData = this.qualityHistory
    
    if (language) {
      qualityData = qualityData.filter(entry => entry.language === language)
    }

    // Get the most recent metrics for each language
    const latestMetrics = new Map<string, TranslationQualityMetrics>()
    
    qualityData.forEach(entry => {
      const existing = latestMetrics.get(entry.language)
      if (!existing || entry.timestamp > existing.timestamp) {
        latestMetrics.set(entry.language, entry.metrics)
      }
    })

    return Array.from(latestMetrics.values()).sort((a, b) => b.qualityScore - a.qualityScore)
  }

  // Get active alerts
  getActiveAlerts(severity?: TranslationAlert['severity']): TranslationAlert[] {
    let alerts = this.alerts.filter(alert => !alert.acknowledged && !alert.resolvedAt)
    
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity)
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
      
      if (severityDiff !== 0) return severityDiff
      return b.timestamp - a.timestamp
    })
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      this.persistData()
    }
  }

  // Resolve alert
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolvedAt = Date.now()
      this.persistData()
    }
  }

  // Generate comprehensive analytics report
  generateAnalyticsReport(timeRange: number = 30): TranslationAnalyticsReport {
    const completionMetrics = this.getCompletionRates(timeRange)
    const missingTranslations = this.getMissingTranslationsByPriority()
    const qualityMetrics = this.getQualityMetrics()
    const teamProductivity = this.getTeamProductivity(timeRange)
    const alerts = this.getActiveAlerts()

    // Calculate overview metrics
    const totalLanguages = completionMetrics.length
    const totalKeys = completionMetrics.reduce((sum, m) => sum + m.totalKeys, 0)
    const averageCompletionRate = completionMetrics.length > 0 
      ? completionMetrics.reduce((sum, m) => sum + m.completionRate, 0) / completionMetrics.length
      : 0
    const totalMissingTranslations = missingTranslations.length
    const qualityScore = qualityMetrics.length > 0
      ? qualityMetrics.reduce((sum, m) => sum + m.qualityScore, 0) / qualityMetrics.length
      : 0

    // Generate trend data
    const cutoffTime = Date.now() - (timeRange * 24 * 60 * 60 * 1000)
    const completionTrend = this.generateCompletionTrend(cutoffTime)
    const qualityTrend = this.generateQualityTrend(cutoffTime)
    const productivityTrend = this.generateProductivityTrend(cutoffTime)

    return {
      period: { start: cutoffTime, end: Date.now() },
      overview: {
        totalLanguages,
        totalKeys,
        averageCompletionRate,
        totalMissingTranslations,
        qualityScore
      },
      completionMetrics,
      missingTranslations,
      qualityMetrics,
      teamProductivity,
      alerts,
      trends: {
        completionTrend,
        qualityTrend,
        productivityTrend
      }
    }
  }

  private generateCompletionTrend(startTime: number): Array<{ date: string, completion: number }> {
    const trend: Array<{ date: string, completion: number }> = []
    const dayMs = 24 * 60 * 60 * 1000
    
    for (let time = startTime; time <= Date.now(); time += dayMs) {
      const dayHistory = this.completionHistory.filter(entry => 
        entry.timestamp >= time && entry.timestamp < time + dayMs
      )
      
      if (dayHistory.length > 0) {
        const latestEntry = dayHistory[dayHistory.length - 1]
        const avgCompletion = latestEntry.metrics.reduce((sum, m) => sum + m.completionRate, 0) / latestEntry.metrics.length
        
        trend.push({
          date: new Date(time).toISOString().split('T')[0],
          completion: avgCompletion
        })
      }
    }
    
    return trend
  }

  private generateQualityTrend(startTime: number): Array<{ date: string, quality: number }> {
    const trend: Array<{ date: string, quality: number }> = []
    const dayMs = 24 * 60 * 60 * 1000
    
    for (let time = startTime; time <= Date.now(); time += dayMs) {
      const dayHistory = this.qualityHistory.filter(entry => 
        entry.timestamp >= time && entry.timestamp < time + dayMs
      )
      
      if (dayHistory.length > 0) {
        const avgQuality = dayHistory.reduce((sum, entry) => sum + entry.metrics.qualityScore, 0) / dayHistory.length
        
        trend.push({
          date: new Date(time).toISOString().split('T')[0],
          quality: avgQuality
        })
      }
    }
    
    return trend
  }

  private generateProductivityTrend(startTime: number): Array<{ date: string, productivity: number }> {
    const trend: Array<{ date: string, productivity: number }> = []
    const dayMs = 24 * 60 * 60 * 1000
    
    for (let time = startTime; time <= Date.now(); time += dayMs) {
      const dayActivity = this.teamActivity.filter(entry => 
        entry.timestamp >= time && entry.timestamp < time + dayMs
      )
      
      const productivity = dayActivity.filter(activity => 
        activity.action === 'translation_added' || activity.action === 'translation_updated'
      ).length
      
      trend.push({
        date: new Date(time).toISOString().split('T')[0],
        productivity
      })
    }
    
    return trend
  }

  private generateDailyReport(): void {
    const report = this.generateAnalyticsReport(1)
    console.log('Daily Translation Analytics Report:', report)
    
    // In a real implementation, this would send the report via email or notification system
  }

  // Clear all analytics data
  clearAllData(): void {
    this.translationUsage.clear()
    this.missingTranslations.clear()
    this.completionHistory = []
    this.teamActivity = []
    this.qualityHistory = []
    this.alerts = []
    
    // Only clear on client side
    if (typeof window !== 'undefined') {
      localStorage.removeItem('translation_usage_data')
      localStorage.removeItem('missing_translations_data')
      localStorage.removeItem('completion_history_data')
      localStorage.removeItem('team_activity_data')
      localStorage.removeItem('quality_history_data')
      localStorage.removeItem('translation_alerts_data')
    }
  }
}

// Singleton instance
export const translationManagementAnalytics = new TranslationManagementAnalyticsService()

// React hook for using translation management analytics
export function useTranslationManagementAnalytics() {
  return {
    trackTranslationUsage: translationManagementAnalytics.trackTranslationUsage.bind(translationManagementAnalytics),
    reportMissingTranslation: translationManagementAnalytics.reportMissingTranslation.bind(translationManagementAnalytics),
    updateCompletionMetrics: translationManagementAnalytics.updateCompletionMetrics.bind(translationManagementAnalytics),
    trackTeamActivity: translationManagementAnalytics.trackTeamActivity.bind(translationManagementAnalytics),
    updateQualityMetrics: translationManagementAnalytics.updateQualityMetrics.bind(translationManagementAnalytics),
    getMissingTranslationsByPriority: translationManagementAnalytics.getMissingTranslationsByPriority.bind(translationManagementAnalytics),
    getCompletionRates: translationManagementAnalytics.getCompletionRates.bind(translationManagementAnalytics),
    getTeamProductivity: translationManagementAnalytics.getTeamProductivity.bind(translationManagementAnalytics),
    getQualityMetrics: translationManagementAnalytics.getQualityMetrics.bind(translationManagementAnalytics),
    getActiveAlerts: translationManagementAnalytics.getActiveAlerts.bind(translationManagementAnalytics),
    acknowledgeAlert: translationManagementAnalytics.acknowledgeAlert.bind(translationManagementAnalytics),
    resolveAlert: translationManagementAnalytics.resolveAlert.bind(translationManagementAnalytics),
    generateAnalyticsReport: translationManagementAnalytics.generateAnalyticsReport.bind(translationManagementAnalytics),
    clearAllData: translationManagementAnalytics.clearAllData.bind(translationManagementAnalytics)
  }
}