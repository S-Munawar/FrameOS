// src/pattern.ts

import { PatternType } from './enums'
import { Scope } from './scope'

/**
 * Pattern represents a composition of tokens and structural rules
 * Examples: primary-button, hero-section, card-layout
 */
export interface Pattern {
  id: string                    // Unique identifier
  name: string                  // Pattern name
  type: PatternType             // Category
  description?: string          // Human-readable description
  tokens: string[]              // Token IDs used in this pattern
  rules: PatternRule[]          // Structural rules
  structure?: Record<string, unknown>  // Optional structure definition
  scope: Scope                  // Where this pattern applies
  examples?: string[]           // Component IDs that use this pattern
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * Pattern rule defines structural constraints
 */
export interface PatternRule {
  property: string              // CSS property or structural property
  value: string                 // Value or token reference
  condition?: string            // When this rule applies
}

/**
 * Pattern filter for querying
 */
export interface PatternFilter {
  type?: PatternType | PatternType[]
  scope?: Scope
  name?: string
  usesToken?: string            // Filter by token ID
}

/**
 * Helper: Create pattern input
 */
export type CreatePatternInput = Omit<Pattern, 'id' | 'createdAt' | 'updatedAt' | 'version'>

/**
 * Helper: Update pattern input
 */
export type UpdatePatternInput = Partial<Omit<Pattern, 'id' | 'createdAt' | 'version'>>