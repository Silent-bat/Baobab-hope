#!/usr/bin/env node

/**
 * Language Deployment Script
 * Manages phased rollout of language support
 */

const fs = require('fs')
const path = require('path')

// Deployment phases configuration
const DEPLOYMENT_PHASES = [
  {
    phase: 1,
    name: 'Core Infrastructure',
    languages: ['en', 'fr'],
    description: 'Base languages with full infrastructure'
  },
  {
    phase: 2,
    name: 'Major European Languages',
    languages: ['es', 'de', 'it', 'pt', 'nl'],
    description: 'High-demand European languages'
  },
  {
    phase: 3,
    name: 'Asian Languages',
    languages: ['zh', 'ja', 'ko', 'hi', 'bn'],
    description: 'Major Asian market languages'
  },
  {
    phase: 4,
    name: 'RTL Languages',
    languages: ['ar', 'he', 'fa', 'ur'],
    description: 'Right-to-left languages requiring special handling'
  },
  {
    phase: 5,
    name: 'Additional Languages',
    languages: ['ru', 'pl', 'tr', 'sv', 'no', 'da'],
    description: 'Extended language support'
  }
]

class LanguageDeploymentManager {
  constructor() {
    this.baseUrl = process.env.DEPLOYMENT_BASE_URL || 'http://localhost:3000'
    this.apiKey = process.env.ADMIN_API_KEY || 'dev-key'
  }

