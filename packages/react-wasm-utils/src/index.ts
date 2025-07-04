// Экспортируем полезные утилиты
export { mapToObject } from './lib/mapToObject'
export { loadWasm } from './lib/wasm-loader'

// Экспортируем типы, которые могут быть полезны пользователям
export type { WorkerTask, WorkerResponse, GenericObject } from './types.js'
