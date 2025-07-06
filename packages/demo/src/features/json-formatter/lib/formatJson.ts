export function formatJson(
  input: string
): { success: true; formatted: string } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, 2)
    return { success: true, formatted }
  } catch {
    return { success: false, error: '❌ Неверный JSON формат' }
  }
}
