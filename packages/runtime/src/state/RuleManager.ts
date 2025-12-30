// src/state/RuleManager.ts

import { v4 as uuidv4 } from 'uuid'
import type {
  Rule,
  CreateRuleInput,
  UpdateRuleInput,
  Version,
} from '@frameos/types'
import { EntityType, ChangeType } from '@frameos/types'
import {
  ruleSchema,
  createRuleInputSchema,
  updateRuleInputSchema,
} from '@frameos/validators'
import { VersionTracker } from './VersionTracker'

/**
 * RuleManager handles all rule operations
 */
export class RuleManager {
  private rules: Map<string, Rule>
  private versionTracker: VersionTracker

  constructor(rules: Map<string, Rule>, versionTracker: VersionTracker) {
    this.rules = rules
    this.versionTracker = versionTracker
  }

  /**
   * Create a new rule
   */
  create(input: CreateRuleInput, reason?: string): Version {
    // Validate input
    const validationResult = createRuleInputSchema.safeParse(input)
    if (!validationResult.success) {
      throw new Error(`Invalid rule input: ${validationResult.error.message}`)
    }

    // Create rule
    const rule: Rule = {
      ...input,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    // Validate complete rule
    const ruleValidation = ruleSchema.safeParse(rule)
    if (!ruleValidation.success) {
      throw new Error(`Invalid rule: ${ruleValidation.error.message}`)
    }

    // Store rule
    this.rules.set(rule.id, rule)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.RULE,
      entityId: rule.id,
      changeType: ChangeType.CREATE,
      before: null,
      after: rule,
      scope: this.formatScope(rule.scope),
      reason,
    })
  }

  /**
   * Update an existing rule
   */
  update(id: string, updates: UpdateRuleInput, reason?: string): Version {
    // Get existing rule
    const existing = this.rules.get(id)
    if (!existing) {
      throw new Error(`Rule with ID ${id} not found`)
    }

    // Validate updates
    const validationResult = updateRuleInputSchema.safeParse(updates)
    if (!validationResult.success) {
      throw new Error(`Invalid rule updates: ${validationResult.error.message}`)
    }

    // Create updated rule
    const updated: Rule = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      version: existing.version + 1,
    }

    // Validate complete rule
    const ruleValidation = ruleSchema.safeParse(updated)
    if (!ruleValidation.success) {
      throw new Error(`Invalid updated rule: ${ruleValidation.error.message}`)
    }

    // Store updated rule
    this.rules.set(id, updated)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.RULE,
      entityId: id,
      changeType: ChangeType.UPDATE,
      before: existing,
      after: updated,
      scope: this.formatScope(updated.scope),
      reason,
    })
  }

  /**
   * Delete a rule
   */
  delete(id: string, reason?: string): Version {
    // Get existing rule
    const existing = this.rules.get(id)
    if (!existing) {
      throw new Error(`Rule with ID ${id} not found`)
    }

    // Remove rule
    this.rules.delete(id)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.RULE,
      entityId: id,
      changeType: ChangeType.DELETE,
      before: existing,
      after: null,
      scope: this.formatScope(existing.scope),
      reason,
    })
  }

  /**
   * Get rule by ID
   */
  getById(id: string): Rule | null {
    return this.rules.get(id) || null
  }

  /**
   * Get all rules
   */
  getAll(): Rule[] {
    return Array.from(this.rules.values())
  }

  /**
   * Get rules by scope
   */
  getByScope(scope: any): Rule[] {
    return this.getAll().filter(
      (r) => r.scope.type === scope.type && r.scope.id === scope.id
    )
  }

  /**
   * Get rules by enforcement level
   */
  getByEnforcement(enforcement: string): Rule[] {
    return this.getAll().filter((r) => r.enforcement === enforcement)
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
   * Get rule count
   */
  count(): number {
    return this.rules.size
  }

  /**
   * Check if rule exists
   */
  exists(id: string): boolean {
    return this.rules.has(id)
  }
}