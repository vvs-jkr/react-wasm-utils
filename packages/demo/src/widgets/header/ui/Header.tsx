import React from 'react'
import type { DemoPage } from '../../../shared/config/demo-pages'
import './header.css'

interface HeaderProps {
  currentDemo?: DemoPage
  onMenuToggle: () => void
}

export function Header({ currentDemo, onMenuToggle }: HeaderProps) {
  if (!currentDemo) {
    return (
      <header className="demo-header-bar">
        <button className="mobile-menu-toggle" onClick={onMenuToggle} aria-label="Открыть меню">
          ☰
        </button>
        <div className="demo-title">
          <span className="demo-icon">🚀</span>
          <div>
            <h1>React + WebAssembly Utils Demo</h1>
            <p className="demo-subtitle">Выберите демо из меню</p>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="demo-header-bar">
      <button className="mobile-menu-toggle" onClick={onMenuToggle} aria-label="Открыть меню">
        ☰
      </button>
      <div className="demo-title">
        <span className="demo-icon">{currentDemo.icon}</span>
        <div>
          <h1>{currentDemo.title}</h1>
          <p className="demo-subtitle">{currentDemo.description}</p>
        </div>
      </div>
    </header>
  )
}
