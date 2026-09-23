import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Alert } from '@/components/Alert/Alert'
import { ToastContext, type ToastInput } from './toastContext'
import styles from './Toast.module.css'

interface ToastItem extends ToastInput {
  id: number
}

const MAX_TOASTS = 3
const AUTO_DISMISS_MS = 5000

/** Bottom-right, aria-live polite, auto-dismiss ~5 s (errors persist), max 3 stacked (docs/06 §3.2). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])

  const show = useCallback(
    (toast: ToastInput) => {
      const id = nextId.current++
      setToasts((all) => [...all, { ...toast, id }].slice(-MAX_TOASTS))
      if (toast.tone !== 'danger') window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} aria-live="polite">
        {toasts.map((toast) => (
          <Alert key={toast.id} tone={toast.tone} title={toast.title} onDismiss={() => dismiss(toast.id)} className={styles.toast}>
            {toast.message && <span className={styles.message}>{toast.message}</span>}
          </Alert>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
