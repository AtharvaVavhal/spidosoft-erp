import type { ReactNode } from 'react'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { cn } from '@/utils/cn'
import styles from './DataTable.module.css'

export interface DataTableColumn<T> {
  key: string
  header: ReactNode
  /**
   * Fixed width in px, sized for the column's longest expected value (r5; date/time baseline 160).
   * Omit on exactly ONE column: the flexible column, which truncates with an ellipsis.
   */
  width?: number
  align?: 'left' | 'right' | 'center'
  tone?: 'primary' | 'secondary' | 'tertiary'
  render: (row: T) => ReactNode
  /** Full value shown on hover/focus when the flexible column truncates. */
  title?: (row: T) => string | undefined
  /** Skeleton bar width while loading. */
  skeletonWidth?: number
}

export type DataTableStatus = 'loading' | 'error' | 'empty' | 'ready'

export interface DataTableSelection<K> {
  selected: ReadonlySet<K>
  onToggle: (key: K) => void
  onToggleAll: (checked: boolean) => void
}

export interface DataTableProps<T, K extends string | number> {
  /** Accessible name of the table. */
  label: string
  columns: Array<DataTableColumn<T>>
  rows: T[]
  rowKey: (row: T) => K
  status: DataTableStatus
  /** Minimum table width in px; below it the table scrolls inside its panel (r4). */
  minWidth: number
  emptyState?: ReactNode
  errorState?: ReactNode
  selection?: DataTableSelection<K>
  skeletonRows?: number
  rowLabel?: (row: T) => string
  /** Small empty/error area for embedded grids (e.g. the mapping GridView). */
  compactStates?: boolean
}

export function DataTable<T, K extends string | number>({
  label,
  columns,
  rows,
  rowKey,
  status,
  minWidth,
  emptyState,
  errorState,
  selection,
  skeletonRows = 12,
  rowLabel,
  compactStates = false,
}: DataTableProps<T, K>) {
  const totalColumns = columns.length + (selection ? 1 : 0)
  const selectedCount = selection ? rows.filter((r) => selection.selected.has(rowKey(r))).length : 0
  const alignClass = (align?: DataTableColumn<T>['align']) =>
    align === 'right' ? styles.right : align === 'center' ? styles.center : undefined
  const toneClass = (tone?: DataTableColumn<T>['tone']) =>
    tone === 'secondary' ? styles.toneSecondary : tone === 'tertiary' ? styles.toneTertiary : undefined

  let body: ReactNode
  if (status === 'loading') {
    body = Array.from({ length: skeletonRows }, (_, i) => (
      <tr key={i} aria-hidden="true">
        {selection && (
          <td className={styles.checkCell}>
            <span className={styles.skeleton} style={{ width: 16, height: 16 }} />
          </td>
        )}
        {columns.map((column, c) => (
          <td key={column.key} className={alignClass(column.align)}>
            <span
              className={styles.skeleton}
              style={{ width: column.skeletonWidth ?? (column.width ? Math.max(24, column.width - 48) : 140 + ((i * 37 + c * 11) % 120)) }}
            />
          </td>
        ))}
      </tr>
    ))
  } else if (status === 'error' || status === 'empty') {
    body = (
      <tr className={styles.stateRow}>
        <td className={compactStates ? styles.stateCellCompact : styles.stateCell} colSpan={totalColumns}>
          {status === 'error' ? errorState : emptyState}
        </td>
      </tr>
    )
  } else {
    body = rows.map((row) => {
      const key = rowKey(row)
      const isSelected = selection?.selected.has(key) ?? false
      return (
        <tr key={key} aria-selected={selection ? isSelected : undefined}>
          {selection && (
            <td className={styles.checkCell}>
              <Checkbox
                checked={isSelected}
                onChange={() => selection.onToggle(key)}
                aria-label={`Select ${rowLabel ? rowLabel(row) : String(key)}`}
              />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.key}
              className={cn(alignClass(column.align), toneClass(column.tone))}
              title={column.title?.(row)}
            >
              {column.render(row)}
            </td>
          ))}
        </tr>
      )
    })
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table} style={{ minWidth }} aria-label={label} aria-busy={status === 'loading' || undefined}>
        <colgroup>
          {selection && <col style={{ width: 40 }} />}
          {columns.map((column) => (
            <col key={column.key} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {selection && (
              <th className={styles.checkCell} scope="col">
                <Checkbox
                  aria-label="Select all rows on this page"
                  disabled={status !== 'ready' || rows.length === 0}
                  checked={rows.length > 0 && selectedCount === rows.length}
                  indeterminate={selectedCount > 0 && selectedCount < rows.length}
                  onChange={(e) => selection.onToggleAll(e.currentTarget.checked)}
                />
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key} scope="col" className={alignClass(column.align)}>
                <span className={styles.headerInner}>{column.header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  )
}
