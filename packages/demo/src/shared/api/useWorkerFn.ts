import { useState, useEffect, useRef, useCallback } from 'react'
import { WorkerTask, WorkerResponse } from '../types'
import { createWasmWorker } from './workerFactory'

let taskIdCounter = 0

export function useWorkerFn<T = unknown>() {
  const [state, setState] = useState<{
    data: T | null
    error: string | null
    isLoading: boolean
  }>({
    data: null,
    error: null,
    isLoading: false,
  })

  const latestTaskId = useRef<number | null>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const worker = createWasmWorker()
    workerRef.current = worker
    const handler = (event: MessageEvent<WorkerResponse>) => {
      if ('id' in event.data && event.data.id !== latestTaskId.current) return
      if (event.data.status === 'success') {
        setState({ data: event.data.data as T, error: null, isLoading: false })
      } else if ('error' in event.data) {
        setState({
          data: null,
          error: event.data.error || 'Unknown worker error',
          isLoading: false,
        })
      }
    }
    worker.addEventListener('message', handler)
    return () => {
      worker.removeEventListener('message', handler)
      worker.terminate()
    }
  }, [])

  const execute = useCallback((task: Omit<WorkerTask, 'id'>) => {
    const worker = workerRef.current
    if (!worker) return
    const id = ++taskIdCounter
    latestTaskId.current = id
    setState({ data: null, error: null, isLoading: true })
    worker.postMessage({ id, ...task })
  }, [])

  return [state, execute] as const
}
