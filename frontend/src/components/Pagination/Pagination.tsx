import { useId } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Select } from '@/components/Select/Select'
import { PAGE_SIZE_OPTIONS } from '@/types/api'
import styles from './Pagination.module.css'

export interface PaginationProps {
  /** Zero-based page index. */
  page: number
  size: number
  totalElements: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

const WINDOW = 5

export function Pagination({ page, size, totalElements, onPageChange, onSizeChange }: PaginationProps) {
  const sizeId = useId()
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const from = totalElements === 0 ? 0 : page * size + 1
  const to = Math.min(totalElements, (page + 1) * size)
  const start = Math.max(0, Math.min(page - Math.floor(WINDOW / 2), totalPages - WINDOW))
  const numbers = Array.from({ length: Math.min(WINDOW, totalPages) }, (_, i) => start + i)
  const atStart = page <= 0
  const atEnd = page >= totalPages - 1

  return (
    <div className={styles.pager}>
      <div className={styles.size}>
        <label htmlFor={sizeId}>Rows per page</label>
        <Select
          id={sizeId}
          value={String(size)}
          options={PAGE_SIZE_OPTIONS.map((n) => ({ value: String(n), label: String(n) }))}
          onChange={(e) => onSizeChange(Number(e.currentTarget.value))}
        />
      </div>
      <span className={styles.range} aria-live="polite">
        {from}–{to} of {totalElements}
      </span>
      <nav className={styles.pages} aria-label="Pagination">
        <button type="button" className={styles.pageButton} disabled={atStart} onClick={() => onPageChange(0)} aria-label="First page">
          <ChevronsLeft aria-hidden="true" />
        </button>
        <button type="button" className={styles.pageButton} disabled={atStart} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft aria-hidden="true" />
        </button>
        <span className={styles.numbers}>
          {numbers.map((n) => (
            <button
              key={n}
              type="button"
              className={styles.pageButton}
              aria-current={n === page ? 'page' : undefined}
              aria-label={`Page ${n + 1}`}
              onClick={() => onPageChange(n)}
            >
              {n + 1}
            </button>
          ))}
        </span>
        <button type="button" className={styles.pageButton} disabled={atEnd} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight aria-hidden="true" />
        </button>
        <button type="button" className={styles.pageButton} disabled={atEnd} onClick={() => onPageChange(totalPages - 1)} aria-label="Last page">
          <ChevronsRight aria-hidden="true" />
        </button>
      </nav>
    </div>
  )
}
