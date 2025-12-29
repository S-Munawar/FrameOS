// src/project.ts

import { z } from 'zod'

// Project schema
export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  designSystemId: z.string().uuid(),
  pages: z.array(z.string().uuid()),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Design system schema
export const designSystemSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  tokens: z.array(z.string().uuid()),
  patterns: z.array(z.string().uuid()),
  rules: z.array(z.string().uuid()),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().int().positive(),
})

// Create project input
export const createProjectInputSchema = projectSchema.omit({
  id: true,
  designSystemId: true,
  createdAt: true,
  updatedAt: true,
  version: true,
})

// Update project input
export const updateProjectInputSchema = projectSchema
  .omit({
    id: true,
    createdAt: true,
    version: true,
  })
  .partial()