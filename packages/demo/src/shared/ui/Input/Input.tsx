import React from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'default' | 'number'
}

export function Input({ label, error, variant = 'default', className = '', ...props }: InputProps) {
  const inputClasses = ['ui-input', `ui-input--${variant}`, error && 'ui-input--error', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="ui-input-group">
      {label && <label className="ui-input__label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <span className="ui-input__error">{error}</span>}
    </div>
  )
}
