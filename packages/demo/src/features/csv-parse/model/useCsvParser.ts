import { useState, useMemo, useCallback } from 'react'
import { useWasmWorker } from '~/shared/api'
import { generateLargeCsv } from '~/entities/csv'
import type { ParseCsvResult } from '~/shared/types'
import type { CsvParseState, CsvRecord } from '~/entities/csv'

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

  const { execute, hasWorker } = useWasmWorker()

  // Извлекаем заголовки из данных
  const headers = useMemo(() => {
    if (state.data.length === 0) return []
    return Object.keys(state.data[0])
  }, [state.data])

  // Превью данных (первые 20 строк)
  const previewData = useMemo(() => state.data.slice(0, 20), [state.data])

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
      const startTime = performance.now()
      const result = await execute('parseCsv', { csvText: csvInput })
      const parseTime = performance.now() - startTime

      if (Array.isArray(result)) {
        setState(prev => ({
          ...prev,
          data: result as CsvRecord[],
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
      setState(prev => ({
        ...prev,
        error: `❌ Ошибка обработки: ${parseError}`,
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
