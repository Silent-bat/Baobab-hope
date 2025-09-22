'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  Zap,
  MapPin,
  ArrowRightLeft
} from 'lucide-react'
import { useLanguageAnalytics, LanguageUsageMetrics, LanguagePerformanceMetrics } from '@/lib/i18n/language-analytics'

interface LanguageUsageDashboardProps {
  className?: string
}

export function LanguageUsageDashboard({ className }: LanguageUsageDashboardProps) {
  const analytics = useLanguageAnalytics()
  const [timeRange, setTimeRange] = useState(7)
  const [metrics, setMetrics] = useState<LanguageUsageMetrics | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [languageMetrics, setLanguageMetrics] = useState<LanguagePerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadData = async () => {
    setIsLoading(true)
    try {
      const usageMetrics = analytics.getLanguageUsageMetrics(timeRange)
      const dashboard = analytics.getDashboardData(timeRange)
      
      setMetrics(usageMetrics)
      setDashboardData(dashboard)
      
      // Load metrics for the most popular language if none selected
      if (!selectedLanguage && dashboard.topLanguages.length > 0) {
        const topLang = dashboard.topLanguages[0].language
        setSelectedLanguage(topLang)
        setLanguageMetrics(analytics.getLanguagePerformanceMetrics(topLang, timeRange))
      } else if (selectedLanguage) {
        setLanguageMetrics(analytics.getLanguagePerformanceMetrics(selectedLanguage, timeRange))
      }
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [timeRange])

  useEffect(() => {
    if (selectedLanguage) {
      setLanguageMetrics(analytics.getLanguagePerformanceMetrics(selectedLanguage, timeRange))
    }
  }, [selectedLanguage, timeRange])

  const handleExportData = () => {
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
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (!metrics || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No analytics data available</p>
          <p className="text-sm mt-2">Start using the website to generate usage data</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Language Usage Analytics</h2>
          <p className="text-muted-foreground">
            Track language preferences, usage patterns, and performance metrics
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
              <SelectItem value="1">Last day</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.currentUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently online (last 30 min)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.uniqueUsers} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages Used</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(metrics.languageDistribution).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dashboardData.performanceAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Issues requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Most Popular Languages</span>
                </CardTitle>
                <CardDescription>
                  Languages by user count and percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topLanguages.map((lang: any, index: number) => (
                    <div key={lang.language} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <span className="text-sm font-medium">{lang.language.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{lang.users}</span>
                          <span className="text-xs text-muted-foreground">
                            ({lang.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={lang.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Language Switches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  <span>Recent Language Switches</span>
                </CardTitle>
                <CardDescription>
                  Latest language switching activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentSwitches.length > 0 ? (
                    dashboardData.recentSwitches.slice(0, 5).map((switch_: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {switch_.from.toUpperCase()}
                          </Badge>
                          <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {switch_.to.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(switch_.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <ArrowRightLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent language switches</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Alerts */}
          {dashboardData.performanceAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Performance Alerts</span>
                </CardTitle>
                <CardDescription>
                  Issues that need immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.performanceAlerts.map((alert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'high' ? 'bg-red-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{alert.language.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{alert.issue}</p>
                        </div>
                      </div>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(metrics.languageDistribution).map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()} ({metrics.languageDistribution[lang]} events)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {languageMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedLanguage.toUpperCase()} language performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Load Time</span>
                      <span className="text-sm font-medium">
                        {languageMetrics.averageLoadTime.toFixed(0)}ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache Hit Rate</span>
                      <span className="text-sm font-medium">
                        {formatPercentage(languageMetrics.cacheHitRate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className={`text-sm font-medium ${
                        languageMetrics.errorRate > 0.1 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatPercentage(languageMetrics.errorRate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Translation Completeness</span>
                      <span className="text-sm font-medium">
                        {formatPercentage(languageMetrics.translationCompleteness)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Satisfaction</span>
                      <span className="text-sm font-medium">
                        {languageMetrics.userSatisfactionScore.toFixed(1)}/100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Popular Pages</span>
                  </CardTitle>
                  <CardDescription>
                    Most visited pages in {selectedLanguage.toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {languageMetrics.popularPages.slice(0, 5).map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          <span className="text-sm font-medium truncate max-w-32">
                            {page.page}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{page.views}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(page.averageTime)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Load Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Load Time by Language</span>
                </CardTitle>
                <CardDescription>
                  Average translation loading times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.averageLoadTime)
                    .sort(([,a], [,b]) => a - b)
                    .map(([lang, time]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${
                            time > 2000 ? 'text-red-600' : 
                            time > 1000 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {time.toFixed(0)}ms
                          </span>
                          {time > 2000 && <AlertTriangle className="h-3 w-3 text-red-500" />}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Error Rates by Language</span>
                </CardTitle>
                <CardDescription>
                  Translation loading error rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.errorRates)
                    .sort(([,a], [,b]) => b - a)
                    .map(([lang, rate]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${
                            rate > 0.1 ? 'text-red-600' : 
                            rate > 0.05 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {formatPercentage(rate)}
                          </span>
                          {rate > 0.1 && <AlertTriangle className="h-3 w-3 text-red-500" />}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Engagement by Language</span>
                </CardTitle>
                <CardDescription>
                  Session duration and page views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.userEngagement).map(([lang, engagement]) => (
                    <div key={lang} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                        <Badge variant="outline" className="text-xs">
                          {formatDuration(engagement.averageSessionDuration)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          Bounce Rate: {formatPercentage(engagement.bounceRate)}
                        </div>
                        <div>
                          Pages/Session: {engagement.pagesPerSession.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Switching Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  <span>Language Switching Patterns</span>
                </CardTitle>
                <CardDescription>
                  Most common language transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.switchingPatterns)
                    .flatMap(([from, targets]) => 
                      Object.entries(targets).map(([to, count]) => ({ from, to, count }))
                    )
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((pattern, index) => (
                      <div key={`${pattern.from}-${pattern.to}`} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">#{index + 1}</span>
                          <Badge variant="outline" className="text-xs">
                            {pattern.from.toUpperCase()}
                          </Badge>
                          <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {pattern.to.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{pattern.count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Geographic Distribution</span>
              </CardTitle>
              <CardDescription>
                Language usage by country/region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.geographicDistribution).map(([lang, countries]) => (
                  <div key={lang} className="space-y-2">
                    <h4 className="text-sm font-medium">{lang.toUpperCase()}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(countries)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 4)
                        .map(([country, count]) => (
                          <div key={country} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{country}</span>
                            <span>{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}