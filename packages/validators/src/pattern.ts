// src/pattern.ts

import { z } from 'zod'
import { patternTypeSchema } from './enums'
import { scopeSchema } from './scope'

// Pattern rule schema
export const patternRuleSchema = z.object({
  property: z.string().min(1),
  value: z.string().min(1),
  condition: z.string().optional(),
})

// Pattern schema
export const patternSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: patternTypeSchema,
  description: z.string().optional(),
  tokens: z.array(z.string().uuid()),
  rules: z.array(patternRuleSchema),
  structure: z.record(z.unknown()).optional(),
  scope: scopeSchema,
  examples: z.array(z.string().uuid()).optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Create pattern input
export const createPatternInputSchema = patternSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

// Update pattern input
export const updatePatternInputSchema = patternSchema
  .omit({
    id: true,
    createdAt: true,
    version: true,
  })
  .partial()