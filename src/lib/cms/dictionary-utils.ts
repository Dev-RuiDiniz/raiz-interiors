type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEqualJsonValue(left: unknown, right: unknown): boolean {
  if (left === right) return true

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false
    return left.every((item, index) => isEqualJsonValue(item, right[index]))
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    if (leftKeys.length !== rightKeys.length) return false
    return leftKeys.every((key) => isEqualJsonValue(left[key], right[key]))
  }

  return false
}

export function deepMergeDictionary<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T
  }

  const merged: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    const baseValue = merged[key]
    const overrideValue = override[key]

    if (Array.isArray(baseValue)) {
      merged[key] = Array.isArray(overrideValue) ? overrideValue : baseValue
      continue
    }

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      merged[key] = deepMergeDictionary(baseValue, overrideValue)
      continue
    }

    merged[key] = overrideValue
  }

  return merged as T
}

export function createDictionaryDiff(base: unknown, edited: unknown): unknown {
  if (isEqualJsonValue(base, edited)) {
    return undefined
  }

  if (Array.isArray(base) || Array.isArray(edited)) {
    return edited
  }

  if (isPlainObject(base) && isPlainObject(edited)) {
    const diff: Record<string, unknown> = {}
    for (const key of Object.keys(edited)) {
      const next = createDictionaryDiff(base[key], edited[key])
      if (next !== undefined) {
        diff[key] = next
      }
    }

    return Object.keys(diff).length ? diff : undefined
  }

  return edited
}

export function cloneDictionaryValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDictionaryValue(item)) as T
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneDictionaryValue(item)])) as T
  }

  return value
}

export type { JsonValue }
