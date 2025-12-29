// src/project.ts

/**
 * Project is the top-level container
 */
export interface Project {
  id: string
  name: string
  description?: string
  designSystemId: string        // Reference to design system
  pages: string[]               // Page IDs
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * Design system contains all design memory
 */
export interface DesignSystem {
  id: string
  projectId: string             // Which project owns this
  tokens: string[]              // All token IDs
  patterns: string[]            // All pattern IDs
  rules: string[]               // All rule IDs
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * Serialized state for export/import
 */
export interface SerializedState {
  version: string               // Schema version
  project: Project
  designSystem: DesignSystem
  tokens: Record<string, unknown>      // Token ID → Token
  patterns: Record<string, unknown>    // Pattern ID → Pattern
  rules: Record<string, unknown>       // Rule ID → Rule
  components: Record<string, unknown>  // Component ID → Component
  pages: Record<string, unknown>       // Page ID → Page
  versions: Version[]           // Version history
  exportedAt: Date
}

/**
 * Helper: Create project input
 */
export type CreateProjectInput = Omit<Project, 'id' | 'designSystemId' | 'createdAt' | 'updatedAt' | 'version'>

/**
 * Helper: Update project input
 */
export type UpdateProjectInput = Partial<Omit<Project, 'id' | 'createdAt' | 'version'>>

// Import Version type
import { Version } from './version'