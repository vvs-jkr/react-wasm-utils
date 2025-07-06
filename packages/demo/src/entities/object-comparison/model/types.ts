export interface ComparisonResult {
  isEqual: boolean
  differences?: Array<{
    path: string
    value1: unknown
    value2: unknown
  }>
  processTime?: number
}

export interface ComparisonState {
  result: ComparisonResult | null
  isLoading: boolean
  error: string | null
}

export interface SampleObjects {
  obj1: string
  obj2: string
}

export type SampleType = 'nested'
