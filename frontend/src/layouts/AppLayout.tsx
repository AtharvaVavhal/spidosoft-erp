import { Outlet } from 'react-router'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/utils/cn'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppLayout.module.css'

/**
 * Application shell: canvas-family sidebar, single-row top bar, scrolling workspace.
 * The sidebar is expanded by default; collapsing is a user action (no automatic collapse — r5).
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('erp.sidebar.collapsed', false)
  return (
    <div className={cn(styles.shell, collapsed && styles.collapsed)}>
      <a className={styles.skipLink} href="#workspace">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={styles.main}>
        <TopBar />
        <main id="workspace" className={styles.workspace} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
