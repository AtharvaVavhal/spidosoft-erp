import { NavLink } from 'react-router'
import { LayoutDashboard, Package, PanelLeftClose, PanelLeftOpen, Truck, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import styles from './Sidebar.module.css'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

/** Module grouping is provisional (docs/06 §9 — sections TBC); only confirmed masters are listed. */
const NAV: NavGroup[] = [
  { label: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  {
    label: 'Masters',
    items: [
      { to: '/masters/items', label: 'Item Master', icon: Package },
      { to: '/masters/customers', label: 'Customer Master', icon: Users },
      { to: '/masters/suppliers', label: 'Supplier Master', icon: Truck },
    ],
  },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className={cn(styles.sidebar, collapsed && styles.collapsed)} aria-label="Primary">
      <div className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">
          S
        </span>
        <span className={styles.brandName}>SpidoSoft</span>
        <span className={styles.brandSub}>ERP</span>
      </div>
      <nav className={styles.nav} aria-label="Modules">
        {NAV.map((group) => (
          <div key={group.label} className={styles.group}>
            <div className={styles.groupLabel} id={`nav-${group.label}`}>
              {group.label}
            </div>
            <ul className={styles.list} aria-labelledby={`nav-${group.label}`}>
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={styles.item} title={collapsed ? label : undefined}>
                    <Icon aria-hidden="true" />
                    <span className={styles.label}>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className={styles.footer}>
        <button
          type="button"
          className={cn(styles.item, styles.toggle)}
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
          <span className={styles.label}>Collapse</span>
        </button>
      </div>
    </aside>
  )
}
