import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { IconButton } from '@/components/IconButton/IconButton'
import { cn } from '@/utils/cn'
import styles from './Alert.module.css'

export type AlertTone = 'success' | 'warning' | 'danger' | 'info'

const ICONS = { success: CircleCheck, warning: TriangleAlert, danger: CircleAlert, info: Info } as const

export interface AlertProps {
  tone: AlertTone
  title?: string
  children?: ReactNode
  onDismiss?: () => void
  className?: string
}

/** Inline page-level message. Danger alerts use role="alert"; others role="status". */
export function Alert({ tone, title, children, onDismiss, className }: AlertProps) {
  const Icon = ICONS[tone]
  return (
    <div className={cn(styles.alert, styles[tone], className)} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon aria-hidden="true" />
      <div className={styles.body}>
        {title && <span className={styles.title}>{title} </span>}
        {children}
      </div>
      {onDismiss && <IconButton className={styles.dismiss} icon={X} label="Dismiss" onClick={onDismiss} />}
    </div>
  )
}
