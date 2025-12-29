// src/scope.ts

import { ScopeType } from './enums'

export { ScopeType } from './enums'

/**
 * Scope defines the context in which a design decision applies
 * Hierarchy: GLOBAL → PAGE → COMPONENT → ELEMENT
 */
export interface Scope {
  type: ScopeType
  id?: string // Required for non-global scopes (page ID, component ID, element ID)
}

/**
 * Resolution context provides the full hierarchy for scope resolution
 */
export interface ResolutionContext {
  page?: string        // Current page ID
  component?: string   // Current component ID
  element?: string     // Current element ID
}

/**
 * Represents a single level in the scope hierarchy
 */
export interface ScopeLevel {
  type: ScopeType
  id: string | null
}

/**
 * Override chain showing how a token value was resolved
 */
export interface OverrideChain {
  global?: string       // Value at global scope
  page?: string         // Override at page scope
  component?: string    // Override at component scope
  element?: string      // Override at element scope
  final: string         // Final resolved value
  source: string        // Which scope provided the final value (e.g., "page:homepage")
}

/**
 * Type guard: Check if scope is global
 */
export function isGlobalScope(scope: Scope): boolean {
  return scope.type === ScopeType.GLOBAL
}

/**
 * Type guard: Check if scope is page-level
 */
export function isPageScope(scope: Scope): boolean {
  return scope.type === ScopeType.PAGE
}

/**
 * Type guard: Check if scope is component-level
 */
export function isComponentScope(scope: Scope): boolean {
  return scope.type === ScopeType.COMPONENT
}

/**
 * Type guard: Check if scope is element-level
 */
export function isElementScope(scope: Scope): boolean {
  return scope.type === ScopeType.ELEMENT
}

/**
 * Helper: Create a global scope
 */
export function createGlobalScope(): Scope {
  return { type: ScopeType.GLOBAL }
}

/**
 * Helper: Create a page scope
 */
export function createPageScope(pageId: string): Scope {
  return { type: ScopeType.PAGE, id: pageId }
}

/**
 * Helper: Create a component scope
 */
export function createComponentScope(componentId: string): Scope {
  return { type: ScopeType.COMPONENT, id: componentId }
}

/**
 * Helper: Create an element scope
 */
export function createElementScope(elementId: string): Scope {
  return { type: ScopeType.ELEMENT, id: elementId }
}

/**
 * Helper: Format scope as string for display
 */
export function formatScope(scope: Scope): string {
  if (scope.type === ScopeType.GLOBAL) {
    return 'global'
  }
  return `${scope.type}:${scope.id}`
}

/**
 * Helper: Compare two scopes for equality
 */
export function scopesEqual(a: Scope, b: Scope): boolean {
  return a.type === b.type && a.id === b.id
}