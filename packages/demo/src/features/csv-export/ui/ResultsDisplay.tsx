import React from 'react'
import { Button } from '~/shared/ui'
import { downloadData } from '~/shared/lib'
import type { CsvRecord } from '~/entities/csv'

interface ResultsDisplayProps {
  data: CsvRecord[]
  headers: string[]
  previewData: CsvRecord[]
  parseTime: number | null
  rowCount: number
}

export function ResultsDisplay({
  data,
  headers,
  previewData,
  parseTime,
  rowCount,
}: ResultsDisplayProps) {
  const handleDownload = () => {
    if (data.length === 0) return
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadData(data, `parsed_csv_${timestamp}.json`, 'json')
  }

  if (data.length === 0) return null

  return (
    <div className="results-section">
      <div className="results-header">
        <div className="sort-indicator">
          Обработано: <strong>{rowCount.toLocaleString()}</strong> записей
          {parseTime && (
            <span>
              {' '}
              • Время парсинга: <strong>{parseTime.toFixed(1)} мс</strong>
            </span>
          )}
        </div>
        <div className="download-buttons">
          <Button size="sm" onClick={handleDownload}>
            📥 JSON
          </Button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span>📋 Результат парсинга (первые 20 записей)</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, index) => (
              <tr key={index}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info">
        💡 <strong>Применение:</strong> импорт данных, отчёты, интеграция с внешними системами
      </div>
    </div>
  )
}
