/// <reference types="vite/client" />

declare global {
  const __webpack_public_path__: string
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css' {
  const css: string
  export default css
}

// WebAssembly module types
declare module '*.wasm' {
  const wasmModule: WebAssembly.Module
  export default wasmModule
}

// Worker types
declare module '*?worker' {
  const WorkerFactory: new () => Worker
  export default WorkerFactory
}

// Image assets
declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

export {}

// Описываем точную структуру экспортируемых из WASM функций
interface WasmExports extends WebAssembly.Exports {
  sort_by_key: (data: any, key: string) => any
  parse_csv: (csvData: string) => any
  deep_equal: (a: any, b: any) => boolean
  // Добавьте сюда любые другие функции, которые вы экспортируете из Rust
}

// Переопределяем стандартный модуль для .wasm?init
declare module '*.wasm?init' {
  // Теперь init возвращает Promise с нашим конкретным интерфейсом
  const init: () => Promise<WasmExports>
  export default init
}

// Vite HMR types
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
