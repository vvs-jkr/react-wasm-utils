// Типы для WASM операций
export interface SortByKeyPayload {
  data: Array<Record<string, unknown>>
  key: string
}

export interface DeepEqualPayload {
  a: unknown
  b: unknown
}

export interface ParseCsvPayload {
  csvText: string
  delimiter?: string
  hasHeader?: boolean
}

export type WasmOperationType = 'sortByKey' | 'deepEqual' | 'parseCsv'

export type WasmPayload = SortByKeyPayload | DeepEqualPayload | ParseCsvPayload

// Результаты WASM операций
export type SortByKeyResult = Array<Record<string, unknown>>
export type DeepEqualResult = boolean
export type ParseCsvResult = Array<Record<string, string | number>>

export type WasmResult = SortByKeyResult | DeepEqualResult | ParseCsvResult

// Сообщения воркера
export interface WorkerMessage {
  status: 'ready' | 'success' | 'error'
  id?: number
  data?: WasmResult
  error?: string
}

export interface WorkerTask<T = WasmResult> {
  resolve: (value: T) => void
  reject: (error: Error) => void
}

export interface WorkerRequest {
  id: number
  type: WasmOperationType
  payload: WasmPayload
}
