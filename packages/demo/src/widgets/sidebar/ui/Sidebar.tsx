import type { DemoPage } from '~/shared/config/demo-pages'
// import styles from './Sidebar.module.css'

interface SidebarProps {
  demoPages: DemoPage[]
  activeDemo: string
  onDemoChange: (demoId: string) => void
  onClose: () => void
  isOpen: boolean
}

export function Sidebar({ demoPages, activeDemo, onDemoChange, onClose, isOpen }: SidebarProps) {
  const sidebarStyle = {
    position: 'fixed' as const,
    top: 0,
    left: isOpen ? 0 : '-320px',
    width: '320px',
    height: '100vh',
    background: 'rgba(20, 20, 20, 0.95)',
    borderRight: '1px solid #333',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    backdropFilter: 'blur(10px)',
  }

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#4fc3f7',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '4px',
  }

  const navStyle = {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto' as const,
  }

  const itemStyle = (isActive: boolean) => ({
    width: '100%',
    padding: '15px 20px',
    background: 'none',
    border: 'none',
    color: '#e6edf3',
    textAlign: 'left' as const,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderLeft: isActive ? '3px solid #4fc3f7' : '3px solid transparent',
    backgroundColor: isActive ? 'rgba(79, 195, 247, 0.1)' : 'transparent',
    transition: 'all 0.3s ease',
  })

  const iconStyle = {
    fontSize: '20px',
    minWidth: '24px',
  }

  const contentStyle = {
    flex: 1,
  }

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '4px',
  }

  const descriptionStyle = {
    fontSize: '14px',
    color: '#c0c0c0',
    lineHeight: 1.4,
  }

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#4fc3f7' }}>React WASM Utils</h3>
        <button style={closeButtonStyle} onClick={onClose} aria-label="Закрыть меню">
          ×
        </button>
      </div>

      <nav style={navStyle}>
        {demoPages.map(demo => (
          <button
            key={demo.id}
            style={itemStyle(activeDemo === demo.id)}
            onClick={() => onDemoChange(demo.id)}
          >
            <span style={iconStyle}>{demo.icon}</span>
            <div style={contentStyle}>
              <div style={titleStyle}>{demo.title}</div>
              <div style={descriptionStyle}>{demo.description}</div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}
