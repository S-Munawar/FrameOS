// src/rule.ts

import { RuleType, EnforcementLevel } from './enums'
import { Scope } from './scope'

/**
 * Rule enforces consistency or automation
 */
export interface Rule {
  id: string
  name: string
  type: RuleType
  description: string           // Human-readable rule description
  condition: RuleCondition      // When this rule applies
  enforcement: EnforcementLevel // How strictly to enforce
  scope: Scope                  // Where this rule applies
  action?: RuleAction           // What to do when rule is triggered
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * Rule condition defines when a rule applies
 */
export interface RuleCondition {
  type: 'always' | 'tokenType' | 'componentType' | 'custom'
  value?: string                // Value for conditional types
  expression?: string           // Custom expression (future)
}

/**
 * Rule action defines what happens when rule is triggered
 */
export interface RuleAction {
  type: 'validate' | 'autoApply' | 'suggest'
  parameters?: Record<string, unknown>
}

/**
 * Validation result from rule checking
 */
export interface ValidationResult {
  valid: boolean
  violations: RuleViolation[]
}

/**
 * Rule violation
 */
export interface RuleViolation {
  ruleId: string
  ruleName: string
  severity: EnforcementLevel
  message: string
  entityId: string              // ID of entity that violated rule
  entityType: string            // Type of entity
  suggestion?: string           // How to fix
}

/**
 * Helper: Create rule input
 */
export type CreateRuleInput = Omit<Rule, 'id' | 'createdAt' | 'updatedAt' | 'version'>

/**
 * Helper: Update rule input
 */
export type UpdateRuleInput = Partial<Omit<Rule, 'id' | 'createdAt' | 'version'>>