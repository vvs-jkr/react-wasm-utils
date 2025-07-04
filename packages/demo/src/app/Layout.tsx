import React, { useState } from 'react'
import { Sidebar } from '../widgets/sidebar'
import { Header } from '../widgets/header'
import type { DemoPage } from '../shared/config/demo-pages'

interface LayoutProps {
  children: React.ReactNode
  demoPages: DemoPage[]
  activeDemo: string
  onDemoChange: (demoId: string) => void
}

export function Layout({ children, demoPages, activeDemo, onDemoChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  
  const currentDemo = demoPages.find(page => page.id === activeDemo)

  return (
    <div className="app">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        demoPages={demoPages}
        activeDemo={activeDemo}
        onDemoChange={onDemoChange}
      />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header 
          currentDemo={currentDemo}
          onMenuToggle={toggleSidebar}
        />
        <main className="demo-wrapper">{children}</main>
      </div>
    </div>
  )
} 