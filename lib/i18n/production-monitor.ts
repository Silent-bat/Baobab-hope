/**
 * Production monitoring system for multi-language support
 * Tracks errors, performance, and user feedback
 */

export interface TranslationError {
  id: string
  timestamp: Date
  language: string
  key: string
  error: string
  context?: Record<string, any>
  userId?: string
  sessionId: string
  userAgent: string
  url: string
}

export interface PerformanceMetric {
  id: string
  timestamp: Date
  language: string
  metric: 'load_time' | 'cache_hit' | 'bundle_size' | 'render_time'
  value: number
  context?: Record<string, any>
  userId?: string
  sessionId: string
}

export interface UserFeedback {
  id: string
  timestamp: Date
  language: string
  translationKey?: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  userId?: string
  sessionId: string
  context?: Record<string, any>
}

export interface MonitoringAlert {
  id: string
  timestamp: Date
  type: 'error_rate' | 'performance' | 'missing_translations' | 'user_feedback'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  data: Record<string, any>
  resolved: boolean
}

class ProductionMonitor {
  private errorBuffer: TranslationError[] = []
  private performanceBuffer: PerformanceMetric[] = []
  private feedbackBuffer: UserFeedback[] = []
  private alerts: MonitoringAlert[] = []
  
  private readonly maxBufferSize = 100
  private readonly flushInterval = 30000 // 30 seconds
  private readonly alertThresholds = {
    errorRate: 0.05, // 5% error rate
    loadTime: 3000, // 3 seconds
    missingTranslations: 10 // 10 missing translations per hour
  }

  private flushTimer?: NodeJS.Timeout
  private sessionId: string
  private isProduction: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isProduction = process.env.NODE_ENV === 'production'
    
