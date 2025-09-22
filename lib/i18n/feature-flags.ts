/**
 * Feature flag system for phased language rollout
 */

export interface LanguageFeatureFlags {
  enabledLanguages: string[]
  betaLanguages: string[]
  experimentalLanguages: string[]
  rolloutPercentage: Record<string, number>
  maintenanceMode: boolean
}

export interface DeploymentPhase {
  phase: number
  name: string
  languages: string[]
  rolloutPercentage: number
  startDate: Date
  endDate?: Date
  enabled: boolean
}

class FeatureFlagManager {
  private flags: LanguageFeatureFlags
  private phases: DeploymentPhase[]

  constructor() {
    this.flags = this.getDefaultFlags()
    this.phases = this.getDeploymentPhases()
  }

  /**
   * Ensure phases is always iterable
   */
  private ensurePhasesIterable(): DeploymentPhase[] {
    if (!this.phases || !Array.isArray(this.phases) || this.phases.length === 0) {
      this.phases = this.getDeploymentPhases()
    }
    return this.phases
  }

  private getDefaultFlags(): LanguageFeatureFlags {
    return {
      enabledLanguages: [
        // UN Official Languages (Priority 1)
        'en', 'fr', 'es', 'ar', 'zh', 'ru',
        // Major World Languages (Priority 2)
        'pt', 'de', 'ja', 'hi', 'it', 'nl', 'ko', 'tr', 'pl', 'bn', 'ur', 'fa', 'he', 'sv', 'no', 'da',
        // Additional Languages (Priority 3)
        'vi', 'th', 'id', 'ms', 'sw', 'am', 'yo', 'ha', 'el', 'cs', 'hu', 'ro', 'bg', 'hr', 'sr', 'sk', 'sl', 'fi', 'is', 'ga', 'cy', 'ca', 'eu', 'gl', 'et', 'lv', 'lt', 'mt', 'sq'
      ], // All available languages enabled
      betaLanguages: [],
      experimentalLanguages: [],
      rolloutPercentage: {},
      maintenanceMode: false
    }
  }

  private getDeploymentPhases(): DeploymentPhase[] {
    return [
      {
        phase: 1,
        name: 'All Languages',
        languages: [
          // UN Official Languages
          'en', 'fr', 'es', 'ar', 'zh', 'ru',
          // Major World Languages
          'pt', 'de', 'ja', 'hi', 'it', 'nl', 'ko', 'tr', 'pl', 'bn', 'ur', 'fa', 'he', 'sv', 'no', 'da',
          // Additional Languages
          'vi', 'th', 'id', 'ms', 'sw', 'am', 'yo', 'ha', 'el', 'cs', 'hu', 'ro', 'bg', 'hr', 'sr', 'sk', 'sl', 'fi', 'is', 'ga', 'cy', 'ca', 'eu', 'gl', 'et', 'lv', 'lt', 'mt', 'sq'
        ],
        rolloutPercentage: 100,
        startDate: new Date('2024-01-01'),
        enabled: true
      },
      {
        phase: 2,
        name: 'Major European Languages',
        languages: ['es', 'de', 'it', 'pt', 'nl'],
        rolloutPercentage: 0,
        startDate: new Date('2024-02-01'),
        enabled: false
      },
      {
        phase: 3,
        name: 'Asian Languages',
        languages: ['zh', 'ja', 'ko', 'hi', 'bn'],
        rolloutPercentage: 0,
        startDate: new Date('2024-03-01'),
        enabled: false
      },
      {
        phase: 4,
        name: 'RTL Languages',
        languages: ['ar', 'he', 'fa', 'ur'],
        rolloutPercentage: 0,
        startDate: new Date('2024-04-01'),
        enabled: false
      },
      {
        phase: 5,
        name: 'Additional Languages',
        languages: ['ru', 'pl', 'tr', 'sv', 'no', 'da'],
        rolloutPercentage: 0,
        startDate: new Date('2024-05-01'),
        enabled: false
      }
    ]
  }

