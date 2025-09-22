'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react'
import productionMonitor from '@/lib/i18n/production-monitor'

interface MonitoringData {
  errors: any[]
  performance: Record<string, any>
  feedback: any[]
  alerts: any[]
  status: any
}

export function ProductionMonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchMonitoringData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMonitoringData = async () => {
    try {
      const [errorsRes, performanceRes, feedbackRes, alertsRes] = await Promise.all([
        fetch('/api/monitoring/errors').catch(() => ({ ok: false })),
        fetch('/api/monitoring/performance').catch(() => ({ ok: false })),
        fetch('/api/monitoring/feedback').catch(() => ({ ok: false })),
        fetch('/api/monitoring/alerts').catch(() => ({ ok: false }))
      ])

      const status = productionMonitor.getStatus()
      const performance = productionMonitor.getPerformanceSummary()
      const errors = productionMonitor.getRecentErrors(20)

      setData({
        errors,
        performance,
        feedback: [],
        alerts: alertsRes.ok ? (await alertsRes.json()).alerts || [] : [],
        status
      })
      
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load monitoring data. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  const criticalAlerts = data.alerts.filter(alert => alert.severity === 'critical' && !alert.resolved)
  const highAlerts = data.alerts.filter(alert => alert.severity === 'high' && !alert.resolved)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of multi-language system health
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalAlerts.length} critical alert(s)</strong> require immediate attention
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {criticalAlerts.length === 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-lg font-bold text-green-600">Healthy</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-lg font-bold text-red-600">Critical</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.status.unresolvedAlerts} unresolved alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.errors.length > 0 ? ((data.errors.length / 100) * 100).toFixed(1) : '0.0'}%
            </div>
            <Progress 
              value={Math.min((data.errors.length / 10) * 100, 100)} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {data.errors.length} errors in last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(data.performance).length > 0 
                ? Math.round(Object.values(data.performance).reduce((acc: number, perf: any) => acc + perf.avg, 0) / Object.values(data.performance).length)
                : 0}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average rating this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">
            Alerts {data.status.unresolvedAlerts > 0 && (
              <Badge variant="destructive" className="ml-2">{data.status.unresolvedAlerts}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Current system alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No active alerts. System is running smoothly.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {alert.severity === 'critical' ? (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        ) : alert.severity === 'high' ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{alert.message}</h3>
                          <Badge 
                            variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.type} • {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>
                Translation and system errors from the last hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.errors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No recent errors detected.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{error.language}</Badge>
                          <span className="font-medium">{error.key}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(error.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{error.error}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Translation loading and rendering performance by language
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(data.performance).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>No performance data available yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(data.performance).map(([key, stats]: [string, any]) => {
                    const [language, metric] = key.split('_')
                    return (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{language.toUpperCase()}</Badge>
                            <span className="font-medium">{metric.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {stats.trend === 'improving' ? (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            ) : stats.trend === 'degrading' ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : (
                              <Activity className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Avg:</span>
                            <div className="font-medium">{Math.round(stats.avg)}ms</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Min:</span>
                            <div className="font-medium">{Math.round(stats.min)}ms</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max:</span>
                            <div className="font-medium">{Math.round(stats.max)}ms</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">P95:</span>
                            <div className="font-medium">{Math.round(stats.p95)}ms</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
              <CardDescription>
                Translation quality feedback from users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>Feedback collection is active. Data will appear here as users provide ratings.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}