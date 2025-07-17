# 🚀 React WASM Utils

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvvs-jkr%2Freact-wasm-utils)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

**Высокопроизводительные утилиты для React, написанные на Rust и скомпилированные в WebAssembly**

[🎯 Демо](https://react-wasm-utils.vercel.app/) • [📚 Документация](#-api-reference) • [🔧 Установка](#-installation)

</div>

---

## 🌟 Особенности

- **🔥 Высокая производительность** — Rust + WebAssembly для критически важных операций
- **📊 CSV парсинг** — быстрый и надёжный парсинг CSV файлов
- **🔍 Сравнение объектов** — глубокое сравнение JavaScript объектов
- **⚡ Сортировка массивов** — оптимизированная сортировка больших массивов
- **📱 TypeScript поддержка** — полная типизация из коробки
- **🎨 React интеграция** — готовые хуки и компоненты
- **🌐 Совместимость** — работает во всех современных браузерах

## 🎯 Демо

Попробуйте библиотеку в действии: **[react-wasm-utils.vercel.app](https://react-wasm-utils.vercel.app/)**

## 📦 Установка

```bash
yarn add react-wasm-utils
# или
npm install react-wasm-utils
```

### Требования

- React 18.2.0+
- Современный браузер с поддержкой WebAssembly
- TypeScript 5.0+ (опционально)

## 🚀 Быстрый старт

```typescript
import { loadWasm, parseCsv, deepEqual, sortByKey } from 'react-wasm-utils'

// Инициализация WASM модуля
await loadWasm()

// Парсинг CSV
const csvData = 'name,age,city\nJohn,25,NYC\nJane,30,LA'
const parsed = await parseCsv(csvData)
console.log(parsed)
// [{ name: "John", age: "25", city: "NYC" }, ...]

// Сравнение объектов
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = { a: 1, b: { c: 2 } }
console.log(await deepEqual(obj1, obj2)) // true

// Сортировка массивов
const data = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
]
const sorted = await sortByKey(data, 'age')
console.log(sorted) // Отсортировано по возрасту
```

## 📚 API Reference

### `loadWasm(): Promise<void>`

Инициализирует WebAssembly модуль. Должна быть вызвана перед использованием других функций.

### `parseCsv(csvData: string): Promise<Array<Record<string, any>>>`

Парсит CSV строку в массив объектов.

### `deepEqual(obj1: any, obj2: any): Promise<boolean>`

Выполняет глубокое сравнение двух объектов.

### `sortByKey(array: Array<any>, key: string): Promise<Array<any>>`

Сортирует массив объектов по указанному ключу.

## 🏗️ Архитектура проекта

```
react-wasm-utils/
├── packages/
│   ├── react-wasm-utils/     # 📦 Основная библиотека
│   │   ├── src/             # TypeScript код
│   │   ├── wasm-lib/        # Rust код
│   │   │   ├── src/
│   │   │   │   ├── lib.rs   # Основные функции
│   │   │   │   ├── data.rs  # CSV парсинг
│   │   │   │   └── utils.rs # Утилиты
│   │   │   └── Cargo.toml
│   │   └── dist/            # Скомпилированные файлы
│   └── demo/                # 🎨 Demo приложение
│       ├── src/
│       └── dist/
├── README.md
└── package.json
```

## 🔧 Разработка

### Предварительные требования

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) 1.70+
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Yarn](https://yarnpkg.com/)

### Локальная разработка

```bash
git clone https://github.com/vvs-jkr/react-wasm-utils.git
cd react-wasm-utils
yarn install
cd packages/react-wasm-utils/wasm-lib
wasm-pack build --target web --out-dir pkg
cd ../../..
yarn build:lib
yarn dev:demo
```

### Доступные команды

```bash
# Сборка всего проекта
yarn build
# Сборка только библиотеки
yarn build:lib
# Сборка только demo
yarn build:demo
# Запуск demo в режиме разработки
yarn dev:demo
# Тестирование
yarn test
# Линтинг
yarn lint
# Форматирование кода
yarn format
```

## 🧪 Тестирование

```bash
yarn test
yarn workspace react-wasm-utils test
yarn workspace demo test
```

## 📊 Производительность

| Операция                    | JavaScript | WASM | Ускорение |
| --------------------------- | ---------- | ---- | --------- |
| CSV парсинг (10MB)          | 2.3s       | 0.8s | **2.9x**  |
| Сортировка (100k элементов) | 1.2s       | 0.4s | **3x**    |
| Глубокое сравнение          | 0.5s       | 0.2s | **2.5x**  |

_Тесты проводились на Chrome 120, MacBook Pro M1_

## 🌐 Совместимость браузеров

| Browser | Version |
| ------- | ------- |
| Chrome  | 57+     |
| Firefox | 53+     |
| Safari  | 11+     |
| Edge    | 16+     |

## 📄 Лицензия

Этот проект лицензирован под MIT License — смотрите [LICENSE](LICENSE) файл для деталей.
