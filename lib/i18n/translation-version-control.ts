// Translation version control system for tracking changes and history

import { TranslationData, TranslationFile } from './types'

export interface TranslationVersion {
  id: string
  version: string
  language: string
  namespace: string
  timestamp: Date
  author: string
  message: string
  changes: TranslationChange[]
  checksum: string
  parentVersion?: string
}

export interface TranslationChange {
  type: 'create' | 'update' | 'delete' | 'move'
  key: string
  oldValue?: string | null
  newValue?: string | null
  oldKey?: string // for move operations
}

export interface TranslationBranch {
  name: string
  baseVersion: string
  headVersion: string
  created: Date
  author: string
  description: string
  merged: boolean
  mergedAt?: Date
}

export interface TranslationCommit {
  id: string
  version: TranslationVersion
  branch: string
  timestamp: Date
  author: string
  message: string
  files: string[] // affected files
}

export interface TranslationDiff {
  language: string
  namespace: string
  fromVersion: string
  toVersion: string
  changes: TranslationChange[]
  summary: {
    created: number
    updated: number
    deleted: number
    moved: number
  }
}

export interface MergeConflict {
  key: string
  baseValue: string | null
  currentValue: string | null
  incomingValue: string | null
  resolution?: 'current' | 'incoming' | 'manual'
  resolvedValue?: string
}

export interface MergeResult {
  success: boolean
  conflicts: MergeConflict[]
  mergedData: TranslationData
  version: TranslationVersion
}

export class TranslationVersionControl {
  private static instance: TranslationVersionControl
  private versions: Map<string, TranslationVersion> = new Map()
  private branches: Map<string, TranslationBranch> = new Map()
  private commits: TranslationCommit[] = []
  private currentBranch: string = 'main'

  private constructor() {
    this.initializeMainBranch()
  }

  static getInstance(): TranslationVersionControl {
    if (!TranslationVersionControl.instance) {
      TranslationVersionControl.instance = new TranslationVersionControl()
    }
    return TranslationVersionControl.instance
  }

  /**
   * Create a new version from translation file
   */
  async createVersion(
    translationFile: TranslationFile,
    author: string,
    message: string,
    parentVersion?: string
  ): Promise<TranslationVersion> {
    const versionId = this.generateVersionId()
    const changes = parentVersion ? 
      await this.calculateChanges(translationFile, parentVersion) : 
      this.createInitialChanges(translationFile.translations)

    const version: TranslationVersion = {
      id: versionId,
      version: translationFile.version,
      language: translationFile.language,
      namespace: translationFile.namespace,
      timestamp: new Date(),
      author,
      message,
      changes,
      checksum: this.calculateChecksum(translationFile.translations),
      parentVersion
    }

    this.versions.set(versionId, version)
    
    // Create commit
    const commit: TranslationCommit = {
      id: this.generateCommitId(),
      version,
      branch: this.currentBranch,
      timestamp: new Date(),
      author,
      message,
      files: [`${translationFile.language}-${translationFile.namespace}.json`]
    }
    
    this.commits.push(commit)
    
    return version
  }

  /**
   * Get version by ID
   */
  getVersion(versionId: string): TranslationVersion | null {
    return this.versions.get(versionId) || null
  }

