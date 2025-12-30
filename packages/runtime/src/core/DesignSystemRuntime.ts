// src/core/DesignSystemRuntime.ts

import { v4 as uuidv4 } from 'uuid'
import type {
  Token,
  Pattern,
  Rule,
  CreateTokenInput,
  UpdateTokenInput,
  TokenFilter,
  CreatePatternInput,
  UpdatePatternInput,
  PatternFilter,
  CreateRuleInput,
  UpdateRuleInput,
  Version,
  HistoryFilter,
  Project,
  DesignSystem,
  SerializedState,
} from '@frameos/types'
import { EntityType, ChangeType } from '@frameos/types'
import {
  createEmptyState,
  cloneState,
  type DesignSystemState,
} from '../state/DesignSystemState'
import { VersionTracker } from '../state/VersionTracker'
import { TokenManager } from '../state/TokenManager'
import { PatternManager } from '../state/PatternManager'
import { RuleManager } from '../state/RuleManager'
import {
  serializeState,
  deserializeState,
  CURRENT_SCHEMA_VERSION,
} from '../utils/serialization'

/**
 * DesignSystemRuntime is the main API for managing design system state
 * 
 * This is a pure, framework-agnostic TypeScript library that manages
 * design decisions with immutability and version tracking.
 */
export class DesignSystemRuntime {
  private state: DesignSystemState
  private versionTracker: VersionTracker
  private tokenManager: TokenManager
  private patternManager: PatternManager
  private ruleManager: RuleManager

  constructor(initialState?: DesignSystemState) {
    this.state = initialState || createEmptyState()
    this.versionTracker = new VersionTracker()
    
    // Initialize managers with state references
    this.tokenManager = new TokenManager(this.state.tokens, this.versionTracker)
    this.patternManager = new PatternManager(this.state.patterns, this.versionTracker)
    this.ruleManager = new RuleManager(this.state.rules, this.versionTracker)
    
    // Load versions if state has them
    if (this.state.versions.length > 0) {
      this.versionTracker.loadVersions(this.state.versions)
    }
  }

  // ==================== TOKEN OPERATIONS ====================

