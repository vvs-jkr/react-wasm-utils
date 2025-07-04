import * as wasmLoader from '../../src/lib/wasm-loader'

describe('loadWasm', () => {
  it('должна быть функцией', () => {
    expect(typeof wasmLoader.loadWasm).toBe('function')
  })
})
