// src/token.ts

import { z } from 'zod'
import { tokenTypeSchema, tokenSourceSchema } from './enums'
import { scopeSchema } from './scope'

// Token schema
export const tokenSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: tokenTypeSchema,
  value: z.string().min(1),
  scope: scopeSchema,
  source: tokenSourceSchema,
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Create token input schema (without generated fields)
export const createTokenInputSchema = tokenSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

// Update token input schema (partial)
export const updateTokenInputSchema = tokenSchema
  .omit({
    id: true,
    createdAt: true,
    version: true,
  })
  .partial()

// Token filter schema
export const tokenFilterSchema = z.object({
  type: z.union([tokenTypeSchema, z.array(tokenTypeSchema)]).optional(),
  scope: scopeSchema.optional(),
  name: z.string().optional(),
  source: tokenSourceSchema.optional(),
})