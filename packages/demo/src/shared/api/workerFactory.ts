export function createWorker() {
  // В тестовом окружении import.meta может быть undefined
  if (typeof window !== 'undefined' && window.document) {
    // Браузерное окружение
    return new Worker(new URL('../../worker.ts', import.meta.url))
  } else {
    // Тестовое окружение - создаем mock worker
    return createMockWorker()
  }
}

interface MockWorker extends Omit<Worker, 'postMessage' | 'terminate'> {
  postMessage: (message: unknown) => void
  terminate: () => void
}

function createMockWorker(): MockWorker {
  // Создаем простую заглушку воркера для тестов
  const mockWorker = {
    postMessage: () => {},
    terminate: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null as ((event: ErrorEvent) => void) | null,
    onmessageerror: null as ((event: MessageEvent) => void) | null,
  } as MockWorker

  // Симулируем готовность воркера
  setTimeout(() => {
    if (mockWorker.onmessage) {
      mockWorker.onmessage({ data: { status: 'ready' } } as MessageEvent)
    }
  }, 0)

  return mockWorker
}

export function createTestWorker() {
  // Создаем максимально простой воркер без template literals
  const workerCode = [
    'console.log("MINIMAL WORKER: Starting");',
    '',
    '// Отправляем сообщение немедленно',
    'self.postMessage({ ',
    '  status: "ready", ',
    '  message: "Minimal worker ready!",',
    '  timestamp: Date.now()',
    '});',
    '',
    '// Отправляем повторное сообщение через 1 секунду',
    'setTimeout(() => {',
    '  self.postMessage({ ',
    '    status: "ping", ',
    '    message: "Delayed ping from worker",',
    '    timestamp: Date.now()',
    '  });',
    '}, 1000);',
  ].join('\n')

  try {
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)

    const worker = new Worker(workerUrl)

    // Очищаем URL после создания воркера
    setTimeout(() => URL.revokeObjectURL(workerUrl), 5000)

    return worker
  } catch (error) {
    console.error('[FACTORY] Failed to create minimal worker:', error)
    throw error
  }
}

export function createWasmWorker() {
  // Создаем WASM воркер с абсолютными URL без template literals
  const workerCodeLines = [
    '// Определяем абсолютные URL для файлов',
    'const baseUrl = self.location.origin;',
    'const wasmJsUrl = baseUrl + "/wasm/wasm_lib.js";',
    'const wasmBinaryUrl = baseUrl + "/wasm/wasm_lib_bg.wasm";',
    '',
    '// Загружаем WASM модуль через fetch с абсолютным URL',
    'fetch(wasmJsUrl)',
    '  .then(response => {',
    '    if (!response.ok) {',
    '      throw new Error("Failed to fetch wasm_lib.js: " + response.status + " " + response.statusText);',
    '    }',
    '    return response.text();',
    '  })',
    '  .then(moduleCode => {',
    '    // Создаем blob URL и импортируем как модуль',
    '    const moduleBlob = new Blob([moduleCode], { type: "application/javascript" });',
    '    const moduleUrl = URL.createObjectURL(moduleBlob);',
    '    return import(moduleUrl);',
    '  })',
    '  .then(async (wasmModule) => {',
    '    // Используем default экспорт для инициализации',
    '    await wasmModule.default(wasmBinaryUrl);',
    '    ',
    '    // Сохраняем ссылку на модуль',
    '    self.wasmModule = wasmModule;',
    '    ',
    '    // Отправляем сигнал готовности',
    '    self.postMessage({ status: "ready" });',
    '  })',
    '  .catch(error => {',
    '    console.error("❌ Ошибка загрузки WASM:", error);',
    '    self.postMessage({ ',
    '      status: "error", ',
    '      id: -1, ',
    '      error: "WASM load failed: " + error.message ',
    '    });',
    '  });',
    '',
    '// Обработчик сообщений',
    'self.onmessage = async (event) => {',
    '  try {',
    '    if (!self.wasmModule) {',
    '      throw new Error("WASM not initialized");',
    '    }',
    '    ',
    '    const { id, type, payload } = event.data;',
    '    let result;',
    '    ',
    '    // Функция для рекурсивного преобразования Map в обычные объекты/массивы',
    '    function convertWasmResult(data) {',
    '      if (data instanceof Map) {',
    '        // Если Map имеет числовые ключи (0,1,2...) - преобразуем в массив',
    '        const keys = Array.from(data.keys());',
    '        const isArrayLike = keys.every((key, index) => key === index);',
    '        ',
    '        if (isArrayLike) {',
    '          return Array.from(data.values()).map(convertWasmResult);',
    '        } else {',
    '          // Иначе преобразуем в объект',
    '          const obj = {};',
    '          for (const [key, value] of data) {',
    '            obj[key] = convertWasmResult(value);',
    '          }',
    '          return obj;',
    '        }',
    '      }',
    '      ',
    '      if (Array.isArray(data)) {',
    '        return data.map(convertWasmResult);',
    '      }',
    '      ',
    '      if (data && typeof data === "object") {',
    '        const obj = {};',
    '        for (const [key, value] of Object.entries(data)) {',
    '          obj[key] = convertWasmResult(value);',
    '        }',
    '        return obj;',
    '      }',
    '      ',
    '      return data;',
    '    }',
    '',
    '    switch (type) {',
    '      case "deepEqual":',
    '        result = self.wasmModule.deep_equal(payload.a, payload.b);',
    '        break;',
    '        ',
    '      case "sortByKey":',
    '        result = self.wasmModule.sort_by_key(payload.data, payload.key);',
    '        result = convertWasmResult(result);',
    '        break;',
    '        ',
    '      case "parseCsv":',
    '        result = self.wasmModule.parse_csv(payload.csvText);',
    '        result = convertWasmResult(result);',
    '        break;',
    '        ',
    '      case "parseCsvEnhanced":',
    '        result = self.wasmModule.parse_csv_enhanced(payload.csvText, payload.delimiter);',
    '        result = convertWasmResult(result);',
    '        break;',
    '        ',
    '      default:',
    '        throw new Error("Unknown task type: " + type);',
    '    }',
    '    ',
    '    self.postMessage({ status: "success", id, data: result });',
    '    ',
    '  } catch (error) {',
    '    console.error("❌ Ошибка выполнения задачи:", error);',
    '    self.postMessage({ ',
    '      status: "error", ',
    '      id: event.data.id || -1, ',
    '      error: String(error) ',
    '    });',
    '  }',
    '};',
  ]

  const workerCode = workerCodeLines.join('\n')

  try {
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const workerUrl = URL.createObjectURL(blob)

    const worker = new Worker(workerUrl, { type: 'module' })

    // Очищаем URL через 10 секунд
    setTimeout(() => URL.revokeObjectURL(workerUrl), 10000)

    return worker
  } catch (error) {
    console.error('[FACTORY] Failed to create WASM worker:', error)
    throw error
  }
}
