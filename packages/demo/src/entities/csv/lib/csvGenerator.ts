import type { CsvSample } from '../model/types'

/**
 * Генерирует большой CSV файл с тестовыми данными
 */
export function generateLargeCsv(rows: number = 1000): string {
  const categories = ['Электроника', 'Одежда', 'Книги', 'Дом и сад', 'Спорт']
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'HP', 'Dell']

  const lines = ['id,product,category,brand,price,stock,rating']

  for (let i = 1; i <= rows; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const price = (Math.random() * 50000 + 1000).toFixed(2)
    const stock = Math.floor(Math.random() * 100)
    const rating = (Math.random() * 2 + 3).toFixed(1) // 3.0 - 5.0

    lines.push(`${i},${brand} Product ${i},${category},${brand},${price},${stock},${rating}`)
  }

  return lines.join('\n')
}

/**
 * Конфигурация примеров CSV данных - упрощенная версия
 */
export const CSV_SAMPLES: CsvSample[] = [
  {
    key: 'simple',
    label: 'Пример данных',
    icon: '📋',
    data: `name,age,city,salary
Иван Петров,25,Москва,75000
Анна Смирнова,30,СПб,85000
Пётр Сидоров,35,Казань,65000
Мария Иванова,28,Новосибирск,70000
Алексей Козлов,32,Екатеринбург,68000`,
  },
]

/**
 * Получает пример CSV по ключу
 */
export function getCsvSample(key: string): string {
  const sample = CSV_SAMPLES.find(s => s.key === key)
  return sample?.data || ''
}
