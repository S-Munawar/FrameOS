// src/page.ts

import { Scope } from './scope'

/**
 * Page represents a complete page with components
 */
export interface Page {
  id: string
  name: string
  route: string                 // URL path (e.g., "/", "/about")
  description?: string
  components: string[]          // Ordered list of component IDs
  layout?: PageLayout           // Page-level layout config
  overrides: TokenOverride[]    // Page-scoped token overrides
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
  version: number
}

/**
 * Page layout configuration
 */
export interface PageLayout {
  type: 'single-column' | 'two-column' | 'grid' | 'custom'
  config?: Record<string, unknown>
}

/**
 * Token override at page level
 */
export interface TokenOverride {
  tokenId: string               // Token being overridden
  tokenName: string             // Token name (for convenience)
  value: string                 // Override value
  scope: Scope                  // Scope of override
}

/**
 * Helper: Create page input
 */
export type CreatePageInput = Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'version'>

/**
 * Helper: Update page input
 */
export type UpdatePageInput = Partial<Omit<Page, 'id' | 'createdAt' | 'version'>>