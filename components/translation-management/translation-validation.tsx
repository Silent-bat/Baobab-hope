'use client'

// Translation validation component with comprehensive error checking

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  RefreshCw, 
  FileText, 
  Search,
  Filter,
  Download,
  Settings,
  Zap
} from 'lucide-react'

import { translationValidator, ValidationReport, ValidationIssue } from '@/lib/i18n/translation-validator'
import { translationFileManager } from '@/lib/i18n/translation-file-manager'

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

interface TranslationValidationProps {
  languages: LanguageStatus[]
  onValidationComplete: () => void
}

interface ValidationState {
  reports: Record<string, ValidationReport>
  isValidating: boolean
  selectedLanguage: string
  filterSeverity: 'all' | 'error' | 'warning' | 'info'
  searchQuery: string
}

export function TranslationValidation({ languages, onValidationComplete }: TranslationValidationProps) {
  const [validationState, setValidationState] = useState<ValidationState>({
    reports: {},
    isValidating: false,
    selectedLanguage: languages.length > 0 ? languages[0].code : '',
    filterSeverity: 'all',
    searchQuery: ''
  })

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (languages.length > 0 && !validationState.selectedLanguage) {
      setValidationState(prev => ({ ...prev, selectedLanguage: languages[0].code }))
    }
  }, [languages])

  const validateAllLanguages = async () => {
    try {
      setValidationState(prev => ({ ...prev, isValidating: true }))
      setError(null)

      const reports: Record<string, ValidationReport> = {}

      for (const language of languages) {
        try {
          const translationFile = await translationFileManager.loadTranslationFile(language.code)
          if (translationFile) {
            const report = await translationValidator.validateTranslationFile(translationFile)
            reports[language.code] = report
          }
        } catch (error) {
          console.error(`Failed to validate ${language.code}:`, error)
        }
      }

      setValidationState(prev => ({ ...prev, reports }))
      onValidationComplete()
    } catch (error) {
      console.error('Validation failed:', error)
      setError('Failed to validate translations. Please try again.')
    } finally {
      setValidationState(prev => ({ ...prev, isValidating: false }))
    }
  }

  const validateSingleLanguage = async (languageCode: string) => {
    try {
      setValidationState(prev => ({ ...prev, isValidating: true }))
      setError(null)

      const translationFile = await translationFileManager.loadTranslationFile(languageCode)
      if (translationFile) {
        const report = await translationValidator.validateTranslationFile(translationFile)
        setValidationState(prev => ({
          ...prev,
          reports: { ...prev.reports, [languageCode]: report }
        }))
      }
    } catch (error) {
      console.error(`Failed to validate ${languageCode}:`, error)
      setError(`Failed to validate ${languageCode}. Please try again.`)
    } finally {
      setValidationState(prev => ({ ...prev, isValidating: false }))
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'destructive'
      case 'warning': return 'secondary'
      case 'info': return 'outline'
      default: return 'outline'
    }
  }

  const getOverallStatus = () => {
    const reports = Object.values(validationState.reports)
    if (reports.length === 0) return { status: 'unknown', color: 'gray' }

    const totalErrors = reports.reduce((sum, report) => sum + report.summary.errors, 0)
    const totalWarnings = reports.reduce((sum, report) => sum + report.summary.warnings, 0)

    if (totalErrors > 0) return { status: 'errors', color: 'red' }
    if (totalWarnings > 0) return { status: 'warnings', color: 'yellow' }
    return { status: 'clean', color: 'green' }
  }

  const selectedReport = validationState.reports[validationState.selectedLanguage]
  const filteredIssues = selectedReport?.issues.filter(issue => {
    const matchesSeverity = validationState.filterSeverity === 'all' || issue.severity === validationState.filterSeverity
    const matchesSearch = validationState.searchQuery === '' || 
                         issue.key.toLowerCase().includes(validationState.searchQuery.toLowerCase()) ||
                         issue.message.toLowerCase().includes(validationState.searchQuery.toLowerCase())
    return matchesSeverity && matchesSearch
  }) || []

  const overallStatus = getOverallStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Translation Validation</h2>
          <p className="text-muted-foreground">
            Validate translation files for errors, warnings, and consistency issues
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={validateAllLanguages} 
            disabled={validationState.isValidating}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${validationState.isValidating ? 'animate-spin' : ''}`} />
            {validationState.isValidating ? 'Validating...' : 'Validate All'}
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Rules
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Validation Overview</span>
            <Badge className={`bg-${overallStatus.color}-500`}>
              {overallStatus.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Object.keys(validationState.reports).length}
              </div>
              <div className="text-sm text-muted-foreground">Languages Validated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(validationState.reports).reduce((sum, report) => sum + report.summary.errors, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(validationState.reports).reduce((sum, report) => sum + report.summary.warnings, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(validationState.reports).reduce((sum, report) => sum + report.summary.infos, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Info Messages</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="by-language" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-language">By Language</TabsTrigger>
          <TabsTrigger value="by-rule">By Rule</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="by-language" className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Language List */}
            <div className="col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Languages</CardTitle>
                  <CardDescription>
                    Select a language to view validation results
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1 p-4">
                      {languages.map((language) => {
                        const report = validationState.reports[language.code]
                        const hasReport = !!report
                        
                        return (
                          <div
                            key={language.code}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              validationState.selectedLanguage === language.code
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setValidationState(prev => ({ 
                              ...prev, 
                              selectedLanguage: language.code 
                            }))}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{language.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {language.code.toUpperCase()}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {hasReport ? (
                                  <>
                                    {report.summary.errors > 0 && (
                                      <Badge variant="destructive" className="text-xs">
                                        {report.summary.errors}
                                      </Badge>
                                    )}
                                    {report.summary.warnings > 0 && (
                                      <Badge variant="secondary" className="text-xs">
                                        {report.summary.warnings}
                                      </Badge>
                                    )}
                                    {report.summary.errors === 0 && report.summary.warnings === 0 && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      validateSingleLanguage(language.code)
                                    }}
                                    disabled={validationState.isValidating}
                                  >
                                    Validate
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Validation Results */}
            <div className="col-span-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Validation Results
                        {validationState.selectedLanguage && (
                          <span className="ml-2 text-base font-normal text-muted-foreground">
                            ({languages.find(l => l.code === validationState.selectedLanguage)?.name})
                          </span>
                        )}
                      </CardTitle>
                      {selectedReport && (
                        <CardDescription>
                          {selectedReport.summary.totalKeys} keys • 
                          {selectedReport.summary.errors} errors • 
                          {selectedReport.summary.warnings} warnings • 
                          {Math.round(selectedReport.summary.completionRate)}% complete
                        </CardDescription>
                      )}
                    </div>
                    
                    {selectedReport && (
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={validationState.filterSeverity} 
                          onValueChange={(value: any) => setValidationState(prev => ({ 
                            ...prev, 
                            filterSeverity: value 
                          }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Issues</SelectItem>
                            <SelectItem value="error">Errors</SelectItem>
                            <SelectItem value="warning">Warnings</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {selectedReport ? (
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Completion Rate</span>
                          <span>{Math.round(selectedReport.summary.completionRate)}%</span>
                        </div>
                        <Progress value={selectedReport.summary.completionRate} className="h-2" />
                      </div>

                      {/* Issues List */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">
                            Issues ({filteredIssues.length})
                          </h4>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search issues..."
                              value={validationState.searchQuery}
                              onChange={(e) => setValidationState(prev => ({ 
                                ...prev, 
                                searchQuery: e.target.value 
                              }))}
                              className="pl-8 pr-3 py-2 text-sm border rounded-md w-64"
                            />
                          </div>
                        </div>

                        <ScrollArea className="h-[300px]">
                          <div className="space-y-3">
                            {filteredIssues.map((issue, index) => (
                              <Alert key={index} className={`${
                                issue.severity === 'error' ? 'border-red-200' : 
                                issue.severity === 'warning' ? 'border-yellow-200' : 
                                'border-blue-200'
                              }`}>
                                <div className="flex items-start space-x-3">
                                  {getSeverityIcon(issue.severity)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Badge variant={getSeverityColor(issue.severity) as any} className="text-xs">
                                        {issue.rule}
                                      </Badge>
                                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                        {issue.key}
                                      </code>
                                    </div>
                                    <AlertDescription className="text-sm">
                                      {issue.message}
                                      {issue.suggestion && (
                                        <div className="mt-2 text-xs text-muted-foreground">
                                          <strong>Suggestion:</strong> {issue.suggestion}
                                        </div>
                                      )}
                                    </AlertDescription>
                                  </div>
                                </div>
                              </Alert>
                            ))}
                            
                            {filteredIssues.length === 0 && (
                              <div className="text-center py-8 text-muted-foreground">
                                {selectedReport.issues.length === 0 ? (
                                  <div>
                                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                    <p>No validation issues found!</p>
                                  </div>
                                ) : (
                                  <p>No issues match your search criteria.</p>
                                )}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Suggestions */}
                      {selectedReport.suggestions.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Suggestions</h4>
                          <div className="space-y-2">
                            {selectedReport.suggestions.map((suggestion, index) => (
                              <Alert key={index}>
                                <Info className="h-4 w-4" />
                                <AlertDescription>{suggestion}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a language to view validation results</p>
                        <p className="text-sm mt-2">
                          Or click "Validate All" to check all languages
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="by-rule">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Validation Rule</CardTitle>
              <CardDescription>
                View all validation issues grouped by rule type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rule-based view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
              <CardDescription>
                Overall translation quality metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Summary view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}