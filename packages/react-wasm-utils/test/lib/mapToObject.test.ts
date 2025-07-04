import { mapToObject } from '../../src/lib/mapToObject'

describe('mapToObject', () => {
  it('returns object as is', () => {
    const obj = { a: 1, b: 2 }
    expect(mapToObject(obj)).toEqual(obj)
  })

  it('converts flat Map to object', () => {
    const map = new Map([
      ['a', 1],
      ['b', 2],
    ])
    expect(mapToObject(map)).toEqual({ a: 1, b: 2 })
  })

  it('converts nested Map to nested object', () => {
    const nested = new Map<string, unknown>([
      ['a', 1],
      [
        'b',
        new Map<string, unknown>([
          ['c', 3],
          ['d', 4],
        ]),
      ],
    ])
    expect(mapToObject(nested)).toEqual({ a: 1, b: { c: 3, d: 4 } })
  })

  it('handles empty Map', () => {
    const map = new Map()
    expect(mapToObject(map)).toEqual({})
  })
})
