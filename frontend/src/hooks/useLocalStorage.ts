import { useCallback, useState } from 'react'

/** Per-viewer UI preference (e.g. sidebar collapsed). Storage failures fall back to the default. */
export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  })

  const set = useCallback(
    (next: T) => {
      setValue(next)
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        /* storage unavailable — keep in-memory value */
      }
    },
    [key],
  )

  return [value, set] as const
}
