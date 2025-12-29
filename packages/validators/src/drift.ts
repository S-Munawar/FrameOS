// src/drift.ts

import { z } from 'zod'
import { driftSeveritySchema } from './enums'

// Affected entity schema
export const affectedEntitySchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['component', 'page', 'pattern']),
  name: z.string(),
  changeDescription: z.string(),
  before: z.string().optional(),
  after: z.string().optional(),
})

// Drift report schema (simplified for now)
export const driftReportSchema = z.object({
  severity: driftSeveritySchema,
  affected: z.array(affectedEntitySchema),
  unaffected: z.array(affectedEntitySchema),
  conflicts: z.array(z.unknown()), // Will be defined later with rule violations
  recommendations: z.array(z.string()),
  preview: z.string().optional(),
})