// src/scope.ts

import { z } from 'zod'
import { scopeTypeSchema } from './enums'

// Scope schema
export const scopeSchema = z.object({
  type: scopeTypeSchema,
  id: z.string().optional(),
}).refine(
  (data) => {
    // Global scope should not have ID
    if (data.type === 'global') {
      return data.id === undefined
    }
    // Non-global scopes must have ID
    return data.id !== undefined && data.id.length > 0
  },
  {
    message: 'Non-global scopes must have an ID',
  }
)

// Resolution context schema
export const resolutionContextSchema = z.object({
  page: z.string().optional(),
  component: z.string().optional(),
  element: z.string().optional(),
})