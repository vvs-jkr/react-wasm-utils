// Worker для WASM операций
console.log('[worker] === WASM WORKER STARTING ===')

import type { WorkerTask, WorkerResponse } from './shared/types'

// Простая заглушка для WASM функций - будем использовать JavaScript реализации
class WasmMock {
  deep_equal(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  sort_by_key(data: unknown[], key: string): unknown[] {
    if (!Array.isArray(data)) return []

    return [...data].sort((a: any, b: any) => {
      const valueA = a?.[key]
      const valueB = b?.[key]

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB)
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB
      }

      return String(valueA).localeCompare(String(valueB))
    })
  }

  parse_csv(csvData: string): unknown[] {
    if (!csvData || typeof csvData !== 'string') return []

    const lines = csvData.trim().split('\n')
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const result = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const obj: Record<string, string> = {}

      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })

      result.push(obj)
    }

    return result
  }
}

let wasmInstance: WasmMock | null = null

// Инициализация (используем JavaScript заглушку)
async function initWasm(): Promise<WasmMock> {
  try {
    console.log('[worker] Initializing WASM mock...')
    return new WasmMock()
  } catch (error) {
    console.error('[worker] Failed to init WASM mock:', error)
    throw error
  }
}

// Инициализируем при загрузке worker
initWasm()
  .then(wasm => {
    wasmInstance = wasm
    console.log('[worker] WASM mock ready!')
    self.postMessage({ status: 'ready' } as WorkerResponse)
  })
  .catch(error => {
    console.error('[worker] Initialization failed:', error)
    self.postMessage({
      status: 'error',
      id: -1,
      error: `Init failed: ${error.message}`,
    } as WorkerResponse)
  })

// Обработчик сообщений
self.onmessage = async (event: MessageEvent<WorkerTask>) => {
  const { id, type, payload } = event.data

  console.log(`[worker] Processing task: ${type} (id: ${id})`)

  if (!wasmInstance) {
    self.postMessage({
      status: 'error',
      id,
      error: 'Worker not initialized',
    } as WorkerResponse)
    return
  }

  try {
    let result: unknown

    switch (type) {
      case 'deepEqual':
        result = wasmInstance.deep_equal(payload.a, payload.b)
        break

      case 'sortByKey':
        result = wasmInstance.sort_by_key(payload.data, payload.key)
        break

      case 'parseCsv':
        result = wasmInstance.parse_csv(payload.csvData)
        break

      default:
        throw new Error(`Unknown task type: ${type}`)
    }

    console.log(`[worker] Task ${type} completed successfully`)
    self.postMessage({
      status: 'success',
      id,
      data: result,
    } as WorkerResponse)
  } catch (error) {
    console.error(`[worker] Task ${type} failed:`, error)
    self.postMessage({
      status: 'error',
      id,
      error: String(error),
    } as WorkerResponse)
  }
}

console.log('[worker] === WORKER READY ===')

export {} // Делаем файл ES модулем
