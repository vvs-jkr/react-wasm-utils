import { useState, useEffect } from 'react'

// Определяем тип для нашего WASM-модуля, чтобы TypeScript нам помогал
export type WasmModule = {
  deep_equal: (a: unknown, b: unknown) => boolean
  // Здесь мы будем добавлять другие функции, когда реализуем их
  // sort_by_key: (...) => ...
}

export function useWasm() {
  const [wasm, setWasm] = useState<WasmModule | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // Та же самая логика загрузки, что и в App.tsx
        const module = await import('../../wasm-lib/pkg/wasm_lib.js')
        setWasm(module)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    loadWasm()
  }, [])

  return { wasm, error, isLoading }
}
