import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/utils/cn'
import styles from './Panel.module.css'

export function Panel({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(styles.panel, className)} {...rest} />
}

export function PanelSection({
  title,
  description,
  aside,
  children,
}: {
  title?: string
  description?: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={styles.section}>
      {(title || description || aside) && (
        <div className={styles.sectionHead}>
          {title && <h2 className={styles.sectionTitle}>{title}</h2>}
          {description && <p className={styles.sectionDescription}>{description}</p>}
          {aside}
        </div>
      )}
      {children}
    </section>
  )
}
