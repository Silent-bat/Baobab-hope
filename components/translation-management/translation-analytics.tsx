'use client'

// Translation analytics component with metrics and insights

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Users, 
  Clock, 
  Target,
  Activity,
  PieChart,
  Calendar,
  Award
} from 'lucide-react'

interface TranslationStats {
  totalLanguages: number
  totalKeys: number
  completedTranslations: number
  pendingApprovals: number
  validationErrors: number
  lastUpdated: Date
}

interface LanguageStatus {
  code: string
  name: string
  completionRate: number
  keyCount: number
  errors: number
  warnings: number
  lastUpdated: Date
  status: 'complete' | 'in-progress' | 'needs-review' | 'error'
}

interface TranslationAnalyticsProps {
  stats: TranslationStats | null
  languageStatuses: LanguageStatus[]
}

export function TranslationAnalytics({ stats, languageStatuses }: TranslationAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('completion')

  // Calculate analytics data
  const completionRates = languageStatuses.map(lang => ({
    language: lang.name,
    code: lang.code,
    completion: lang.completionRate,
    keys: lang.keyCount,
    errors: lang.errors,
    warnings: lang.warnings
  })).sort((a, b) => b.completion - a.completion)

  const averageCompletion = languageStatuses.length > 0 
    ? languageStatuses.reduce((sum, lang) => sum + lang.completionRate, 0) / languageStatuses.length
    : 0

  const topPerformingLanguages = completionRates.slice(0, 5)
  const languagesNeedingAttention = completionRates
    .filter(lang => lang.completion < 80 || lang.errors > 0)
    .slice(0, 5)

  const qualityScore = languageStatuses.length > 0
    ? languageStatuses.reduce((sum, lang) => {
        const errorPenalty = lang.errors * 5
        const warningPenalty = lang.warnings * 2
        const completionBonus = lang.completionRate
        return sum + Math.max(0, completionBonus - errorPenalty - warningPenalty)
      }, 0) / languageStatuses.length
    : 0

  // Mock trend data (in a real app, this would come from historical data)
  const trendData = [
    { period: 'Week 1', completion: 65, quality: 78 },
    { period: 'Week 2', completion: 68, quality: 82 },
    { period: 'Week 3', completion: 72, quality: 85 },
    { period: 'Week 4', completion: 75, quality: 88 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600'
      case 'in-progress': return 'text-blue-600'
      case 'needs-review': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'text-green-600'
    if (completion >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Translation Analytics</h2>
          <p className="text-muted-foreground">
            Insights and metrics for translation quality and progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageCompletion)}%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+2.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(qualityScore)}/100</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+5.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Languages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLanguages}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>{languageStatuses.filter(l => l.status === 'complete').length} complete</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.validationErrors + stats.pendingApprovals}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span>-12% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Completion Progress</span>
                </CardTitle>
                <CardDescription>
                  Translation completion by language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingLanguages.map((lang) => (
                    <div key={lang.code} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{lang.language}</span>
                          <Badge variant="outline" className="text-xs">{lang.code}</Badge>
                        </div>
                        <span className={`text-sm font-medium ${getCompletionColor(lang.completion)}`}>
                          {Math.round(lang.completion)}%
                        </span>
                      </div>
                      <Progress value={lang.completion} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Status Distribution</span>
                </CardTitle>
                <CardDescription>
                  Current status of all languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['complete', 'in-progress', 'needs-review', 'error'].map(status => {
                    const count = languageStatuses.filter(l => l.status === status).length
                    const percentage = languageStatuses.length > 0 ? (count / languageStatuses.length) * 100 : 0
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'complete' ? 'bg-green-500' :
                            status === 'in-progress' ? 'bg-blue-500' :
                            status === 'needs-review' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(percentage)}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Top Performing Languages</span>
                </CardTitle>
                <CardDescription>
                  Languages with highest completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformingLanguages.map((lang, index) => (
                    <div key={lang.code} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{lang.language}</span>
                          <span className="text-green-600 font-medium">
                            {Math.round(lang.completion)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lang.keys.toLocaleString()} keys • {lang.errors} errors
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Needs Attention</span>
                </CardTitle>
                <CardDescription>
                  Languages requiring immediate focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {languagesNeedingAttention.length > 0 ? (
                    languagesNeedingAttention.map((lang) => (
                      <div key={lang.code} className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-xs font-medium text-red-600">
                          !
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{lang.language}</span>
                            <span className={`font-medium ${getCompletionColor(lang.completion)}`}>
                              {Math.round(lang.completion)}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {lang.errors > 0 && `${lang.errors} errors • `}
                            {lang.warnings > 0 && `${lang.warnings} warnings • `}
                            {lang.keys.toLocaleString()} keys
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">All languages are performing well!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quality Metrics</span>
                </CardTitle>
                <CardDescription>
                  Translation quality indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Quality Score</span>
                      <span className="text-sm font-medium">{Math.round(qualityScore)}/100</span>
                    </div>
                    <Progress value={qualityScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.validationErrors}</div>
                      <div className="text-muted-foreground">Total Errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {languageStatuses.reduce((sum, lang) => sum + lang.warnings, 0)}
                      </div>
                      <div className="text-muted-foreground">Total Warnings</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Error-free languages</span>
                      <span>{languageStatuses.filter(l => l.errors === 0).length}/{languageStatuses.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Complete languages</span>
                      <span>{languageStatuses.filter(l => l.completionRate === 100).length}/{languageStatuses.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Error Distribution</span>
                </CardTitle>
                <CardDescription>
                  Types and frequency of validation errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Missing translations', count: 15, color: 'bg-red-500' },
                    { type: 'Interpolation errors', count: 8, color: 'bg-orange-500' },
                    { type: 'Plural form issues', count: 5, color: 'bg-yellow-500' },
                    { type: 'Markup inconsistencies', count: 3, color: 'bg-blue-500' },
                  ].map((error) => (
                    <div key={error.type} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${error.color}`} />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm">{error.type}</span>
                        <span className="text-sm font-medium">{error.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Progress Trends</span>
              </CardTitle>
              <CardDescription>
                Translation progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Trend charts would be displayed here</p>
                <p className="text-sm mt-2">
                  Integration with charting library needed for visual trends
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}