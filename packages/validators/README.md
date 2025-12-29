# @frameos/validators

Zod validation schemas for frameos domain model.

## Installation
```bash
pnpm add @frameos/validators
```

## Usage
```typescript
import { tokenSchema } from '@frameos/validators'

const result = tokenSchema.safeParse(someData)

if (result.success) {
  // Data is valid
  const token = result.data
} else {
  // Validation failed
  console.error(result.error)
}
```

## Exports

All Zod schemas matching the TypeScript types from `@frameos/types`:

- `tokenSchema`, `createTokenInputSchema`, `updateTokenInputSchema`
- `patternSchema`, `createPatternInputSchema`, `updatePatternInputSchema`
- `ruleSchema`, `createRuleInputSchema`, `updateRuleInputSchema`
- And more...

## Validation Pattern
```typescript
import { createTokenInputSchema } from '@frameos/validators'

// Validate user input before creating token
const result = createTokenInputSchema.safeParse(userInput)

if (!result.success) {
  // Return validation errors to user
  return { errors: result.error.format() }
}

// Safe to use validated data
const validatedInput = result.data
```