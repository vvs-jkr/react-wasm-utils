export function mapToObject<T extends object>(
  item: T | Map<string, unknown>
): T {
  if (item instanceof Map) {
    const obj: Record<string, unknown> = {}
    for (const [key, value] of item.entries()) {
      obj[key] = value instanceof Map ? mapToObject(value) : value
    }
    return obj as T
  }
  return item
}
