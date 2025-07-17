import React from 'react'
import { useCsvParser, CsvInput, ParseControls } from '~/features/csv-parse'
import { useFileUpload, SampleSelector } from '~/features/csv-upload'
import { ResultsDisplay, ErrorDisplay } from '~/features/csv-export'

/**
 * Виджет для полноценной обработки CSV данных
 * Объединяет загрузку, парсинг и экспорт CSV
 */
export function CsvProcessor() {
  const {
    csvInput,
    data,
    isLoading,
    parseTime,
    error,
    hasWorker,
    headers,
    previewData,
    rowCount,
    parseCsv,
    loadSample,
    clearAll,
    setCsvContent,
    delimiter,
  } = useCsvParser()

  const { handleFileUpload } = useFileUpload()

  const onFileUpload = (file: File) => {
    handleFileUpload(
      file,
      content => setCsvContent(content),
      error => console.error('Ошибка загрузки файла:', error)
    )
  }

  const canParse = hasWorker && csvInput.trim().length > 0

  // Получаем номер строки ошибки, если есть
  const errorLine = typeof error === 'object' && error?.line ? error.line : undefined

  return (
    <div className="csv-processor">
      <SampleSelector onLoadSample={loadSample} onFileUpload={onFileUpload} />

      <CsvInput value={csvInput} onChange={setCsvContent} errorLine={errorLine} />

      <div style={{ margin: '8px 0', color: '#888' }}>
        Автоматически выбранный разделитель: <b>{delimiter}</b>
      </div>

      <ParseControls
        onParse={parseCsv}
        onClear={clearAll}
        isLoading={isLoading}
        disabled={!canParse}
      />

      {error && <ErrorDisplay error={error} />}

      <ResultsDisplay
        data={data}
        headers={headers}
        previewData={previewData}
        parseTime={parseTime}
        rowCount={rowCount}
      />
    </div>
  )
}
