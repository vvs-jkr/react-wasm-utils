import React from 'react'
import type { DemoPage } from '../../../shared/config/demo-pages'
import './sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  demoPages: DemoPage[]
  activeDemo: string
  onDemoChange: (demoId: string) => void
}

export function Sidebar({ isOpen, onToggle, demoPages, activeDemo, onDemoChange }: SidebarProps) {
  const handlePageSelect = (pageId: string) => {
    onDemoChange(pageId)
    // Закрываем сайдбар на мобильных устройствах после выбора
    if (window.innerWidth <= 768) {
      onToggle()
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Открыть меню">
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>🚀 React WASM Utils</h3>
          <button className="sidebar-close" onClick={onToggle} aria-label="Закрыть меню">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {demoPages.map(page => (
            <button
              key={page.id}
              className={`sidebar-item ${activeDemo === page.id ? 'active' : ''}`}
              onClick={() => handlePageSelect(page.id)}
            >
              <span className="sidebar-icon">{page.icon}</span>
              <div className="sidebar-content">
                <div className="sidebar-title">{page.title}</div>
                <div className="sidebar-description">{page.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
