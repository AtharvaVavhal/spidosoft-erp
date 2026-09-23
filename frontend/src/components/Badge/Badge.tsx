import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

/** Status never relies on colour alone: a badge always carries text (and optionally an icon). */
export function Badge({ tone = 'neutral', icon: Icon, children, title }: {
  tone?: BadgeTone
  icon?: LucideIcon
  children: ReactNode
  title?: string
}) {
  return (
    <span className={cn(styles.badge, styles[tone])} title={title}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </span>
  )
}
