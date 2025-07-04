import { useState, useEffect, useRef } from 'react'
import { createWasmWorker } from './workerFactory'

interface WorkerMessage {
  status: 'ready' | 'success' | 'error'
  id?: number
  data?: any
  error?: string
}

interface WorkerTask<T> {
  resolve: (value: T) => void
  reject: (error: Error) => void
}

export function useWasmWorker() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasWorker, setHasWorker] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const tasksRef = useRef<Map<number, WorkerTask<any>>>(new Map())
  const taskIdRef = useRef(0)

  useEffect(() => {
    let worker: Worker | null = null

    try {
      worker = createWasmWorker()

      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const { status, id, data, error: workerError } = event.data

        if (status === 'ready') {
          setHasWorker(true)
          return
        }

        if (id !== undefined) {
          const task = tasksRef.current.get(id)
          if (task) {
            tasksRef.current.delete(id)
            if (status === 'success') {
              task.resolve(data)
            } else if (status === 'error') {
              task.reject(new Error(workerError || 'Unknown worker error'))
            }
          }
        }
      }

      worker.onerror = error => {
        console.error('❌ Worker error:', error)
        setError('Worker crashed')
        setHasWorker(false)
      }

      workerRef.current = worker
    } catch (err) {
      console.error('❌ Failed to create worker:', err)
      setError('Failed to initialize worker')
    }

    return () => {
      if (worker) {
        worker.terminate()
      }
    }
  }, [])

  const execute = async <T>(type: string, payload: any): Promise<T> => {
    if (!hasWorker || !workerRef.current) {
      throw new Error('Worker not ready')
    }

    setLoading(true)
    setError(null)

    const taskId = taskIdRef.current++

    return new Promise<T>((resolve, reject) => {
      tasksRef.current.set(taskId, { resolve, reject })

      const timeout = setTimeout(() => {
        tasksRef.current.delete(taskId)
        reject(new Error('Task timeout'))
      }, 10000)

      const originalResolve = resolve
      const originalReject = reject

      const wrappedResolve = (value: T) => {
        clearTimeout(timeout)
        setLoading(false)
        originalResolve(value)
      }

      const wrappedReject = (error: Error) => {
        clearTimeout(timeout)
        setLoading(false)
        setError(error.message)
        originalReject(error)
      }

      tasksRef.current.set(taskId, {
        resolve: wrappedResolve,
        reject: wrappedReject,
      })

      workerRef.current!.postMessage({ id: taskId, type, payload })
    })
  }

  return {
    execute,
    loading,
    error,
    hasWorker,
  }
}
