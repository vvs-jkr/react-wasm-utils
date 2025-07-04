# react-wasm-utils

Набор чистых функций и утилит для ускорения вычислений с помощью Rust и WebAssembly.

## Возможности

- Быстрые вычисления на Rust через WASM
- Преобразование Map в объект (`mapToObject`)
- Загрузка WASM-модуля (`loadWasm`)
- Типы для интеграции с воркерами и WASM

## Установка

```bash
npm install react-wasm-utils
```

## Экспортируется из пакета

- `mapToObject`
- `loadWasm`
- Типы: `GenericObject`, `WorkerTask`, `WorkerResponse`, `WasmModule`

## Пример использования

```ts
import { mapToObject, loadWasm } from 'react-wasm-utils'

const map = new Map([
  ['a', 1],
  ['b', 2],
])
const obj = mapToObject(map) // { a: 1, b: 2 }
```

> Advanced-хуки и воркеры доступны только в demo-проекте (не входят в npm-пакет).
