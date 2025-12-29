// src/version.ts

import { ChangeType, EntityType } from './enums'

/**
 * Version represents an immutable change record
 */
export interface Version {
  id: string                    // Unique version ID
  timestamp: Date               // When change occurred
  entityType: EntityType        // What type of entity changed
  entityId: string              // Which entity changed
  changeType: ChangeType        // What kind of change
  before: unknown               // State before change (null for create)
  after: unknown                // State after change (null for delete)
  scope?: string                // Scope of change (formatted)
  reason?: string               // Why this change was made
  actor: VersionActor           // Who/what made the change
  metadata?: Record<string, unknown>
}

/**
 * Actor who made the change
 */
export enum VersionActor {
  USER = 'user',                // User action
  SYSTEM = 'system',            // System automation
  AI_PROPOSAL = 'ai-proposal',  // AI suggestion
  IMPORT = 'import',            // Imported from external source
}

/**
 * History filter
 */
export interface HistoryFilter {
  entityType?: EntityType | EntityType[]
  entityId?: string
  changeType?: ChangeType | ChangeType[]
  actor?: VersionActor
  from?: Date                   // Filter by date range
  to?: Date
  limit?: number                // Limit results
}

/**
 * Version with additional context
 */
export interface VersionWithContext extends Version {
  entityName?: string           // Name of the entity that changed
  summary: string               // Human-readable summary
}

/**
 * Helper: Create version input
 */
export type CreateVersionInput = Omit<Version, 'id' | 'timestamp'>