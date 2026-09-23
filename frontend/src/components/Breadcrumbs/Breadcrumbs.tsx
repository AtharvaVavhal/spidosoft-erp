import { Link } from 'react-router'
import { cn } from '@/utils/cn'
import styles from './Breadcrumbs.module.css'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null
  const parents = items.slice(0, -1)
  const current = items[items.length - 1]
  const parentPath = parents.map((c) => c.label).join(' / ')
  const lastParent = parents[parents.length - 1]

  return (
    <nav className={styles.crumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {parents.length > 0 && (
          <li className={cn(styles.item, styles.more)}>
            <Link className={styles.link} to={lastParent?.to ?? '/'} title={parentPath} aria-label={`Back to ${parentPath}`}>
              …
            </Link>
          </li>
        )}
        {parents.map((crumb) => (
          <li key={crumb.label} className={cn(styles.item, styles.collapsible)}>
            {crumb.to ? (
              <Link className={styles.link} to={crumb.to}>
                {crumb.label}
              </Link>
            ) : (
              crumb.label
            )}
          </li>
        ))}
        {current && (
          <li className={styles.item}>
            <span className={styles.current} aria-current="page">
              {current.label}
            </span>
          </li>
        )}
      </ol>
    </nav>
  )
}
