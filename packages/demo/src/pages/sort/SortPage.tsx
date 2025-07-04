import React, { useState, useMemo } from 'react'
import { useWasmWorker } from '../../shared/api'
import { Button } from '../../shared/ui'
import { downloadData } from '../../shared/lib'

// Генератор тестовых данных
function generateTestData(count: number) {
  const firstNames = [
    'Анна',
    'Иван',
    'Мария',
    'Петр',
    'Елена',
    'Алексей',
    'Ольга',
    'Дмитрий',
    'Светлана',
    'Николай',
  ]
  const lastNames = [
    'Иванов',
    'Петров',
    'Сидоров',
    'Козлов',
    'Новиков',
    'Морозов',
    'Петров',
    'Волков',
    'Соловьев',
    'Васильев',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    age: Math.floor(Math.random() * 50) + 18,
  }))
}

export function SortPage() {
  const [dataSize, setDataSize] = useState(10000)
  const [testData, setTestData] = useState<any[]>([])
  const [sortedData, setSortedData] = useState<any[]>([])
  const [sortField, setSortField] = useState<'name' | 'age'>('name')
  const [isLoading, setIsLoading] = useState(false)
  const [sortTime, setSortTime] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [error, setError] = useState<string | null>(null)
  const [sortMethod, setSortMethod] = useState<'WASM' | 'JavaScript' | null>(null)
  const [generationProgress, setGenerationProgress] = useState<number | null>(null)
  const { execute, hasWorker } = useWasmWorker()

  // Константы безопасности
  const MAX_SAFE_SIZE = 500_000
  const EXTREME_SIZE_WARNING = 1_000_000
  const GENERATION_CHUNK_SIZE = 10_000

  // Пагинация данных для отображения
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, rowsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / rowsPerPage)
  }, [sortedData.length, rowsPerPage])

  // Безопасная генерация данных с прогрессом
  const generateData = async () => {
    // Проверка на экстремальные значения
    if (dataSize > EXTREME_SIZE_WARNING) {
      const confirmed = window.confirm(
        `⚠️ ПРЕДУПРЕЖДЕНИЕ!\n\nВы пытаетесь создать ${dataSize.toLocaleString()} записей.\n` +
          `Это может привести к:\n` +
          `• Зависанию браузера на 10+ секунд\n` +
          `• Потреблению >500MB памяти\n` +
          `• Возможному краху страницы\n\n` +
          `Рекомендуется использовать до ${MAX_SAFE_SIZE.toLocaleString()} записей.\n\n` +
          `Продолжить на свой риск?`
      )
      if (!confirmed) return
    }

    setIsLoading(true)
    setSortedData([])
    setSortTime(null)
    setSortMethod(null)
    setCurrentPage(1)
    setError(null)
    setGenerationProgress(0)

    try {
      // Для больших массивов используем chunked generation
      if (dataSize > GENERATION_CHUNK_SIZE) {
        const data = await generateDataChunked(dataSize)
        setTestData(data)
        setSortedData(data)
      } else {
        // Обычная генерация для маленьких массивов
        const data = generateTestData(dataSize)
        setTestData(data)
        setSortedData(data)
      }
    } catch (error) {
      console.error('❌ Ошибка генерации данных:', error)
      setError(`Ошибка генерации: ${String(error)}`)
    } finally {
      setIsLoading(false)
      setGenerationProgress(null)
    }
  }

  // Chunked генерация для больших массивов
  const generateDataChunked = async (count: number): Promise<any[]> => {
    const chunks = Math.ceil(count / GENERATION_CHUNK_SIZE)
    const result: any[] = []

    console.log(
      `🔄 Генерация ${count.toLocaleString()} записей по ${GENERATION_CHUNK_SIZE.toLocaleString()} за раз...`
    )

    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startIndex = chunkIndex * GENERATION_CHUNK_SIZE
      const endIndex = Math.min(startIndex + GENERATION_CHUNK_SIZE, count)
      const chunkSize = endIndex - startIndex

      // Генерируем chunk
      const chunkData = generateTestData(chunkSize)

      // Корректируем ID для continuity
      chunkData.forEach((item, index) => {
        item.id = startIndex + index + 1
      })

      result.push(...chunkData)

      // Обновляем прогресс
      const progress = Math.round(((chunkIndex + 1) / chunks) * 100)
      setGenerationProgress(progress)

      console.log(
        `📊 Сгенерировано: ${result.length.toLocaleString()}/${count.toLocaleString()} (${progress}%)`
      )

      // Даем браузеру возможность обновить UI
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    console.log(`✅ Генерация завершена: ${result.length.toLocaleString()} записей`)
    return result
  }

  const sortData = async () => {
    if (testData.length === 0) return

    // Дополнительная проверка перед сортировкой
    if (testData.length > EXTREME_SIZE_WARNING) {
      const confirmed = window.confirm(
        `⚠️ ЭКСТРЕМАЛЬНАЯ СОРТИРОВКА!\n\n` +
          `Сортировка ${testData.length.toLocaleString()} записей может занять несколько минут.\n` +
          `Браузер может показаться зависшим.\n\n` +
          `Продолжить?`
      )
      if (!confirmed) return
    }

    setIsLoading(true)
    setCurrentPage(1)
    setError(null)
    setSortMethod(null)
    const startTime = performance.now()

    try {
      let result: any[]

      // Используем WASM если доступен, иначе JavaScript fallback
      if (hasWorker) {
        console.log(`[Sort] 🦀 Используем WASM для ${testData.length} записей`)
        setSortMethod('WASM')

        try {
          result = await execute('sortByKey', {
            data: testData,
            key: sortField === 'name' ? 'name' : 'age',
          })
        } catch (wasmError) {
          console.warn(`[Sort] WASM ошибка: ${String(wasmError)}, переключаемся на JavaScript`)
          setSortMethod('JavaScript')

          // Fallback на JavaScript при ошибке WASM
          result = [...testData].sort((a: any, b: any) => {
            const valueA = a?.[sortField]
            const valueB = b?.[sortField]

            if (typeof valueA === 'string' && typeof valueB === 'string') {
              return valueA.localeCompare(valueB)
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
              return valueA - valueB
            }

            return String(valueA).localeCompare(String(valueB))
          })
        }
      } else {
        console.log(
          `[Sort] ⚡ Используем JavaScript для ${testData.length} записей (WASM недоступен)`
        )
        setSortMethod('JavaScript')

        // JavaScript сортировка
        result = [...testData].sort((a: any, b: any) => {
          const valueA = a?.[sortField]
          const valueB = b?.[sortField]

          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueA.localeCompare(valueB)
          }

          if (typeof valueA === 'number' && typeof valueB === 'number') {
            return valueA - valueB
          }

          return String(valueA).localeCompare(String(valueB))
        })
      }

      if (Array.isArray(result)) {
        setSortedData(result)
        setSortTime(performance.now() - startTime)
      } else {
        throw new Error('Результат сортировки не является массивом')
      }
    } catch (error) {
      console.error('❌ Ошибка сортировки:', error)
      setError(`Ошибка сортировки: ${String(error)}`)
      setSortMethod(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (sortedData.length === 0) return
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadData(sortedData, `sorted_data_${sortField}_${timestamp}.json`, 'json')
  }

  const handleDownloadCsv = () => {
    if (sortedData.length === 0) return
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadData(sortedData, `sorted_data_${sortField}_${timestamp}.csv`, 'csv')
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const changeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }

  // Определяем какой метод будет использован
  const expectedMethod = hasWorker ? 'WASM' : 'JavaScript'
  const isLargeDataset = testData.length > 100_000

  return (
    <div className="demo-container">
      <div className="demo-content demo-content--centered">
        {!hasWorker && <div className="status-warning">⚠️ WASM воркер инициализируется...</div>}

        <div className="input-group">
          <label>Количество записей:</label>
          <div className="number-input-container">
            <input
              type="number"
              min="100"
              max="5000000"
              step="100"
              value={dataSize}
              onChange={e => setDataSize(parseInt(e.target.value) || 100)}
              className="number-input"
            />
            <span className="input-hint">от 100 до 5,000,000 (рекомендуется до 500,000)</span>
          </div>
        </div>

        <div className="input-group">
          <label>Поле для сортировки:</label>
          <div className="button-group">
            <Button
              variant={sortField === 'name' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortField('name')}
            >
              По имени
            </Button>
            <Button
              variant={sortField === 'age' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortField('age')}
            >
              По возрасту
            </Button>
          </div>
        </div>

        <div className="button-group">
          <Button onClick={generateData} loading={isLoading} disabled={isLoading}>
            🎲 Сгенерировать данные
          </Button>
          <Button onClick={sortData} loading={isLoading} disabled={testData.length === 0}>
            📊 Сортировать ({expectedMethod})
          </Button>
        </div>

        {/* Индикатор прогресса генерации */}
        {generationProgress !== null && (
          <div className="progress-container">
            <div className="progress-info">
              <span>Генерация данных...</span>
              <span>{generationProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${generationProgress}%` }} />
            </div>
          </div>
        )}

        {/* Предупреждение о размере массива */}
        {dataSize > MAX_SAFE_SIZE && (
          <div className="result warning">
            <h4>⚠️ Экстремальный размер данных</h4>
            <p>
              Вы указали {dataSize.toLocaleString()} записей (больше рекомендуемого лимита{' '}
              {MAX_SAFE_SIZE.toLocaleString()}). Это может привести к медленной работе браузера,
              высокому потреблению памяти и возможным ошибкам.
            </p>
            <p>
              <strong>Рекомендации:</strong>
              <br />• Для тестирования используйте до {MAX_SAFE_SIZE.toLocaleString()} записей
              <br />• Для реальных данных рассмотрите серверную обработку
              <br />• При генерации &gt;1M записей будет показано дополнительное предупреждение
            </p>
          </div>
        )}

        {/* Информация о методе для больших массивов */}
        {testData.length > 0 && (
          <div className={`result ${isLargeDataset ? 'success' : 'info'}`}>
            <h4>
              {isLargeDataset
                ? '🚀 Большой массив - потоковая WASM сортировка'
                : `📊 Стандартная ${expectedMethod} сортировка`}
            </h4>
            <p>
              {isLargeDataset ? (
                <>
                  Для массивов больше 100,000 записей используется оптимизированная потоковая
                  сортировка WASM с минимальным потреблением памяти.
                </>
              ) : (
                <>
                  Массив {testData.length.toLocaleString()} записей будет отсортирован через{' '}
                  {expectedMethod}.
                </>
              )}
            </p>
          </div>
        )}

        {/* Ошибки */}
        {error && (
          <div className="result error">
            <h4>❌ Ошибка</h4>
            <p>{error}</p>
          </div>
        )}

        {sortedData.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <div className="sort-indicator">
                📊 Отсортировано по <strong>{sortField === 'name' ? 'имени' : 'возрасту'}</strong>:{' '}
                <strong>{sortedData.length.toLocaleString()}</strong> записей всего
                {sortMethod && <span className="method-info"> • {sortMethod}</span>}
                {sortTime && (
                  <span>
                    {' '}
                    • Время сортировки: <strong>{sortTime.toFixed(1)} мс</strong>
                  </span>
                )}
              </div>
              <div className="download-buttons">
                <Button size="sm" onClick={handleDownload}>
                  📥 JSON ({sortedData.length.toLocaleString()})
                </Button>
                <Button size="sm" onClick={handleDownloadCsv}>
                  📥 CSV ({sortedData.length.toLocaleString()})
                </Button>
              </div>
            </div>

            {/* Настройки просмотра */}
            <div className="pagination-controls">
              <div className="rows-per-page">
                <label>Показать записей:</label>
                <select
                  value={rowsPerPage}
                  onChange={e => changeRowsPerPage(parseInt(e.target.value))}
                  className="pagination-select"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="pagination-info">
                Показано {(currentPage - 1) * rowsPerPage + 1}-
                {Math.min(currentPage * rowsPerPage, sortedData.length)} из{' '}
                {sortedData.length.toLocaleString()}
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <span>
                  📋 Отсортированные данные (страница {currentPage} из {totalPages})
                </span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th className={sortField === 'name' ? 'sorted-column' : ''}>Имя</th>
                    <th className={sortField === 'age' ? 'sorted-column' : ''}>Возраст</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td className={sortField === 'name' ? 'sorted-column' : ''}>{item.name}</td>
                      <td className={sortField === 'age' ? 'sorted-column' : ''}>{item.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="pagination">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Назад
                </Button>

                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? 'primary' : 'secondary'}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span>...</span>
                      <Button
                        size="sm"
                        variant={currentPage === totalPages ? 'primary' : 'secondary'}
                        onClick={() => goToPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Вперед →
                </Button>
              </div>
            )}

            <div className="info">
              💡 <strong>Применение:</strong> сортировка больших таблиц, поиск данных, отчёты.
              Сортировка выполняется для всех {sortedData.length.toLocaleString()} записей,
              отображается по страницам для удобства.
              {isLargeDataset && (
                <span>
                  {' '}
                  Потоковая WASM сортировка обрабатывает массивы до 500k записей с минимальным
                  потреблением памяти.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
