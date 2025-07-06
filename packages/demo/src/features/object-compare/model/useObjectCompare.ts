import { useState, useCallback } from 'react'
import { useWasmWorker } from '~/shared/api'
import type { DeepEqualResult } from '~/shared/types'
import type { ComparisonResult, ComparisonState } from '~/entities/object-comparison'

export function useObjectCompare() {
  const [state, setState] = useState<ComparisonState>({
    result: null,
    isLoading: false,
    error: null,
  })

  const { execute, hasWorker } = useWasmWorker()

  const compareObjects = async (object1: string, object2: string) => {
    if (!hasWorker) return

    setState(prev => ({ ...prev, isLoading: true, result: null, error: null }))

    try {
      // Парсим JSON объекты
      const obj1 = JSON.parse(object1)
      const obj2 = JSON.parse(object2)

      const startTime = performance.now()
      const isEqual = (await execute('deepEqual', { a: obj1, b: obj2 })) as boolean
      const compareTime = performance.now() - startTime

      const result: ComparisonResult = { isEqual, compareTime }
      setState(prev => ({ ...prev, result, isLoading: false }))
    } catch (parseError) {
      const error =
        parseError instanceof SyntaxError
          ? '❌ Ошибка в JSON синтаксисе. Проверьте корректность данных.'
          : `❌ Ошибка сравнения: ${parseError}`

      setState(prev => ({ ...prev, error, isLoading: false }))
    }
  }

  const clearState = () => {
    setState({
      result: null,
      isLoading: false,
      error: null,
    })
  }

  return {
    ...state,
    compareObjects,
    clearState,
    hasWorker,
  }
}
