# Domain Model

## Overview

This document describes the complete domain model for frameos. All entities, their relationships, and the scope hierarchy.

## Entity Hierarchy
```
Project
  └── DesignSystem
        ├── Tokens (global, page, component, element)
        ├── Patterns
        └── Rules
  └── Pages
        └── Components
              └── Components (nested)
```

## Scope Hierarchy

GLOBAL
↓
PAGE
↓
COMPONENT
↓
ELEMENT

Lower scopes override higher scopes explicitly.

## Core Entities

### Token
Atomic design decision (color, typography, spacing, etc.)

**Fields:**
- `id`: UUID
- `name`: Semantic name (e.g., "button-primary-bg")
- `type`: TokenType enum
- `value`: Actual value
- `scope`: Scope (type + optional ID)
- `source`: How it was created
- `version`: Version number

**Relationships:**
- Used by: Components, Patterns
- Scoped to: Project, Page, Component, Element

### Pattern
Composition of tokens and structural rules

**Fields:**
- `id`: UUID
- `name`: Pattern name
- `type`: PatternType enum
- `tokens`: Array of token IDs
- `rules`: Array of PatternRule objects
- `scope`: Scope

**Relationships:**
- References: Tokens
- Applied to: Components

### Rule
Constraint or automation rule

**Fields:**
- `id`: UUID
- `name`: Rule name
- `type`: RuleType enum
- `enforcement`: EnforcementLevel enum
- `condition`: When rule applies
- `scope`: Scope

**Relationships:**
- Validates: Tokens, Patterns, Components

### Component
UI structure

**Fields:**
- `id`: UUID
- `name`: Component name
- `type`: ComponentType enum
- `tokens`: Token IDs used
- `patterns`: Pattern IDs applied
- `children`: Child component IDs
- `scope`: Scope for overrides

**Relationships:**
- Uses: Tokens, Patterns
- Belongs to: Page
- Contains: Components (nested)

### Page
Complete page with components

**Fields:**
- `id`: UUID
- `name`: Page name
- `route`: URL path
- `components`: Component IDs (ordered)
- `overrides`: Page-scoped token overrides

**Relationships:**
- Contains: Components
- Belongs to: Project
- Overrides: Tokens at page scope

### Version
Immutable change record

**Fields:**
- `id`: UUID
- `timestamp`: When change occurred
- `entityType`: What changed
- `entityId`: Which entity
- `changeType`: Create/Update/Delete/Override
- `before`: Previous state
- `after`: New state
- `actor`: Who made change

**Relationships:**
- Tracks changes to: All entities

## Scope Resolution Algorithm

## Type Guards

The types package provides type guards for runtime type checking:

- `isGlobalScope(scope)`: Check if scope is global
- `isPageScope(scope)`: Check if scope is page-level
- `isComponentScope(scope)`: Check if scope is component-level
- `isElementScope(scope)`: Check if scope is element-level
- `isColorToken(token)`: Check if token is a color
- `isTypographyToken(token)`: Check if token is typography
- `isSpacingToken(token)`: Check if token is spacing

## Validation

All types have corresponding Zod schemas in the validators package:

- `tokenSchema`: Validates Token objects
- `patternSchema`: Validates Pattern objects
- `ruleSchema`: Validates Rule objects
- `componentSchema`: Validates Component objects
- `pageSchema`: Validates Page objects
- `versionSchema`: Validates Version objects
- `scopeSchema`: Validates Scope objects

Use `createXxxInputSchema` for creation (without id, timestamps, version).
Use `updateXxxInputSchema` for updates (partial fields).

## Enums

All enums are available in both TypeScript and Zod formats:

- `TokenType`: color, typography, spacing, shadow, border, radius, opacity, sizing, z-index
- `ScopeType`: global, page, component, element
- `ChangeType`: create, update, delete, override
- `EnforcementLevel`: error, warning, suggestion
- `DriftSeverity`: none, low, moderate, high, critical
- `PatternType`: layout, component, interaction
- `RuleType`: constraint, guideline, automation
- `ComponentType`: button, input, card, header, footer, section, container, text, image, link, list, custom
- `EntityType`: token, pattern, rule, component, page, project

## Usage Examples

### Creating a Token
```typescript