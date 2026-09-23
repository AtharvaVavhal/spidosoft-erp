import { ApiError } from '../http/apiError'

/**
 * Shared behaviour for in-memory mock adapters (development only).
 *
 * Simulated states can be forced from the URL to exercise the UI:
 *   ?mock=slow   — 1.5 s latency
 *   ?mock=error  — every mock call fails
 *   ?mock=empty  — list calls return no rows
 */
export type MockMode = 'normal' | 'slow' | 'error' | 'empty'

export function mockMode(): MockMode {
  if (typeof window === 'undefined') return 'normal'
  const value = new URLSearchParams(window.location.search).get('mock')
  return value === 'slow' || value === 'error' || value === 'empty' ? value : 'normal'
}

export async function mockCall<T>(produce: () => T): Promise<T> {
  const mode = mockMode()
  await new Promise((resolve) => setTimeout(resolve, mode === 'slow' ? 1500 : 250))
  if (mode === 'error') {
    throw new ApiError('MOCK_UNAVAILABLE', 'The data source did not respond (simulated).', { status: 503 })
  }
  return produce()
}

export function isEmptyMode(): boolean {
  return mockMode() === 'empty'
}

export function paginate<T>(rows: T[], page: number, size: number) {
  const start = page * size
  return {
    content: rows.slice(start, start + size),
    page,
    size,
    totalElements: rows.length,
    totalPages: Math.ceil(rows.length / size),
  }
}

export function matches(query: string, ...values: Array<string | null>): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return values.some((v) => v !== null && v.toLowerCase().includes(q))
}