  /**
   * Get all versions for a language and namespace
   */
  getVersionHistory(language: string, namespace: string = 'default'): TranslationVersion[] {
    return Array.from(this.versions.values())
      .filter(v => v.language === language && v.namespace === namespace)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * Get latest version for a language and namespace
   */
  getLatestVersion(language: string, namespace: string = 'default'): TranslationVersion | null {
    const versions = this.getVersionHistory(language, namespace)
    return versions.length > 0 ? versions[0] : null
  }

  /**
   * Create a diff between two versions
   */
  async createDiff(fromVersionId: string, toVersionId: string): Promise<TranslationDiff | null> {
    const fromVersion = this.getVersion(fromVersionId)
    const toVersion = this.getVersion(toVersionId)
    
    if (!fromVersion || !toVersion) {
      return null
    }

    if (fromVersion.language !== toVersion.language || fromVersion.namespace !== toVersion.namespace) {
      throw new Error('Cannot diff versions from different languages or namespaces')
    }

    // Reconstruct translation data for both versions
    const fromData = await this.reconstructTranslationData(fromVersionId)
    const toData = await this.reconstructTranslationData(toVersionId)
    
    const changes = this.compareTranslationData(fromData, toData)
    
    const summary = {
      created: changes.filter(c => c.type === 'create').length,
      updated: changes.filter(c => c.type === 'update').length,
      deleted: changes.filter(c => c.type === 'delete').length,
      moved: changes.filter(c => c.type === 'move').length
    }

    return {
      language: fromVersion.language,
      namespace: fromVersion.namespace,
      fromVersion: fromVersion.version,
      toVersion: toVersion.version,
      changes,
      summary
    }
  }

  /**
   * Create a new branch
   */
  createBranch(
    name: string,
    baseVersion: string,
    author: string,
    description: string = ''
  ): TranslationBranch {
    if (this.branches.has(name)) {
      throw new Error(`Branch ${name} already exists`)
    }

    const branch: TranslationBranch = {
      name,
      baseVersion,
      headVersion: baseVersion,
      created: new Date(),
      author,
      description,
      merged: false
    }

    this.branches.set(name, branch)
    return branch
  }

  /**
   * Switch to a branch
   */
  switchBranch(branchName: string): void {
    if (!this.branches.has(branchName)) {
      throw new Error(`Branch ${branchName} does not exist`)
    }
    this.currentBranch = branchName
  }

  /**
   * Get current branch
   */
  getCurrentBranch(): string {
    return this.currentBranch
  }

  /**
   * Get all branches
   */
  getBranches(): TranslationBranch[] {
    return Array.from(this.branches.values())
  }

  /**
   * Merge branch into target branch
   */
  async mergeBranch(
    sourceBranch: string,
    targetBranch: string = 'main',
    author: string,
    message: string
  ): Promise<MergeResult> {
    const source = this.branches.get(sourceBranch)
    const target = this.branches.get(targetBranch)
    
    if (!source || !target) {
      throw new Error('Source or target branch does not exist')
    }

    // Get the versions to merge
    const sourceVersion = this.getVersion(source.headVersion)
    const targetVersion = this.getVersion(target.headVersion)
    const baseVersion = this.getVersion(source.baseVersion)
    
    if (!sourceVersion || !targetVersion || !baseVersion) {
      throw new Error('Cannot find required versions for merge')
    }

    // Reconstruct translation data
    const sourceData = await this.reconstructTranslationData(source.headVersion)
    const targetData = await this.reconstructTranslationData(target.headVersion)
    const baseData = await this.reconstructTranslationData(source.baseVersion)

    // Detect conflicts
    const conflicts = this.detectMergeConflicts(baseData, targetData, sourceData)
    
    if (conflicts.length > 0) {
      return {
        success: false,
        conflicts,
        mergedData: targetData,
        version: targetVersion
      }
    }

    // Perform merge
    const mergedData = this.performMerge(baseData, targetData, sourceData)
    
    // Create new version for merged result
    const mergedFile: TranslationFile = {
      language: sourceVersion.language,
      namespace: sourceVersion.namespace,
      version: this.incrementVersion(targetVersion.version),
      lastUpdated: new Date(),
      translations: mergedData
    }

    const mergedVersion = await this.createVersion(
      mergedFile,
      author,
      `Merge ${sourceBranch} into ${targetBranch}: ${message}`,
      target.headVersion
    )

    // Update target branch head
    target.headVersion = mergedVersion.id
    
    // Mark source branch as merged
    source.merged = true
    source.mergedAt = new Date()

    return {
      success: true,
      conflicts: [],
      mergedData,
      version: mergedVersion
    }
  }

  /**
   * Resolve merge conflicts
   */
  resolveMergeConflicts(
    conflicts: MergeConflict[],
    resolutions: Record<string, { resolution: 'current' | 'incoming' | 'manual', value?: string }>
  ): TranslationData {
    const resolvedData: TranslationData = {}
    
    for (const conflict of conflicts) {
      const resolution = resolutions[conflict.key]
      if (!resolution) {
        throw new Error(`No resolution provided for conflict: ${conflict.key}`)
      }

      let resolvedValue: string | null = null
      
      switch (resolution.resolution) {
        case 'current':
          resolvedValue = conflict.currentValue
          break
        case 'incoming':
          resolvedValue = conflict.incomingValue
          break
        case 'manual':
          resolvedValue = resolution.value || null
          break
      }

      if (resolvedValue !== null) {
        this.setNestedValue(resolvedData, conflict.key, resolvedValue)
      }
    }
    
    return resolvedData
  }

  /**
   * Get commit history
   */
  getCommitHistory(branch?: string): TranslationCommit[] {
    return this.commits
      .filter(commit => !branch || commit.branch === branch)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * Revert to a specific version
   */
  async revertToVersion(
    versionId: string,
    author: string,
    message: string
  ): Promise<TranslationVersion> {
    const targetVersion = this.getVersion(versionId)
    if (!targetVersion) {
      throw new Error(`Version ${versionId} not found`)
    }

    // Reconstruct the translation data from the target version
    const revertedData = await this.reconstructTranslationData(versionId)
    
    // Create new version with reverted data
    const revertedFile: TranslationFile = {
      language: targetVersion.language,
      namespace: targetVersion.namespace,
      version: this.incrementVersion(targetVersion.version),
      lastUpdated: new Date(),
      translations: revertedData
    }

    return this.createVersion(
      revertedFile,
      author,
      `Revert to version ${targetVersion.version}: ${message}`,
      this.getLatestVersion(targetVersion.language, targetVersion.namespace)?.id
    )
  }

  /**
   * Tag a version
   */
  tagVersion(versionId: string, tag: string, message: string = ''): void {
    const version = this.getVersion(versionId)
    if (!version) {
      throw new Error(`Version ${versionId} not found`)
    }

    // In a full implementation, store tags separately
    console.log(`Tagged version ${versionId} as ${tag}: ${message}`)
  }

  /**
   * Private helper methods
   */
  private initializeMainBranch(): void {
    const mainBranch: TranslationBranch = {
      name: 'main',
      baseVersion: '',
      headVersion: '',
      created: new Date(),
      author: 'system',
      description: 'Main branch',
      merged: false
    }
    
    this.branches.set('main', mainBranch)
  }

  private async calculateChanges(
    translationFile: TranslationFile,
    parentVersionId: string
  ): Promise<TranslationChange[]> {
    const parentData = await this.reconstructTranslationData(parentVersionId)
    return this.compareTranslationData(parentData, translationFile.translations)
  }

  private createInitialChanges(data: TranslationData): TranslationChange[] {
    const changes: TranslationChange[] = []
    
    this.traverseTranslationData(data, (key, value) => {
      changes.push({
        type: 'create',
        key,
        newValue: typeof value === 'string' ? value : JSON.stringify(value)
      })
    })
    
    return changes
  }

  private compareTranslationData(oldData: TranslationData, newData: TranslationData): TranslationChange[] {
    const changes: TranslationChange[] = []
    const oldKeys = this.getAllKeys(oldData)
    const newKeys = this.getAllKeys(newData)
    
    // Find created keys
    for (const key of newKeys) {
      if (!oldKeys.has(key)) {
        const newValue = this.getNestedValue(newData, key)
        changes.push({
          type: 'create',
          key,
          newValue: typeof newValue === 'string' ? newValue : JSON.stringify(newValue)
        })
      }
    }
    
    // Find deleted keys
    for (const key of oldKeys) {
      if (!newKeys.has(key)) {
        const oldValue = this.getNestedValue(oldData, key)
        changes.push({
          type: 'delete',
          key,
          oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue)
        })
      }
    }
    
    // Find updated keys
    for (const key of newKeys) {
      if (oldKeys.has(key)) {
        const oldValue = this.getNestedValue(oldData, key)
        const newValue = this.getNestedValue(newData, key)
        
        const oldStr = typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue)
        const newStr = typeof newValue === 'string' ? newValue : JSON.stringify(newValue)
        
        if (oldStr !== newStr) {
          changes.push({
            type: 'update',
            key,
            oldValue: oldStr,
            newValue: newStr
          })
        }
      }
    }
    
    return changes
  }

