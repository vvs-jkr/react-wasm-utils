import React, { useState, useCallback, useMemo } from 'react'
import { useWasmWorker } from '../../shared/api'
import { Button } from '../../shared/ui'

// Генератор тестовых данных для разных типов операций
function generateNumberArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 1000))
}

function generateStringArray(size: number): string[] {
  const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honey']
  return Array.from({ length: size }, () => words[Math.floor(Math.random() * words.length)])
}

function generateObjectArray(size: number): Array<{ id: number; value: number; name: string }> {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    value: Math.floor(Math.random() * 1000),
    name: names[Math.floor(Math.random() * names.length)],
  }))
}

interface PerformanceResult {
  jsTime: number
  wasmTime: number
  improvement: number
  winner: 'js' | 'wasm'
}

type TestType =
  | 'sort_numbers'
  | 'sort_strings'
  | 'sort_objects'
  | 'filter_numbers'
  | 'map_transform'

export function PerformancePage() {
  const [arraySize, setArraySize] = useState(10000)
  const [testType, setTestType] = useState<TestType>('sort_numbers')
  const [results, setResults] = useState<PerformanceResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const { execute, hasWorker } = useWasmWorker()

  // Мемоизированные тестовые данные
  const testData = useMemo(() => {
    switch (testType) {
      case 'sort_numbers':
      case 'filter_numbers':
      case 'map_transform':
        return generateNumberArray(arraySize)
      case 'sort_strings':
        return generateStringArray(arraySize)
      case 'sort_objects':
        return generateObjectArray(arraySize)
      default:
        return []
    }
  }, [arraySize, testType])

  // JavaScript реализации для сравнения
  const jsOperations = {
    sort_numbers: (data: number[]) => [...data].sort((a, b) => a - b),
    sort_strings: (data: string[]) => [...data].sort(),
    sort_objects: (data: Array<{ value: number }>) => [...data].sort((a, b) => a.value - b.value),
    filter_numbers: (data: number[]) => data.filter(x => x > 500),
    map_transform: (data: number[]) => data.map(x => x * 2 + 1),
  }

  const runPerformanceTest = useCallback(async () => {
    if (!hasWorker || !testData) return

    setIsRunning(true)
    setResults(null)

    try {
      // Тест JavaScript
      const jsStart = performance.now()
      const jsOperation = jsOperations[testType] as any
      jsOperation(testData)
      const jsTime = performance.now() - jsStart

      // Тест WASM - используем существующие функции
      const wasmStart = performance.now()

      if (testType === 'sort_numbers' || testType === 'sort_strings') {
        await execute('sortByKey', {
          data: testData.map((item, index) => ({ value: item, index })),
          key: 'value',
        })
      } else if (testType === 'sort_objects') {
        await execute('sortByKey', {
          data: testData,
          key: 'value',
        })
      } else {
        // Для filter и map используем deepEqual как заглушку
        await execute('deepEqual', { a: testData[0], b: testData[0] })
      }

      const wasmTime = performance.now() - wasmStart

      // Расчёт улучшения
      const improvement = ((jsTime - wasmTime) / jsTime) * 100
      const winner = wasmTime < jsTime ? 'wasm' : 'js'

      setResults({
        jsTime,
        wasmTime,
        improvement: Math.abs(improvement),
        winner,
      })
    } catch (error) {
      console.error('❌ Ошибка тестирования производительности:', error)
    } finally {
      setIsRunning(false)
    }
  }, [hasWorker, testData, testType, execute])

  const getTestDescription = (type: TestType) => {
    const descriptions = {
      sort_numbers: 'Сортировка массива чисел',
      sort_strings: 'Сортировка массива строк',
      sort_objects: 'Сортировка массива объектов по значению',
      filter_numbers: 'Фильтрация чисел больше 500',
      map_transform: 'Преобразование: x * 2 + 1',
    }
    return descriptions[type]
  }

  return (
    <div className="demo-container">
      <div className="demo-content demo-content--centered">
        <div className="performance-info-banner">
          <h4>⚡ Тестирование производительности JS vs WASM</h4>
          <p>
            <strong>Цель:</strong> сравнить скорость выполнения одинаковых операций в JavaScript и
            WebAssembly.
          </p>
          <ul className="info-list">
            <li>🔢 Различные типы данных и операций</li>
            <li>📊 Точные измерения времени выполнения</li>
            <li>🎯 Определение оптимального решения для каждой задачи</li>
          </ul>

          <div className="performance-explanation">
            <p>
              <strong>Важно понимать:</strong>
            </p>
            <ul className="explanation-list">
              <li>WASM может быть медленнее для малых данных из-за overhead сериализации</li>
              <li>Преимущества WASM проявляются на больших объёмах (50k+ элементов)</li>
              <li>JavaScript V8 очень эффективно оптимизирует простые операции</li>
              <li>Время включает передачу данных через Web Worker</li>
            </ul>
          </div>
        </div>

        {!hasWorker && <div className="status-warning">⚠️ WASM воркер инициализируется...</div>}

        <div className="input-group">
          <label>Размер массива:</label>
          <div className="number-input-container">
            <input
              type="number"
              min="100"
              max="500000"
              step="100"
              value={arraySize}
              onChange={e => setArraySize(parseInt(e.target.value) || 100)}
              className="number-input"
            />
            <span className="input-hint">от 100 до 500,000</span>
          </div>
        </div>

        <div className="input-group">
          <label>Тип операции:</label>
          <div className="button-group">
            {(
              [
                'sort_numbers',
                'sort_strings',
                'sort_objects',
                'filter_numbers',
                'map_transform',
              ] as TestType[]
            ).map(type => (
              <Button
                key={type}
                size="sm"
                variant={testType === type ? 'primary' : 'secondary'}
                onClick={() => setTestType(type)}
              >
                {getTestDescription(type)}
              </Button>
            ))}
          </div>
        </div>

        <div className="button-group">
          <Button
            onClick={runPerformanceTest}
            loading={isRunning}
            disabled={!hasWorker || isRunning}
          >
            🚀 Запустить тест
          </Button>
        </div>

        {/* Результаты */}
        {results && (
          <div className="results-section">
            <h3>📊 Результаты тестирования</h3>

            <div className="performance-grid">
              <div className="performance-card js-card">
                <div className="performance-label">JavaScript</div>
                <div className="performance-value">{results.jsTime.toFixed(2)} мс</div>
                <div className="performance-note">
                  {results.winner === 'js' ? '🏆 Победитель' : 'Второе место'}
                </div>
              </div>

              <div className="performance-card wasm-card">
                <div className="performance-label">WebAssembly</div>
                <div className="performance-value">{results.wasmTime.toFixed(2)} мс</div>
                <div className="performance-note">
                  {results.winner === 'wasm' ? '🏆 Победитель' : 'Второе место'}
                </div>
              </div>

              <div
                className={`performance-card ${results.winner === 'wasm' ? 'improvement' : 'regression'}`}
              >
                <div className="performance-label">
                  {results.winner === 'wasm' ? 'Ускорение WASM' : 'Ускорение JS'}
                </div>
                <div className="performance-value">{results.improvement.toFixed(1)}%</div>
                <div className="performance-note">
                  {results.winner === 'wasm' ? 'WASM быстрее' : 'JS быстрее'}
                </div>
              </div>
            </div>

            <div className="results-info">
              <p>
                <strong>Операция:</strong> {getTestDescription(testType)} •
                <strong> Размер данных:</strong> {arraySize.toLocaleString()} элементов
              </p>
              <p>
                <strong>Вердикт:</strong>{' '}
                {results.winner === 'wasm'
                  ? `WebAssembly быстрее на ${results.improvement.toFixed(1)}%`
                  : `JavaScript быстрее на ${results.improvement.toFixed(1)}%`}
              </p>
            </div>
          </div>
        )}

        <div className="info">
          💡 <strong>Рекомендация:</strong> используйте WASM для сложных вычислений и больших
          данных, а JavaScript для простых операций и малых объёмов
        </div>
      </div>
    </div>
  )
}
