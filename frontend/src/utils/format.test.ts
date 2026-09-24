import { describe, expect, it } from 'vitest'
import { EMPTY, formatDateTime, formatDecimal, formatInteger, formatText } from './format'

describe('format helpers', () => {
  it('shows the empty placeholder for null, undefined and blank text', () => {
    expect(formatText(null)).toBe(EMPTY)
    expect(formatText(undefined)).toBe(EMPTY)
    expect(formatText('  ')).toBe(EMPTY)
    expect(formatText('SMSP0001')).toBe('SMSP0001')
  })

  it('formats decimal(20,2) with two decimals and Indian grouping, without a currency', () => {
    expect(formatDecimal(1234567.5)).toBe('12,34,567.50')
    expect(formatDecimal(null)).toBe(EMPTY)
  })

  it('formats integers', () => {
    expect(formatInteger(1500)).toBe('1,500')
    expect(formatInteger(undefined)).toBe(EMPTY)
  })

  it('shows SQL datetime as stored, without time-zone conversion', () => {
    expect(formatDateTime('2026-09-24T23:45:00')).toBe('24 Sept 2026, 23:45')
    expect(formatDateTime(null)).toBe(EMPTY)
    expect(formatDateTime('not a date')).toBe('not a date')
  })
})
