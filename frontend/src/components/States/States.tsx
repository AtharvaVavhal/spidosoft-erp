import type { CSSProperties, ReactNode } from 'react'
import { LoaderCircle, RefreshCw } from 'lucide-react'
import { Alert } from '@/components/Alert/Alert'
import { Button } from '@/components/Button/Button'
import styles from './States.module.css'

/** Plain-text empty state: title, one line, optional action. No illustrations (docs/06 §3.2). */
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className={styles.state}>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.text}>{description}</p>}
      {action}
    </div>
  )
}

/** Explains what failed and offers a retry. */
export function ErrorState({
  title,
  message,
  onRetry,
  requestId,
}: {
  title: string
  message: string
  onRetry?: () => void
  requestId?: string | null
}) {
  return (
    <div className={`${styles.state} ${styles.errorBox}`}>
      <Alert tone="danger" title={title}>
        {message}
      </Alert>
      {onRetry && (
        <div className={styles.actions}>
          <Button icon={RefreshCw} onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
      {requestId && <p className={styles.meta}>Request ID: {requestId}</p>}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.loading} role="status">
      <LoaderCircle className={styles.spinner} aria-hidden="true" />
      {label}
    </div>
  )
}

export function Skeleton({ width, height, style }: { width: number | string; height?: number; style?: CSSProperties }) {
  return <span className={styles.skeleton} style={{ width, height, ...style }} aria-hidden="true" />
}
