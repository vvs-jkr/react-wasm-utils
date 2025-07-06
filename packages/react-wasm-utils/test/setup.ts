import '@testing-library/jest-dom'

// Mock Worker для тестов
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = jest.fn()
  terminate = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn()

  constructor(_url: string | URL) {
    // Симулируем готовность воркера
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data: { status: 'ready' } } as MessageEvent)
      }
    }, 0)
  }
}

// Мокаем Worker глобально
global.Worker = MockWorker as any

// Мокаем URL для import.meta.url
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
global.URL.revokeObjectURL = jest.fn()

// Мокаем Blob
global.Blob = class MockBlob {
  size = 0
  type = ''
  constructor(_blobParts?: BlobPart[], options?: BlobPropertyBag) {
    this.type = options?.type || ''
  }
  stream = jest.fn()
  text = jest.fn()
  arrayBuffer = jest.fn()
  slice = jest.fn()
} as any