  private async reconstructTranslationData(versionId: string): Promise<TranslationData> {
    const version = this.getVersion(versionId)
    if (!version) {
      throw new Error(`Version ${versionId} not found`)
    }

    // Start with empty data and apply changes from the beginning
    let data: TranslationData = {}
    
    // Get all versions in chronological order up to the target version
    const versionChain = this.getVersionChain(versionId)
    
    for (const v of versionChain) {
      data = this.applyChanges(data, v.changes)
    }
    
    return data
  }

  private getVersionChain(versionId: string): TranslationVersion[] {
    const chain: TranslationVersion[] = []
    let currentVersionId: string | undefined = versionId
    
    while (currentVersionId) {
      const version = this.getVersion(currentVersionId)
      if (!version) break
      
      chain.unshift(version)
      currentVersionId = version.parentVersion
    }
    
    return chain
  }

  private applyChanges(data: TranslationData, changes: TranslationChange[]): TranslationData {
    const result = { ...data }
    
    for (const change of changes) {
      switch (change.type) {
        case 'create':
        case 'update':
          if (change.newValue !== undefined) {
            try {
              const value = JSON.parse(change.newValue)
              this.setNestedValue(result, change.key, value)
            } catch {
              this.setNestedValue(result, change.key, change.newValue)
            }
          }
          break
        
        case 'delete':
          this.deleteNestedValue(result, change.key)
          break
        
        case 'move':
          if (change.oldKey && change.newValue !== undefined) {
            const value = this.getNestedValue(result, change.oldKey)
            this.deleteNestedValue(result, change.oldKey)
            this.setNestedValue(result, change.key, value)
          }
          break
      }
    }
    
    return result
  }

