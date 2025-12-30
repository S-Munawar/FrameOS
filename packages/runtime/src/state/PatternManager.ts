// src/state/PatternManager.ts

import { v4 as uuidv4 } from 'uuid'
import type {
  Pattern,
  CreatePatternInput,
  UpdatePatternInput,
  PatternFilter,
  Version,
} from '@frameos/types'
import { EntityType, ChangeType } from '@frameos/types'
import {
  patternSchema,
  createPatternInputSchema,
  updatePatternInputSchema,
} from '@frameos/validators'
import { VersionTracker } from './VersionTracker'

/**
 * PatternManager handles all pattern operations
 */
export class PatternManager {
  private patterns: Map<string, Pattern>
  private versionTracker: VersionTracker

  constructor(patterns: Map<string, Pattern>, versionTracker: VersionTracker) {
    this.patterns = patterns
    this.versionTracker = versionTracker
  }

  /**
   * Create a new pattern
   */
  create(input: CreatePatternInput, reason?: string): Version {
    // Validate input
    const validationResult = createPatternInputSchema.safeParse(input)
    if (!validationResult.success) {
      throw new Error(`Invalid pattern input: ${validationResult.error.message}`)
    }

    // Check for duplicate name at same scope
    const existing = this.findByNameAndScope(input.name, input.scope)
    if (existing) {
      throw new Error(
        `Pattern with name "${input.name}" already exists at scope ${JSON.stringify(input.scope)}`
      )
    }

    // Create pattern
    const pattern: Pattern = {
      ...input,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    // Validate complete pattern
    const patternValidation = patternSchema.safeParse(pattern)
    if (!patternValidation.success) {
      throw new Error(`Invalid pattern: ${patternValidation.error.message}`)
    }

    // Store pattern
    this.patterns.set(pattern.id, pattern)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.PATTERN,
      entityId: pattern.id,
      changeType: ChangeType.CREATE,
      before: null,
      after: pattern,
      scope: this.formatScope(pattern.scope),
      reason,
    })
  }

  /**
   * Update an existing pattern
   */
  update(id: string, updates: UpdatePatternInput, reason?: string): Version {
    // Get existing pattern
    const existing = this.patterns.get(id)
    if (!existing) {
      throw new Error(`Pattern with ID ${id} not found`)
    }

    // Validate updates
    const validationResult = updatePatternInputSchema.safeParse(updates)
    if (!validationResult.success) {
      throw new Error(`Invalid pattern updates: ${validationResult.error.message}`)
    }

    // Check for name conflicts if name is being changed
    if (updates.name && updates.name !== existing.name) {
      const scope = updates.scope || existing.scope
      const conflict = this.findByNameAndScope(updates.name, scope)
      if (conflict && conflict.id !== id) {
        throw new Error(
          `Pattern with name "${updates.name}" already exists at scope ${JSON.stringify(scope)}`
        )
      }
    }

    // Create updated pattern
    const updated: Pattern = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      version: existing.version + 1,
    }

    // Validate complete pattern
    const patternValidation = patternSchema.safeParse(updated)
    if (!patternValidation.success) {
      throw new Error(`Invalid updated pattern: ${patternValidation.error.message}`)
    }

    // Store updated pattern
    this.patterns.set(id, updated)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.PATTERN,
      entityId: id,
      changeType: ChangeType.UPDATE,
      before: existing,
      after: updated,
      scope: this.formatScope(updated.scope),
      reason,
    })
  }

  /**
   * Delete a pattern
   */
  delete(id: string, reason?: string): Version {
    // Get existing pattern
    const existing = this.patterns.get(id)
    if (!existing) {
      throw new Error(`Pattern with ID ${id} not found`)
    }

    // Remove pattern
    this.patterns.delete(id)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.PATTERN,
      entityId: id,
      changeType: ChangeType.DELETE,
      before: existing,
      after: null,
      scope: this.formatScope(existing.scope),
      reason,
    })
  }

  /**
   * Get pattern by ID
   */
  getById(id: string): Pattern | null {
    return this.patterns.get(id) || null
  }

  /**
   * Get all patterns
   */
  getAll(): Pattern[] {
    return Array.from(this.patterns.values())
  }

  /**
   * Get patterns with filter
   */
  getFiltered(filter: PatternFilter): Pattern[] {
    let patterns = this.getAll()

    // Filter by type
    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type]
      patterns = patterns.filter((p) => types.includes(p.type))
    }

    // Filter by scope
    if (filter.scope) {
      patterns = patterns.filter(
        (p) =>
          p.scope.type === filter.scope!.type &&
          p.scope.id === filter.scope!.id
      )
    }

    // Filter by name (partial match)
    if (filter.name) {
      const searchLower = filter.name.toLowerCase()
      patterns = patterns.filter((p) => p.name.toLowerCase().includes(searchLower))
    }

    // Filter by token usage
    if (filter.usesToken) {
      patterns = patterns.filter((p) => p.tokens.includes(filter.usesToken!))
    }

    return patterns
  }

  /**
   * Find pattern by name and scope
   */
  private findByNameAndScope(name: string, scope: any): Pattern | undefined {
    return Array.from(this.patterns.values()).find(
      (p) =>
        p.name === name &&
        p.scope.type === scope.type &&
        p.scope.id === scope.id
    )
  }

  /**
   * Format scope as string
   */
  private formatScope(scope: any): string {
    if (scope.type === 'global') {
      return 'global'
    }
    return `${scope.type}:${scope.id}`
  }

  /**
   * Get pattern count
   */
  count(): number {
    return this.patterns.size
  }

  /**
   * Check if pattern exists
   */
  exists(id: string): boolean {
    return this.patterns.has(id)
  }

  /**
   * Get patterns that use a specific token
   */
  getPatternsUsingToken(tokenId: string): Pattern[] {
    return this.getAll().filter((p) => p.tokens.includes(tokenId))
  }
}