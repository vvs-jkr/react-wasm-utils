import React, { useState } from 'react'
import { Sidebar } from '~/widgets/sidebar'
import { SidebarToggle } from '~/shared/ui'
import type { DemoPage } from '~/shared/config/demo-pages'

interface LayoutProps {
  children: React.ReactNode
  demoPages: DemoPage[]
  activeDemo: string
  onDemoChange: (demo: string) => void
}

export function Layout({ children, demoPages, activeDemo, onDemoChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const handleDemoChange = (demo: string) => {
    onDemoChange(demo)
    setSidebarOpen(false)
  }

  const currentDemo = demoPages.find(demo => demo.id === activeDemo)

  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
      color: '#e6edf3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainContent: {
      paddingLeft: '80px',
      paddingRight: '20px',
      paddingTop: '20px',
      paddingBottom: '20px',
      transition: 'margin-left 0.3s ease',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    demoHeaderBar: {
      marginBottom: '30px',
      borderBottom: '1px solid #333',
      paddingBottom: '20px'
    },
    demoTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    demoIcon: {
      fontSize: '28px'
    },
    demoSubtitle: {
      color: '#c0c0c0',
      marginTop: '8px',
      fontSize: '16px'
    },
    demoWrapper: {
      marginTop: '20px'
    },
    sidebarOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999
    }
  }

  return (
    <div style={styles.app}>
      {/* Кнопка меню */}
      <SidebarToggle isOpen={sidebarOpen} onClick={handleSidebarToggle} />

      {/* Overlay для закрытия sidebar */}
      {sidebarOpen && (
        <div style={styles.sidebarOverlay} onClick={handleSidebarClose} />
      )}

      {/* Sidebar */}
      <Sidebar
        demoPages={demoPages}
        activeDemo={activeDemo}
        onDemoChange={handleDemoChange}
        onClose={handleSidebarClose}
        isOpen={sidebarOpen}
      />

      {/* Основной контент */}
      <main style={styles.mainContent}>
        <div style={styles.demoHeaderBar}>
          <div style={styles.demoTitle}>
            <span style={styles.demoIcon}>{currentDemo?.icon || '🚀'}</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px' }}>{currentDemo?.title || 'React + WebAssembly Utils Demo'}</h1>
              <p style={styles.demoSubtitle}>
                {currentDemo?.description || 'Выберите демо из меню'}
              </p>
            </div>
          </div>
        </div>
        <div style={styles.demoWrapper}>
          {children}
        </div>
      </main>
    </div>
  )
} 