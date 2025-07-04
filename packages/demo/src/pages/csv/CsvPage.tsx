import React, { useState, useMemo, useRef } from 'react'
import { useWasmWorker } from '../../shared/api'
import { Button } from '../../shared/ui'
import { downloadData } from '../../shared/lib'

// Примеры CSV данных
const SAMPLE_CSV = {
  simple: `id,name,age,city
1,Иван Петров,25,Москва
2,Анна Смирнова,30,СПб
3,Пётр Сидоров,35,Казань
4,Мария Иванова,28,Новосибирск`,

  complex: `product_id,name,category,price,quantity,supplier,last_updated
SKU001,Ноутбук Apple MacBook Pro,Электроника,180000.50,15,Apple Inc,2024-01-15
SKU002,Смартфон Samsung Galaxy S24,Электроника,89999.99,25,Samsung,2024-01-12
SKU003,Наушники Sony WH-1000XM5,Аудио,32000.00,8,Sony Corporation,2024-01-10
SKU004,Планшет iPad Air,Электроника,72000.00,12,Apple Inc,2024-01-08`,

  large: generateLargeCsv(),
}

function generateLargeCsv() {
  const categories = ['Электроника', 'Одежда', 'Книги', 'Дом и сад', 'Спорт']
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'HP', 'Dell']

  let csv = 'id,product,category,brand,price,stock,rating\n'

  for (let i = 1; i <= 1000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const price = (Math.random() * 50000 + 1000).toFixed(2)
    const stock = Math.floor(Math.random() * 100)
    const rating = (Math.random() * 2 + 3).toFixed(1) // 3.0 - 5.0

    csv += `${i},${brand} Product ${i},${category},${brand},${price},${stock},${rating}\n`
  }

  return csv
}

export function CsvPage() {
  const [csvInput, setCsvInput] = useState(SAMPLE_CSV.simple)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [parseTime, setParseTime] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { execute, hasWorker } = useWasmWorker()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Превью данных (первые 20 строк)
  const previewData = useMemo(() => parsedData.slice(0, 20), [parsedData])
  const headers = useMemo(() => {
    if (parsedData.length === 0) return []
    return Object.keys(parsedData[0])
  }, [parsedData])

  const loadSample = (sampleKey: keyof typeof SAMPLE_CSV) => {
    setCsvInput(SAMPLE_CSV[sampleKey])
    setParsedData([])
    setError(null)
    setParseTime(null)
  }

  const parseCsv = async () => {
    if (!hasWorker || !csvInput.trim()) return

    setIsLoading(true)
    setError(null)
    setParsedData([])

    try {
      const startTime = performance.now()
      const result = await execute('parseCsv', { csvData: csvInput })
      const parseTime = performance.now() - startTime

      if (Array.isArray(result)) {
        setParsedData(result)
        setParseTime(parseTime)
      } else {
        setError('❌ Ошибка парсинга CSV')
      }
    } catch (parseError) {
      setError(`❌ Ошибка обработки: ${parseError}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      setCsvInput(content)
      setParsedData([])
      setError(null)
      setParseTime(null)
    }
    reader.readAsText(file)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const clearInput = () => {
    setCsvInput('')
    setParsedData([])
    setError(null)
    setParseTime(null)
  }

  const handleDownload = () => {
    if (parsedData.length === 0) return
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadData(parsedData, `parsed_csv_${timestamp}.json`, 'json')
  }

  return (
    <div className="demo-container">
      <div className="demo-content demo-content--centered">
        {!hasWorker && <div className="status-warning">⚠️ WASM воркер инициализируется...</div>}

        {/* Примеры и загрузка файла */}
        <div className="input-group">
          <label>Загрузить пример или файл:</label>
          <div className="button-group">
            <Button size="sm" variant="secondary" onClick={() => loadSample('simple')}>
              📋 Простой CSV
            </Button>
            <Button size="sm" variant="secondary" onClick={() => loadSample('complex')}>
              🏢 Товары
            </Button>
            <Button size="sm" variant="secondary" onClick={() => loadSample('large')}>
              📊 Большой (1000 строк)
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Button size="sm" variant="secondary" onClick={triggerFileUpload}>
              📁 Загрузить файл
            </Button>
          </div>
        </div>

        {/* Поле ввода CSV */}
        <div className="input-group">
          <label>CSV данные:</label>
          <textarea
            value={csvInput}
            onChange={e => setCsvInput(e.target.value)}
            className="input-field"
            placeholder="id,name,age&#10;1,Иван,25&#10;2,Анна,30"
            rows={8}
          />
        </div>

        {/* Кнопки управления */}
        <div className="button-group">
          <Button onClick={parseCsv} loading={isLoading} disabled={!hasWorker || !csvInput.trim()}>
            📄 Парсить CSV
          </Button>
          <Button variant="secondary" onClick={clearInput}>
            🧹 Очистить
          </Button>
        </div>

        {/* Ошибки */}
        {error && (
          <div className="result error">
            <h4>Ошибка</h4>
            <p>{error}</p>
          </div>
        )}

        {/* Результаты */}
        {parsedData.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <div className="sort-indicator">
                Обработано: <strong>{parsedData.length.toLocaleString()}</strong> записей
                {parseTime && (
                  <span>
                    {' '}
                    • Время парсинга: <strong>{parseTime.toFixed(1)} мс</strong>
                  </span>
                )}
              </div>
              <div className="download-buttons">
                <Button size="sm" onClick={handleDownload}>
                  📥 JSON
                </Button>
              </div>
            </div>

            {/* Таблица результатов */}
            <div className="table-container">
              <div className="table-header">
                <span>📋 Результат парсинга (первые 20 записей)</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {headers.map((header, cellIndex) => (
                        <td key={cellIndex}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="info">
              💡 <strong>Применение:</strong> импорт данных, отчёты, интеграция с внешними системами
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
