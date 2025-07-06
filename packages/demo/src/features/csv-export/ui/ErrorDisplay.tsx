import React from 'react'

interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return <div className="error-message">{error}</div>
}
