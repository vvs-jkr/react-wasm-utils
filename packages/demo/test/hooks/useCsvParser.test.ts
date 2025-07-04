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
import { useCsvParser } from '../../src/shared/lib/useCsvParser'

jest.mock('../../src/shared/api/useWorkerTask')
const mockedUseWorkerTask = useWorkerTask as jest.Mock

describe('useCsvParser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call useWorkerTask with correct parameters', () => {
    const csvData = 'name,age\nJohn,30\nJane,25'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    renderHook(() => useCsvParser(csvData))

    expect(mockedUseWorkerTask).toHaveBeenCalledWith({
      type: 'parseCsv',
      payload: { csvData },
    })
  })

  it('should return loading state initially', () => {
    const csvData = 'name,age\nJohn,30'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    const { result } = renderHook(() => useCsvParser(csvData))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should return parsed data when task completes successfully', () => {
    const csvData = 'name,age\nJohn,30\nJane,25'
    const parsedData = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]

    mockedUseWorkerTask.mockReturnValue({
      data: parsedData,
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useCsvParser(csvData))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual(parsedData)
    expect(result.current.error).toBe(null)
  })

  it('should return error when task fails', () => {
    const csvData = 'invalid,csv,data'
    const errorMessage = 'CSV parsing failed'

    mockedUseWorkerTask.mockReturnValue({
      data: null,
      error: errorMessage,
      isLoading: false,
    })

    const { result } = renderHook(() => useCsvParser(csvData))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(errorMessage)
  })
})
