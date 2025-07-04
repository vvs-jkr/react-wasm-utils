import React, { useState } from 'react'
import { Layout } from './app/Layout'
import { SortPage, ComparePage, CsvPage, PerformancePage } from './pages'
import { DEMO_PAGES } from './shared/config/demo-pages'

function App() {
  const [activeDemo, setActiveDemo] = useState('sort')

  const renderDemo = () => {
    switch (activeDemo) {
      case 'sort':
        return <SortPage />
      case 'compare':
        return <ComparePage />
      case 'csv':
        return <CsvPage />
      case 'performance':
        return <PerformancePage />
      default:
        return <SortPage />
    }
  }

  return (
    <Layout demoPages={DEMO_PAGES} activeDemo={activeDemo} onDemoChange={setActiveDemo}>
      {renderDemo()}
    </Layout>
  )
}

export default App
