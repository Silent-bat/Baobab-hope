'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Target,
  Zap,
  Bell,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Award,
  AlertCircle,
  Eye,
  Calendar
} from 'lucide-react'
import { 
  useTranslationManagementAnalytics,
  TranslationAnalyticsReport,
  MissingTranslationReport,
  TranslationCompletionMetrics,
  TranslationTeamProductivity,
  TranslationAlert
} from '@/lib/i18n/translation-management-analytics'

interface TranslationManagementDashboardProps {
  className?: string
}

export function TranslationManagementDashboard({ className }: TranslationManagementDashboardProps) {
  const analytics = useTranslationManagementAnalytics()
  const [timeRange, setTimeRange] = useState(30)
  const [report, setReport] = useState<TranslationAnalyticsReport | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadData = async () => {
    setIsLoading(true)
    try {
      const analyticsReport = analytics.generateAnalyticsReport(timeRange)
      setReport(analyticsReport)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load translation management analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [timeRange])

  const handleExportReport = () => {
    if (!report) return
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translation-management-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    analytics.acknowledgeAlert(alertId)
    loadData()
  }

  const handleResolveAlert = (alertId: string) => {
    analytics.resolveAlert(alertId)
    loadData()
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600'
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getCompletionColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDuration = (days: number) => {
    if (days < 1) return 'Today'
    if (days === 1) return '1 day ago'
    return `${Math.floor(days)} days ago`
  }

  if (isLoading && !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading translation management analytics...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No translation management data available</p>
          <p className="text-sm mt-2">Start managing translations to generate analytics</p>
        </div>
      </div>
    )
  }

  const criticalAlerts = report.alerts.filter(a => a.severity === 'critical').length
  const highPriorityMissing = report.missingTranslations.filter(m => m.priority === 'high').length
  const lowQualityLanguages = report.qualityMetrics.filter(q => q.qualityScore < 70).length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Translation Management Analytics</h2>
          <p className="text-muted-foreground">
            Monitor translation quality, completion rates, and team productivity
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalAlerts} critical alert{criticalAlerts > 1 ? 's' : ''}</strong> require immediate attention.
            <Button variant="link" className="p-0 ml-2 text-red-600" onClick={() => setSelectedLanguage('alerts')}>
              View alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.overview.totalLanguages}</div>
            <p className="text-xs text-muted-foreground">
              Active languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCompletionColor(report.overview.averageCompletionRate)}`}>
              {report.overview.averageCompletionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Translations</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{report.overview.totalMissingTranslations}</div>
            <p className="text-xs text-muted-foreground">
              {highPriorityMissing} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.overview.qualityScore.toFixed(1)}/100</div>
            <p className="text-xs text-muted-foreground">
              {lowQualityLanguages} languages need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{report.alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts} critical
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="completion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completion">Completion</TabsTrigger>
          <TabsTrigger value="missing">Missing Translations</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="productivity">Team Productivity</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="completion" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Rates by Language */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Completion Rates by Language</span>
                </CardTitle>
                <CardDescription>
                  Translation completion status for each language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.completionMetrics
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .slice(0, 10)
                    .map((metric) => (
                      <div key={metric.language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{metric.language.toUpperCase()}</span>
                            <Badge variant="outline" className="text-xs">
                              {metric.totalKeys} keys
                            </Badge>
                          </div>
                          <span className={`text-sm font-medium ${getCompletionColor(metric.completionRate)}`}>
                            {metric.completionRate.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={metric.completionRate} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{metric.translatedKeys} translated</span>
                          <span>{metric.missingKeys.length} missing</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Translation Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates and additions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.completionMetrics
                    .filter(m => m.recentlyAdded > 0 || m.recentlyUpdated > 0)
                    .sort((a, b) => b.lastUpdated - a.lastUpdated)
                    .slice(0, 8)
                    .map((metric) => (
                      <div key={metric.language} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{metric.language.toUpperCase()}</span>
                          <div className="flex space-x-1">
                            {metric.recentlyAdded > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                +{metric.recentlyAdded} added
                              </Badge>
                            )}
                            {metric.recentlyUpdated > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {metric.recentlyUpdated} updated
                              </Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration((Date.now() - metric.lastUpdated) / (24 * 60 * 60 * 1000))}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="missing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Missing Translations by Priority</span>
              </CardTitle>
              <CardDescription>
                Translation keys that need immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.missingTranslations.slice(0, 20).map((missing, index) => (
                  <div key={`${missing.language}-${missing.namespace}-${missing.key}`} 
                       className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{missing.namespace}.{missing.key}</span>
                          <Badge variant="outline" className="text-xs">
                            {missing.language.toUpperCase()}
                          </Badge>
                          <Badge variant={
                            missing.priority === 'high' ? 'destructive' :
                            missing.priority === 'medium' ? 'default' : 'secondary'
                          } className="text-xs">
                            {missing.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Reported {missing.reportCount} times • {missing.affectedPages.length} pages affected
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Impact: {missing.userImpact}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDuration((Date.now() - missing.firstReported) / (24 * 60 * 60 * 1000))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Quality Scores by Language</span>
                </CardTitle>
                <CardDescription>
                  Translation quality metrics and scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.qualityMetrics
                    .sort((a, b) => b.qualityScore - a.qualityScore)
                    .map((quality) => (
                      <div key={quality.language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{quality.language.toUpperCase()}</span>
                          <span className={`text-sm font-medium ${
                            quality.qualityScore >= 80 ? 'text-green-600' :
                            quality.qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {quality.qualityScore.toFixed(1)}/100
                          </span>
                        </div>
                        <Progress value={quality.qualityScore} className="h-2" />
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <span>Checks: {quality.automatedQualityChecks.passed}/{quality.automatedQualityChecks.passed + quality.automatedQualityChecks.failed}</span>
                          <span>Reviews: {quality.humanReviewMetrics.approved}/{quality.humanReviewMetrics.approved + quality.humanReviewMetrics.rejected}</span>
                          <span>Feedback: {quality.userFeedbackScore.toFixed(1)}/5</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Quality Issues</span>
                </CardTitle>
                <CardDescription>
                  Common quality problems across languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.qualityMetrics
                    .filter(q => Object.keys(q.errorTypes).length > 0 || Object.keys(q.warningTypes).length > 0)
                    .slice(0, 5)
                    .map((quality) => (
                      <div key={quality.language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{quality.language.toUpperCase()}</span>
                          <Badge variant="outline" className="text-xs">
                            Score: {quality.qualityScore.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(quality.errorTypes).map(([type, count]) => (
                            <div key={type} className="flex justify-between text-sm">
                              <span className="text-red-600">{type}</span>
                              <span>{count} errors</span>
                            </div>
                          ))}
                          {Object.entries(quality.warningTypes).map(([type, count]) => (
                            <div key={type} className="flex justify-between text-sm">
                              <span className="text-yellow-600">{type}</span>
                              <span>{count} warnings</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Productivity</span>
              </CardTitle>
              <CardDescription>
                Translation team performance and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.teamProductivity.map((contributor, index) => (
                  <div key={contributor.contributor} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{contributor.contributor}</div>
                        <div className="text-sm text-muted-foreground">
                          {contributor.languagesWorkedOn.length} languages • {contributor.productivity.toFixed(1)} translations/day
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-green-600">{contributor.translationsAdded}</div>
                          <div className="text-xs text-muted-foreground">Added</div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-600">{contributor.translationsUpdated}</div>
                          <div className="text-xs text-muted-foreground">Updated</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {report.teamProductivity.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No team activity data available</p>
                    <p className="text-sm mt-2">Team contributions will appear here once translation work begins</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Active Alerts</span>
              </CardTitle>
              <CardDescription>
                Issues requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getAlertSeverityColor(alert.severity)}`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{alert.message}</span>
                          {alert.language && (
                            <Badge variant="outline" className="text-xs">
                              {alert.language.toUpperCase()}
                            </Badge>
                          )}
                          <Badge variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'default' : 'secondary'
                          } className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {alert.type.replace('_', ' ')} • {formatDuration((Date.now() - alert.timestamp) / (24 * 60 * 60 * 1000))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!alert.acknowledged && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
                {report.alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                    <p>No active alerts</p>
                    <p className="text-sm mt-2">All translation issues have been resolved</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Completion Trend</span>
                </CardTitle>
                <CardDescription>
                  Average completion rate over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Trend chart would be displayed here</p>
                  <p className="text-sm mt-2">
                    {report.trends.completionTrend.length} data points available
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quality Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Quality Trend</span>
                </CardTitle>
                <CardDescription>
                  Quality score changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Quality trend chart would be displayed here</p>
                  <p className="text-sm mt-2">
                    {report.trends.qualityTrend.length} data points available
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Productivity Trend</span>
                </CardTitle>
                <CardDescription>
                  Team productivity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Productivity trend chart would be displayed here</p>
                  <p className="text-sm mt-2">
                    {report.trends.productivityTrend.length} data points available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}