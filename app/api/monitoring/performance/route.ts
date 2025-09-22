import { NextRequest, NextResponse } from 'next/server'
import { PerformanceMetric } from '@/lib/i18n/production-monitor'

export async function POST(request: NextRequest) {
  try {
    const { metrics }: { metrics: PerformanceMetric[] } = await request.json()
    
    // Process performance metrics
    const performanceAnalysis = analyzePerformanceMetrics(metrics)
    
    // Log to monitoring service
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metrics received:', performanceAnalysis)
    } else {
      await logPerformanceMetrics(metrics, performanceAnalysis)
    }
    
    // Check for performance alerts
    const alerts = checkPerformanceAlerts(performanceAnalysis)
    if (alerts.length > 0) {
      await sendPerformanceAlerts(alerts)
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: metrics.length,
      alerts: alerts.length,
      analysis: performanceAnalysis
    })
  } catch (error) {
    console.error('Error processing performance metrics:', error)
    return NextResponse.json(
      { error: 'Failed to process performance metrics' },
      { status: 500 }
    )
  }
}

function analyzePerformanceMetrics(metrics: PerformanceMetric[]) {
  const analysis: Record<string, {
    avg: number
    min: number
    max: number
    count: number
    p95: number
    trend: 'improving' | 'degrading' | 'stable'
  }> = {}
  
  // Group metrics by language and type
  const grouped = metrics.reduce((acc, metric) => {
    const key = `${metric.language}_${metric.metric}`
    if (!acc[key]) acc[key] = []
    acc[key].push(metric.value)
    return acc
  }, {} as Record<string, number[]>)
  
  // Calculate statistics for each group
  Object.entries(grouped).forEach(([key, values]) => {
    values.sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const p95Index = Math.floor(values.length * 0.95)
    
    analysis[key] = {
      avg,
      min: values[0],
      max: values[values.length - 1],
      count: values.length,
      p95: values[p95Index] || values[values.length - 1],
      trend: calculateTrend(values)
    }
  })
  
  return analysis
}

function calculateTrend(values: number[]): 'improving' | 'degrading' | 'stable' {
  if (values.length < 3) return 'stable'
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2))
  const secondHalf = values.slice(Math.floor(values.length / 2))
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  
  const change = (secondAvg - firstAvg) / firstAvg
  
  if (change > 0.1) return 'degrading'
  if (change < -0.1) return 'improving'
  return 'stable'
}

function checkPerformanceAlerts(analysis: Record<string, any>) {
  const alerts = []
  
  Object.entries(analysis).forEach(([key, stats]) => {
    const [language, metric] = key.split('_')
    
    // Check load time alerts
    if (metric === 'load_time') {
      if (stats.avg > 3000) {
        alerts.push({
          type: 'slow_load_time',
          severity: stats.avg > 5000 ? 'high' : 'medium',
          language,
          message: `Average load time for ${language} is ${stats.avg.toFixed(0)}ms`,
          data: stats
        })
      }
      
      if (stats.p95 > 5000) {
        alerts.push({
          type: 'p95_load_time',
          severity: 'high',
          language,
          message: `95th percentile load time for ${language} is ${stats.p95.toFixed(0)}ms`,
          data: stats
        })
      }
    }
    
    // Check for degrading performance
    if (stats.trend === 'degrading') {
      alerts.push({
        type: 'performance_degradation',
        severity: 'medium',
        language,
        message: `Performance degradation detected for ${language} ${metric}`,
        data: stats
      })
    }
  })
  
  return alerts
}

async function logPerformanceMetrics(metrics: PerformanceMetric[], analysis: any) {
  // Send to monitoring service (e.g., DataDog, New Relic)
  if (process.env.PERFORMANCE_MONITORING_URL) {
    try {
      await fetch(process.env.PERFORMANCE_MONITORING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
        },
        body: JSON.stringify({
          type: 'i18n_performance',
          metrics,
          analysis,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to log performance metrics:', error)
    }
  }
}

async function sendPerformanceAlerts(alerts: any[]) {
  if (process.env.ALERT_WEBHOOK_URL) {
    try {
      const message = {
        text: `⚠️ I18n Performance Alerts`,
        attachments: alerts.map(alert => ({
          color: alert.severity === 'high' ? 'danger' : 'warning',
          fields: [
            {
              title: 'Alert Type',
              value: alert.type,
              short: true
            },
            {
              title: 'Language',
              value: alert.language,
              short: true
            },
            {
              title: 'Message',
              value: alert.message,
              short: false
            }
          ]
        }))
      }
      
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      })
    } catch (error) {
      console.error('Failed to send performance alerts:', error)
    }
  }
}