/**
 * Модель CSV данных
 */
export interface CsvRecord {
  [key: string]: string | number
}

/**
 * Результат парсинга CSV
 */
export interface CsvParseResult {
  data: CsvRecord[]
  parseTime: number
  rowCount: number
}

/**
 * Состояние парсинга CSV
 */
export interface CsvParseState {
  data: CsvRecord[]
  isLoading: boolean
  parseTime: number | null
  error: string | { message: string; line?: number } | null
}

/**
 * Типы примеров CSV
 */
export type CsvSampleType = 'simple' | 'complex' | 'large'

/**
 * Конфигурация примера CSV
 */
export interface CsvSample {
  key: CsvSampleType
  label: string
  icon: string
  data: string
}
