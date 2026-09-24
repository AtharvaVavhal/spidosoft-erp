import { z } from 'zod'
import { ColumnLimits } from './columnLimits'

/** Optional free text: '' → null. Optional max length (confirmed column limit). */
export function optionalText(max?: number) {
  const base = z.string().trim()
  const limited = max === undefined ? base : base.max(max, `Maximum ${max} characters`)
  return limited.transform((v) => (v === '' ? null : v))
}

/** Optional decimal(20,2) entered as text: '' → null, otherwise a number within the column precision. */
export function optionalDecimal20_2() {
  const { integer, fraction } = ColumnLimits.decimal20_2
  const pattern = new RegExp(`^-?\\d{1,${integer}}(\\.\\d{1,${fraction}})?$`)
  return z
    .string()
    .trim()
    .refine((v) => v === '' || pattern.test(v), `Up to ${integer} digits and ${fraction} decimal places`)
    .transform((v) => (v === '' ? null : Number(v)))
}

/**
 * Optional numeric(p,0) entered as text: '' → null, otherwise at most `digits` digits.
 * Kept as a string: numeric(18,0) exceeds JavaScript's safe-integer range, and the API transports
 * SupplierMaster.Telephone as a string of digits (docs/07 §0).
 */
export function optionalDigits(digits: number) {
  const pattern = new RegExp(`^\\d{1,${digits}}$`)
  return z
    .string()
    .trim()
    .refine((v) => v === '' || pattern.test(v), `Digits only, up to ${digits}`)
    .transform((v) => (v === '' ? null : v))
}
