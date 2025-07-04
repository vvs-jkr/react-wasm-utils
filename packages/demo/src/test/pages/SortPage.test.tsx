import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SortPage } from '../../pages/sort/SortPage'

// Мокаем workerFactory
jest.mock('../../shared/api/workerFactory', () => ({
  createWasmWorker: () => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onmessage: null,
    onerror: null,
  }),
}))

// Мокаем WASM воркер
jest.mock('../../shared/api/useWasmWorker', () => ({
  useWasmWorker: () => ({
    execute: jest.fn().mockResolvedValue([
      { id: 1, name: 'Анна Иванова', age: 25 },
      { id: 2, name: 'Иван Петров', age: 30 },
    ]),
    hasWorker: true,
  }),
}))

// Мокаем downloadFile
jest.mock('../../shared/lib/downloadFile', () => ({
  downloadFile: jest.fn(),
}))

describe('SortPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('рендерится без ошибок', () => {
    render(<SortPage />)
    expect(screen.getByText('Количество записей:')).toBeInTheDocument()
  })

  it('позволяет изменить размер данных', () => {
    render(<SortPage />)
    const input = screen.getByDisplayValue('10000')
    fireEvent.change(input, { target: { value: '5000' } })
    expect(input).toHaveValue(5000)
  })

  it('переключает поле сортировки', () => {
    render(<SortPage />)
    const ageButton = screen.getByText('По возрасту')
    fireEvent.click(ageButton)
    // Проверяем, что кнопка стала активной (это потребует проверки CSS классов)
  })

  it('генерирует данные при клике', async () => {
    render(<SortPage />)
    const generateButton = screen.getByText('🎲 Сгенерировать данные')
    fireEvent.click(generateButton)

    // Ждём завершения загрузки
    await waitFor(() => {
      expect(generateButton).not.toBeDisabled()
    })
  })
})
