import { describe, it, expect, beforeEach } from 'vitest'
import { TokenManager } from '../state/TokenManager'
import { VersionTracker } from '../state/VersionTracker'
import { TokenType, TokenSource } from '@frameos/types'
import { createGlobalScope, createPageScope } from '@frameos/types'

describe('TokenManager', () => {
  let tokenManager: TokenManager
  let versionTracker: VersionTracker
  let tokens: Map<string, any>

  beforeEach(() => {
    tokens = new Map()
    versionTracker = new VersionTracker()
    tokenManager = new TokenManager(tokens, versionTracker)
  })

  it('should create token', () => {
    const version = tokenManager.create({
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    expect(version).toBeDefined()
    expect(tokenManager.count()).toBe(1)

    const token = tokenManager.getAll()[0]
    expect(token.name).toBe('primary-color')
    expect(token.version).toBe(1)
  })

  it('should prevent duplicate names at same scope', () => {
    tokenManager.create({
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    expect(() => {
      tokenManager.create({
        name: 'primary-color',
        type: TokenType.COLOR,
        value: '#10B981',
        scope: createGlobalScope(),
        source: TokenSource.USER_DEFINED,
      })
    }).toThrow('already exists')
  })

  it('should update token', () => {
    tokenManager.create({
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    const token = tokenManager.getAll()[0]
    
    tokenManager.update(token.id, { value: '#10B981' })

    const updated = tokenManager.getById(token.id)
    expect(updated?.value).toBe('#10B981')
    expect(updated?.version).toBe(2)
  })

  it('should delete token', () => {
    tokenManager.create({
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#3B82F6',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    const token = tokenManager.getAll()[0]
    tokenManager.delete(token.id)

    expect(tokenManager.count()).toBe(0)
    expect(tokenManager.exists(token.id)).toBe(false)
  })

  it('should filter tokens by type', () => {
    tokenManager.create({
      name: 'color',
      type: TokenType.COLOR,
      value: '#000',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    tokenManager.create({
      name: 'spacing',
      type: TokenType.SPACING,
      value: '16px',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    const colors = tokenManager.getFiltered({ type: TokenType.COLOR })
    expect(colors).toHaveLength(1)
    expect(colors[0].type).toBe(TokenType.COLOR)
  })

  it('should filter tokens by scope', () => {
    tokenManager.create({
      name: 'global-color',
      type: TokenType.COLOR,
      value: '#000',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    tokenManager.create({
      name: 'page-color',
      type: TokenType.COLOR,
      value: '#111',
      scope: createPageScope('homepage'),
      source: TokenSource.USER_DEFINED,
    })

    const globalTokens = tokenManager.getFiltered({ scope: createGlobalScope() })
    expect(globalTokens).toHaveLength(1)
    expect(globalTokens[0].name).toBe('global-color')
  })

  it('should filter tokens by name', () => {
    tokenManager.create({
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#000',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    tokenManager.create({
      name: 'secondary-color',
      type: TokenType.COLOR,
      value: '#111',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })

    const filtered = tokenManager.getFiltered({ name: 'primary' })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('primary-color')
  })
})