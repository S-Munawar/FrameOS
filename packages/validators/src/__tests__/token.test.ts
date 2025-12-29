// src/__tests__/token.test.ts

import { describe, it, expect } from 'vitest'
import { tokenSchema, createTokenInputSchema } from '../token'
import { TokenType, TokenSource, ScopeType } from '@frameos/types'

describe('Token validation', () => {
  it('should validate correct token', () => {
    const token = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: { type: ScopeType.GLOBAL },
      source: TokenSource.USER_DEFINED,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    const result = tokenSchema.safeParse(token)
    expect(result.success).toBe(true)
  })

  it('should reject token with invalid UUID', () => {
    const token = {
      id: 'invalid-uuid',
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: { type: ScopeType.GLOBAL },
      source: TokenSource.USER_DEFINED,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    const result = tokenSchema.safeParse(token)
    expect(result.success).toBe(false)
  })

  it('should reject token with empty name', () => {
    const token = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: '',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: { type: ScopeType.GLOBAL },
      source: TokenSource.USER_DEFINED,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    const result = tokenSchema.safeParse(token)
    expect(result.success).toBe(false)
  })

  it('should validate create token input', () => {
    const input = {
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: { type: ScopeType.GLOBAL },
      source: TokenSource.USER_DEFINED,
    }

    const result = createTokenInputSchema.safeParse(input)
    expect(result.success).toBe(true)
  })
})