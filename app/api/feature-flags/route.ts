import { NextRequest, NextResponse } from 'next/server'
import featureFlagManager from '@/lib/i18n/feature-flags'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    const flags = featureFlagManager.getCurrentFlags()
    const availableLanguages = featureFlagManager.getAvailableLanguages(userId || undefined)
    const deploymentStatus = featureFlagManager.getDeploymentStatus()

    return NextResponse.json({
      flags,
      availableLanguages,
      deploymentStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching feature flags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, phase, percentage, languageCode, maintenanceMode } = body

    // In production, add authentication/authorization here
    const isAuthorized = process.env.NODE_ENV === 'development' || 
                        request.headers.get('authorization') === `Bearer ${process.env.ADMIN_API_KEY}`
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    switch (action) {
      case 'enablePhase':
        if (typeof phase === 'number' && typeof percentage === 'number') {
          featureFlagManager.enablePhase(phase, percentage)
        }
        break
      
      case 'increaseRollout':
        if (typeof languageCode === 'string' && typeof percentage === 'number') {
          featureFlagManager.increaseRollout(languageCode, percentage)
        }
        break
      
      case 'setMaintenanceMode':
        if (typeof maintenanceMode === 'boolean') {
          featureFlagManager.setMaintenanceMode(maintenanceMode)
        }
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const updatedStatus = featureFlagManager.getDeploymentStatus()
    
    return NextResponse.json({
      success: true,
      deploymentStatus: updatedStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating feature flags:', error)
    return NextResponse.json(
      { error: 'Failed to update feature flags' },
      { status: 500 }
    )
  }
}