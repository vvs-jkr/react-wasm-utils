/**
 * Описывает объект, который может иметь любые строковые ключи.
 * Использование `unknown` вместо `any` — более безопасная практика,
 * так как заставляет нас выполнять проверки перед использованием значения.
 */
export type GenericObject = Record<string, unknown>

/**
 * Тип для WASM модуля с методами для работы с данными
 */
export interface WasmModule {
  sortByKey(data: GenericObject[], key: string): Map<string, unknown>[]
  parseCsv(csvData: string): Map<string, unknown>[]
  deepEqual(a: unknown, b: unknown): boolean
}

type DeepEqualTask = {
  id: number
  type: 'deepEqual'
  payload: { a: unknown; b: unknown }
}

type SortByKeyTask = {
  id: number
  type: 'sortByKey'
  payload: { data: GenericObject[]; key: string }
}

type ParseCsvTask = {
  id: number
  type: 'parseCsv'
  payload: { csvData: string }
}

// 2. Объединяем их в один тип. `type` - это наш "дискриминант"
export type WorkerTask = DeepEqualTask | SortByKeyTask | ParseCsvTask

// Тип для ответа остается таким же
export type WorkerResponse =
  | { status: 'ready' }
  | { status: 'success'; id: number; data: unknown }
  | { status: 'error'; id: number; error: string }

type WasmInitFunction = () => Promise<void>

export type WasmLibModule = WasmModule & {
  default: WasmInitFunction
}
