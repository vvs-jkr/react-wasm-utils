import wasmInit, * as wasm from '../../wasm-lib/pkg/wasm_lib.js'

let wasmInstance: typeof wasm | null = null

export const loadWasm = async () => {
  console.log('[WASM] loadWasm called')

  if (!wasmInstance) {
    try {
      const cacheBuster = Date.now()
      const wasmUrl = `/wasm/wasm_lib_bg.wasm?v=${cacheBuster}`
      console.log('[WASM] Loading from', wasmUrl)
      console.log('[WASM] wasmInit function:', typeof wasmInit)

      await wasmInit(wasmUrl)
      console.log('[WASM] Initialization complete')
      wasmInstance = wasm
      console.log('[WASM] Instance created:', wasmInstance)
    } catch (error) {
      console.error('[WASM] Failed to initialize:', error)
      throw error
    }
  } else {
    console.log('[WASM] Using cached instance')
  }

  return wasmInstance
}
