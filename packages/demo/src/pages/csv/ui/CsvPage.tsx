import React from 'react'
import { CsvProcessor } from '~/widgets/csv-processor'

/**
 * Страница парсинга CSV данных через WebAssembly
 * Архитектура: Feature-Sliced Design (FSD)
 */
export function CsvPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📄 CSV Парсер</h1>
        <p className="page-description">Быстрый парсинг CSV файлов с помощью WebAssembly</p>
      </div>

      <div className="page-content">
        <CsvProcessor />
      </div>
    </div>
  )
}
