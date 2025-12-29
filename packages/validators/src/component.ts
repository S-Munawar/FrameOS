// src/component.ts

import { z } from 'zod'
import { componentTypeSchema } from './enums'
import { scopeSchema } from './scope'

// Component props schema
export const componentPropsSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.undefined()])
)

// Component variant schema
export const componentVariantSchema = z.object({
  name: z.string().min(1),
  tokens: z.array(z.string().uuid()),
  props: componentPropsSchema.optional(),
})

// Component schema
export const componentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: componentTypeSchema,
  description: z.string().optional(),
  code: z.string().optional(),
  tokens: z.array(z.string().uuid()),
  patterns: z.array(z.string().uuid()),
  props: componentPropsSchema.optional(),
  children: z.array(z.string().uuid()).optional(),
  parentId: z.string().uuid().optional(),
  pageId: z.string().uuid().optional(),
  scope: scopeSchema,
  variants: z.array(componentVariantSchema).optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Create component input
export const createComponentInputSchema = componentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

// Update component input
export const updateComponentInputSchema = componentSchema
  .omit({
    id: true,
    createdAt: true,
    version: true,
  })
  .partial()