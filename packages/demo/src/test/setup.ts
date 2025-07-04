import '@testing-library/jest-dom'

// Мокаем Worker API
global.Worker = class Worker {
  constructor(url: string | URL) {
    this.url = url
  }
  url: string | URL
  onmessage: ((ev: MessageEvent) => void) | null = null
  onerror: ((ev: ErrorEvent) => void) | null = null
  postMessage = jest.fn()
  terminate = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn()
}

// Мокаем File API
global.FileReader = class FileReader {
  result: string | ArrayBuffer | null = null
  error: DOMException | null = null
  readyState: number = 0
  onload: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onerror: ((ev: ProgressEvent<FileReader>) => void) | null = null
  onprogress: ((ev: ProgressEvent<FileReader>) => void) | null = null

  readAsText = jest.fn()
  readAsDataURL = jest.fn()
  abort = jest.fn()
  addEventListener = jest.fn()
  removeEventListener = jest.fn()
  dispatchEvent = jest.fn()
}

// Мокаем URL.createObjectURL
global.URL.createObjectURL = jest.fn()
global.URL.revokeObjectURL = jest.fn()

// Мокаем Blob
global.Blob = class Blob {
  constructor(blobParts?: BlobPart[], options?: BlobPropertyBag) {
    this.size = 0
    this.type = options?.type || ''
  }
  size: number
  type: string
  stream = jest.fn()
  text = jest.fn()
  arrayBuffer = jest.fn()
  slice = jest.fn()
}
