// src/__tests__/DesignSystemRuntime.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { DesignSystemRuntime } from '../core/DesignSystemRuntime'
import { TokenType, TokenSource, ScopeType, PatternType, RuleType, EnforcementLevel, EntityType, ChangeType } from '@frameos/types'
import { createGlobalScope, createPageScope } from '@frameos/types'

describe('DesignSystemRuntime', () => {
  let runtime: DesignSystemRuntime

  beforeEach(() => {
    runtime = new DesignSystemRuntime()
  })

  describe('Initialization', () => {
    it('should create empty runtime', () => {
      expect(runtime).toBeDefined()
      expect(runtime.getTokens()).toEqual([])
      expect(runtime.getPatterns()).toEqual([])
      expect(runtime.getRules()).toEqual([])
    })

    it('should initialize project', () => {
      runtime.initializeProject('Test Project', 'A test project')
      
      const project = runtime.getProject()
      expect(project).toBeDefined()
      expect(project?.name).toBe('Test Project')
      expect(project?.description).toBe('A test project')
      
      const designSystem = runtime.getDesignSystem()
expect(designSystem).toBeDefined()
expect(designSystem?.projectId).toBe(project?.id)
})
})
describe('Token Operations', () => {
beforeEach(() => {
runtime.initializeProject('Test')
})
it('should create a token', () => {
  const version = runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  expect(version).toBeDefined()
  expect(version.changeType).toBe('create')

  const tokens = runtime.getTokens()
  expect(tokens).toHaveLength(1)
  expect(tokens[0].name).toBe('primary-color')
  expect(tokens[0].value).toBe('#3B82F6')
})

it('should prevent duplicate token names at same scope', () => {
  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  expect(() => {
    runtime.createToken({
      name: 'primary-color',
      type: TokenType.COLOR,
      value: '#10B981',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })
  }).toThrow('already exists')
})

it('should allow same name at different scopes', () => {
  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#10B981',
    scope: createPageScope('homepage'),
    source: TokenSource.USER_DEFINED,
  })

  const tokens = runtime.getTokens()
  expect(tokens).toHaveLength(2)
})

it('should update a token', () => {
  const version1 = runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  const token = runtime.getTokens()[0]
  
  const version2 = runtime.updateToken(token.id, {
    value: '#10B981',
  }, 'Changed to green')

  expect(version2.changeType).toBe('update')
  expect(version2.reason).toBe('Changed to green')

  const updated = runtime.getToken(token.id)
  expect(updated?.value).toBe('#10B981')
  expect(updated?.version).toBe(2)
})

it('should delete a token', () => {
  const version1 = runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  const token = runtime.getTokens()[0]
  
  const version2 = runtime.deleteToken(token.id, 'No longer needed')

  expect(version2.changeType).toBe('delete')
  expect(runtime.getTokens()).toHaveLength(0)
})

it('should filter tokens by type', () => {
  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  runtime.createToken({
    name: 'heading-font',
    type: TokenType.TYPOGRAPHY,
    value: 'Inter',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  const colorTokens = runtime.getTokens({ type: TokenType.COLOR })
  expect(colorTokens).toHaveLength(1)
  expect(colorTokens[0].name).toBe('primary-color')
})
})
describe('Pattern Operations', () => {
beforeEach(() => {
runtime.initializeProject('Test')
})
it('should create a pattern', () => {
  const version = runtime.createPattern({
    name: 'primary-button',
    type: PatternType.COMPONENT,
    description: 'Primary button pattern',
    tokens: [],
    rules: [
      { property: 'padding', value: '12px 24px' },
    ],
    scope: createGlobalScope(),
  })

  expect(version).toBeDefined()
  const patterns = runtime.getPatterns()
  expect(patterns).toHaveLength(1)
  expect(patterns[0].name).toBe('primary-button')
})

it('should update a pattern', () => {
  runtime.createPattern({
    name: 'primary-button',
    type: PatternType.COMPONENT,
    tokens: [],
    rules: [],
    scope: createGlobalScope(),
  })

  const pattern = runtime.getPatterns()[0]
  
  runtime.updatePattern(pattern.id, {
    description: 'Updated description',
  })

  const updated = runtime.getPattern(pattern.id)
  expect(updated?.description).toBe('Updated description')
  expect(updated?.version).toBe(2)
})

it('should delete a pattern', () => {
  runtime.createPattern({
    name: 'primary-button',
    type: PatternType.COMPONENT,
    tokens: [],
    rules: [],
    scope: createGlobalScope(),
  })

  const pattern = runtime.getPatterns()[0]
  runtime.deletePattern(pattern.id)

  expect(runtime.getPatterns()).toHaveLength(0)
})
})
describe('Rule Operations', () => {
beforeEach(() => {
runtime.initializeProject('Test')
})
it('should create a rule', () => {
  const version = runtime.createRule({
    name: 'Button padding rule',
    type: RuleType.CONSTRAINT,
    description: 'All buttons must have minimum 8px padding',
    condition: { type: 'always' },
    enforcement: EnforcementLevel.ERROR,
    scope: createGlobalScope(),
  })

  expect(version).toBeDefined()
  const rules = runtime.getRules()
  expect(rules).toHaveLength(1)
  expect(rules[0].name).toBe('Button padding rule')
})

it('should update a rule', () => {
  runtime.createRule({
    name: 'Padding rule',
    type: RuleType.CONSTRAINT,
    description: 'Min padding',
    condition: { type: 'always' },
    enforcement: EnforcementLevel.ERROR,
    scope: createGlobalScope(),
  })

  const rule = runtime.getRules()[0]
  
  runtime.updateRule(rule.id, {
    enforcement: EnforcementLevel.WARNING,
  })

  const updated = runtime.getRule(rule.id)
  expect(updated?.enforcement).toBe('warning')
})

it('should delete a rule', () => {
  runtime.createRule({
    name: 'Test rule',
    type: RuleType.CONSTRAINT,
    description: 'Test',
    condition: { type: 'always' },
    enforcement: EnforcementLevel.ERROR,
    scope: createGlobalScope(),
  })

  const rule = runtime.getRules()[0]
  runtime.deleteRule(rule.id)

  expect(runtime.getRules()).toHaveLength(0)
})
})
describe('Version History', () => {
beforeEach(() => {
runtime.initializeProject('Test')
})
it('should track all changes', () => {
  // Create token
  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  // Update token
  const token = runtime.getTokens()[0]
  runtime.updateToken(token.id, { value: '#10B981' })

  // Delete token
  runtime.deleteToken(token.id)

  const history = runtime.getHistory()
  // 1 project create + 1 token create + 1 update + 1 delete = 4
  expect(history.length).toBeGreaterThanOrEqual(3)
})

it('should filter history by entity type', () => {
  runtime.createToken({
    name: 'color',
    type: TokenType.COLOR,
    value: '#000',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  runtime.createPattern({
    name: 'pattern',
    type: PatternType.COMPONENT,
    tokens: [],
    rules: [],
    scope: createGlobalScope(),
  })

  const tokenHistory = runtime.getHistory({ entityType: EntityType.TOKEN })
  expect(tokenHistory.every(v => v.entityType === 'token')).toBe(true)
})

it('should filter history by change type', () => {
  runtime.createToken({
    name: 'color',
    type: TokenType.COLOR,
    value: '#000',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  const token = runtime.getTokens()[0]
  runtime.updateToken(token.id, { value: '#111' })
  runtime.deleteToken(token.id)

  const creates = runtime.getHistory({ changeType: ChangeType.CREATE })
  expect(creates.every(v => v.changeType === 'create')).toBe(true)

  const updates = runtime.getHistory({ changeType: ChangeType.UPDATE })
  expect(updates.length).toBeGreaterThanOrEqual(1)
})
})
describe('State Export/Import', () => {
beforeEach(() => {
runtime.initializeProject('Test Project')
})
it('should export state', () => {
  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  const exported = runtime.exportState()

  expect(exported.version).toBeDefined()
  expect(exported.project).toBeDefined()
  expect(exported.designSystem).toBeDefined()
  expect(Object.keys(exported.tokens)).toHaveLength(1)
  expect(exported.versions.length).toBeGreaterThanOrEqual(1)
})

it('should import state', () => {
  runtime.createToken({
    name: 'primary-color',
    type: TokenType.COLOR,
    value: '#3B82F6',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  const exported = runtime.exportState()

  // Create new runtime and import
  const runtime2 = new DesignSystemRuntime()
  runtime2.importState(exported)

  const tokens = runtime2.getTokens()
  expect(tokens).toHaveLength(1)
  expect(tokens[0].name).toBe('primary-color')

  const project = runtime2.getProject()
  expect(project?.name).toBe('Test Project')
})

it('should preserve all data through export/import', () => {
  // Create complex state
  runtime.createToken({
    name: 'color1',
    type: TokenType.COLOR,
    value: '#000',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  runtime.createPattern({
    name: 'pattern1',
    type: PatternType.COMPONENT,
    tokens: [],
    rules: [],
    scope: createGlobalScope(),
  })

  runtime.createRule({
    name: 'rule1',
    type: RuleType.CONSTRAINT,
    description: 'Test rule',
    condition: { type: 'always' },
    enforcement: EnforcementLevel.ERROR,
    scope: createGlobalScope(),
  })

  const exported = runtime.exportState()
  
  const runtime2 = new DesignSystemRuntime()
  runtime2.importState(exported)

  expect(runtime2.getTokens()).toHaveLength(1)
  expect(runtime2.getPatterns()).toHaveLength(1)
  expect(runtime2.getRules()).toHaveLength(1)
  expect(runtime2.getHistory().length).toBe(runtime.getHistory().length)
})
})
describe('Statistics', () => {
beforeEach(() => {
runtime.initializeProject('Test')
})
it('should return correct statistics', () => {
  runtime.createToken({
    name: 'token1',
    type: TokenType.COLOR,
    value: '#000',
    scope: createGlobalScope(),
    source: TokenSource.USER_DEFINED,
  })

  runtime.createPattern({
    name: 'pattern1',
    type: PatternType.COMPONENT,
    tokens: [],
    rules: [],
    scope: createGlobalScope(),
  })

  const stats = runtime.getStatistics()

  expect(stats.tokens).toBe(1)
  expect(stats.patterns).toBe(1)
  expect(stats.rules).toBe(0)
  expect(stats.lastModified).toBeInstanceOf(Date)
})
})
describe('Error Handling', () => {
beforeEach(() => {
runtime.initializeProject('Test')
})
it('should throw error for invalid token input', () => {
  expect(() => {
    runtime.createToken({
      name: '', // Invalid: empty name
      type: TokenType.COLOR,
      value: '#000',
      scope: createGlobalScope(),
      source: TokenSource.USER_DEFINED,
    })
  }).toThrow()
})

it('should throw error when updating non-existent token', () => {
  expect(() => {
    runtime.updateToken('non-existent-id', { value: '#000' })
  }).toThrow('not found')
})

it('should throw error when deleting non-existent token', () => {
  expect(() => {
    runtime.deleteToken('non-existent-id')
  }).toThrow('not found')
})

it('should throw error when exporting without project', () => {
  const emptyRuntime = new DesignSystemRuntime()
  expect(() => {
    emptyRuntime.exportState()
  }).toThrow('no project initialized')
})
})
})