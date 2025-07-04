import React, { useState } from 'react'
import { useWasmWorker } from '../../shared/api'
import { Button } from '../../shared/ui'

// Примеры для демонстрации
const SAMPLE_OBJECTS = {
  simple: {
    obj1: JSON.stringify({ name: 'Иван', age: 25, city: 'Москва' }, null, 2),
    obj2: JSON.stringify({ name: 'Иван', age: 25, city: 'Москва' }, null, 2),
  },
  different: {
    obj1: JSON.stringify({ name: 'Иван', age: 25, city: 'Москва' }, null, 2),
    obj2: JSON.stringify({ name: 'Пётр', age: 30, city: 'СПб' }, null, 2),
  },
  complex: {
    obj1: JSON.stringify(
      {
        user: {
          profile: { name: 'Анна', settings: { theme: 'dark', lang: 'ru' } },
          data: [1, 2, { nested: true }],
        },
        timestamp: '2024-01-01',
      },
      null,
      2
    ),
    obj2: JSON.stringify(
      {
        user: {
          profile: { name: 'Анна', settings: { theme: 'light', lang: 'ru' } },
          data: [1, 2, { nested: true }],
        },
        timestamp: '2024-01-01',
      },
      null,
      2
    ),
  },
}

export function ComparePage() {
  const [object1, setObject1] = useState(SAMPLE_OBJECTS.simple.obj1)
  const [object2, setObject2] = useState(SAMPLE_OBJECTS.simple.obj2)
  const [comparisonResult, setComparisonResult] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [compareTime, setCompareTime] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { execute, hasWorker } = useWasmWorker()

  const loadSample = (sampleKey: keyof typeof SAMPLE_OBJECTS) => {
    const sample = SAMPLE_OBJECTS[sampleKey]
    setObject1(sample.obj1)
    setObject2(sample.obj2)
    setComparisonResult(null)
    setError(null)
    setCompareTime(null)
  }

  const compareObjects = async () => {
    if (!hasWorker) return

    setIsLoading(true)
    setComparisonResult(null)
    setError(null)

    try {
      // Парсим JSON объекты
      const obj1 = JSON.parse(object1)
      const obj2 = JSON.parse(object2)

      const startTime = performance.now()
      const result = await execute('deepEqual', { a: obj1, b: obj2 })
      const compareTime = performance.now() - startTime

      setComparisonResult(result as boolean)
      setCompareTime(compareTime)
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        setError('❌ Ошибка в JSON синтаксисе. Проверьте корректность данных.')
      } else {
        setError(`❌ Ошибка сравнения: ${parseError}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearInputs = () => {
    setObject1('')
    setObject2('')
    setComparisonResult(null)
    setError(null)
    setCompareTime(null)
  }

  const formatJson = (input: string, setter: (value: string) => void) => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setter(formatted)
      setError(null)
    } catch (e) {
      setError('❌ Неверный JSON формат')
    }
  }

  return (
    <div className="demo-container">
      <div className="demo-content demo-content--compare">
        {!hasWorker && <div className="status-warning">⚠️ WASM воркер инициализируется...</div>}

        {/* Примеры */}
        <div className="input-group">
          <label>Загрузить пример:</label>
          <div className="button-group">
            <Button size="sm" variant="secondary" onClick={() => loadSample('simple')}>
              🟢 Одинаковые
            </Button>
            <Button size="sm" variant="secondary" onClick={() => loadSample('different')}>
              🔴 Разные
            </Button>
            <Button size="sm" variant="secondary" onClick={() => loadSample('complex')}>
              🔄 Сложные
            </Button>
          </div>
        </div>

        {/* Поля ввода */}
        <div className="compare-inputs">
          <div className="input-section">
            <label>Объект 1 (JSON):</label>
            <textarea
              value={object1}
              onChange={e => setObject1(e.target.value)}
              className="input-field"
              placeholder='{ "name": "Пример", "value": 123 }'
              rows={12}
            />
            <Button size="sm" variant="secondary" onClick={() => formatJson(object1, setObject1)}>
              🎨 Форматировать
            </Button>
          </div>

          <div className="input-section">
            <label>Объект 2 (JSON):</label>
            <textarea
              value={object2}
              onChange={e => setObject2(e.target.value)}
              className="input-field"
              placeholder='{ "name": "Пример", "value": 123 }'
              rows={12}
            />
            <Button size="sm" variant="secondary" onClick={() => formatJson(object2, setObject2)}>
              🎨 Форматировать
            </Button>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="button-group">
          <Button
            onClick={compareObjects}
            loading={isLoading}
            disabled={!hasWorker || !object1.trim() || !object2.trim()}
          >
            🔍 Сравнить объекты
          </Button>
          <Button variant="secondary" onClick={clearInputs}>
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

        {/* Результат сравнения */}
        {comparisonResult !== null && !error && (
          <div className="results-section">
            <div className="comparison-result">
              {comparisonResult ? (
                <span style={{ color: '#4caf50' }}>✅ Объекты идентичны</span>
              ) : (
                <span style={{ color: '#f44336' }}>❌ Объекты различаются</span>
              )}
              {compareTime && (
                <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '0.5rem' }}>
                  Время сравнения: <strong>{compareTime.toFixed(2)} мс</strong>
                </div>
              )}
            </div>

            <div className="info">
              💡 <strong>Применение:</strong> валидация данных, тестирование, синхронизация
              состояний
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
