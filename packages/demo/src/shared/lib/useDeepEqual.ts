import { useWorkerTask } from '../api/useWorkerTask'

export function useDeepEqual(a: unknown, b: unknown) {
  const { data, error, isLoading } = useWorkerTask<boolean>({
    type: 'deepEqual',
    payload: { a, b },
  })
  return {
    data,
    error,
    isLoading,
  }
}