  /**
   * Create a new token
   */
  createToken(input: CreateTokenInput, reason?: string): Version {
    const version = this.tokenManager.create(input, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Update an existing token
   */
  updateToken(id: string, updates: UpdateTokenInput, reason?: string): Version {
    const version = this.tokenManager.update(id, updates, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Delete a token
   */
  deleteToken(id: string, reason?: string): Version {
    const version = this.tokenManager.delete(id, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Get token by ID
   */
  getToken(id: string): Token | null {
    return this.tokenManager.getById(id)
  }

  /**
   * Get all tokens
   */
  getTokens(filter?: TokenFilter): Token[] {
    return filter ? this.tokenManager.getFiltered(filter) : this.tokenManager.getAll()
  }

  // ==================== PATTERN OPERATIONS ====================

  /**
   * Create a new pattern
   */
  createPattern(input: CreatePatternInput, reason?: string): Version {
    const version = this.patternManager.create(input, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Update an existing pattern
   */
  updatePattern(id: string, updates: UpdatePatternInput, reason?: string): Version {
    const version = this.patternManager.update(id, updates, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Delete a pattern
   */
  deletePattern(id: string, reason?: string): Version {
    const version = this.patternManager.delete(id, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Get pattern by ID
   */
  getPattern(id: string): Pattern | null {
    return this.patternManager.getById(id)
  }

  /**
   * Get all patterns
   */
  getPatterns(filter?: PatternFilter): Pattern[] {
    return filter ? this.patternManager.getFiltered(filter) : this.patternManager.getAll()
  }

  // ==================== RULE OPERATIONS ====================

  /**
   * Create a new rule
   */
  createRule(input: CreateRuleInput, reason?: string): Version {
    const version = this.ruleManager.create(input, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Update an existing rule
   */
  updateRule(id: string, updates: UpdateRuleInput, reason?: string): Version {
    const version = this.ruleManager.update(id, updates, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Delete a rule
   */
  deleteRule(id: string, reason?: string): Version {
    const version = this.ruleManager.delete(id, reason)
    this.state.lastModified = new Date()
    return version
  }

  /**
   * Get rule by ID
   */
  getRule(id: string): Rule | null {
    return this.ruleManager.getById(id)
  }

  /**
   * Get all rules
   */
  getRules(): Rule[] {
    return this.ruleManager.getAll()
  }

  // ==================== VERSION HISTORY ====================

  /**
   * Get version history
   */
  getHistory(filter?: HistoryFilter): Version[] {
    return filter
      ? this.versionTracker.getFiltered(filter)
      : this.versionTracker.getAll()
  }

  /**
   * Get version by ID
   */
  getVersion(id: string): Version | null {
    return this.versionTracker.getById(id)
  }

  /**
   * Revert to a previous version (simplified - full implementation in future phase)
   */
  revert(versionId: string): void {
    throw new Error('Revert not yet implemented - coming in future phase')
  }

  // ==================== PROJECT MANAGEMENT ====================

  /**
   * Initialize a new project
   */
  initializeProject(name: string, description?: string): void {
    const projectId = uuidv4()
    const designSystemId = uuidv4()

    this.state.project = {
      id: projectId,
      name,
      description,
      designSystemId,
      pages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    this.state.designSystem = {
      id: designSystemId,
      projectId,
      tokens: [],
      patterns: [],
      rules: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    this.versionTracker.createVersion({
      entityType: EntityType.PROJECT,
      entityId: projectId,
      changeType: ChangeType.CREATE,
      before: null,
      after: this.state.project,
      reason: 'Project initialized',
    })
  }

  /**
   * Get current project
   */
  getProject(): Project | null {
    return this.state.project
  }

  /**
   * Get design system
   */
  getDesignSystem(): DesignSystem | null {
    return this.state.designSystem
  }

  // ==================== STATE MANAGEMENT ====================

  /**
   * Get read-only copy of state
   */
  getState(): Readonly<DesignSystemState> {
    return cloneState(this.state)
  }

  /**
   * Export state as JSON
   */
  exportState(): SerializedState {
    if (!this.state.project || !this.state.designSystem) {
      throw new Error('Cannot export state: no project initialized')
    }

    const serialized: SerializedState = {
      version: CURRENT_SCHEMA_VERSION,
      project: this.state.project,
      designSystem: this.state.designSystem,
      tokens: Object.fromEntries(this.state.tokens),
      patterns: Object.fromEntries(this.state.patterns),
      rules: Object.fromEntries(this.state.rules),
      components: {},
      pages: {},
      versions: this.versionTracker.getAll(),
      exportedAt: new Date(),
    }

    return serialized
  }

  /**
   * Import state from serialized data
   */
  importState(serialized: SerializedState): void {
    const deserialized = typeof serialized === 'string'
      ? deserializeState(serialized)
      : serialized

    // Clear current state
    this.state = createEmptyState()

    // Import project and design system
    this.state.project = deserialized.project
    this.state.designSystem = deserialized.designSystem

    // Import tokens
    for (const [id, token] of Object.entries(deserialized.tokens)) {
      this.state.tokens.set(id, token as Token)
    }

    // Import patterns
    for (const [id, pattern] of Object.entries(deserialized.patterns)) {
      this.state.patterns.set(id, pattern as Pattern)
    }

    // Import rules
    for (const [id, rule] of Object.entries(deserialized.rules)) {
      this.state.rules.set(id, rule as Rule)
    }

    // Import versions
    this.versionTracker.loadVersions(deserialized.versions)
    this.state.versions = deserialized.versions

    // Re-instantiate managers to use new Maps
    this.tokenManager = new TokenManager(this.state.tokens, this.versionTracker)
    this.patternManager = new PatternManager(this.state.patterns, this.versionTracker)
    this.ruleManager = new RuleManager(this.state.rules, this.versionTracker)

    this.state.lastModified = new Date()
  }

  /**
   * Clear all state
   */
  clear(): void {
    this.state = createEmptyState()
    this.versionTracker.clear()
  }

  // ==================== STATISTICS ====================

  /**
   * Get statistics about current state
   */
  getStatistics() {
    return {
      tokens: this.tokenManager.count(),
      patterns: this.patternManager.count(),
      rules: this.ruleManager.count(),
      versions: this.versionTracker.count(),
      lastModified: this.state.lastModified,
    }
  }
}