import React, { useState } from 'react'
import { Button } from '~/shared/ui'
import { SAMPLE_OBJECTS } from '~/entities/object-comparison'
import { useObjectCompare, SampleButtons, ComparisonResult } from '~/features/object-compare'
import { JsonInput } from './JsonInput'

export function CompareForm() {
  const [object1, setObject1] = useState(SAMPLE_OBJECTS.nested.obj1)
  const [object2, setObject2] = useState(SAMPLE_OBJECTS.nested.obj2)

  const { result, isLoading, error, compareObjects, clearState, hasWorker } = useObjectCompare()

  const handleSampleSelect = (obj1: string, obj2: string) => {
    setObject1(obj1)
    setObject2(obj2)
    clearState()
  }

  const handleFile1Load = (content: string) => {
    setObject1(content)
    clearState()
  }

  const handleFile2Load = (content: string) => {
    setObject2(content)
    clearState()
  }

  const handleCompare = () => {
    compareObjects(object1, object2)
  }

  const handleClear = () => {
    setObject1('')
    setObject2('')
    clearState()
  }

  const handleError = (errorMessage: string) => {
    // В данном случае ошибка обрабатывается в useObjectCompare
    console.warn(errorMessage)
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  }

  const warningStyle = {
    background: 'rgba(255, 193, 7, 0.1)',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    color: '#ffc107',
  }

  const inputsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  }

  const buttonsStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  }

  const errorStyle = {
    background: 'rgba(220, 53, 69, 0.1)',
    border: '1px solid #dc3545',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    color: '#dc3545',
  }

  return (
    <div style={containerStyle}>
      {!hasWorker && <div style={warningStyle}>⚠️ WASM воркер инициализируется...</div>}

      <SampleButtons
        onSampleSelect={handleSampleSelect}
        onFile1Load={handleFile1Load}
        onFile2Load={handleFile2Load}
      />

      {/* Поля ввода */}
      <div style={inputsStyle}>
        <JsonInput
          label="Объект 1 (JSON)"
          value={object1}
          onChange={setObject1}
          onError={handleError}
        />
        <JsonInput
          label="Объект 2 (JSON)"
          value={object2}
          onChange={setObject2}
          onError={handleError}
        />
      </div>

      {/* Кнопки управления */}
      <div style={buttonsStyle}>
        <Button
          onClick={handleCompare}
          loading={isLoading}
          disabled={!hasWorker || !object1.trim() || !object2.trim()}
        >
          🔍 Сравнить объекты
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          🧹 Очистить
        </Button>
      </div>

      {/* Ошибки */}
      {error && (
        <div style={errorStyle}>
          <h4 style={{ margin: '0 0 8px 0' }}>Ошибка</h4>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Результат сравнения */}
      {result && !error && <ComparisonResult result={result} />}
    </div>
  )
}
