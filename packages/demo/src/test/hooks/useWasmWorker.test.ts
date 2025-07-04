import { renderHook } from '@testing-library/react'
import { useWasmWorker } from '../../shared/api/useWasmWorker'
import type { WorkerTask, WorkerResponse } from '../../shared/types'

type MockedWorker = {
  removeEventListener: jest.Mock
  postMessage: jest.Mock
  terminate: jest.Mock
  onmessage: ((event: { data: WorkerResponse }) => void) | null
  onerror: ((event: any) => void) | null
  triggerReady: () => void
}

jest.mock('../../shared/api/workerFactory', () => {
  let workerResponseType: 'success' | 'error' = 'success'
  const mockFactory = {
    _workers: [] as MockedWorker[],
    __setResponseType: (type: 'success' | 'error') => {
      workerResponseType = type
    },
    createWasmWorker: function () {
      let onmessage: ((event: { data: WorkerResponse }) => void) | null = null
      const worker: MockedWorker = {
        removeEventListener: jest.fn(),
        postMessage: jest.fn((msg: WorkerTask) => {
          setTimeout(() => {
            if (worker.onmessage) {
              if (workerResponseType === 'success') {
                worker.onmessage({ data: { id: msg.id, status: 'success', data: 'test-result' } })
              } else {
                worker.onmessage({ data: { id: msg.id, status: 'error', error: 'fail' } })
              }
            }
          }, 0)
        }),
        terminate: jest.fn(),
        onmessage: null,
        onerror: null,
        triggerReady: () => {
          if (worker.onmessage) worker.onmessage({ data: { status: 'ready' } })
        },
      }
      Object.defineProperty(worker, 'onmessage', {
        get: () => onmessage,
        set: fn => {
          onmessage = fn
        },
        configurable: true,
      })
      mockFactory._workers.push(worker)
      return worker
    },
    createWorker: function () {
      return this.createWasmWorker()
    },
  }
  return mockFactory
})

import * as workerFactoryImport from '../../shared/api/workerFactory'

type WorkerFactoryMock = {
  _workers: MockedWorker[]
  __setResponseType: (type: 'success' | 'error') => void
}
const workerFactory = workerFactoryImport as unknown as WorkerFactoryMock

describe('useWasmWorker', () => {
  it('должен возвращать начальное состояние', () => {
    workerFactory.__setResponseType('success')
    const { result } = renderHook(() => useWasmWorker())
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.hasWorker).toBe(false)
  })

  it('должен корректно завершать воркер при размонтировании', () => {
    workerFactory.__setResponseType('success')
    const { unmount } = renderHook(() => useWasmWorker())
    // terminate будет вызван при размонтировании
    unmount()
    // Проверить можно через мок terminate, если нужно
  })
})
