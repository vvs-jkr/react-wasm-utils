/**
 * Локальные типы для демо проекта
 */
export type GenericObject = Record<string, unknown>

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

export type WorkerTask = DeepEqualTask | SortByKeyTask | ParseCsvTask

export type WorkerResponse =
  | { status: 'ready' }
  | { status: 'success'; id: number; data: unknown }
  | { status: 'error'; id: number; error: string }

type WasmInitFunction = () => Promise<void>

export type WasmLibModule = WasmModule & {
  default: WasmInitFunction
}
