export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Очистка
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadData(
  data: Array<Record<string, unknown>> | Record<string, unknown>,
  filename: string,
  type: 'json' | 'csv' = 'json'
) {
  let content: string
  let mimeType: string

  if (type === 'csv') {
    // Преобразуем массив объектов в CSV
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0])
      const csvHeaders = headers.join(',')
      const csvRows = data.map(row =>
        headers
          .map(header => {
            const value = row[header]
            // Экранируем значения с запятыми или кавычками
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return String(value ?? '')
          })
          .join(',')
      )
      content = [csvHeaders, ...csvRows].join('\n')
    } else {
      content = ''
    }
    mimeType = 'text/csv;charset=utf-8;'
  } else {
    content = JSON.stringify(data, null, 2)
    mimeType = 'application/json;charset=utf-8;'
  }

  downloadFile(content, filename, mimeType)
}
