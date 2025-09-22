'use client'

// Translation management dashboard with real-time editing and approval workflow

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Languages, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Upload,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Users,
  BarChart3
} from 'lucide-react'

import { TranslationEditor } from './translation-editor'
import { TranslationImportExport } from './translation-import-export'
import { TranslationValidation } from './translation-validation'
import { TranslationApproval } from './translation-approval'
import { TranslationAnalytics } from './translation-analytics'

import { translationFileManager } from '@/lib/i18n/translation-file-manager'
import { translationValidator } from '@/lib/i18n/translation-validator'
import { translationImportExport } from '@/lib/i18n/translation-import-export'
import { getAllLanguages } from '@/lib/i18n/languages'

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

export function TranslationDashboard() {
  const [stats, setStats] = useState<TranslationStats | null>(null)
  const [languageStatuses, setLanguageStatuses] = useState<LanguageStatus[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load translation statistics
      const languages = getAllLanguages()
      const languageStatuses: LanguageStatus[] = []
      let totalKeys = 0
      let completedTranslations = 0
      let totalErrors = 0
      let pendingApprovals = 0

      for (const language of languages) {
        if (!language.enabled) continue

        try {
          // Load translation file
          const translationFile = await translationFileManager.loadTranslationFile(language.code)
          
          if (translationFile) {
            // Validate translations
            const validation = await translationValidator.validateTranslationFile(translationFile)
            
            const status: LanguageStatus = {
              code: language.code,
              name: language.name,
              completionRate: validation.metadata.completionRate,
              keyCount: validation.metadata.keyCount,
              errors: validation.summary.errors,
              warnings: validation.summary.warnings,
              lastUpdated: translationFile.lastUpdated,
              status: validation.summary.errors > 0 ? 'error' : 
                      validation.metadata.completionRate < 100 ? 'in-progress' : 
                      validation.summary.warnings > 0 ? 'needs-review' : 'complete'
            }

            languageStatuses.push(status)
            totalKeys += status.keyCount
            completedTranslations += Math.round((status.keyCount * status.completionRate) / 100)
            totalErrors += status.errors
            
            // Simulate pending approvals (in real implementation, get from approval system)
            if (status.status === 'needs-review') {
              pendingApprovals += status.warnings
            }
          }
        } catch (error) {
          console.error(`Failed to load data for ${language.code}:`, error)
          
          languageStatuses.push({
            code: language.code,
            name: language.name,
            completionRate: 0,
            keyCount: 0,
            errors: 1,
            warnings: 0,
            lastUpdated: new Date(),
            status: 'error'
          })
        }
      }

      const stats: TranslationStats = {
        totalLanguages: languageStatuses.length,
        totalKeys,
        completedTranslations,
        pendingApprovals,
        validationErrors: totalErrors,
        lastUpdated: new Date()
      }

      setStats(stats)
      setLanguageStatuses(languageStatuses)
      
      // Set default selected language
      if (languageStatuses.length > 0 && !selectedLanguage) {
        setSelectedLanguage(languageStatuses[0].code)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load translation data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    loadDashboardData()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'needs-review': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete': return 'Complete'
      case 'in-progress': return 'In Progress'
      case 'needs-review': return 'Needs Review'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  const filteredLanguages = languageStatuses.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || lang.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading translation data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button onClick={refreshData} variant="outline" size="sm" className="ml-2">
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Translation Management</h1>
          <p className="text-muted-foreground">
            Manage translations across {stats?.totalLanguages} languages
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Languages</CardTitle>
              <Languages className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLanguages}</div>
              <p className="text-xs text-muted-foreground">
                Active languages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalKeys.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Translation keys
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTranslations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.completedTranslations / stats.totalKeys) * 100)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.validationErrors}</div>
              <p className="text-xs text-muted-foreground">
                Validation errors
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Language Filter and Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Languages</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by language name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="needs-review">Needs Review</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLanguages.map((language) => (
              <Card key={language.code} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedLanguage(language.code)
                      setActiveTab('editor')
                    }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{language.name}</CardTitle>
                    <Badge className={getStatusColor(language.status)}>
                      {getStatusText(language.status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {language.code.toUpperCase()} • {language.keyCount} keys
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span>{Math.round(language.completionRate)}%</span>
                      </div>
                      <Progress value={language.completionRate} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Errors: {language.errors}</span>
                      <span>Warnings: {language.warnings}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Updated: {language.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No languages match your search criteria.
            </div>
          )}
        </TabsContent>

        <TabsContent value="editor">
          <TranslationEditor 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onTranslationUpdate={refreshData}
          />
        </TabsContent>

        <TabsContent value="validation">
          <TranslationValidation 
            languages={languageStatuses}
            onValidationComplete={refreshData}
          />
        </TabsContent>

        <TabsContent value="approval">
          <TranslationApproval 
            pendingApprovals={stats?.pendingApprovals || 0}
            onApprovalComplete={refreshData}
          />
        </TabsContent>

        <TabsContent value="import-export">
          <TranslationImportExport 
            languages={languageStatuses.map(l => l.code)}
            onImportComplete={refreshData}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <TranslationAnalytics 
            stats={stats}
            languageStatuses={languageStatuses}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}