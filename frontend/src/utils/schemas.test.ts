import { describe, expect, it } from 'vitest'
import { optionalDecimal20_2, optionalDigits, optionalText } from './schemas'

describe('optionalText', () => {
  it('turns blank input into null and trims', () => {
    expect(optionalText().parse('   ')).toBeNull()
    expect(optionalText().parse('  Aluminium ')).toBe('Aluminium')
  })

  it('enforces the confirmed column length only when one is given', () => {
    expect(optionalText(3).safeParse('abcd').success).toBe(false)
    expect(optionalText(3).parse('abc')).toBe('abc')
    expect(optionalText().parse('x'.repeat(10_000))).toHaveLength(10_000)
  })
})

describe('optionalDecimal20_2', () => {
  const schema = optionalDecimal20_2()

  it('accepts up to 18 integer digits and 2 decimals', () => {
    expect(schema.parse('18.00')).toBe(18)
    expect(schema.parse('')).toBeNull()
    expect(schema.safeParse('1'.repeat(18)).success).toBe(true)
  })

  it('rejects values outside decimal(20,2)', () => {
    expect(schema.safeParse('18.005').success).toBe(false)
    expect(schema.safeParse('1'.repeat(19)).success).toBe(false)
    expect(schema.safeParse('12a').success).toBe(false)
  })
})

describe('optionalDigits', () => {
  it('keeps numeric(18,0) values as exact strings (no precision loss)', () => {
    // 18 digits: above Number.MAX_SAFE_INTEGER, so a number would round.
    expect(optionalDigits(18).parse('987654321098765432')).toBe('987654321098765432')
  })

  it('rejects non-digits and too many digits', () => {
    expect(optionalDigits(10).safeParse('98200 11111').success).toBe(false)
    expect(optionalDigits(10).safeParse('+919820011111').success).toBe(false)
    expect(optionalDigits(6).safeParse('4110011').success).toBe(false)
    expect(optionalDigits(6).parse('')).toBeNull()
  })
})
