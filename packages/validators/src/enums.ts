// src/enums.ts

import { z } from 'zod'
import {
  TokenType,
  ScopeType,
  ChangeType,
  EnforcementLevel,
  DriftSeverity,
  PatternType,
  RuleType,
  ComponentType,
  EntityType,
  TokenSource,
  VersionActor,
} from '@frameos/types'

// Zod enum schemas
export const tokenTypeSchema = z.nativeEnum(TokenType)
export const scopeTypeSchema = z.nativeEnum(ScopeType)
export const changeTypeSchema = z.nativeEnum(ChangeType)
export const enforcementLevelSchema = z.nativeEnum(EnforcementLevel)
export const driftSeveritySchema = z.nativeEnum(DriftSeverity)
export const patternTypeSchema = z.nativeEnum(PatternType)
export const ruleTypeSchema = z.nativeEnum(RuleType)
export const componentTypeSchema = z.nativeEnum(ComponentType)
export const entityTypeSchema = z.nativeEnum(EntityType)
export const tokenSourceSchema = z.nativeEnum(TokenSource)
export const versionActorSchema = z.nativeEnum(VersionActor)