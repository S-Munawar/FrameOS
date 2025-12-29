// src/token.ts

import { TokenType } from './enums'
import { Scope } from './scope'

/**
 * Token represents an atomic design decision
 * Examples: primary-color, heading-font, spacing-base
 */
export interface Token {
  id: string                    // Unique identifier (UUID)
  name: string                  // Semantic name (e.g., "button-primary-bg")
  type: TokenType               // Category (color, typography, etc.)
  value: string                 // Actual value (e.g., "#3B82F6", "16px", "Inter")
  scope: Scope                  // Where this token applies
  source: TokenSource           // How this token was created
  description?: string          // Optional human-readable description
  metadata?: Record<string, unknown>  // Additional data
  createdAt: Date               // Creation timestamp
  updatedAt: Date               // Last update timestamp
  version: number               // Version number (starts at 1)
}

/**
 * Token source indicates how the token was created
 */
export enum TokenSource {
  USER_DEFINED = 'user-defined',      // Manually created by user
  INFERRED = 'inferred',              // Inferred from code/image by AI
  IMPORTED = 'imported',              // Imported from external source
  SYSTEM = 'system',                  // Created by system automation
}

/**
 * Token filter for querying tokens
 */
export interface TokenFilter {
  type?: TokenType | TokenType[]
  scope?: Scope
  name?: string                  // Partial match
  source?: TokenSource
}

/**
 * Resolved token includes resolution metadata
 */
export interface ResolvedToken {
  token: Token                   // The actual token
  value: string                  // Final resolved value
  source: string                 // Which scope provided this value
  overrideChain?: {
    global?: string
    page?: string
    component?: string
    element?: string
  }
}

/**
 * Token with usage information
 */
export interface TokenWithUsage extends Token {
  usageCount: number             // How many components use this token
  usedIn: string[]               // IDs of components/pages using this token
}

/**
 * Type guard: Check if token is a color token
 */
export function isColorToken(token: Token): boolean {
  return token.type === TokenType.COLOR
}

/**
 * Type guard: Check if token is a typography token
 */
export function isTypographyToken(token: Token): boolean {
  return token.type === TokenType.TYPOGRAPHY
}

/**
 * Type guard: Check if token is a spacing token
 */
export function isSpacingToken(token: Token): boolean {
  return token.type === TokenType.SPACING
}

/**
 * Helper: Create a new token (without ID and timestamps)
 */
export type CreateTokenInput = Omit<Token, 'id' | 'createdAt' | 'updatedAt' | 'version'>

/**
 * Helper: Update token (partial fields)
 */
export type UpdateTokenInput = Partial<Omit<Token, 'id' | 'createdAt' | 'version'>>