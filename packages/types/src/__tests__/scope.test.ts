// src/__tests__/scope.test.ts

import { describe, it, expect } from 'vitest'
import {
  createGlobalScope,
  createPageScope,
  createComponentScope,
  createElementScope,
  isGlobalScope,
  isPageScope,
  isComponentScope,
  isElementScope,
  formatScope,
  scopesEqual,
  ScopeType,
} from '../scope'

describe('Scope utilities', () => {
  it('should create global scope', () => {
    const scope = createGlobalScope()
    expect(scope.type).toBe(ScopeType.GLOBAL)
    expect(scope.id).toBeUndefined()
  })

  it('should create page scope', () => {
    const scope = createPageScope('page-123')
    expect(scope.type).toBe(ScopeType.PAGE)
    expect(scope.id).toBe('page-123')
  })

  it('should identify global scope', () => {
    const scope = createGlobalScope()
    expect(isGlobalScope(scope)).toBe(true)
    expect(isPageScope(scope)).toBe(false)
  })

  it('should format scope correctly', () => {
    expect(formatScope(createGlobalScope())).toBe('global')
    expect(formatScope(createPageScope('page-123'))).toBe('page:page-123')
  })

  it('should compare scopes', () => {
    const scope1 = createPageScope('page-123')
    const scope2 = createPageScope('page-123')
    const scope3 = createPageScope('page-456')

    expect(scopesEqual(scope1, scope2)).toBe(true)
    expect(scopesEqual(scope1, scope3)).toBe(false)
  })
})