  async deployPhase(phaseNumber, rolloutPercentage = 100, dryRun = false) {
    const phase = DEPLOYMENT_PHASES.find(p => p.phase === phaseNumber)
    if (!phase) {
      throw new Error(`Phase ${phaseNumber} not found`)
    }

    console.log(`\n🚀 Deploying Phase ${phaseNumber}: ${phase.name}`)
    console.log(`Languages: ${phase.languages.join(', ')}`)
    console.log(`Rollout: ${rolloutPercentage}%`)
    console.log(`Dry run: ${dryRun ? 'Yes' : 'No'}`)

    if (dryRun) {
      console.log('✅ Dry run completed - no changes made')
      return
    }

    // Pre-deployment checks
    await this.runPreDeploymentChecks(phase)

    // Deploy the phase
    try {
      const response = await fetch(`${this.baseUrl}/api/feature-flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          action: 'enablePhase',
          phase: phaseNumber,
          percentage: rolloutPercentage
        })
      })

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Phase deployed successfully')
      console.log(`Current deployment status:`, result.deploymentStatus)

      // Post-deployment verification
      await this.runPostDeploymentChecks(phase)

    } catch (error) {
      console.error('❌ Deployment failed:', error.message)
      throw error
    }
  }

  async runPreDeploymentChecks(phase) {
    console.log('\n🔍 Running pre-deployment checks...')

    // Check translation files exist
    for (const lang of phase.languages) {
      const translationPath = path.join(process.cwd(), 'public', 'locales', `${lang}.json`)
      if (!fs.existsSync(translationPath)) {
        throw new Error(`Translation file missing for ${lang}: ${translationPath}`)
      }
      console.log(`✅ Translation file exists: ${lang}`)
    }

    // Check for RTL support if needed
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    const hasRtlLanguages = phase.languages.some(lang => rtlLanguages.includes(lang))
    if (hasRtlLanguages) {
      const rtlCssPath = path.join(process.cwd(), 'app', 'globals.css')
      const rtlCss = fs.readFileSync(rtlCssPath, 'utf8')
      if (!rtlCss.includes('[dir="rtl"]')) {
        console.warn('⚠️  RTL CSS styles may be missing')
      } else {
        console.log('✅ RTL CSS support detected')
      }
    }

    console.log('✅ Pre-deployment checks completed')
  }

  async runPostDeploymentChecks(phase) {
    console.log('\n🔍 Running post-deployment checks...')

    // Wait a moment for deployment to propagate
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check feature flags endpoint
    try {
      const response = await fetch(`${this.baseUrl}/api/feature-flags`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Feature flags endpoint responding')
        console.log(`Available languages: ${data.availableLanguages.join(', ')}`)
      }
    } catch (error) {
      console.warn('⚠️  Could not verify feature flags endpoint:', error.message)
    }

    console.log('✅ Post-deployment checks completed')
  }

  async rollback(phaseNumber) {
    console.log(`\n🔄 Rolling back Phase ${phaseNumber}...`)

    try {
      const response = await fetch(`${this.baseUrl}/api/feature-flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          action: 'enablePhase',
          phase: phaseNumber,
          percentage: 0
        })
      })

      if (!response.ok) {
        throw new Error(`Rollback failed: ${response.statusText}`)
      }

      console.log('✅ Phase rolled back successfully')
    } catch (error) {
      console.error('❌ Rollback failed:', error.message)
      throw error
    }
  }

  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/feature-flags`)
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('\n📊 Current Deployment Status:')
      console.log(`Current Phase: ${data.deploymentStatus.currentPhase}`)
      console.log(`Enabled Languages: ${data.availableLanguages.join(', ')}`)
      console.log(`Total Languages: ${data.deploymentStatus.enabledLanguages}/${data.deploymentStatus.totalLanguages}`)
      
      if (data.flags.maintenanceMode) {
        console.log('🚨 Maintenance mode is ENABLED')
      }

      return data
    } catch (error) {
      console.error('❌ Status check failed:', error.message)
      throw error
    }
  }

  async enableMaintenanceMode() {
    console.log('\n🚨 Enabling maintenance mode...')
    
    try {
      const response = await fetch(`${this.baseUrl}/api/feature-flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          action: 'setMaintenanceMode',
          maintenanceMode: true
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to enable maintenance mode: ${response.statusText}`)
      }

      console.log('✅ Maintenance mode enabled - only core languages available')
    } catch (error) {
      console.error('❌ Failed to enable maintenance mode:', error.message)
      throw error
    }
  }

  async disableMaintenanceMode() {
    console.log('\n✅ Disabling maintenance mode...')
    
    try {
      const response = await fetch(`${this.baseUrl}/api/feature-flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          action: 'setMaintenanceMode',
          maintenanceMode: false
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to disable maintenance mode: ${response.statusText}`)
      }

      console.log('✅ Maintenance mode disabled')
    } catch (error) {
      console.error('❌ Failed to disable maintenance mode:', error.message)
      throw error
    }
  }

  listPhases() {
    console.log('\n📋 Available Deployment Phases:')
    DEPLOYMENT_PHASES.forEach(phase => {
      console.log(`\nPhase ${phase.phase}: ${phase.name}`)
      console.log(`  Languages: ${phase.languages.join(', ')}`)
      console.log(`  Description: ${phase.description}`)
    })
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const manager = new LanguageDeploymentManager()

  try {
    switch (command) {
      case 'deploy':
        const phase = parseInt(args[1])
        const percentage = parseInt(args[2]) || 100
        const dryRun = args.includes('--dry-run')
        await manager.deployPhase(phase, percentage, dryRun)
        break

      case 'rollback':
        const rollbackPhase = parseInt(args[1])
        await manager.rollback(rollbackPhase)
        break

      case 'status':
        await manager.getStatus()
        break

      case 'maintenance':
        const action = args[1]
        if (action === 'enable') {
          await manager.enableMaintenanceMode()
        } else if (action === 'disable') {
          await manager.disableMaintenanceMode()
        } else {
          console.error('Usage: maintenance [enable|disable]')
          process.exit(1)
        }
        break

      case 'list':
        manager.listPhases()
        break

      default:
        console.log(`
Language Deployment Manager

Usage:
  node scripts/deploy-language-phase.js <command> [options]

Commands:
  deploy <phase> [percentage] [--dry-run]  Deploy a language phase
  rollback <phase>                         Rollback a language phase
  status                                   Show current deployment status
  maintenance [enable|disable]             Toggle maintenance mode
  list                                     List all deployment phases

Examples:
  node scripts/deploy-language-phase.js deploy 2 25 --dry-run
  node scripts/deploy-language-phase.js deploy 2 100
  node scripts/deploy-language-phase.js rollback 2
  node scripts/deploy-language-phase.js status
  node scripts/deploy-language-phase.js maintenance enable
        `)
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { LanguageDeploymentManager, DEPLOYMENT_PHASES }