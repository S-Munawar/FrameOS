// src/state/TokenManager.ts

import { v4 as uuidv4 } from 'uuid'
import type {
  Token,
  CreateTokenInput,
  UpdateTokenInput,
  TokenFilter,
  Version,
} from '@frameos/types'
import { EntityType, ChangeType } from '@frameos/types'
import { tokenSchema, createTokenInputSchema, updateTokenInputSchema } from '@frameos/validators'
import { VersionTracker } from './VersionTracker'

/**
 * TokenManager handles all token operations
 */
export class TokenManager {
  private tokens: Map<string, Token>
  private versionTracker: VersionTracker

  constructor(tokens: Map<string, Token>, versionTracker: VersionTracker) {
    this.tokens = tokens
    this.versionTracker = versionTracker
  }

  /**
   * Create a new token
   */
  create(input: CreateTokenInput, reason?: string): Version {
    // Validate input
    const validationResult = createTokenInputSchema.safeParse(input)
    if (!validationResult.success) {
      throw new Error(`Invalid token input: ${validationResult.error.message}`)
    }

    // Check for duplicate name at same scope
    const existing = this.findByNameAndScope(input.name, input.scope)
    if (existing) {
      throw new Error(
        `Token with name "${input.name}" already exists at scope ${JSON.stringify(input.scope)}`
      )
    }

    // Create token
    const token: Token = {
      ...input,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    }

    // Validate complete token
    const tokenValidation = tokenSchema.safeParse(token)
    if (!tokenValidation.success) {
      throw new Error(`Invalid token: ${tokenValidation.error.message}`)
    }

    // Store token
    this.tokens.set(token.id, token)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.TOKEN,
      entityId: token.id,
      changeType: ChangeType.CREATE,
      before: null,
      after: token,
      scope: this.formatScope(token.scope),
      reason,
    })
  }

  /**
   * Update an existing token
   */
  update(id: string, updates: UpdateTokenInput, reason?: string): Version {
    // Get existing token
    const existing = this.tokens.get(id)
    if (!existing) {
      throw new Error(`Token with ID ${id} not found`)
    }

    // Validate updates
    const validationResult = updateTokenInputSchema.safeParse(updates)
    if (!validationResult.success) {
      throw new Error(`Invalid token updates: ${validationResult.error.message}`)
    }

    // Check for name conflicts if name is being changed
    if (updates.name && updates.name !== existing.name) {
      const scope = updates.scope || existing.scope
      const conflict = this.findByNameAndScope(updates.name, scope)
      if (conflict && conflict.id !== id) {
        throw new Error(
          `Token with name "${updates.name}" already exists at scope ${JSON.stringify(scope)}`
        )
      }
    }

    // Create updated token
    const updated: Token = {
      ...existing,
      ...updates,
      id: existing.id, // Never change ID
      createdAt: existing.createdAt, // Never change creation date
      updatedAt: new Date(),
      version: existing.version + 1,
    }

    // Validate complete token
    const tokenValidation = tokenSchema.safeParse(updated)
    if (!tokenValidation.success) {
      throw new Error(`Invalid updated token: ${tokenValidation.error.message}`)
    }

    // Store updated token
    this.tokens.set(id, updated)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.TOKEN,
      entityId: id,
      changeType: ChangeType.UPDATE,
      before: existing,
      after: updated,
      scope: this.formatScope(updated.scope),
      reason,
    })
  }

  /**
   * Delete a token
   */
  delete(id: string, reason?: string): Version {
    // Get existing token
    const existing = this.tokens.get(id)
    if (!existing) {
      throw new Error(`Token with ID ${id} not found`)
    }

    // Remove token
    this.tokens.delete(id)

    // Create version
    return this.versionTracker.createVersion({
      entityType: EntityType.TOKEN,
      entityId: id,
      changeType: ChangeType.DELETE,
      before: existing,
      after: null,
      scope: this.formatScope(existing.scope),
      reason,
    })
  }

  /**
   * Get token by ID
   */
  getById(id: string): Token | null {
    return this.tokens.get(id) || null
  }

  /**
   * Get all tokens
   */
  getAll(): Token[] {
    return Array.from(this.tokens.values())
  }

  /**
   * Get tokens with filter
   */
  getFiltered(filter: TokenFilter): Token[] {
    let tokens = this.getAll()

    // Filter by type
    if (filter.type) {
      const types = Array.isArray(filter.type) ? filter.type : [filter.type]
      tokens = tokens.filter((t) => types.includes(t.type))
    }

    // Filter by scope
    if (filter.scope) {
      tokens = tokens.filter(
        (t) =>
          t.scope.type === filter.scope!.type &&
          t.scope.id === filter.scope!.id
      )
    }

    // Filter by name (partial match)
    if (filter.name) {
      const searchLower = filter.name.toLowerCase()
      tokens = tokens.filter((t) => t.name.toLowerCase().includes(searchLower))
    }

    // Filter by source
    if (filter.source) {
      tokens = tokens.filter((t) => t.source === filter.source)
    }

    return tokens
  }

  /**
   * Find token by name and scope
   */
  private findByNameAndScope(name: string, scope: any): Token | undefined {
    return Array.from(this.tokens.values()).find(
      (t) =>
        t.name === name &&
        t.scope.type === scope.type &&
        t.scope.id === scope.id
    )
  }

  /**
   * Format scope as string
   */
  private formatScope(scope: any): string {
    if (scope.type === 'global') {
      return 'global'
    }
    return `${scope.type}:${scope.id}`
  }

  /**
   * Get token count
   */
  count(): number {
    return this.tokens.size
  }

  /**
   * Check if token exists
   */
  exists(id: string): boolean {
    return this.tokens.has(id)
  }
}