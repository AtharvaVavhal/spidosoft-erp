import { Link } from 'react-router'
import { Alert } from '@/components/Alert/Alert'
import { Badge } from '@/components/Badge/Badge'
import { Button } from '@/components/Button/Button'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Panel, PanelSection } from '@/components/Panel/Panel'
import { Skeleton } from '@/components/States/States'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSystemHealth, useSystemVersion } from '@/hooks/useSystem'
import { formatText } from '@/utils/format'
import { DetailList } from './shared/DetailList'
import styles from './DashboardPage.module.css'

/** Dashboard content is TBD (docs/06 §7). The system panel calls the real backend (/api/system/*). */
export function DashboardPage() {
  useDocumentTitle('Dashboard')
  const health = useSystemHealth()
  const version = useSystemVersion()

  return (
    <>
      <PageHeader title="Dashboard" description="SpidoSoft ERP — foundation build" />
      <Alert tone="info">Dashboard content is pending confirmation of scope. Master data is available from the sidebar.</Alert>
      <div className={styles.grid}>
        <Panel>
          <PanelSection
            title="Backend status"
            aside={
              health.isSuccess ? (
                <Badge tone={health.data.status === 'UP' ? 'success' : 'danger'}>API {health.data.status}</Badge>
              ) : undefined
            }
          >
            {health.isPending || version.isPending ? (
              <div style={{ display: 'grid', gap: 12 }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="50%" />
              </div>
            ) : health.isError ? (
              <>
                <Alert tone="danger" title="Backend not reachable.">
                  {health.error.message} Start it with <code>./mvnw spring-boot:run</code> in <code>backend/</code>.
                </Alert>
                <div style={{ marginTop: 12 }}>
                  <Button
                    onClick={() => {
                      void health.refetch()
                      void version.refetch()
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </>
            ) : (
              <DetailList
                items={[
                  {
                    label: 'Database',
                    value:
                      health.data.database === 'NOT_CONFIGURED' ? (
                        <Badge tone="neutral">Not configured</Badge>
                      ) : (
                        <Badge tone={health.data.database === 'UP' ? 'success' : 'danger'}>{health.data.database}</Badge>
                      ),
                  },
                  { label: 'Version', value: version.data ? version.data.version : '—', numeric: true },
                  { label: 'Spring Boot', value: version.data ? version.data.springBootVersion : '—', numeric: true },
                  { label: 'Java', value: version.data ? version.data.javaVersion : '—', numeric: true },
                  { label: 'Built', value: formatText(version.data?.buildTime ?? null), numeric: true, full: true },
                ]}
              />
            )}
          </PanelSection>
        </Panel>
        <Panel>
          <PanelSection title="Masters">
            <ul className={styles.links}>
              <li>
                <Link to="/masters/items">Item Master</Link>
              </li>
              <li>
                <Link to="/masters/customers">Customer Master</Link>
              </li>
              <li>
                <Link to="/masters/suppliers">Supplier Master</Link>
              </li>
            </ul>
          </PanelSection>
        </Panel>
      </div>
    </>
  )
}
