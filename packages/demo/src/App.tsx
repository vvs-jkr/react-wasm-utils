import React, { useState } from 'react'
import { Layout } from './app/Layout'
import { ComparePage } from '~/pages'
import { CsvPage } from '~/pages/csv'
import { DEMO_PAGES } from '~/shared/config/demo-pages'

export function App() {
  const [activeDemo, setActiveDemo] = useState('compare')

  const renderDemo = () => {
    switch (activeDemo) {
      case 'compare':
        return <ComparePage />
      case 'csv':
        return <CsvPage />
      default:
        return <ComparePage />
    }
  }

  return (
    <Layout demoPages={DEMO_PAGES} activeDemo={activeDemo} onDemoChange={setActiveDemo}>
      {renderDemo()}
    </Layout>
  )
}

export default App
