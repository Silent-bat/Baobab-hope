'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { AlertTriangle, CheckCircle, Clock, Globe, Users, TrendingUp } from 'lucide-react'

interface DeploymentStatus {
  currentPhase: number
  enabledPhases: any[]
  nextPhase?: any
  totalLanguages: number
  enabledLanguages: number
}

interface FeatureFlags {
  enabledLanguages: string[]
  betaLanguages: string[]
  experimentalLanguages: string[]
  rolloutPercentage: Record<string, number>
  maintenanceMode: boolean
}

export function DeploymentDashboard() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchDeploymentStatus()
  }, [])

  const fetchDeploymentStatus = async () => {
    try {
      const response = await fetch('/api/feature-flags')
      const data = await response.json()
      setDeploymentStatus(data.deploymentStatus)
      setFeatureFlags(data.flags)
    } catch (error) {
      console.error('Failed to fetch deployment status:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFeatureFlag = async (action: string, params: any) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-key'}`
        },
        body: JSON.stringify({ action, ...params })
      })

      if (response.ok) {
        await fetchDeploymentStatus()
      } else {
        console.error('Failed to update feature flag')
      }
    } catch (error) {
      console.error('Error updating feature flag:', error)
    } finally {
      setUpdating(false)
    }
  }

  const enablePhase = (phase: number, percentage: number = 100) => {
    updateFeatureFlag('enablePhase', { phase, percentage })
  }

  const increaseRollout = (languageCode: string, percentage: number) => {
    updateFeatureFlag('increaseRollout', { languageCode, percentage })
  }

  const toggleMaintenanceMode = (enabled: boolean) => {
    updateFeatureFlag('setMaintenanceMode', { maintenanceMode: enabled })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!deploymentStatus || !featureFlags) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load deployment status. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  const progressPercentage = (deploymentStatus.enabledLanguages / deploymentStatus.totalLanguages) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Language Deployment Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control the phased rollout of multi-language support
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Maintenance Mode</span>
          <Switch
            checked={featureFlags.maintenanceMode}
            onCheckedChange={toggleMaintenanceMode}
            disabled={updating}
          />
        </div>
      </div>

      {/* Maintenance Mode Alert */}
      {featureFlags.maintenanceMode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Maintenance mode is enabled. Only core languages (English/French) are available.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Phase {deploymentStatus.currentPhase}</div>
            <p className="text-xs text-muted-foreground">
              {deploymentStatus.enabledPhases.length} phases active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages Enabled</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deploymentStatus.enabledLanguages}/{deploymentStatus.totalLanguages}
            </div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beta Languages</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featureFlags.betaLanguages.length}</div>
            <p className="text-xs text-muted-foreground">
              Limited rollout active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experimental</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featureFlags.experimentalLanguages.length}</div>
            <p className="text-xs text-muted-foreground">
              Testing in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="phases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="phases">Deployment Phases</TabsTrigger>
          <TabsTrigger value="languages">Language Status</TabsTrigger>
          <TabsTrigger value="rollout">Rollout Control</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Phases</CardTitle>
              <CardDescription>
                Manage the phased rollout of language support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentStatus.enabledPhases.map((phase) => (
                  <div key={phase.phase} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Phase {phase.phase}: {phase.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {phase.languages.join(', ')} • {phase.rolloutPercentage}% rollout
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))}

                {deploymentStatus.nextPhase && (
                  <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">
                          Phase {deploymentStatus.nextPhase.phase}: {deploymentStatus.nextPhase.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {deploymentStatus.nextPhase.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => enablePhase(deploymentStatus.nextPhase!.phase, 25)}
                        disabled={updating}
                      >
                        Start Beta (25%)
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => enablePhase(deploymentStatus.nextPhase!.phase, 100)}
                        disabled={updating}
                      >
                        Full Rollout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Language Status</CardTitle>
              <CardDescription>
                Current status of all supported languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featureFlags.enabledLanguages.map((lang) => (
                  <div key={lang} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{lang.toUpperCase()}</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                ))}
                {featureFlags.betaLanguages.map((lang) => (
                  <div key={lang} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{lang.toUpperCase()}</span>
                    <Badge variant="secondary">Beta</Badge>
                  </div>
                ))}
                {featureFlags.experimentalLanguages.map((lang) => (
                  <div key={lang} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{lang.toUpperCase()}</span>
                    <Badge variant="outline">Experimental</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rollout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rollout Control</CardTitle>
              <CardDescription>
                Fine-tune the rollout percentage for individual languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(featureFlags.rolloutPercentage).map(([lang, percentage]) => (
                  <div key={lang} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang.toUpperCase()}</span>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <Slider
                      value={[percentage]}
                      onValueChange={([value]) => increaseRollout(lang, value)}
                      max={100}
                      step={5}
                      className="w-full"
                      disabled={updating}
                    />
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