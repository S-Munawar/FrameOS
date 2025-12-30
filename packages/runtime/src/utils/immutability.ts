// src/utils/immutability.ts

/**
 * Deep clone an object
 * Used to ensure immutability when updating state
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T
  }

  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  throw new Error('Unable to clone object')
}

/**
 * Update an object immutably
 * Returns a new object with updated properties
 */
export function immutableUpdate<T extends object>(
  obj: T,
  updates: Partial<T>
): T {
  return {
    ...deepClone(obj),
    ...updates,
  }
}

/**
 * Add item to array immutably
 */
export function immutablePush<T>(array: T[], item: T): T[] {
  return [...array, item]
}

/**
 * Remove item from array immutably by index
 */
export function immutableRemoveAt<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

/**
 * Remove item from array immutably by predicate
 */
export function immutableRemove<T>(
  array: T[],
  predicate: (item: T) => boolean
): T[] {
  return array.filter((item) => !predicate(item))
}

/**
 * Update item in array immutably
 */
export function immutableUpdateAt<T>(
  array: T[],
  index: number,
  updater: (item: T) => T
): T[] {
  return array.map((item, i) => (i === index ? updater(item) : item))
}

/**
 * Replace item in array immutably based on ID
 */
export function immutableReplaceById<T extends { id: string }>(
  array: T[],
  id: string,
  newItem: T
): T[] {
  return array.map((item) => (item.id === id ? newItem : item))
}