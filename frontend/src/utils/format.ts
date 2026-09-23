const decimalFormatter = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const integerFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** Placeholder for empty values. */
export const EMPTY = '—'

export function formatText(value: string | null | undefined): string {
  return value === null || value === undefined || value.trim() === '' ? EMPTY : value
}

/** decimal(20,2) columns (GSTRate, PurchaseCost, SellingPrice). Currency/unit is TBD, so none is shown. */
export function formatDecimal(value: number | null | undefined): string {
  return value === null || value === undefined ? EMPTY : decimalFormatter.format(value)
}

export function formatInteger(value: number | null | undefined): string {
  return value === null || value === undefined ? EMPTY : integerFormatter.format(value)
}

/**
 * SQL `datetime` has no time zone; the zone is TBD (docs/10 §2H), so the value is shown as stored.
 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return EMPTY
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value)
  if (!match) return value
  const [, y, m, d, hh, mm] = match
  const month = new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-IN', { month: 'short' })
  return `${d} ${month} ${y}, ${hh}:${mm}`
}
