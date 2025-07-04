jest.mock('../../src/shared/lib/workerFactory', () => ({
  createWorker: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    postMessage: jest.fn(),
    terminate: jest.fn(),
  }),
  createWasmWorker: () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    postMessage: jest.fn(),
    terminate: jest.fn(),
    onmessage: null,
    onerror: null,
  }),
}))

import { renderHook } from '@testing-library/react'
import { useWorkerTask } from '../../src/shared/api/useWorkerTask'

describe('useWorkerTask', () => {
  beforeEach(() => {
    // Worker уже замокан в setup.ts
  })

  it('should return initial loading state', () => {
    const { result } = renderHook(() =>
      useWorkerTask({
        type: 'deepEqual',
        payload: { a: 1, b: 1 },
      })
    )

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.isLoading).toBe(true)
  })

  it('should handle different task types', () => {
    const { result: result1 } = renderHook(() =>
      useWorkerTask({
        type: 'sortByKey',
        payload: { data: [{ name: 'John' }], key: 'name' },
      })
    )

    const { result: result2 } = renderHook(() =>
      useWorkerTask({
        type: 'parseCsv',
        payload: { csvData: 'name,age\nJohn,30' },
      })
    )

    const { result: result3 } = renderHook(() =>
      useWorkerTask({
        type: 'deepEqual',
        payload: { a: 1, b: 2 },
      })
    )

    // Все должны начинать с загрузки
    expect(result1.current.isLoading).toBe(true)
    expect(result2.current.isLoading).toBe(true)
    expect(result3.current.isLoading).toBe(true)
  })

  it('should handle task parameter changes', () => {
    const { result, rerender } = renderHook(
      (props: { type: 'deepEqual'; payload: { a: number; b: number } }) => useWorkerTask(props),
      {
        initialProps: {
          type: 'deepEqual',
          payload: { a: 1, b: 1 },
        },
      }
    )

    expect(result.current.isLoading).toBe(true)

    // Изменяем задачу
    rerender({
      type: 'deepEqual',
      payload: { a: 2, b: 2 },
    })

    // Должно снова быть в состоянии загрузки
    expect(result.current.isLoading).toBe(true)
  })
})
