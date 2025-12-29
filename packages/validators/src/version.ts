// src/version.ts

import { z } from 'zod'
import { changeTypeSchema, entityTypeSchema, versionActorSchema } from './enums'

// Version schema
export const versionSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  entityType: entityTypeSchema,
  entityId: z.string().uuid(),
  changeType: changeTypeSchema,
  before: z.unknown().nullable(),
  after: z.unknown().nullable(),
  scope: z.string().optional(),
  reason: z.string().optional(),
  actor: versionActorSchema,
  metadata: z.record(z.unknown()).optional(),
})

// History filter schema
export const historyFilterSchema = z.object({
  entityType: z.union([entityTypeSchema, z.array(entityTypeSchema)]).optional(),
  entityId: z.string().uuid().optional(),
  changeType: z.union([changeTypeSchema, z.array(changeTypeSchema)]).optional(),
  actor: versionActorSchema.optional(),
  from: z.date().optional(),
  to: z.date().optional(),
  limit: z.number().int().positive().optional(),
})