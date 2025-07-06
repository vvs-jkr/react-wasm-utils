import React, { useRef } from 'react'
import { Button } from '~/shared/ui'
import { SAMPLE_OBJECTS } from '~/entities/object-comparison'
import type { SampleType } from '~/entities/object-comparison'

interface SampleButtonsProps {
  onSampleSelect: (obj1: string, obj2: string) => void
  onFile1Load: (content: string) => void
  onFile2Load: (content: string) => void
}

export function SampleButtons({ onSampleSelect, onFile1Load, onFile2Load }: SampleButtonsProps) {
  const file1InputRef = useRef<HTMLInputElement>(null)
  const file2InputRef = useRef<HTMLInputElement>(null)

  const handleSampleLoad = (sampleKey: SampleType) => {
    const sample = SAMPLE_OBJECTS[sampleKey]
    onSampleSelect(sample.obj1, sample.obj2)
  }

  const handleFile1Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result as string
        try {
          // Проверяем валидность JSON и форматируем
          const parsed = JSON.parse(content)
          const formatted = JSON.stringify(parsed, null, 2)
          onFile1Load(formatted)
        } catch (error) {
          alert('Ошибка: Файл не является валидным JSON')
        }
      }
      reader.readAsText(file)
    } else {
      alert('Пожалуйста, выберите JSON файл')
    }
    // Сбрасываем input для возможности загрузить тот же файл снова
    event.target.value = ''
  }

  const handleFile2Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result as string
        try {
          // Проверяем валидность JSON и форматируем
          const parsed = JSON.parse(content)
          const formatted = JSON.stringify(parsed, null, 2)
          onFile2Load(formatted)
        } catch (error) {
          alert('Ошибка: Файл не является валидным JSON')
        }
      }
      reader.readAsText(file)
    } else {
      alert('Пожалуйста, выберите JSON файл')
    }
    // Сбрасываем input для возможности загрузить тот же файл снова
    event.target.value = ''
  }

  return (
    <div className="input-group">
      <label>Загрузить пример или файлы:</label>
      <div className="button-group">
        <Button size="sm" variant="secondary" onClick={() => handleSampleLoad('nested')}>
          🔄 Сгенерировать JSON
        </Button>

        <input
          ref={file1InputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFile1Upload}
          style={{ display: 'none' }}
        />
        <Button size="sm" variant="secondary" onClick={() => file1InputRef.current?.click()}>
          📁 Загрузить в Объект 1
        </Button>

        <input
          ref={file2InputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFile2Upload}
          style={{ display: 'none' }}
        />
        <Button size="sm" variant="secondary" onClick={() => file2InputRef.current?.click()}>
          📁 Загрузить в Объект 2
        </Button>
      </div>
    </div>
  )
}
