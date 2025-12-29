// src/page.ts

import { z } from 'zod'
import { scopeSchema } from './scope'

// Page layout schema
export const pageLayoutSchema = z.object({
  type: z.enum(['single-column', 'two-column', 'grid', 'custom']),
  config: z.record(z.unknown()).optional(),
})

// Token override schema
export const tokenOverrideSchema = z.object({
  tokenId: z.string().uuid(),
  tokenName: z.string(),
  value: z.string(),
  scope: scopeSchema,
})

// Page schema
export const pageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  route: z.string().min(1),
  description: z.string().optional(),
  components: z.array(z.string().uuid()),
  layout: pageLayoutSchema.optional(),
  overrides: z.array(tokenOverrideSchema),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Create page input
export const createPageInputSchema = pageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

// Update page input
export const updatePageInputSchema = pageSchema
  .omit({
    id: true,
    createdAt: true,
    version: true,
  })
  .partial()