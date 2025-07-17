import React, { useEffect, useRef } from 'react'

interface CsvInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  errorLine?: number
}

export function CsvInput({
  value,
  onChange,
  placeholder = 'name,age,city\nИван,25,Москва\nАнна,30,СПб',
  errorLine,
}: CsvInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (errorLine && textareaRef.current) {
      const lines = value.split('\n')
      let pos = 0
      for (let i = 0; i < errorLine - 1; i++) {
        pos += (lines[i]?.length ?? 0) + 1
      }
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(pos, pos + (lines[errorLine - 1]?.length ?? 0))
      // Прокрутка к ошибке (работает в большинстве браузеров)
      const lineHeight = 20
      textareaRef.current.scrollTop = Math.max(0, (errorLine - 3) * lineHeight)
    }
  }, [errorLine, value])

  return (
    <div className="input-group">
      <label>CSV данные:</label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field"
        placeholder={placeholder}
        rows={10}
        style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          borderColor: errorLine ? 'red' : undefined,
        }}
      />
    </div>
  )
}
