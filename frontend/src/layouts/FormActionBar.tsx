import type { ReactNode } from 'react'
import styles from './FormActionBar.module.css'

export function FormActionBar({ meta, children }: { meta?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {meta && <span className={styles.meta}>{meta}</span>}
        <div className={styles.end}>{children}</div>
      </div>
    </div>
  )
}
