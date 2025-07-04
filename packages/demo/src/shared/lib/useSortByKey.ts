import { useWorkerTask } from '../api/useWorkerTask'
import type { GenericObject } from '../types'

export function useSortByKey<T extends GenericObject = GenericObject>(data: T[], key: string) {
  const {
    data: result,
    error,
    isLoading,
  } = useWorkerTask<T[]>({
    type: 'sortByKey',
    payload: { data, key },
  })

  return {
    data: result,
    error,
    isLoading,
  }
}
