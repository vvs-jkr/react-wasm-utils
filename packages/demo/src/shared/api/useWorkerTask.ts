import { useState, useEffect, useRef } from 'react'
import { WorkerTask, WorkerResponse } from '../types'
import { createWasmWorker } from './workerFactory'

let taskIdCounter = 0

export function useWorkerTask<T = unknown>(task: Omit<WorkerTask, 'id'>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const taskIdRef = useRef<number | null>(null)

  useEffect(() => {
    const worker = createWasmWorker()
    const id = ++taskIdCounter
    taskIdRef.current = id
    setIsLoading(true)
    setData(null)
    setError(null)

    const handler = (event: MessageEvent<WorkerResponse>) => {
      if ('id' in event.data && event.data.id !== id) return
      if (event.data.status === 'success') setData(event.data.data as T)
      else if ('error' in event.data) setError(event.data.error || 'Unknown worker error')
      setIsLoading(false)
    }

    worker.addEventListener('message', handler)
    worker.postMessage({ id, ...task })
    return () => {
      worker.removeEventListener('message', handler)
      worker.terminate()
    }
  }, [task])

  return { data, error, isLoading }
}
