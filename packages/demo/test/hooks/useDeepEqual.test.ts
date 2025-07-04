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
import { useDeepEqual } from '../../src/shared/lib/useDeepEqual'

jest.mock('../../src/shared/api/useWorkerTask')
const mockedUseWorkerTask = useWorkerTask as jest.Mock

describe('useDeepEqual', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call useWorkerTask with the correct parameters', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    renderHook(() => useDeepEqual(obj1, obj2))

    expect(mockedUseWorkerTask).toHaveBeenCalledWith({
      type: 'deepEqual',
      payload: { a: obj1, b: obj2 },
    })
  })

  it('should return loading state initially', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    const { result } = renderHook(() => useDeepEqual(obj1, obj2))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should return the result when task completes successfully', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }

    mockedUseWorkerTask.mockReturnValue({
      data: true,
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useDeepEqual(obj1, obj2))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('should return error when task fails', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 1 }
    const errorMessage = 'Test error'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: errorMessage,
      isLoading: false,
    })

    const { result } = renderHook(() => useDeepEqual(obj1, obj2))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(errorMessage)
  })
})
