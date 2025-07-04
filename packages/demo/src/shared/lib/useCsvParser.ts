import { GenericObject } from '../types'
import { useWorkerTask } from '../api/useWorkerTask'

export function useCsvParser(csvData: string) {
  const { data, error, isLoading } = useWorkerTask<GenericObject[]>({
    type: 'parseCsv',
    payload: { csvData },
  })
  return { data, error, isLoading }
}
