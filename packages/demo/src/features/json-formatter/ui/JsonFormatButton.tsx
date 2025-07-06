import React from 'react'
import { Button } from '~/shared/ui'
import { formatJson } from '../lib/formatJson'

interface JsonFormatButtonProps {
  input: string
  onFormatted: (formatted: string) => void
  onError: (error: string) => void
}

export function JsonFormatButton({ input, onFormatted, onError }: JsonFormatButtonProps) {
  const handleFormat = () => {
    const result = formatJson(input)

    if (result.success) {
      onFormatted(result.formatted)
    } else {
      onError(result.error)
    }
  }

  return (
    <Button size="sm" variant="secondary" onClick={handleFormat}>
      🎨 Форматировать
    </Button>
  )
}
