import { useState, useEffect } from 'react'
import './App.css'
import { useWasm } from './hooks/useWasm' // <-- Импортируем наш хук

const obj1 = { name: 'Alice', age: 30, friends: ['Bob', 'Charlie'] }
const obj2 = { name: 'Alice', age: 30, friends: ['Bob', 'Charlie'] }
const obj3 = { name: 'Alice', age: 31, friends: ['Bob', 'Charlie'] }

function App() {
  // Используем хук для получения доступа к WASM
  const { wasm, isLoading, error } = useWasm()

  const [isEqual1, setIsEqual1] = useState<boolean | null>(null)
  const [isEqual2, setIsEqual2] = useState<boolean | null>(null)

  // Этот эффект теперь зависит от `wasm`
  useEffect(() => {
    // Выполняем сравнение, только когда wasm-модуль загружен
    if (wasm) {
      setIsEqual1(wasm.deep_equal(obj1, obj2))
      setIsEqual2(wasm.deep_equal(obj1, obj3))
    }
  }, [wasm]) // Запускаем эффект, когда `wasm` перестает быть `null`

  if (isLoading) return <div>Loading WASM...</div>
  if (error) return <div>Error loading WASM: {error.message}</div>
  if (!wasm) return <div>WASM module not available.</div>

  return (
    <>
      <h1>Vite + React + Rust/WASM</h1>
      <div className="card">
        <h2>Deep Equal Test (with custom hook)</h2>
        <p>
          Comparing identical objects: <strong>{String(isEqual1)}</strong>
        </p>
        <p>
          Comparing different objects: <strong>{String(isEqual2)}</strong>
        </p>
      </div>
    </>
  )
}

export default App
