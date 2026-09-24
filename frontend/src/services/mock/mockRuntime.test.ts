import { describe, expect, it } from 'vitest'
import { matches, paginate } from './mockRuntime'

describe('mock runtime helpers', () => {
  it('paginates zero-based pages', () => {
    const rows = Array.from({ length: 25 }, (_, i) => i)
    expect(paginate(rows, 0, 10)).toMatchObject({ content: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], totalElements: 25, totalPages: 3 })
    expect(paginate(rows, 2, 10).content).toEqual([20, 21, 22, 23, 24])
  })

  it('matches case-insensitively across nullable values', () => {
    expect(matches('smsp', 'SMSP0001', null)).toBe(true)
    expect(matches('xyz', 'SMSP0001', null)).toBe(false)
    expect(matches('  ', null)).toBe(true)
  })
})
