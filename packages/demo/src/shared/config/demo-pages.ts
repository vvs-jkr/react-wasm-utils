export interface DemoPage {
  id: string
  title: string
  description: string
  icon: string
  category: 'data-processing' | 'performance' | 'algorithms' | 'real-world'
}

export const DEMO_PAGES: DemoPage[] = [
  // Основные функциональные демо
  {
    id: 'sort',
    title: 'Сортировка',
    description: 'Быстрая сортировка массивов',
    icon: '📊',
    category: 'data-processing',
  },
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
    description: 'Обработка табличных данных',
    icon: '📄',
    category: 'data-processing',
  },
  {
    id: 'performance',
    title: 'Тестирование производительности',
    description: 'Сравнение JS vs WASM',
    icon: '⚡',
    category: 'performance',
  },
]
