import { describe, expect, it } from 'vitest'
import css from './design-tokens.css?raw'

/**
 * Re-checks WCAG 2.x contrast on the IMPLEMENTED palette tier (design-tokens.css), not on the spec: each
 * pair from the docs/06 §3.3 pre-check is recomputed from the shipped CSS values. Thresholds are not
 * rounded (4.5 text, 3.0 non-text).
 */
const palette = Object.fromEntries(
  Array.from(css.matchAll(/--palette-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g), (m) => [m[1], m[2]!.toUpperCase()]),
) as Record<string, string>

function hex(name: string): string {
  const value = palette[name]
  if (!value) throw new Error(`--palette-${name} is not defined in design-tokens.css`)
  return value
}

function luminance(color: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, minimum] — palette token names without the --palette- prefix.
const TEXT = 4.5
const NON_TEXT = 3
const pairs: Array<[string, string, number]> = [
  ['text-primary', 'bg-surface', TEXT],
  ['text-primary', 'bg-canvas', TEXT],
  ['text-primary', 'bg-muted', TEXT],
  ['text-primary', 'primary-subtle', TEXT],
  ['text-secondary', 'bg-surface', TEXT],
  ['text-secondary', 'bg-canvas', TEXT],
  ['text-secondary', 'bg-subtle', TEXT],
  ['text-secondary', 'bg-muted', TEXT],
  ['text-tertiary', 'bg-surface', TEXT],
  ['text-tertiary', 'bg-canvas', TEXT],
  ['text-tertiary', 'bg-subtle', TEXT],
  ['text-tertiary', 'bg-muted', TEXT],
  ['text-tertiary', 'primary-subtle', TEXT],
  ['on-primary', 'primary-600', TEXT],
  ['on-primary', 'primary-700', TEXT],
  ['on-primary', 'primary-800', TEXT],
  ['primary-700', 'bg-surface', TEXT],
  ['primary-700', 'bg-canvas', TEXT],
  ['primary-700', 'primary-subtle', TEXT],
  ['primary-600', 'bg-subtle', NON_TEXT],
  ['primary-600', 'bg-surface', NON_TEXT],
  ['primary-600', 'bg-canvas', NON_TEXT],
  ['border-control', 'bg-surface', NON_TEXT],
  ['on-primary', 'success-solid', TEXT],
  ['on-primary', 'warning-solid', TEXT],
  ['on-primary', 'danger-solid', TEXT],
  ['success-text', 'success-tint', TEXT],
  ['warning-text', 'warning-tint', TEXT],
  ['danger-text', 'danger-tint', TEXT],
  ['text-primary', 'chart-seq-1', TEXT],
  ['text-primary', 'chart-seq-2', TEXT],
  ['text-primary', 'chart-seq-3', TEXT],
  ['on-primary', 'chart-seq-4', TEXT],
  ['on-primary', 'chart-seq-5', TEXT],
  ['on-primary', 'chart-seq-6', TEXT],
  ...[1, 2, 3, 4, 5, 6].flatMap((i): Array<[string, string, number]> => [
    [`chart-cat-${i}`, 'bg-surface', NON_TEXT],
    [`chart-cat-${i}`, 'bg-canvas', NON_TEXT],
  ]),
]

describe('implemented design tokens (r5) — contrast re-check', () => {
  it.each(pairs)('%s on %s ≥ %s:1', (fg, bg, min) => {
    expect(contrast(hex(fg), hex(bg))).toBeGreaterThanOrEqual(min)
  })

  it('border.control on canvas/subtle stays below 3:1 by design, so controls must sit on bg.surface', () => {
    expect(contrast(hex('border-control'), hex('bg-canvas'))).toBeLessThan(NON_TEXT)
    expect(contrast(hex('border-control'), hex('bg-subtle'))).toBeLessThan(NON_TEXT)
  })

  it('ships the locked r5 key values', () => {
    expect([hex('primary-600'), hex('primary-700'), hex('primary-800'), hex('primary-subtle')]).toEqual([
      '#2A5CAA', '#234E93', '#1D4179', '#E1E9F6',
    ])
    expect([hex('text-primary'), hex('text-secondary'), hex('text-tertiary')]).toEqual(['#172033', '#3F4B5F', '#5C6877'])
    expect(hex('chart-seq-4')).toBe('#4974B9')
  })
})
