import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Button, ButtonLink } from '@/components/Button/Button'
import { DataTable, type DataTableColumn } from '@/components/DataTable/DataTable'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Pagination } from '@/components/Pagination/Pagination'
import { EmptyState, ErrorState } from '@/components/States/States'
import { useListParams } from '@/hooks/useListParams'
import { ListPageLayout } from '@/layouts/ListPageLayout'
import { SearchToolbar } from '@/layouts/Toolbar'
import type { PageResponse } from '@/types/api'
import { tableStatus } from '@/pages/shared/queryState'

interface Query<T> {
  isPending: boolean
  isError: boolean
  error: Error | null
  data?: PageResponse<T>
  refetch: () => unknown
}

/** Shared list shell for Customer and Supplier Master (read-only, mock data source). */
export function PartyListShell<T>({
  title,
  noun,
  createTo,
  columns,
  rowKey,
  useSearch,
  notice,
}: {
  title: string
  noun: string
  createTo: string
  columns: Array<DataTableColumn<T>>
  rowKey: (row: T) => number
  useSearch: (params: { q: string; page: number; size: number }) => Query<T>
  notice?: ReactNode
}) {
  const { params, update } = useListParams()
  const query = useSearch(params)
  const total = query.data?.totalElements ?? 0
  const status = tableStatus(query)

  return (
    <ListPageLayout
      header={
        <PageHeader
          title={title}
          description="Sample data from a mock data source — backend pending database confirmation"
          actions={
            <ButtonLink variant="primary" icon={Plus} to={createTo}>
              Create New
            </ButtonLink>
          }
        />
      }
      notice={notice}
    >
      <SearchToolbar
        query={params.q}
        placeholder={`Search ${noun} code or name`}
        onSearch={(q) => update({ q, page: 0 })}
        end={query.isPending ? 'Loading…' : query.isError ? '—' : `${total} ${total === 1 ? 'result' : 'results'}`}
      />
      <DataTable
        label={title}
        columns={columns}
        rows={query.data?.content ?? []}
        rowKey={rowKey}
        status={status}
        minWidth={980}
        emptyState={
          <EmptyState
            title={params.q ? `No ${noun}s match your search` : `No ${noun}s yet`}
            description={params.q ? 'Try a different code or name, or clear the search.' : undefined}
            action={params.q ? <Button onClick={() => update({ q: '', page: 0 })}>Clear search</Button> : undefined}
          />
        }
        errorState={
          <ErrorState title={`${title} couldn't be loaded.`} message={query.error?.message ?? ''} onRetry={() => void query.refetch()} />
        }
      />
      {status === 'ready' && (
        <Pagination
          page={params.page}
          size={params.size}
          totalElements={total}
          onPageChange={(page) => update({ page })}
          onSizeChange={(size) => update({ size, page: 0 })}
        />
      )}
    </ListPageLayout>
  )
}
