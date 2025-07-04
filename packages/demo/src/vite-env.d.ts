/// <reference types="vite/client" />

// Описываем точную структуру экспортируемых из WASM функций
interface WasmExports extends WebAssembly.Exports {
  sort_by_key: (data: any, key: string) => any;
  parse_csv: (csvData: string) => any;
  deep_equal: (a: any, b: any) => boolean;
  // Добавьте сюда любые другие функции, которые вы экспортируете из Rust
}

// Переопределяем стандартный модуль для .wasm?init
declare module '*.wasm?init' {
  // Теперь init возвращает Promise с нашим конкретным интерфейсом
  const init: () => Promise<WasmExports>;
  export default init;
}