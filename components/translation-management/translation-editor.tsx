'use client'

// Translation editor with real-time preview and advanced editing features

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Save, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Copy, 
  Undo, 
  Redo,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit3,
  Globe,
  Key,
  Type,
  Hash
} from 'lucide-react'

import { TranslationData, TranslationFile, PluralTranslation } from '@/lib/i18n/types'
import { translationFileManager } from '@/lib/i18n/translation-file-manager'
import { translationValidator } from '@/lib/i18n/translation-validator'
import { getAllLanguages } from '@/lib/i18n/languages'

interface TranslationEntry {
  key: string
  value: string | PluralTranslation
  type: 'string' | 'plural'
  namespace: string
  hasError: boolean
  hasWarning: boolean
  isModified: boolean
  originalValue: string | PluralTranslation
}

interface EditorState {
  entries: TranslationEntry[]
  selectedEntry: string | null
  searchQuery: string
  filterType: 'all' | 'string' | 'plural' | 'modified' | 'errors'
  showPreview: boolean
  unsavedChanges: boolean
}

interface TranslationEditorProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  onTranslationUpdate: () => void
}

export function TranslationEditor({ 
  selectedLanguage, 
  onLanguageChange, 
  onTranslationUpdate 
}: TranslationEditorProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    entries: [],
    selectedEntry: null,
    searchQuery: '',
    filterType: 'all',
    showPreview: true,
    unsavedChanges: false
  })
  
  const [translationFile, setTranslationFile] = useState<TranslationFile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationResults, setValidationResults] = useState<any>(null)

  const languages = getAllLanguages().filter(l => l.enabled)

  // Load translation file when language changes
  useEffect(() => {
    if (selectedLanguage) {
      loadTranslationFile(selectedLanguage)
    }
  }, [selectedLanguage])

  const loadTranslationFile = async (languageCode: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const file = await translationFileManager.loadTranslationFile(languageCode)
      if (!file) {
        // Create new file if it doesn't exist
        const newFile = await translationFileManager.createTranslationFile(languageCode)
        setTranslationFile(newFile)
        setEditorState(prev => ({
          ...prev,
          entries: [],
          selectedEntry: null,
          unsavedChanges: false
        }))
        return
      }

      setTranslationFile(file)

      // Convert translation data to editor entries
      const entries = flattenTranslationData(file.translations)
      
      // Validate translations
      const validation = await translationValidator.validateTranslationFile(file)
      setValidationResults(validation)

      // Mark entries with validation issues
      const entriesWithValidation = entries.map(entry => ({
        ...entry,
        hasError: validation.issues.some(issue => 
          issue.severity === 'error' && issue.key === entry.key
        ),
        hasWarning: validation.issues.some(issue => 
          issue.severity === 'warning' && issue.key === entry.key
        )
      }))

      setEditorState(prev => ({
        ...prev,
        entries: entriesWithValidation,
        selectedEntry: entriesWithValidation.length > 0 ? entriesWithValidation[0].key : null,
        unsavedChanges: false
      }))
    } catch (error) {
      console.error('Failed to load translation file:', error)
      setError('Failed to load translation file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const flattenTranslationData = (data: TranslationData, prefix = '', namespace = 'default'): TranslationEntry[] => {
    const entries: TranslationEntry[] = []

    const traverse = (obj: any, currentPrefix: string) => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key

        if (typeof value === 'string') {
          entries.push({
            key: fullKey,
            value,
            type: 'string',
            namespace,
            hasError: false,
            hasWarning: false,
            isModified: false,
            originalValue: value
          })
        } else if (isPluralTranslation(value)) {
          entries.push({
            key: fullKey,
            value: value as PluralTranslation,
            type: 'plural',
            namespace,
            hasError: false,
            hasWarning: false,
            isModified: false,
            originalValue: value as PluralTranslation
          })
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, fullKey)
        }
      }
    }

    traverse(data, prefix)
    return entries
  }

  const isPluralTranslation = (value: any): boolean => {
    if (typeof value !== 'object' || value === null) return false
    
    const keys = Object.keys(value)
    const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
    
    return keys.some(key => pluralKeys.includes(key)) && 
           keys.every(key => pluralKeys.includes(key) && typeof value[key] === 'string')
  }

  const updateTranslationEntry = (key: string, newValue: string | PluralTranslation) => {
    setEditorState(prev => ({
      ...prev,
      entries: prev.entries.map(entry => 
        entry.key === key 
          ? { 
              ...entry, 
              value: newValue, 
              isModified: JSON.stringify(newValue) !== JSON.stringify(entry.originalValue)
            }
          : entry
      ),
      unsavedChanges: true
    }))
  }

  const saveTranslations = async () => {
    if (!translationFile) return

    try {
      setIsSaving(true)
      setError(null)

      // Reconstruct translation data from entries
      const newTranslationData = reconstructTranslationData(editorState.entries)
      
      // Update translation file
      const updatedFile: TranslationFile = {
        ...translationFile,
        translations: newTranslationData,
        lastUpdated: new Date()
      }

      await translationFileManager.saveTranslationFile(updatedFile)
      
      // Update state
      setTranslationFile(updatedFile)
      setEditorState(prev => ({
        ...prev,
        entries: prev.entries.map(entry => ({
          ...entry,
          isModified: false,
          originalValue: entry.value
        })),
        unsavedChanges: false
      }))

      // Trigger parent update
      onTranslationUpdate()

      // Re-validate
      const validation = await translationValidator.validateTranslationFile(updatedFile)
      setValidationResults(validation)
    } catch (error) {
      console.error('Failed to save translations:', error)
      setError('Failed to save translations. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const reconstructTranslationData = (entries: TranslationEntry[]): TranslationData => {
    const data: TranslationData = {}

    for (const entry of entries) {
      setNestedValue(data, entry.key, entry.value)
    }

    return data
  }

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  const addNewTranslation = () => {
    const newKey = `new_key_${Date.now()}`
    const newEntry: TranslationEntry = {
      key: newKey,
      value: '',
      type: 'string',
      namespace: 'default',
      hasError: false,
      hasWarning: false,
      isModified: true,
      originalValue: ''
    }

    setEditorState(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry],
      selectedEntry: newKey,
      unsavedChanges: true
    }))
  }

  const deleteTranslation = (key: string) => {
    setEditorState(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.key !== key),
      selectedEntry: prev.selectedEntry === key ? null : prev.selectedEntry,
      unsavedChanges: true
    }))
  }

  const duplicateTranslation = (key: string) => {
    const originalEntry = editorState.entries.find(entry => entry.key === key)
    if (!originalEntry) return

    const newKey = `${key}_copy_${Date.now()}`
    const newEntry: TranslationEntry = {
      ...originalEntry,
      key: newKey,
      isModified: true
    }

    setEditorState(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry],
      selectedEntry: newKey,
      unsavedChanges: true
    }))
  }

  const filteredEntries = editorState.entries.filter(entry => {
    const matchesSearch = entry.key.toLowerCase().includes(editorState.searchQuery.toLowerCase()) ||
                         (typeof entry.value === 'string' && 
                          entry.value.toLowerCase().includes(editorState.searchQuery.toLowerCase()))

    const matchesFilter = editorState.filterType === 'all' ||
                         (editorState.filterType === 'string' && entry.type === 'string') ||
                         (editorState.filterType === 'plural' && entry.type === 'plural') ||
                         (editorState.filterType === 'modified' && entry.isModified) ||
                         (editorState.filterType === 'errors' && (entry.hasError || entry.hasWarning))

    return matchesSearch && matchesFilter
  })

  const selectedEntry = editorState.entries.find(entry => entry.key === editorState.selectedEntry)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading translations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <Label htmlFor="language-select">Language</Label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <Badge variant="outline">{lang.code}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {validationResults && (
            <div className="flex items-center space-x-2">
              <Badge variant={validationResults.summary.errors > 0 ? 'destructive' : 'secondary'}>
                {validationResults.summary.errors} errors
              </Badge>
              <Badge variant="outline">
                {validationResults.summary.warnings} warnings
              </Badge>
              <Badge variant="outline">
                {Math.round(validationResults.summary.completionRate)}% complete
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditorState(prev => ({ ...prev, showPreview: !prev.showPreview }))}
          >
            {editorState.showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {editorState.showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          
          <Button onClick={addNewTranslation} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Add Translation
          </Button>

          <Button 
            onClick={saveTranslations} 
            disabled={!editorState.unsavedChanges || isSaving}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {editorState.unsavedChanges && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your work.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-4 h-[600px]">
        {/* Translation List */}
        <div className="col-span-4 space-y-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Translations</CardTitle>
                <Badge variant="outline">
                  {filteredEntries.length} of {editorState.entries.length}
                </Badge>
              </div>
              
              {/* Search and Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search translations..."
                    value={editorState.searchQuery}
                    onChange={(e) => setEditorState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="pl-8"
                  />
                </div>
                
                <Select 
                  value={editorState.filterType} 
                  onValueChange={(value: any) => setEditorState(prev => ({ ...prev, filterType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="plural">Plural</SelectItem>
                    <SelectItem value="modified">Modified</SelectItem>
                    <SelectItem value="errors">With Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="space-y-1 p-4">
                  {filteredEntries.map((entry) => (
                    <div
                      key={entry.key}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        editorState.selectedEntry === entry.key
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setEditorState(prev => ({ ...prev, selectedEntry: entry.key }))}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium truncate">{entry.key}</span>
                            {entry.type === 'plural' && (
                              <Badge variant="outline" className="text-xs">
                                <Hash className="h-3 w-3 mr-1" />
                                Plural
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {typeof entry.value === 'string' 
                              ? entry.value || '(empty)'
                              : `${Object.keys(entry.value).length} forms`
                            }
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {entry.isModified && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" title="Modified" />
                          )}
                          {entry.hasError && (
                            <AlertCircle className="h-4 w-4 text-red-500" title="Has errors" />
                          )}
                          {entry.hasWarning && (
                            <AlertCircle className="h-4 w-4 text-yellow-500" title="Has warnings" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredEntries.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No translations match your search.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Translation Editor */}
        <div className={`${editorState.showPreview ? 'col-span-4' : 'col-span-8'} space-y-4`}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {selectedEntry ? 'Edit Translation' : 'Select Translation'}
                </CardTitle>
                {selectedEntry && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateTranslation(selectedEntry.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTranslation(selectedEntry.key)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {selectedEntry ? (
                <div className="space-y-4">
                  {/* Key Editor */}
                  <div>
                    <Label htmlFor="translation-key">Translation Key</Label>
                    <Input
                      id="translation-key"
                      value={selectedEntry.key}
                      onChange={(e) => {
                        const newKey = e.target.value
                        setEditorState(prev => ({
                          ...prev,
                          entries: prev.entries.map(entry =>
                            entry.key === selectedEntry.key
                              ? { ...entry, key: newKey, isModified: true }
                              : entry
                          ),
                          selectedEntry: newKey
                        }))
                      }}
                      className="font-mono"
                    />
                  </div>

                  {/* Value Editor */}
                  {selectedEntry.type === 'string' ? (
                    <div>
                      <Label htmlFor="translation-value">Translation Value</Label>
                      <Textarea
                        id="translation-value"
                        value={selectedEntry.value as string}
                        onChange={(e) => updateTranslationEntry(selectedEntry.key, e.target.value)}
                        rows={4}
                        placeholder="Enter translation..."
                      />
                    </div>
                  ) : (
                    <div>
                      <Label>Plural Forms</Label>
                      <div className="space-y-3">
                        {Object.entries(selectedEntry.value as PluralTranslation).map(([form, value]) => (
                          <div key={form}>
                            <Label htmlFor={`plural-${form}`} className="text-sm capitalize">
                              {form} {form === 'one' || form === 'other' ? '*' : ''}
                            </Label>
                            <Input
                              id={`plural-${form}`}
                              value={value || ''}
                              onChange={(e) => {
                                const newPluralValue = {
                                  ...(selectedEntry.value as PluralTranslation),
                                  [form]: e.target.value
                                }
                                updateTranslationEntry(selectedEntry.key, newPluralValue)
                              }}
                              placeholder={`${form} form...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Issues */}
                  {validationResults && (
                    <div className="space-y-2">
                      {validationResults.issues
                        .filter((issue: any) => issue.key === selectedEntry.key)
                        .map((issue: any, index: number) => (
                          <Alert key={index} className={issue.severity === 'error' ? 'border-red-200' : 'border-yellow-200'}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>{issue.severity === 'error' ? 'Error' : 'Warning'}:</strong> {issue.message}
                              {issue.suggestion && (
                                <div className="mt-1 text-sm text-muted-foreground">
                                  Suggestion: {issue.suggestion}
                                </div>
                              )}
                            </AlertDescription>
                          </Alert>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a translation to edit</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        {editorState.showPreview && (
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  See how your translation will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEntry ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">Rendered Output:</div>
                      {selectedEntry.type === 'string' ? (
                        <div className="text-sm">
                          {selectedEntry.value as string || <span className="text-muted-foreground italic">(empty)</span>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {Object.entries(selectedEntry.value as PluralTranslation).map(([form, value]) => (
                            <div key={form} className="text-sm">
                              <span className="font-medium capitalize">{form}:</span>{' '}
                              {value || <span className="text-muted-foreground italic">(empty)</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Context Information */}
                    <div className="space-y-2 text-sm">
                      <div><strong>Key:</strong> {selectedEntry.key}</div>
                      <div><strong>Type:</strong> {selectedEntry.type}</div>
                      <div><strong>Namespace:</strong> {selectedEntry.namespace}</div>
                      <div><strong>Status:</strong> 
                        {selectedEntry.isModified ? (
                          <Badge variant="outline" className="ml-2">Modified</Badge>
                        ) : (
                          <Badge variant="secondary" className="ml-2">Saved</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a translation to preview</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}