// src/__tests__/token.test.ts

import { describe, it, expect } from 'vitest'
import { TokenType } from '../enums'
import { isColorToken, isTypographyToken, isSpacingToken } from '../token'
import { createGlobalScope } from '../scope'
import type { Token, TokenSource } from '../token'

describe('Token utilities', () => {
  const createMockToken = (type: TokenType): Token => ({
    id: 'test-id',
    name: 'test-token',
    type,
    value: 'test-value',
    scope: createGlobalScope(),
    source: 'user-defined' as TokenSource,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  })

  it('should identify color token', () => {
    const token = createMockToken(TokenType.COLOR)
    expect(isColorToken(token)).toBe(true)
    expect(isTypographyToken(token)).toBe(false)
  })

  it('should identify typography token', () => {
    const token = createMockToken(TokenType.TYPOGRAPHY)
    expect(isTypographyToken(token)).toBe(true)
    expect(isColorToken(token)).toBe(false)
  })

  it('should identify spacing token', () => {
    const token = createMockToken(TokenType.SPACING)
    expect(isSpacingToken(token)).toBe(true)
    expect(isColorToken(token)).toBe(false)
  })
})