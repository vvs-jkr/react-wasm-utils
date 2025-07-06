import React from 'react'
import type { ComparisonResult as ComparisonResultType } from '~/entities/object-comparison'

interface ComparisonResultProps {
  result: ComparisonResultType
}

export function ComparisonResult({ result }: ComparisonResultProps) {
  return (
    <div className="results-section">
      <div className="comparison-result">
        {result.isEqual ? (
          <span style={{ color: '#4caf50' }}>✅ Объекты идентичны</span>
        ) : (
          <span style={{ color: '#f44336' }}>❌ Объекты различаются</span>
        )}
        <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '0.5rem' }}>
          Время сравнения: <strong>{result.compareTime.toFixed(2)} мс</strong>
        </div>
      </div>

      <div className="info">
        💡 <strong>Применение:</strong> валидация данных, тестирование, синхронизация состояний
      </div>
    </div>
  )
}
