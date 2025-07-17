export function detectDelimiter(csvText: string): string {
  const candidates = [',', ';', '\t', '|']
  const lines = csvText.split('\n').filter(Boolean)
  if (lines.length === 0) return ','

  const counts = candidates.map(delim => ({
    delim,
    count: lines[0].split(delim).length - 1,
  }))
  counts.sort((a, b) => b.count - a.count)
  return counts[0].count > 0 ? counts[0].delim : ','
}
