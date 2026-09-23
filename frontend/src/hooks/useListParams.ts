import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/types/api'

/** List state (search, page, size) kept in the URL, per the locked data-heavy pattern (docs/06 §5). */
export function useListParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => {
    const q = searchParams.get('q') ?? ''
    const page = Math.max(0, Number.parseInt(searchParams.get('page') ?? '0', 10) || 0)
    const rawSize = Number.parseInt(searchParams.get('size') ?? '', 10)
    const size = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize) ? rawSize : DEFAULT_PAGE_SIZE
    return { q, page, size }
  }, [searchParams])

  const update = useCallback(
    (next: Partial<{ q: string; page: number; size: number }>) => {
      setSearchParams(
        (current) => {
          const merged = new URLSearchParams(current)
          for (const [key, value] of Object.entries(next)) {
            const isDefault =
              (key === 'q' && value === '') ||
              (key === 'page' && value === 0) ||
              (key === 'size' && value === DEFAULT_PAGE_SIZE)
            if (isDefault) merged.delete(key)
            else merged.set(key, String(value))
          }
          return merged
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return { params, update }
}