    if (this.isProduction) {
      this.startPeriodicFlush()
      this.setupErrorHandlers()
    }
  }

  /**
   * Record a translation error
   */
  recordError(error: Omit<TranslationError, 'id' | 'timestamp' | 'sessionId' | 'userAgent' | 'url'>): void {
    if (!this.isProduction) return

    const errorRecord: TranslationError = {
      ...error,
      id: this.generateId(),
      timestamp: new Date(),
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    }

    this.errorBuffer.push(errorRecord)
    this.checkErrorRateAlert()
    
    if (this.errorBuffer.length >= this.maxBufferSize) {
      this.flushErrors()
    }
  }

  /**
   * Record a performance metric
   */
  recordPerformance(metric: Omit<PerformanceMetric, 'id' | 'timestamp' | 'sessionId'>): void {
    if (!this.isProduction) return

    const performanceRecord: PerformanceMetric = {
      ...metric,
      id: this.generateId(),
      timestamp: new Date(),
      sessionId: this.sessionId
    }

    this.performanceBuffer.push(performanceRecord)
    this.checkPerformanceAlert(performanceRecord)
    
    if (this.performanceBuffer.length >= this.maxBufferSize) {
      this.flushPerformance()
    }
  }

  /**
   * Record user feedback
   */
  recordFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp' | 'sessionId'>): void {
    const feedbackRecord: UserFeedback = {
      ...feedback,
      id: this.generateId(),
      timestamp: new Date(),
      sessionId: this.sessionId
    }

    this.feedbackBuffer.push(feedbackRecord)
    this.checkFeedbackAlert(feedbackRecord)
    
    if (this.feedbackBuffer.length >= this.maxBufferSize) {
      this.flushFeedback()
    }
  }

  /**
   * Create an alert
   */
  createAlert(alert: Omit<MonitoringAlert, 'id' | 'timestamp' | 'resolved'>): void {
    const alertRecord: MonitoringAlert = {
      ...alert,
      id: this.generateId(),
      timestamp: new Date(),
      resolved: false
    }

    this.alerts.push(alertRecord)
    
    // Send critical alerts immediately
    if (alert.severity === 'critical') {
      this.sendAlert(alertRecord)
    }
  }

  /**
   * Get current monitoring status
   */
  getStatus(): {
    errors: number
    performance: number
    feedback: number
    alerts: number
    unresolvedAlerts: number
  } {
    return {
      errors: this.errorBuffer.length,
      performance: this.performanceBuffer.length,
      feedback: this.feedbackBuffer.length,
      alerts: this.alerts.length,
      unresolvedAlerts: this.alerts.filter(a => !a.resolved).length
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit: number = 10): TranslationError[] {
    return this.errorBuffer.slice(-limit)
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {}
    
    this.performanceBuffer.forEach(metric => {
      const key = `${metric.language}_${metric.metric}`
      if (!summary[key]) {
        summary[key] = { avg: 0, min: Infinity, max: -Infinity, count: 0 }
      }
      
      summary[key].count++
      summary[key].min = Math.min(summary[key].min, metric.value)
      summary[key].max = Math.max(summary[key].max, metric.value)
      summary[key].avg = (summary[key].avg * (summary[key].count - 1) + metric.value) / summary[key].count
    })
    
    return summary
  }

  private checkErrorRateAlert(): void {
    const recentErrors = this.errorBuffer.filter(
      error => Date.now() - error.timestamp.getTime() < 300000 // Last 5 minutes
    )
    
    if (recentErrors.length > 0) {
      const errorRate = recentErrors.length / 100 // Assuming 100 requests per 5 minutes baseline
      
      if (errorRate > this.alertThresholds.errorRate) {
        this.createAlert({
          type: 'error_rate',
          severity: errorRate > 0.1 ? 'critical' : 'high',
          message: `High error rate detected: ${(errorRate * 100).toFixed(2)}%`,
          data: { errorRate, recentErrors: recentErrors.length }
        })
      }
    }
  }

  private checkPerformanceAlert(metric: PerformanceMetric): void {
    if (metric.metric === 'load_time' && metric.value > this.alertThresholds.loadTime) {
      this.createAlert({
        type: 'performance',
        severity: metric.value > 5000 ? 'high' : 'medium',
        message: `Slow translation loading detected: ${metric.value}ms for ${metric.language}`,
        data: { language: metric.language, loadTime: metric.value }
      })
    }
  }

  private checkFeedbackAlert(feedback: UserFeedback): void {
    if (feedback.rating <= 2) {
      this.createAlert({
        type: 'user_feedback',
        severity: 'medium',
        message: `Poor translation feedback received for ${feedback.language}`,
        data: { 
          language: feedback.language, 
          rating: feedback.rating, 
          comment: feedback.comment,
          translationKey: feedback.translationKey
        }
      })
    }
  }

  private async flushErrors(): Promise<void> {
    if (this.errorBuffer.length === 0) return

    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors: this.errorBuffer })
      })
      
      this.errorBuffer = []
    } catch (error) {
      console.error('Failed to flush error data:', error)
    }
  }

  private async flushPerformance(): Promise<void> {
    if (this.performanceBuffer.length === 0) return

    try {
      await fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: this.performanceBuffer })
      })
      
      this.performanceBuffer = []
    } catch (error) {
      console.error('Failed to flush performance data:', error)
    }
  }

  private async flushFeedback(): Promise<void> {
    if (this.feedbackBuffer.length === 0) return

    try {
      await fetch('/api/monitoring/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: this.feedbackBuffer })
      })
      
      this.feedbackBuffer = []
    } catch (error) {
      console.error('Failed to flush feedback data:', error)
    }
  }

  private async sendAlert(alert: MonitoringAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert })
      })
    } catch (error) {
      console.error('Failed to send alert:', error)
    }
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushErrors()
      this.flushPerformance()
      this.flushFeedback()
    }, this.flushInterval)
  }

  private setupErrorHandlers(): void {
    // Global error handler for unhandled translation errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        if (event.error?.message?.includes('translation') || event.error?.message?.includes('i18n')) {
          this.recordError({
            language: 'unknown',
            key: 'global_error',
            error: event.error.message,
            context: { stack: event.error.stack }
          })
        }
      })

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message?.includes('translation') || event.reason?.message?.includes('i18n')) {
          this.recordError({
            language: 'unknown',
            key: 'promise_rejection',
            error: event.reason.message,
            context: { reason: event.reason }
          })
        }
      })
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('monitoring-session-id')
      if (!sessionId) {
        sessionId = this.generateId()
        sessionStorage.setItem('monitoring-session-id', sessionId)
      }
      return sessionId
    }
    return `server-${this.generateId()}`
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    
    // Flush remaining data
    this.flushErrors()
    this.flushPerformance()
    this.flushFeedback()
  }
}

export const productionMonitor = new ProductionMonitor()
export default productionMonitor