// src/state/DesignSystemState.ts

import type {
  Token,
  Pattern,
  Rule,
  Component,
  Page,
  Project,
  DesignSystem,
  Version,
} from '@frameos/types'

/**
 * Internal state structure for the design system runtime
 * All state is stored in-memory as Maps for fast lookups
 */
export interface DesignSystemState {
  // Core entities stored as Maps (ID -> Entity)
  tokens: Map<string, Token>
  patterns: Map<string, Pattern>
  rules: Map<string, Rule>
  components: Map<string, Component>
  pages: Map<string, Page>
  
  // Project and design system (single instances)
  project: Project | null
  designSystem: DesignSystem | null
  
  // Version history (ordered by timestamp)
  versions: Version[]
  
  // Metadata
  lastModified: Date
}

/**
 * Create an empty design system state
 */
export function createEmptyState(): DesignSystemState {
  return {
    tokens: new Map(),
    patterns: new Map(),
    rules: new Map(),
    components: new Map(),
    pages: new Map(),
    project: null,
    designSystem: null,
    versions: [],
    lastModified: new Date(),
  }
}

/**
 * Clone state immutably
 */
export function cloneState(state: DesignSystemState): DesignSystemState {
  return {
    tokens: new Map(state.tokens),
    patterns: new Map(state.patterns),
    rules: new Map(state.rules),
    components: new Map(state.components),
    pages: new Map(state.pages),
    project: state.project ? { ...state.project } : null,
    designSystem: state.designSystem ? { ...state.designSystem } : null,
    versions: [...state.versions],
    lastModified: new Date(),
  }
}