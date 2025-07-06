/**
 * Локальные типы для демо проекта
 */
export type GenericObject = Record<string, unknown>

export interface WasmModule {
  sortByKey(data: GenericObject[], key: string): Map<string, unknown>[]
  parseCsv(csvData: string): Map<string, unknown>[]
  deepEqual(a: unknown, b: unknown): boolean
}

type WasmInitFunction = () => Promise<void>

export type WasmLibModule = WasmModule & {
  default: WasmInitFunction
}

export type {
  SortByKeyPayload,
  DeepEqualPayload,
  ParseCsvPayload,
  WasmOperationType,
  WasmPayload,
  SortByKeyResult,
  DeepEqualResult,
  ParseCsvResult,
  WasmResult,
  WorkerMessage,
  WorkerTask,
  WorkerRequest,
} from './wasm'
