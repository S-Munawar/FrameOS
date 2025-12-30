# @frameos/runtime

Core runtime library for FrameOS. A pure, framework-agnostic TypeScript state machine for managing design system decisions.

## Installation
```bash
pnpm add @frameos/runtime
```

## Quick Start
```typescript
import { DesignSystemRuntime } from '@frameos/runtime'
import { TokenType, TokenSource, createGlobalScope } from '@frameos/types'

// Create runtime instance
const runtime = new DesignSystemRuntime()

// Initialize project
runtime.initializeProject('My SaaS App')

// Create token
runtime.createToken({
  name: 'primary-color',
  type: TokenType.COLOR,
  value: '#3B82F6',
  scope: createGlobalScope(),
  source: TokenSource.USER_DEFINED,
}, 'Initial brand color')

// Get all tokens
const tokens = runtime.getTokens()

// Update token
const token = tokens[0]
runtime.updateToken(token.id, {
  value: '#10B981'
}, 'Changed to green')

// Get version history
const history = runtime.getHistory()

// Export state
const exported = runtime.exportState()

// Import state (in new instance)
const runtime2 = new DesignSystemRuntime()
runtime2.importState(exported)
```

## Features

- **Immutable state**: Every change creates a new version
- **Version tracking**: Full audit trail of all changes
- **Type-safe**: Complete TypeScript support
- **Framework-agnostic**: Works in browser, Node.js, or any JS environment
- **Serializable**: Export/import state as JSON
- **Zero dependencies**: Pure TypeScript with minimal external deps

## API Reference

### Token Operations

- `createToken(input, reason?)`: Create new token
- `updateToken(id, updates, reason?)`: Update existing token
- `deleteToken(id, reason?)`: Delete token
- `getToken(id)`: Get token by ID
- `getTokens(filter?)`: Get all tokens (optionally filtered)

### Pattern Operations

- `createPattern(input, reason?)`: Create new pattern
- `updatePattern(id, updates, reason?)`: Update pattern
- `deletePattern(id, reason?)`: Delete pattern
- `getPattern(id)`: Get pattern by ID
- `getPatterns(filter?)`: Get all patterns

### Rule Operations

- `createRule(input, reason?)`: Create new rule
- `updateRule(id, updates, reason?)`: Update rule
- `deleteRule(id, reason?)`: Delete rule
- `getRule(id)`: Get rule by ID
- `getRules()`: Get all rules

### Version History

- `getHistory(filter?)`: Get version history
- `getVersion(id)`: Get specific version

### Project Management

- `initializeProject(name, description?)`: Initialize new project
- `getProject()`: Get current project
- `getDesignSystem()`: Get design system

### State Management

- `exportState()`: Export as SerializedState
- `importState(state)`: Import from SerializedState
- `getState()`: Get read-only copy of state
- `clear()`: Clear all state

## Architecture

The runtime uses a manager pattern:

- **DesignSystemRuntime**: Main API coordinator
- **TokenManager**: Handles token CRUD
- **PatternManager**: Handles pattern CRUD
- **RuleManager**: Handles rule CRUD
- **VersionTracker**: Tracks all changes

State is stored in-memory using Maps for fast lookups.