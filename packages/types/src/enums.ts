// src/enums.ts

/**
 * Token types represent different categories of design decisions
 */
export enum TokenType {
  COLOR = 'color',
  TYPOGRAPHY = 'typography',
  SPACING = 'spacing',
  SHADOW = 'shadow',
  BORDER = 'border',
  RADIUS = 'radius',
  OPACITY = 'opacity',
  SIZING = 'sizing',
  Z_INDEX = 'z-index',
}

/**
 * Scope type defines the hierarchy of design decisions
 * Lower scopes override higher scopes
 */
export enum ScopeType {
  GLOBAL = 'global',
  PAGE = 'page',
  COMPONENT = 'component',
  ELEMENT = 'element',
}

/**
 * Change types for version tracking
 */
export enum ChangeType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  OVERRIDE = 'override',
}

/**
 * Rule enforcement levels
 */
export enum EnforcementLevel {
  ERROR = 'error',       // Blocks commit
  WARNING = 'warning',   // Shows warning, can override
  SUGGESTION = 'suggestion', // Informational only
}

/**
 * Drift severity levels
 */
export enum DriftSeverity {
  NONE = 'none',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Pattern types
 */
export enum PatternType {
  LAYOUT = 'layout',
  COMPONENT = 'component',
  INTERACTION = 'interaction',
}

/**
 * Rule types
 */
export enum RuleType {
  CONSTRAINT = 'constraint',   // Must be satisfied
  GUIDELINE = 'guideline',     // Should be followed
  AUTOMATION = 'automation',   // Auto-applies changes
}

/**
 * Component types
 */
export enum ComponentType {
  BUTTON = 'button',
  INPUT = 'input',
  CARD = 'card',
  HEADER = 'header',
  FOOTER = 'footer',
  SECTION = 'section',
  CONTAINER = 'container',
  TEXT = 'text',
  IMAGE = 'image',
  LINK = 'link',
  LIST = 'list',
  CUSTOM = 'custom',
}

/**
 * Entity types for versioning
 */
export enum EntityType {
  TOKEN = 'token',
  PATTERN = 'pattern',
  RULE = 'rule',
  COMPONENT = 'component',
  PAGE = 'page',
  PROJECT = 'project',
}