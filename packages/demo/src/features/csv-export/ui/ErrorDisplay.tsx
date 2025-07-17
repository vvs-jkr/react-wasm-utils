import React from 'react'

interface ErrorDisplayProps {
  error: string | { message: string; line?: number } | null
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null
  if (typeof error === 'string') {
    return <div className="error-message">{error}</div>
  }
  // error — объект { message, line? }
  return (
    <div className="error-message">
      {error.message}
      {error.line && <span style={{ marginLeft: 8, color: '#d00' }}>(строка: {error.line})</span>}
    </div>
  )
}
