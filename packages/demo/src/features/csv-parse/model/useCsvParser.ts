import { useState, useMemo } from 'react'
import { useWasmWorker } from '~/shared/api'
import type { CsvParseState, CsvRecord } from '~/entities/csv'
import { detectDelimiter } from './detectDelimiter'

/**
 * Хук для управления парсингом CSV данных
 */
export function useCsvParser() {
  const [csvInput, setCsvInput] = useState('')
  const [state, setState] = useState<CsvParseState>({
    data: [],
    isLoading: false,
    parseTime: null,
    error: null,
  })
  const [delimiter, setDelimiter] = useState<string>(',')

  const { execute, hasWorker } = useWasmWorker()

  // Извлекаем заголовки из данных
  const headers = useMemo(() => {
    if (state.data.length === 0) return []
    return Object.keys(state.data[0])
  }, [state.data])

  // Превью данных (первые 20 строк)
  const previewData = useMemo(() => state.data.slice(0, 20), [state.data])

  // Type guard для результата parseCsvEnhanced
  function isCsvEnhancedResult(obj: unknown): obj is { data: CsvRecord[] } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'data' in obj &&
      Array.isArray((obj as { data?: unknown }).data)
    )
  }

  /**
   * Парсит CSV данные через WASM
   */
  const parseCsv = async (): Promise<void> => {
    if (!hasWorker || !csvInput.trim()) return

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      data: [],
    }))

    try {
      const detected = detectDelimiter(csvInput)
      setDelimiter(detected)
      const startTime = performance.now()
      const result = await execute('parseCsvEnhanced', { csvText: csvInput, delimiter: detected })
      const parseTime = performance.now() - startTime

      if (isCsvEnhancedResult(result)) {
        setState(prev => ({
          ...prev,
          data: result.data,
          parseTime,
          isLoading: false,
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: '❌ Ошибка парсинга CSV',
          isLoading: false,
        }))
      }
    } catch (parseError) {
      // Извлекаем номер строки из текста ошибки, если есть
      let errorObj: { message: string; line?: number }
      const msg = String(parseError)
      const match = msg.match(/line: (\d+)/)
      if (match) {
        errorObj = { message: `❌ Ошибка обработки: ${msg}`, line: Number(match[1]) }
      } else {
        errorObj = { message: `❌ Ошибка обработки: ${msg}` }
      }
      setState(prev => ({
        ...prev,
        error: errorObj,
        isLoading: false,
      }))
    }
  }

  /**
   * Загружает пример CSV данных
   */
  const loadSample = (csvData: string): void => {
    setCsvInput(csvData)
    resetState()
  }

  /**
   * Очищает все данные
   */
  const clearAll = (): void => {
    setCsvInput('')
    resetState()
  }

  /**
   * Сброс состояния парсинга
   */
  const resetState = (): void => {
    setState({
      data: [],
      isLoading: false,
      parseTime: null,
      error: null,
    })
  }

  /**
   * Устанавливает содержимое CSV
   */
  const setCsvContent = (content: string): void => {
    setCsvInput(content)
    resetState()
  }

  return {
    // Состояние
    csvInput,
    data: state.data,
    isLoading: state.isLoading,
    parseTime: state.parseTime,
    error: state.error,
    hasWorker,
    delimiter,

    // Вычисляемые значения
    headers,
    previewData,
    rowCount: state.data.length,

    // Действия
    parseCsv,
    loadSample,
    clearAll,
    setCsvContent,
  }
}
