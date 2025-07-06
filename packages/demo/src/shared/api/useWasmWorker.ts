import { useState, useEffect, useRef, useCallback } from 'react'
import { createWasmWorker } from './workerFactory'
import type {
  WorkerMessage,
  WorkerTask,
  WasmOperationType,
  WasmPayload,
  WasmResult,
  WorkerRequest,
} from '~/shared/types'

export function useWasmWorker() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasWorker, setHasWorker] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const tasksRef = useRef<Map<number, WorkerTask>>(new Map())
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
              task.resolve(data as WasmResult)
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

  const execute = async <T extends WasmResult = WasmResult>(
    type: WasmOperationType,
    payload: WasmPayload
  ): Promise<T> => {
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

      const wrappedResolve = (value: WasmResult) => {
        clearTimeout(timeout)
        setLoading(false)
        originalResolve(value as T)
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

      const worker = workerRef.current
      if (worker) {
        const request: WorkerRequest = { id: taskId, type, payload }
        worker.postMessage(request)
      } else {
        wrappedReject(new Error('Worker is null'))
      }
    })
  }

  return {
    execute,
    loading,
    error,
    hasWorker,
  }
}
