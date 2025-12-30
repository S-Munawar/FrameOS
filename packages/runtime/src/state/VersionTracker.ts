// src/state/VersionTracker.ts

import { v4 as uuidv4 } from 'uuid'
import type {
  Version,
  EntityType,
  ChangeType,
  HistoryFilter,
} from '@frameos/types'
import { VersionActor } from '@frameos/types'

/**
 * VersionTracker manages the version history
 */
export class VersionTracker {
  private versions: Version[] = []

  /**
   * Create a new version record
   */
  createVersion(params: {
    entityType: EntityType
    entityId: string
    changeType: ChangeType
    before: unknown
    after: unknown
    scope?: string
    reason?: string
    actor?: VersionActor
  }): Version {
    const version: Version = {
      id: uuidv4(),
      timestamp: new Date(),
      entityType: params.entityType,
      entityId: params.entityId,
      changeType: params.changeType,
      before: params.before,
      after: params.after,
      scope: params.scope,
      reason: params.reason,
      actor: params.actor ?? VersionActor.USER,
      metadata: {},
    }

    this.versions.push(version)
    return version
  }

  /**
   * Get all versions
   */
  getAll(): Version[] {
    return [...this.versions]
  }

  /**
   * Get versions with filter
   */
  getFiltered(filter: HistoryFilter): Version[] {
    let filtered = [...this.versions]

    // Filter by entity type
    if (filter.entityType) {
      const types = Array.isArray(filter.entityType)
        ? filter.entityType
        : [filter.entityType]
      filtered = filtered.filter((v) => types.includes(v.entityType))
    }

    // Filter by entity ID
    if (filter.entityId) {
      filtered = filtered.filter((v) => v.entityId === filter.entityId)
    }

    // Filter by change type
    if (filter.changeType) {
      const types = Array.isArray(filter.changeType)
        ? filter.changeType
        : [filter.changeType]
      filtered = filtered.filter((v) => types.includes(v.changeType))
    }

    // Filter by actor
    if (filter.actor) {
      filtered = filtered.filter((v) => v.actor === filter.actor)
    }

    // Filter by date range
    if (filter.from) {
      filtered = filtered.filter((v) => v.timestamp >= filter.from!)
    }
    if (filter.to) {
      filtered = filtered.filter((v) => v.timestamp <= filter.to!)
    }

    // Apply limit
    if (filter.limit) {
      filtered = filtered.slice(-filter.limit)
    }

    return filtered
  }

  /**
   * Get version by ID
   */
  getById(id: string): Version | null {
    return this.versions.find((v) => v.id === id) || null
  }

  /**
   * Get latest version for an entity
   */
  getLatestForEntity(entityId: string): Version | null {
    const entityVersions = this.versions.filter((v) => v.entityId === entityId)
    return entityVersions.length > 0
      ? entityVersions[entityVersions.length - 1]
      : null
  }

  /**
   * Clear all versions
   */
  clear(): void {
    this.versions = []
  }

  /**
   * Load versions from array
   */
  loadVersions(versions: Version[]): void {
    this.versions = [...versions]
  }

  /**
   * Get version count
   */
  count(): number {
    return this.versions.length
  }
}