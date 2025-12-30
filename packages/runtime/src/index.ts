// src/index.ts

// Export main runtime
export { DesignSystemRuntime } from './core/DesignSystemRuntime'

// Export state types (for advanced usage)
export type { DesignSystemState } from './state/DesignSystemState'
export { createEmptyState } from './state/DesignSystemState'

// Export utilities
export { serializeState, deserializeState, CURRENT_SCHEMA_VERSION } from './utils/serialization'

// Re-export types from @frameos/types for convenience
export type {
  Token,
  Pattern,
  Rule,
  Component,
  Page,
  Version,
  Project,
  DesignSystem,
  SerializedState,
  CreateTokenInput,
  UpdateTokenInput,
  TokenFilter,
  CreatePatternInput,
  UpdatePatternInput,
  PatternFilter,
  CreateRuleInput,
  UpdateRuleInput,
  HistoryFilter,
} from '@frameos/types'