  /**
   * Check if a language is enabled for the current user
   */
  isLanguageEnabled(languageCode: string, userId?: string): boolean {
    // Always enable core languages
    if (this.flags.enabledLanguages.includes(languageCode)) {
      return true
    }

    // Check maintenance mode
    if (this.flags.maintenanceMode && !['en', 'fr'].includes(languageCode)) {
      return false
    }

    // Check if language is in beta or experimental
    if (this.flags.betaLanguages.includes(languageCode)) {
      return this.isUserInBeta(userId)
    }

    if (this.flags.experimentalLanguages.includes(languageCode)) {
      return this.isUserInExperiment(userId)
    }

    // Check rollout percentage
    const rolloutPercentage = this.flags.rolloutPercentage[languageCode] || 0
    if (rolloutPercentage === 0) return false
    if (rolloutPercentage === 100) return true

    // Use deterministic rollout based on user ID or session
    const userHash = this.getUserHash(userId)
    return userHash < rolloutPercentage
  }

  /**
   * Get all available languages for the current user
   */
  getAvailableLanguages(userId?: string): string[] {
    const allLanguages = this.getAllPossibleLanguages()
    return allLanguages.filter(lang => this.isLanguageEnabled(lang, userId))
  }

  /**
   * Enable a language phase
   */
  enablePhase(phaseNumber: number, rolloutPercentage: number = 100): void {
    const phase = this.ensurePhasesIterable().find(p => p.phase === phaseNumber)
    if (!phase) return

    phase.enabled = true
    phase.rolloutPercentage = rolloutPercentage

    // Add languages to appropriate flag category
    if (rolloutPercentage === 100) {
      this.flags.enabledLanguages.push(...phase.languages)
    } else if (rolloutPercentage > 50) {
      this.flags.betaLanguages.push(...phase.languages)
    } else {
      this.flags.experimentalLanguages.push(...phase.languages)
    }

    // Set rollout percentages
    phase.languages.forEach(lang => {
      this.flags.rolloutPercentage[lang] = rolloutPercentage
    })
  }

  /**
   * Gradually increase rollout for a language
   */
  increaseRollout(languageCode: string, newPercentage: number): void {
    const currentPercentage = this.flags.rolloutPercentage[languageCode] || 0
    if (newPercentage > currentPercentage) {
      this.flags.rolloutPercentage[languageCode] = Math.min(newPercentage, 100)
    }
  }

  /**
   * Get deployment status
   */
  getDeploymentStatus(): {
    currentPhase: number
    enabledPhases: DeploymentPhase[]
    nextPhase?: DeploymentPhase
    totalLanguages: number
    enabledLanguages: number
  } {
    const enabledPhases = this.ensurePhasesIterable().filter(p => p.enabled)
    const currentPhase = Math.max(...enabledPhases.map(p => p.phase), 1)
    const nextPhase = this.ensurePhasesIterable().find(p => p.phase === currentPhase + 1)
    
    const totalLanguages = this.flags.enabledLanguages.length
    const enabledLanguages = this.flags.enabledLanguages.length

    return {
      currentPhase,
      enabledPhases,
      nextPhase,
      totalLanguages,
      enabledLanguages
    }
  }

  /**
   * Set maintenance mode
   */
  setMaintenanceMode(enabled: boolean): void {
    this.flags.maintenanceMode = enabled
  }

  private getAllPossibleLanguages(): string[] {
    // Return all languages from enabledLanguages array, which includes all available languages
    return [...this.flags.enabledLanguages]
  }

  private isUserInBeta(userId?: string): boolean {
    if (!userId) return false
    const hash = this.getUserHash(userId)
    return hash < 20 // 20% of users in beta
  }

  private isUserInExperiment(userId?: string): boolean {
    if (!userId) return false
    const hash = this.getUserHash(userId)
    return hash < 5 // 5% of users in experiment
  }

  private getUserHash(userId?: string): number {
    if (!userId) {
      // Use session-based hash for anonymous users
      userId = this.getSessionId()
    }
    
    // Simple hash function to get consistent percentage
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('deployment-session-id')
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15)
        sessionStorage.setItem('deployment-session-id', sessionId)
      }
      return sessionId
    }
    return 'server-session'
  }

  /**
   * Load flags from external configuration
   */
  async loadFlags(): Promise<void> {
    // Only load flags on client side
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      // In production, this would load from a feature flag service
      const response = await fetch('/api/feature-flags')
      if (response.ok) {
        const externalFlags = await response.json()
        this.flags = { ...this.flags, ...externalFlags }
      }
    } catch (error) {
      console.warn('Failed to load external feature flags, using defaults')
    }
  }

  /**
   * Get current flags (for debugging/admin)
   */
  getCurrentFlags(): LanguageFeatureFlags {
    return { ...this.flags }
  }

}

export const featureFlagManager = new FeatureFlagManager()
export default featureFlagManager