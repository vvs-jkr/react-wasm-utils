import React from 'react'
import { Button } from '~/shared/ui'

interface ParseControlsProps {
  onParse: () => void
  onClear: () => void
  isLoading: boolean
  disabled: boolean
}

export function ParseControls({ onParse, onClear, isLoading, disabled }: ParseControlsProps) {
  return (
    <div className="button-group">
      <Button onClick={onParse} loading={isLoading} disabled={disabled}>
        📄 Парсить CSV
      </Button>
      <Button variant="secondary" onClick={onClear} disabled={isLoading}>
        🧹 Очистить
      </Button>
    </div>
  )
}
