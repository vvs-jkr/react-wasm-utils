// import styles from './SidebarToggle.module.css'

interface SidebarToggleProps {
  isOpen: boolean
  onClick: () => void
}

export function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  const buttonStyle = {
    position: 'fixed' as const,
    top: '20px',
    left: '20px',
    width: '44px',
    height: '44px',
    background: 'rgba(40, 40, 40, 0.9)',
    border: '1px solid #4fc3f7',
    borderRadius: '8px',
    cursor: 'pointer',
    display: isOpen ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1002,
    transition: 'all 0.3s ease',
  }

  const hamburgerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  }

  const spanStyle = {
    width: '18px',
    height: '2px',
    background: '#4fc3f7',
    borderRadius: '1px',
    transition: 'all 0.3s ease',
  }

  return (
    <button style={buttonStyle} onClick={onClick} aria-label="Открыть меню">
      <div style={hamburgerStyle}>
        <span style={spanStyle}></span>
        <span style={spanStyle}></span>
        <span style={spanStyle}></span>
      </div>
    </button>
  )
}
