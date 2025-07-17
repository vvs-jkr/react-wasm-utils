// Worker для WASM операций
console.log('[worker] === WASM WORKER STARTING ===')

import type {
  WorkerRequest,
  WorkerMessage,
  SortByKeyPayload,
  DeepEqualPayload,
  ParseCsvPayload,
} from './shared/types'
import { loadWasm } from 'react-wasm-utils'
import { ParseCsvEnhancedPayload } from './shared/types/wasm'

// Импорт реального WASM модуля
let wasmModule: any = null

// Инициализация WASM модуля
async function initWasm() {
  try {
    console.log('[worker] Loading WASM module...')

    // Загружаем WASM модуль через библиотеку
    wasmModule = await loadWasm()
    console.log('[worker] WASM module loaded successfully!')

    return wasmModule
  } catch (error) {
    console.error('[worker] Failed to load WASM:', error)
    throw error
  }
}

// Инициализируем при загрузке worker
initWasm()
  .then(wasm => {
    wasmModule = wasm
    console.log('[worker] WASM ready!')
    self.postMessage({ status: 'ready' } as WorkerMessage)
  })
  .catch(error => {
    console.error('[worker] Initialization failed:', error)
    self.postMessage({
      status: 'error',
      id: -1,
      error: `Init failed: ${error.message}`,
    } as WorkerMessage)
  })

// Обработчик сообщений
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = event.data

  console.log(`[worker] Processing task: ${type} (id: ${id})`)

  if (!wasmModule) {
    self.postMessage({
      status: 'error',
      id,
      error: 'WASM module not initialized',
    } as WorkerMessage)
    return
  }

  try {
    let result: unknown

    switch (type) {
      case 'deepEqual': {
        const deepEqualPayload = payload as DeepEqualPayload
        result = wasmModule.deep_equal(deepEqualPayload.a, deepEqualPayload.b)
        break
      }

      case 'sortByKey': {
        const sortPayload = payload as SortByKeyPayload
        result = wasmModule.sort_by_key(sortPayload.data, sortPayload.key)
        break
      }

      case 'parseCsv': {
        const csvPayload = payload as ParseCsvPayload
        // Используем базовую функцию парсинга CSV из упрощенного WASM
        result = wasmModule.parse_csv(csvPayload.csvText)
        break
      }

      case 'parseCsvEnhanced': {
        const { csvText, delimiter } = payload as ParseCsvEnhancedPayload
        result = wasmModule.parse_csv_enhanced(csvText, delimiter)
        break
      }

      default:
        throw new Error(`Unknown task type: ${type}`)
    }

    console.log(`[worker] Task ${type} completed successfully`)
    self.postMessage({
      status: 'success',
      id,
      data: result,
    } as WorkerMessage)
  } catch (error) {
    console.error(`[worker] Task ${type} failed:`, error)
    self.postMessage({
      status: 'error',
      id,
      error: String(error),
    } as WorkerMessage)
  }
}

console.log('[worker] === WORKER READY ===')

export {} // Делаем файл ES модулем
