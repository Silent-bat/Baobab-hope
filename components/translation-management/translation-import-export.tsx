'use client'

// Translation import/export component with multiple format support

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Settings,
  Globe,
  Database,
  FileSpreadsheet,
  FileCode,
  File
} from 'lucide-react'

import { translationImportExport, ExportFormat } from '@/lib/i18n/translation-import-export'

interface TranslationImportExportProps {
  languages: string[]
  onImportComplete: () => void
}

interface ExportState {
  selectedLanguages: string[]
  format: string
  includeMetadata: boolean
  includeEmpty: boolean
  flattenStructure: boolean
  isExporting: boolean
  exportResult: any | null
}

interface ImportState {
  selectedFile: File | null
  format: string
  overwriteExisting: boolean
  validateBeforeImport: boolean
  createBackup: boolean
  isImporting: boolean
  importResult: any | null
  importProgress: number
}

export function TranslationImportExport({ languages, onImportComplete }: TranslationImportExportProps) {
  const [exportState, setExportState] = useState<ExportState>({
    selectedLanguages: [],
    format: 'json',
    includeMetadata: true,
    includeEmpty: false,
    flattenStructure: false,
    isExporting: false,
    exportResult: null
  })

  const [importState, setImportState] = useState<ImportState>({
    selectedFile: null,
    format: 'json',
    overwriteExisting: false,
    validateBeforeImport: true,
    createBackup: true,
    isImporting: false,
    importResult: null,
    importProgress: 0
  })

  const supportedFormats = translationImportExport.getSupportedFormats()

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'json': return <FileCode className="h-4 w-4" />
      case 'csv': case 'xlsx': return <FileSpreadsheet className="h-4 w-4" />
      case 'xml': case 'resx': return <FileText className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const handleExport = async () => {
    if (exportState.selectedLanguages.length === 0) {
      return
    }

    try {
      setExportState(prev => ({ ...prev, isExporting: true, exportResult: null }))

      const result = await translationImportExport.exportTranslations(
        exportState.selectedLanguages,
        exportState.format,
        {
          includeMetadata: exportState.includeMetadata,
          includeEmpty: exportState.includeEmpty,
          flattenStructure: exportState.flattenStructure
        }
      )

      setExportState(prev => ({ ...prev, exportResult: result }))

      // Trigger download
      const blob = new Blob([result.data], { type: result.format.mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      setExportState(prev => ({ 
        ...prev, 
        exportResult: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Export failed' 
        } 
      }))
    } finally {
      setExportState(prev => ({ ...prev, isExporting: false }))
    }
  }

  const handleImport = async () => {
    if (!importState.selectedFile) {
      return
    }

    try {
      setImportState(prev => ({ ...prev, isImporting: true, importResult: null, importProgress: 0 }))

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportState(prev => ({ 
          ...prev, 
          importProgress: Math.min(prev.importProgress + 10, 90) 
        }))
      }, 200)

      const fileContent = await importState.selectedFile.arrayBuffer()
      
      const result = await translationImportExport.importTranslations(
        Buffer.from(fileContent),
        importState.format,
        {
          includeEmpty: true,
          flattenStructure: importState.format === 'csv'
        }
      )

      clearInterval(progressInterval)
      setImportState(prev => ({ ...prev, importProgress: 100, importResult: result }))

      if (result.success) {
        onImportComplete()
      }
    } catch (error) {
      console.error('Import failed:', error)
      setImportState(prev => ({ 
        ...prev, 
        importResult: { 
          success: false, 
          errors: [error instanceof Error ? error.message : 'Import failed'],
          warnings: [],
          imported: 0,
          updated: 0,
          skipped: 0,
          languages: []
        } 
      }))
    } finally {
      setImportState(prev => ({ ...prev, isImporting: false }))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportState(prev => ({ 
        ...prev, 
        selectedFile: file,
        format: getFormatFromFileName(file.name)
      }))
    }
  }

  const getFormatFromFileName = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'json': return 'json'
      case 'csv': return 'csv'
      case 'xlsx': case 'xls': return 'xlsx'
      case 'xml': return 'xml'
      case 'yaml': case 'yml': return 'yaml'
      case 'po': return 'po'
      case 'properties': return 'properties'
      case 'resx': return 'resx'
      default: return 'json'
    }
  }

  const toggleLanguageSelection = (languageCode: string) => {
    setExportState(prev => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.includes(languageCode)
        ? prev.selectedLanguages.filter(l => l !== languageCode)
        : [...prev.selectedLanguages, languageCode]
    }))
  }

  const selectAllLanguages = () => {
    setExportState(prev => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.length === languages.length ? [] : [...languages]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Import & Export</h2>
          <p className="text-muted-foreground">
            Import and export translations in various formats
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList>
          <TabsTrigger value="export">Export Translations</TabsTrigger>
          <TabsTrigger value="import">Import Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure your translation export settings
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Language Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Languages</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllLanguages}
                    >
                      {exportState.selectedLanguages.length === languages.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {languages.map(lang => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={exportState.selectedLanguages.includes(lang)}
                          onCheckedChange={() => toggleLanguageSelection(lang)}
                        />
                        <Label htmlFor={`lang-${lang}`} className="text-sm">
                          {lang.toUpperCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {exportState.selectedLanguages.length > 0 && (
                    <div className="mt-2">
                      <Badge variant="outline">
                        {exportState.selectedLanguages.length} language{exportState.selectedLanguages.length > 1 ? 's' : ''} selected
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Format Selection */}
                <div>
                  <Label htmlFor="export-format" className="text-sm font-medium">Export Format</Label>
                  <Select 
                    value={exportState.format} 
                    onValueChange={(value) => setExportState(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedFormats.map(format => (
                        <SelectItem key={format.name} value={format.name.toLowerCase()}>
                          <div className="flex items-center space-x-2">
                            {getFormatIcon(format.name)}
                            <div>
                              <div className="font-medium">{format.name}</div>
                              <div className="text-xs text-muted-foreground">{format.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Export Options</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-metadata"
                        checked={exportState.includeMetadata}
                        onCheckedChange={(checked) => setExportState(prev => ({ 
                          ...prev, 
                          includeMetadata: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="include-metadata" className="text-sm">
                        Include metadata
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-empty"
                        checked={exportState.includeEmpty}
                        onCheckedChange={(checked) => setExportState(prev => ({ 
                          ...prev, 
                          includeEmpty: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="include-empty" className="text-sm">
                        Include empty translations
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flatten-structure"
                        checked={exportState.flattenStructure}
                        onCheckedChange={(checked) => setExportState(prev => ({ 
                          ...prev, 
                          flattenStructure: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="flatten-structure" className="text-sm">
                        Flatten key structure
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <Button
                  onClick={handleExport}
                  disabled={exportState.selectedLanguages.length === 0 || exportState.isExporting}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exportState.isExporting ? 'Exporting...' : 'Export Translations'}
                </Button>
              </CardContent>
            </Card>

            {/* Export Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Export Results</span>
                </CardTitle>
                <CardDescription>
                  View export status and download information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {exportState.isExporting ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Exporting translations...</p>
                    </div>
                  </div>
                ) : exportState.exportResult ? (
                  <div className="space-y-4">
                    {exportState.exportResult.success ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Export completed successfully! File has been downloaded.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Export failed: {exportState.exportResult.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {exportState.exportResult.success && (
                      <div className="space-y-2 text-sm">
                        <div><strong>Filename:</strong> {exportState.exportResult.filename}</div>
                        <div><strong>Format:</strong> {exportState.exportResult.format.name}</div>
                        <div><strong>Languages:</strong> {exportState.exportResult.metadata.languages.join(', ')}</div>
                        <div><strong>Keys:</strong> {exportState.exportResult.metadata.keyCount.toLocaleString()}</div>
                        <div><strong>File Size:</strong> {(exportState.exportResult.metadata.fileSize / 1024).toFixed(1)} KB</div>
                        <div><strong>Exported:</strong> {exportState.exportResult.metadata.exportedAt.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure export settings and click Export to begin</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Import Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Configuration</span>
                </CardTitle>
                <CardDescription>
                  Upload and configure translation import settings
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* File Selection */}
                <div>
                  <Label htmlFor="import-file" className="text-sm font-medium">Select File</Label>
                  <Input
                    id="import-file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".json,.csv,.xlsx,.xml,.yaml,.yml,.po,.properties,.resx"
                    className="mt-1"
                  />
                  {importState.selectedFile && (
                    <div className="mt-2 flex items-center space-x-2">
                      {getFormatIcon(importState.format)}
                      <span className="text-sm">{importState.selectedFile.name}</span>
                      <Badge variant="outline">{importState.format.toUpperCase()}</Badge>
                    </div>
                  )}
                </div>

                {/* Format Override */}
                <div>
                  <Label htmlFor="import-format" className="text-sm font-medium">Format</Label>
                  <Select 
                    value={importState.format} 
                    onValueChange={(value) => setImportState(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedFormats.map(format => (
                        <SelectItem key={format.name} value={format.name.toLowerCase()}>
                          <div className="flex items-center space-x-2">
                            {getFormatIcon(format.name)}
                            <span>{format.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Import Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Import Options</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="overwrite-existing"
                        checked={importState.overwriteExisting}
                        onCheckedChange={(checked) => setImportState(prev => ({ 
                          ...prev, 
                          overwriteExisting: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="overwrite-existing" className="text-sm">
                        Overwrite existing translations
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="validate-before-import"
                        checked={importState.validateBeforeImport}
                        onCheckedChange={(checked) => setImportState(prev => ({ 
                          ...prev, 
                          validateBeforeImport: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="validate-before-import" className="text-sm">
                        Validate before import
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="create-backup"
                        checked={importState.createBackup}
                        onCheckedChange={(checked) => setImportState(prev => ({ 
                          ...prev, 
                          createBackup: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="create-backup" className="text-sm">
                        Create backup before import
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Import Button */}
                <Button
                  onClick={handleImport}
                  disabled={!importState.selectedFile || importState.isImporting}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {importState.isImporting ? 'Importing...' : 'Import Translations'}
                </Button>
              </CardContent>
            </Card>

            {/* Import Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Import Results</span>
                </CardTitle>
                <CardDescription>
                  View import progress and results
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {importState.isImporting ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="mb-4">Importing translations...</p>
                      <Progress value={importState.importProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {importState.importProgress}% complete
                      </p>
                    </div>
                  </div>
                ) : importState.importResult ? (
                  <div className="space-y-4">
                    {importState.importResult.success ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Import completed successfully!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Import completed with errors. See details below.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {importState.importResult.imported}
                        </div>
                        <div className="text-muted-foreground">Imported</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {importState.importResult.updated}
                        </div>
                        <div className="text-muted-foreground">Updated</div>
                      </div>
                    </div>

                    {importState.importResult.languages.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Languages Processed</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {importState.importResult.languages.map((lang: string) => (
                            <Badge key={lang} variant="outline">{lang.toUpperCase()}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {importState.importResult.errors.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-red-600">Errors</Label>
                        <div className="mt-1 space-y-1">
                          {importState.importResult.errors.map((error: string, index: number) => (
                            <Alert key={index} className="border-red-200">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}

                    {importState.importResult.warnings.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-yellow-600">Warnings</Label>
                        <div className="mt-1 space-y-1">
                          {importState.importResult.warnings.map((warning: string, index: number) => (
                            <Alert key={index} className="border-yellow-200">
                              <Info className="h-4 w-4" />
                              <AlertDescription className="text-sm">{warning}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a file and click Import to begin</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}