// src/utils/serialization.ts

import type { SerializedState } from '@frameos/types'

/**
 * Current schema version for serialized state
 * Increment when making breaking changes to state structure
 */
export const CURRENT_SCHEMA_VERSION = '1.0.0'

/**
 * Serialize state to JSON string
 */
export function serializeState(state: SerializedState): string {
  return JSON.stringify(state, null, 2)
}

/**
 * Deserialize state from JSON string
 */
export function deserializeState(json: string): SerializedState {
  const state = JSON.parse(json)
  
  // Validate schema version
  if (!state.version) {
    throw new Error('Invalid serialized state: missing version')
  }
  
  if (state.version !== CURRENT_SCHEMA_VERSION) {
    throw new Error(
      `Schema version mismatch: expected ${CURRENT_SCHEMA_VERSION}, got ${state.version}`
    )
  }
  
  // Convert date strings back to Date objects
  state.exportedAt = new Date(state.exportedAt)
  
  if (state.project) {
    state.project.createdAt = new Date(state.project.createdAt)
    state.project.updatedAt = new Date(state.project.updatedAt)
  }
  
  if (state.designSystem) {
    state.designSystem.createdAt = new Date(state.designSystem.createdAt)
    state.designSystem.updatedAt = new Date(state.designSystem.updatedAt)
  }
  
  // Convert tokens
  for (const id in state.tokens) {
    const token = state.tokens[id] as any
    token.createdAt = new Date(token.createdAt)
    token.updatedAt = new Date(token.updatedAt)
  }
  
  // Convert patterns
  for (const id in state.patterns) {
    const pattern = state.patterns[id] as any
    pattern.createdAt = new Date(pattern.createdAt)
    pattern.updatedAt = new Date(pattern.updatedAt)
  }
  
  // Convert rules
  for (const id in state.rules) {
    const rule = state.rules[id] as any
    rule.createdAt = new Date(rule.createdAt)
    rule.updatedAt = new Date(rule.updatedAt)
  }
  
  // Convert components
  for (const id in state.components) {
    const component = state.components[id] as any
    component.createdAt = new Date(component.createdAt)
    component.updatedAt = new Date(component.updatedAt)
  }
  
  // Convert pages
  for (const id in state.pages) {
    const page = state.pages[id] as any
    page.createdAt = new Date(page.createdAt)
    page.updatedAt = new Date(page.updatedAt)
  }
  
  // Convert versions
  if (state.versions) {
    state.versions = state.versions.map((v: any) => ({
      ...v,
      timestamp: new Date(v.timestamp),
    }))
  }
  
  return state
}

/**
 * Validate serialized state structure
 */
export function validateSerializedState(state: unknown): state is SerializedState {
  if (!state || typeof state !== 'object') {
    return false
  }
  
  const s = state as any
  
  return (
    typeof s.version === 'string' &&
    s.project &&
    s.designSystem &&
    typeof s.tokens === 'object' &&
    typeof s.patterns === 'object' &&
    typeof s.rules === 'object' &&
    typeof s.components === 'object' &&
    typeof s.pages === 'object' &&
    Array.isArray(s.versions) &&
    s.exportedAt instanceof Date
  )
}