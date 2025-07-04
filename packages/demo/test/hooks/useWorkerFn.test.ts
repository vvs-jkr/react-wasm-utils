import { WorkerTask, WorkerResponse } from '../../src/shared/types'

jest.mock('../../src/shared/lib/workerFactory', () => {
  let onmessage: ((event: { data: WorkerResponse & { id: number } }) => void) | null = null
  return {
    createWorker: () => ({
      addEventListener: jest.fn(
        (event: string, cb: (event: { data: WorkerResponse & { id: number } }) => void) => {
          if (event === 'message') onmessage = cb
        }
      ),
      removeEventListener: jest.fn(),
      postMessage: jest.fn((msg: WorkerTask) => {
        setTimeout(() => {
          if (onmessage) {
            onmessage({ data: { id: msg.id, status: 'success', data: null } })
          }
        }, 0)
      }),
      terminate: jest.fn(),
    }),
    createWasmWorker: () => ({
      addEventListener: jest.fn(
        (event: string, cb: (event: { data: WorkerResponse & { id: number } }) => void) => {
          if (event === 'message') onmessage = cb
        }
      ),
      removeEventListener: jest.fn(),
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onmessage: null,
      onerror: null,
    }),
  }
})

import { renderHook, act, waitFor } from '@testing-library/react'
import { useWorkerFn } from '../../src/shared/api/useWorkerFn'

describe('useWorkerFn', () => {
  beforeEach(() => {
    // Worker уже замокан в setup.ts, просто очищаем вызовы
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useWorkerFn())
    const [state] = result.current

    expect(state.data).toBe(null)
    expect(state.error).toBe(null)
    expect(state.isLoading).toBe(false)
  })

  it('should set loading state when execute is called', async () => {
    const { result } = renderHook(() => useWorkerFn())
    const [, execute] = result.current

    act(() => {
      execute({
        type: 'deepEqual',
        payload: { a: 1, b: 1 },
      })
    })

    await waitFor(() => {
      const [state] = result.current
      expect(state.isLoading).toBe(true)
      expect(state.data).toBe(null)
      expect(state.error).toBe(null)
    })
  })

  it('should return stable execute function', () => {
    const { result, rerender } = renderHook(() => useWorkerFn())
    const [, execute1] = result.current

    rerender()
    const [, execute2] = result.current

    // execute функция должна быть стабильной благодаря useCallback
    expect(execute1).toBe(execute2)
  })
})
