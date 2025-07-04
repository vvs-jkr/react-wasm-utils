// Mock Worker для тестов
class MockWorker {
  onmessage = null
  postMessage = vi.fn()
  terminate = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  constructor() {
    // Автоматически регистрируем обработчики
    this.addEventListener = vi.fn()
    this.removeEventListener = vi.fn()
    this.postMessage = vi.fn()
  }
}
// Мокаем Worker глобально
Object.defineProperty(globalThis, 'Worker', {
  value: MockWorker,
  writable: true,
})
// Мокаем URL для import.meta.url
Object.defineProperty(globalThis, 'URL', {
  value: class MockURL {
    constructor(url) {
      return url
    }
  },
  writable: true,
})
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
// Очищаем DOM после каждого теста
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
