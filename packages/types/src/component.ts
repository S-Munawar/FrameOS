// src/component.ts

import { ComponentType } from './enums'
import { Scope } from './scope'

/**
 * Component represents a UI structure
 */
export interface Component {
  id: string
  name: string
  type: ComponentType
  description?: string
  code?: string                 // Generated code (HTML/JSX)
  tokens: string[]              // Token IDs used
  patterns: string[]            // Pattern IDs applied
  props?: ComponentProps        // Component configuration
  children?: string[]           // Child component IDs
  parentId?: string             // Parent component ID (if nested)
  pageId?: string               // Page ID (if belongs to page)
  scope: Scope                  // Component-level overrides
  variants?: ComponentVariant[] // Different states
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * Component props (simplified)
 */
export interface ComponentProps {
  [key: string]: string | number | boolean | undefined
}

/**
 * Component variant (e.g., hover, active, disabled)
 */
export interface ComponentVariant {
  name: string                  // Variant name (e.g., "hover")
  tokens: string[]              // Token overrides for this variant
  props?: ComponentProps        // Prop overrides
}

/**
 * Component hierarchy node
 */
export interface ComponentNode {
  component: Component
  children: ComponentNode[]
}

/**
 * Helper: Create component input
 */
export type CreateComponentInput = Omit<Component, 'id' | 'createdAt' | 'updatedAt' | 'version'>

/**
 * Helper: Update component input
 */
export type UpdateComponentInput = Partial<Omit<Component, 'id' | 'createdAt' | 'version'>>