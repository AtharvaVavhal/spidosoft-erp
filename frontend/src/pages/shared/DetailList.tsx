import type { ReactNode } from 'react'
import { TbdTag } from '@/components/Tbd/Tbd'
import { cn } from '@/utils/cn'
import styles from './DetailList.module.css'

export interface DetailItem {
  label: string
  value: ReactNode
  numeric?: boolean
  full?: boolean
  /** Reason shown in a TBD tag next to the label. */
  tbd?: string
}

/** Read-only field list for detail views. */
export function DetailList({ items }: { items: DetailItem[] }) {
  return (
    <dl className={styles.list}>
      {items.map((item) => (
        <div key={item.label} className={cn(styles.item, item.full && styles.full)}>
          <dt className={styles.term}>
            {item.label}
            {item.tbd && <TbdTag reason={item.tbd} />}
          </dt>
          <dd className={cn(styles.value, item.numeric && styles.numeric)}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
