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
import { useSortByKey } from '../../src/shared/lib/useSortByKey'

jest.mock('../../src/shared/api/useWorkerTask')
const mockedUseWorkerTask = useWorkerTask as jest.Mock

describe('useSortByKey', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call useWorkerTask with correct parameters', () => {
    const testData = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]
    const key = 'name'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    renderHook(() => useSortByKey(testData, key))

    expect(mockedUseWorkerTask).toHaveBeenCalledWith({
      type: 'sortByKey',
      payload: { data: testData, key },
    })
  })

  it('should return loading state initially', () => {
    const testData = [{ name: 'John', age: 30 }]
    const key = 'name'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    const { result } = renderHook(() => useSortByKey(testData, key))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should return sorted data when task completes successfully', () => {
    const testData = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]
    const key = 'name'
    const sortedData = [
      { name: 'Jane', age: 25 },
      { name: 'John', age: 30 },
    ]

    mockedUseWorkerTask.mockReturnValue({
      data: sortedData,
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useSortByKey(testData, key))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual(sortedData)
    expect(result.current.error).toBe(null)
  })

  it('should return error when task fails', () => {
    const testData = [{ name: 'John', age: 30 }]
    const key = 'name'
    const errorMessage = 'Sorting failed'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: errorMessage,
      isLoading: false,
    })

    const { result } = renderHook(() => useSortByKey(testData, key))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(errorMessage)
  })
})
