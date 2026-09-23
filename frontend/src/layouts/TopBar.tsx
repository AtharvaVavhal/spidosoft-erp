import { useMatches } from 'react-router'
import { Building2 } from 'lucide-react'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs/Breadcrumbs'
import { TbdTag } from '@/components/Tbd/Tbd'
import styles from './TopBar.module.css'

export interface RouteHandle {
  crumb?: Crumb | ((params: Record<string, string | undefined>) => Crumb)
}

function useCrumbs(): Crumb[] {
  return useMatches().flatMap((match) => {
    const handle = match.handle as RouteHandle | undefined
    if (!handle?.crumb) return []
    return [typeof handle.crumb === 'function' ? handle.crumb(match.params) : handle.crumb]
  })
}

/**
 * Branch switching and the account menu are critical actions (r4), but branch scoping and
 * authentication are TBD (docs/10 §9-9, §2H). They are shown as present-but-unavailable controls.
 */
export function TopBar() {
  const crumbs = useCrumbs()
  return (
    <header className={styles.topbar}>
      <Breadcrumbs items={crumbs} />
      <span className={styles.spacer} />
      <button
        type="button"
        className={styles.chip}
        aria-disabled="true"
        aria-label="Branch: not available — branch scoping pending confirmation"
        title="Branch scoping is pending Spidosoft confirmation"
      >
        <Building2 aria-hidden="true" />
        <span className={styles.chipText}>Branch</span>
        <TbdTag reason="branch scoping (docs/10 §9-9)" />
      </button>
      <button
        type="button"
        className={styles.account}
        aria-disabled="true"
        aria-label="Account: not available — authentication pending confirmation"
        title="Authentication is pending Spidosoft confirmation"
      >
        <span className={styles.avatar} aria-hidden="true">
          ?
        </span>
        <span className={styles.accountMeta}>
          <span className={styles.accountName}>Not signed in</span>
          <span className={styles.accountRole}>Authentication TBD</span>
        </span>
      </button>
    </header>
  )
}
