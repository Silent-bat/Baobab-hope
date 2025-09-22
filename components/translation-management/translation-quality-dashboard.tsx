'use client'

// Translation quality assurance dashboard

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  MessageSquare,
  AlertCircle,
  Info
} from 'lucide-react'
import { 
  translationQA, 
  QualityReport, 
  QualityMetrics, 
  QualityIssue, 
  UserFeedback 
} from '@/lib/i18n/quality-assurance'
import { getSupportedLanguages } from '@/lib/i18n/languages'

interface QualityDashboardProps {
  className?: string
}

export function TranslationQualityDashboard({ className }: QualityDashboardProps) {
  const [qualityReports, setQualityReports] = useState<Map<string, QualityReport>>(new Map())
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null)
  const [userFeedback, setUserFeedback] = useState<Map<string, UserFeedback[]>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [issueFilter, setIssueFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadQualityData()
  }, [])

  const loadQualityData = async () => {
    setIsLoading(true)
    try {
      // Load quality reports for all languages
      const reports = await translationQA.validateAllLanguages()
      setQualityReports(reports)

      // Get quality metrics
      const metrics = translationQA.getQualityMetrics()
      setQualityMetrics(metrics)

      // Load user feedback
      const supportedLanguages = getSupportedLanguages()
      const feedbackMap = new Map<string, UserFeedback[]>()
      
      for (const language of supportedLanguages) {
        const feedback = translationQA.getUserFeedback(language.code)
        if (feedback.length > 0) {
          feedbackMap.set(language.code, feedback)
        }
      }
      setUserFeedback(feedbackMap)

    } catch (error) {
      console.error('Failed to load quality data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredIssues = () => {
    const allIssues: QualityIssue[] = []
    
    for (const [language, report] of qualityReports.entries()) {
      if (selectedLanguage === 'all' || selectedLanguage === language) {
        allIssues.push(...report.issues)
      }
    }

    let filtered = allIssues

    if (issueFilter !== 'all') {
      filtered = filtered.filter(issue => issue.type === issueFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(issue => 
        issue.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }

  const getSeverityColor = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getSeverityIcon = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertCircle className="h-4 w-4" />
      case 'medium': return <Info className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const exportQualityReport = () => {
    const data = {
      metrics: qualityMetrics,
      reports: Object.fromEntries(qualityReports),
      feedback: Object.fromEntries(userFeedback),
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translation-quality-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quality data...</span>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Translation Quality Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and improve translation quality across all languages
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadQualityData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportQualityReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quality Metrics Overview */}
      {qualityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Completion</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qualityMetrics.overallCompletion.toFixed(1)}%
              </div>
              <Progress value={qualityMetrics.overallCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Quality</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {qualityMetrics.averageQuality.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Quality score out of 100
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qualityMetrics.totalIssues}</div>
              <p className="text-xs text-muted-foreground">
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
              <div className="text-2xl font-bold">
                {Array.from(userFeedback.values()).flat().length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total feedback items
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {qualityMetrics && (
            <>
              {/* Language Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Quality Rankings</CardTitle>
                  <CardDescription>
                    Languages ranked by quality score and completion percentage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {qualityMetrics.languageRankings.slice(0, 10).map((ranking, index) => (
                      <div key={ranking.language} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center text-sm font-medium">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{ranking.language.toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground">
                              {ranking.issues} issues
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {ranking.completion.toFixed(1)}% complete
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Quality: {ranking.quality.toFixed(1)}
                            </div>
                          </div>
                          <Progress value={ranking.completion} className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Issue Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Issues by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(qualityMetrics.issuesByType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Issues by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(qualityMetrics.issuesBySeverity).map(([severity, count]) => (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(severity as QualityIssue['severity'])}
                            <span className="capitalize">{severity}</span>
                          </div>
                          <Badge variant={getSeverityColor(severity as QualityIssue['severity'])}>
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {Array.from(qualityReports.keys()).map((language) => (
                      <SelectItem key={language} value={language}>
                        {language.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={issueFilter} onValueChange={setIssueFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                    <SelectItem value="empty">Empty</SelectItem>
                    <SelectItem value="placeholder">Placeholder</SelectItem>
                    <SelectItem value="formatting">Formatting</SelectItem>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="encoding">Encoding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Issues Table */}
          <Card>
            <CardHeader>
              <CardTitle>Translation Issues</CardTitle>
              <CardDescription>
                {getFilteredIssues().length} issues found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Suggestion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredIssues().map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <Badge variant={getSeverityColor(issue.severity)} className="gap-1">
                            {getSeverityIcon(issue.severity)}
                            {issue.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {issue.language.toUpperCase()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {issue.key}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={issue.message}>
                            {issue.message}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          {issue.suggestion && (
                            <div className="truncate text-sm text-muted-foreground" title={issue.suggestion}>
                              {issue.suggestion}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4">
            {Array.from(userFeedback.entries()).map(([language, feedback]) => (
              <Card key={language}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language.toUpperCase()} Feedback</span>
                    <Badge variant="outline">{feedback.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback.slice(0, 5).map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                              {item.priority}
                            </Badge>
                            <Badge variant={
                              item.status === 'resolved' ? 'default' : 
                              item.status === 'reviewed' ? 'secondary' : 'outline'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-mono mb-2">{item.key}</div>
                        <p className="text-sm">{item.message}</p>
                      </div>
                    ))}
                    {feedback.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center">
                        And {feedback.length - 5} more items...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <div className="grid gap-4">
            {Array.from(qualityReports.entries()).map(([language, report]) => (
              <Card key={language}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{language.toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {report.completionPercentage.toFixed(1)}% complete
                      </Badge>
                      <Badge variant="secondary">
                        Quality: {report.qualityScore.toFixed(1)}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {report.translatedKeys} of {report.totalKeys} keys translated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={report.completionPercentage} />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Total Keys</div>
                        <div className="text-muted-foreground">{report.totalKeys}</div>
                      </div>
                      <div>
                        <div className="font-medium">Translated</div>
                        <div className="text-muted-foreground">{report.translatedKeys}</div>
                      </div>
                      <div>
                        <div className="font-medium">Missing</div>
                        <div className="text-muted-foreground">{report.missingKeys}</div>
                      </div>
                      <div>
                        <div className="font-medium">Issues</div>
                        <div className="text-muted-foreground">{report.issues.length}</div>
                      </div>
                    </div>

                    {report.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recent Issues</h4>
                        <div className="space-y-2">
                          {report.issues.slice(0, 3).map((issue) => (
                            <div key={issue.id} className="flex items-center gap-2 text-sm">
                              <Badge variant={getSeverityColor(issue.severity)} className="gap-1">
                                {getSeverityIcon(issue.severity)}
                                {issue.severity}
                              </Badge>
                              <span className="font-mono">{issue.key}</span>
                              <span className="text-muted-foreground truncate">
                                {issue.message}
                              </span>
                            </div>
                          ))}
                          {report.issues.length > 3 && (
                            <p className="text-sm text-muted-foreground">
                              And {report.issues.length - 3} more issues...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}