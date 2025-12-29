// src/drift.ts

import { DriftSeverity } from './enums'
import { RuleViolation } from './rule'

/**
 * Drift report analyzes the impact of a proposed change
 */
export interface DriftReport {
  severity: DriftSeverity
  affected: AffectedEntity[]    // Entities that will change
  unaffected: AffectedEntity[]  // Entities with overrides (won't change)
  conflicts: RuleViolation[]    // Rule violations
  recommendations: string[]     // Suggestions for safer changes
  preview?: string              // Preview of change (optional)
}

/**
 * Entity affected by a change
 */
export interface AffectedEntity {
  id: string
  type: 'component' | 'page' | 'pattern'
  name: string
  changeDescription: string     // What will change
  before?: string               // Current state
  after?: string                // New state
}

/**
 * Drift analysis context
 */
export interface DriftContext {
  changeType: 'create' | 'update' | 'delete'
  entityType: string
  entityId?: string
  proposedChanges: Record<string, unknown>
}

/**
 * Drift detector configuration
 */
export interface DriftDetectorConfig {
  includePreviews: boolean      // Include before/after previews
  maxAffectedEntities: number   // Limit results
  includeRecommendations: boolean
}