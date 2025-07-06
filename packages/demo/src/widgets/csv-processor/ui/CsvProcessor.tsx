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

  return (
    <div className="csv-processor">
      <SampleSelector onLoadSample={loadSample} onFileUpload={onFileUpload} />

      <CsvInput value={csvInput} onChange={setCsvContent} />

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
