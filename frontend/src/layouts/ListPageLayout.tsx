import type { ReactNode } from 'react'
import { Panel } from '@/components/Panel/Panel'
import styles from './ListPageLayout.module.css'

export function ListPageLayout({ header, notice, children }: { header: ReactNode; notice?: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.page}>
      {header}
      {notice && <div className={styles.notice}>{notice}</div>}
      <Panel className={styles.panel}>{children}</Panel>
    </div>
  )
}
