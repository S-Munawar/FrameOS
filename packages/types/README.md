# @frameos/types

TypeScript type definitions for frameos domain model.

## Installation
```bash
pnpm add @frameos/types
```

## Usage
```typescript
import { Token, TokenType, createGlobalScope } from '@frameos/types'

const token: Token = {
  id: 'some-uuid',
  name: 'primary-color',
  type: TokenType.COLOR,
  value: '#3B82F6',
  scope: createGlobalScope(),
  // ...
}
```

## Exports

- All domain types (Token, Pattern, Rule, Component, Page, etc.)
- All enums (TokenType, ScopeType, etc.)
- Scope utilities (createGlobalScope, formatScope, etc.)
- Type guards (isColorToken, isGlobalScope, etc.)

See full documentation in `/docs/domain-model.md`