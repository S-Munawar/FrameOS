// src/__tests__/scope.test.ts

import { describe, it, expect } from 'vitest'
import { scopeSchema } from '../scope'
import { ScopeType } from '@frameos/types'

describe('Scope validation', () => {
  it('should validate global scope without ID', () => {
    const scope = { type: ScopeType.GLOBAL }
    const result = scopeSchema.safeParse(scope)
    expect(result.success).toBe(true)
  })

  it('should reject global scope with ID', () => {
    const scope = { type: ScopeType.GLOBAL, id: 'should-not-exist' }
    const result = scopeSchema.safeParse(scope)
    expect(result.success).toBe(false)
  })

  it('should validate page scope with ID', () => {
    const scope = { type: ScopeType.PAGE, id: 'page-123' }
    const result = scopeSchema.safeParse(scope)
    expect(result.success).toBe(true)
  })

  it('should reject page scope without ID', () => {
    const scope = { type: ScopeType.PAGE }
    const result = scopeSchema.safeParse(scope)
    expect(result.success).toBe(false)
  })

  it('should reject page scope with empty ID', () => {
    const scope = { type: ScopeType.PAGE, id: '' }
    const result = scopeSchema.safeParse(scope)
    expect(result.success).toBe(false)
  })
})