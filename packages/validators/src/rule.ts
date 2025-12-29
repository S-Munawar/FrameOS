// src/rule.ts

import { z } from 'zod'
import { ruleTypeSchema, enforcementLevelSchema } from './enums'
import { scopeSchema } from './scope'

// Rule condition schema
export const ruleConditionSchema = z.object({
  type: z.enum(['always', 'tokenType', 'componentType', 'custom']),
  value: z.string().optional(),
  expression: z.string().optional(),
})

// Rule action schema
export const ruleActionSchema = z.object({
  type: z.enum(['validate', 'autoApply', 'suggest']),
  parameters: z.record(z.unknown()).optional(),
})

// Rule schema
export const ruleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: ruleTypeSchema,
  description: z.string().min(1),
  condition: ruleConditionSchema,
  enforcement: enforcementLevelSchema,
  scope: scopeSchema,
  action: ruleActionSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Create rule input
export const createRuleInputSchema = ruleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

// Update rule input
export const updateRuleInputSchema = ruleSchema
  .omit({
    id: true,
    createdAt: true,
    version: true,
  })
  .partial()