import { useState, type FormEvent, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { Input } from '@/components/Input/Input'
import styles from './Toolbar.module.css'

export interface SearchToolbarProps {
  query: string
  placeholder: string
  onSearch: (query: string) => void
  /** Right-aligned content, e.g. the result count. */
  end?: ReactNode
  children?: ReactNode
}

/**
 * Toolbar Search (r4): a SECONDARY "Search" button, and Enter in the field runs the search. The page's
 * single filled primary stays the create action.
 */
export function SearchToolbar({ query, placeholder, onSearch, end, children }: SearchToolbarProps) {
  const [draft, setDraft] = useState(query)
  // Keep the field in sync when the URL query changes (back/forward, Clear search) — adjusted during render.
  const [syncedQuery, setSyncedQuery] = useState(query)
  if (syncedQuery !== query) {
    setSyncedQuery(query)
    setDraft(query)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(draft.trim())
  }

  return (
    <form className={styles.toolbar} role="search" onSubmit={submit}>
      <div className={styles.search}>
        <label className="sr-only" htmlFor="toolbar-search">
          {placeholder}
        </label>
        <Input
          id="toolbar-search"
          type="search"
          leadingIcon={Search}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.currentTarget.value)}
        />
      </div>
      {children}
      <Button type="submit" variant="secondary">
        Search
      </Button>
      <Button
        variant="ghost"
        disabled={draft === '' && query === ''}
        onClick={() => {
          setDraft('')
          onSearch('')
        }}
      >
        Clear
      </Button>
      {end && <div className={styles.end}>{end}</div>}
    </form>
  )
}
