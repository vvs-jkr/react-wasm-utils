import { useCallback } from 'react'

/**
 * Хук для работы с загрузкой CSV файлов
 */
export function useFileUpload() {
  /**
   * Читает содержимое файла как текст
   */
  const readFileAsText = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = event => {
        const content = event.target?.result as string
        resolve(content)
      }

      reader.onerror = () => {
        reject(new Error('Ошибка чтения файла'))
      }

      reader.readAsText(file)
    })
  }, [])

  /**
   * Обрабатывает загрузку CSV файла
   */
  const handleFileUpload = useCallback(
    async (file: File, onSuccess: (content: string) => void, onError?: (error: string) => void) => {
      try {
        const content = await readFileAsText(file)
        onSuccess(content)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
        onError?.(errorMessage)
      }
    },
    [readFileAsText]
  )

  return {
    handleFileUpload,
    readFileAsText,
  }
}