  private detectMergeConflicts(
    baseData: TranslationData,
    currentData: TranslationData,
    incomingData: TranslationData
  ): MergeConflict[] {
    const conflicts: MergeConflict[] = []
    const allKeys = new Set([
      ...this.getAllKeys(baseData),
      ...this.getAllKeys(currentData),
      ...this.getAllKeys(incomingData)
    ])
    
    for (const key of allKeys) {
      const baseValue = this.getNestedValue(baseData, key)
      const currentValue = this.getNestedValue(currentData, key)
      const incomingValue = this.getNestedValue(incomingData, key)
      
      // Check if both branches modified the same key differently
      if (baseValue !== currentValue && baseValue !== incomingValue && currentValue !== incomingValue) {
        conflicts.push({
          key,
          baseValue: baseValue || null,
          currentValue: currentValue || null,
          incomingValue: incomingValue || null
        })
      }
    }
    
    return conflicts
  }

  private performMerge(
    baseData: TranslationData,
    currentData: TranslationData,
    incomingData: TranslationData
  ): TranslationData {
    const merged = { ...currentData }
    const allKeys = new Set([
      ...this.getAllKeys(baseData),
      ...this.getAllKeys(currentData),
      ...this.getAllKeys(incomingData)
    ])
    
    for (const key of allKeys) {
      const baseValue = this.getNestedValue(baseData, key)
      const currentValue = this.getNestedValue(currentData, key)
      const incomingValue = this.getNestedValue(incomingData, key)
      
      // If only incoming branch changed, use incoming value
      if (baseValue === currentValue && baseValue !== incomingValue) {
        if (incomingValue !== undefined) {
          this.setNestedValue(merged, key, incomingValue)
        } else {
          this.deleteNestedValue(merged, key)
        }
      }
      // If only current branch changed, keep current value (already in merged)
      // If both changed the same way, keep current value
      // If both changed differently, this would be a conflict (handled separately)
    }
    
    return merged
  }

  private traverseTranslationData(
    data: TranslationData,
    callback: (key: string, value: any) => void,
    prefix: string = ''
  ): void {
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string' || this.isPluralTranslation(value)) {
        callback(fullKey, value)
      } else if (typeof value === 'object' && value !== null) {
        this.traverseTranslationData(value as TranslationData, callback, fullKey)
      }
    }
  }

  private getAllKeys(data: TranslationData, prefix: string = ''): Set<string> {
    const keys = new Set<string>()
    
    for (const [key, value] of Object.entries(data)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'string' || this.isPluralTranslation(value)) {
        keys.add(fullKey)
      } else if (typeof value === 'object' && value !== null) {
        const nestedKeys = this.getAllKeys(value as TranslationData, fullKey)
        nestedKeys.forEach(k => keys.add(k))
      }
    }
    
    return keys
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  private deleteNestedValue(obj: any, path: string): void {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    const target = keys.reduce((current, key) => current?.[key], obj)
    if (target) {
      delete target[lastKey]
    }
  }

  private isPluralTranslation(value: any): boolean {
    if (typeof value !== 'object' || value === null) return false
    
    const keys = Object.keys(value)
    const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
    
    return keys.some(key => pluralKeys.includes(key)) && 
           keys.every(key => pluralKeys.includes(key) && typeof value[key] === 'string')
  }

  private calculateChecksum(data: TranslationData): string {
    const content = JSON.stringify(data, Object.keys(data).sort())
    
    // Simple hash function
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    return hash.toString(16)
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number)
    parts[2] = (parts[2] || 0) + 1
    return parts.join('.')
  }

  private generateVersionId(): string {
    return `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateCommitId(): string {
    return `commit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Export singleton instance
export const translationVersionControl = TranslationVersionControl.getInstance()