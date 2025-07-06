export interface DemoPage {
  id: string
  title: string
  description: string
  icon: string
  category: 'data-processing' | 'performance' | 'algorithms' | 'real-world'
}

export const DEMO_PAGES: DemoPage[] = [
  // Оптимальные функциональные демо
  {
    id: 'compare',
    title: 'Сравнение объектов',
    description: 'Глубокое сравнение структур',
    icon: '🔍',
    category: 'data-processing',
  },
  {
    id: 'csv',
    title: 'Парсинг CSV',
    description: 'FSD архитектура + WASM парсинг',
    icon: '📄',
    category: 'data-processing',
  },
]
