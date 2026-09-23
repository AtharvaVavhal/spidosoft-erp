import { Pencil, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/Button/Button'
import { DataTable, type DataTableColumn } from '@/components/DataTable/DataTable'
import { IconLink } from '@/components/IconButton/IconButton'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Pagination } from '@/components/Pagination/Pagination'
import { EmptyState, ErrorState } from '@/components/States/States'
import { TbdTag, TbdValue } from '@/components/Tbd/Tbd'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useItemSearch } from '@/hooks/useItems'
import { useListParams } from '@/hooks/useListParams'
import { ListPageLayout } from '@/layouts/ListPageLayout'
import { SearchToolbar } from '@/layouts/Toolbar'
import { Button } from '@/components/Button/Button'
import type { ItemMaster } from '@/types/item'
import { formatDecimal, formatText } from '@/utils/format'
import { tableStatus } from '../shared/queryState'

const STATUS_TBD = 'ItemMaster has no status column (docs/10 §2G)'
const MODIFIED_TBD = 'ItemMaster has no modified timestamp (docs/10 C13)'

/**
 * Columns: confirmed ItemMaster columns plus two TBD columns. Fixed widths fit their longest value
 * (r5; date/time baseline 160; row-action 56 = 28px button + cell padding); Item Name is the single
 * flexible column. Min width 980 (fits 1280 with the expanded sidebar).
 * Item Group / Base Unit are not shown: their source columns are TBD (docs/10 §2G).
 */
const columns: Array<DataTableColumn<ItemMaster>> = [
  { key: 'code', header: 'Item Code', width: 96, render: (r) => <span className="tabular">{r.ItemCode}</span> },
  { key: 'name', header: 'Item Name', render: (r) => formatText(r.ItemName), title: (r) => r.ItemName ?? undefined },
  { key: 'type', header: 'Item Type', width: 120, tone: 'secondary', render: (r) => formatText(r.ItemType) },
  { key: 'uom', header: 'UOM', width: 64, tone: 'secondary', render: (r) => formatText(r.UOM) },
  { key: 'hsn', header: 'HSN Code', width: 96, tone: 'secondary', render: (r) => <span className="tabular">{formatText(r.HSNCODE)}</span> },
  { key: 'gst', header: 'GST Rate', width: 80, align: 'right', render: (r) => formatDecimal(r.GSTRate) },
  {
    key: 'status',
    header: (
      <>
        Status <TbdTag reason={STATUS_TBD} />
      </>
    ),
    width: 88,
    render: () => <TbdValue reason={STATUS_TBD} />,
    skeletonWidth: 40,
  },
  {
    key: 'modified',
    header: (
      <>
        Last Modified <TbdTag reason={MODIFIED_TBD} />
      </>
    ),
    width: 160,
    align: 'right',
    render: () => <TbdValue reason={MODIFIED_TBD} />,
  },
  {
    key: 'actions',
    header: <span className="sr-only">Actions</span>,
    width: 56,
    align: 'right',
    render: (r) => <IconLink icon={Pencil} label={`Open ${r.ItemCode}`} to={`/masters/items/${r.ID}`} />,
    skeletonWidth: 16,
  },
]

export function ItemListPage() {
  useDocumentTitle('Item Master')
  const { params, update } = useListParams()
  const query = useItemSearch(params)
  const total = query.data?.totalElements ?? 0

  return (
    <ListPageLayout
      header={
        <PageHeader
          title="Item Master"
          description="Sample data from a mock data source — backend pending database confirmation"
          actions={
            <ButtonLink variant="primary" icon={Plus} to="/masters/items/new">
              Create New
            </ButtonLink>
          }
        />
      }
    >
      <SearchToolbar
        query={params.q}
        placeholder="Search item code or name"
        onSearch={(q) => update({ q, page: 0 })}
        end={query.isPending ? 'Loading…' : query.isError ? '—' : `${total} ${total === 1 ? 'result' : 'results'}`}
      />
      <DataTable
        label="Items"
        columns={columns}
        rows={query.data?.content ?? []}
        rowKey={(r) => r.ID}
        status={tableStatus(query)}
        minWidth={980}
        emptyState={
          <EmptyState
            title={params.q ? 'No items match your search' : 'No items yet'}
            description={params.q ? 'Try a different item code or name, or clear the search.' : 'Create the first item to get started.'}
            action={
              params.q ? (
                <Button onClick={() => update({ q: '', page: 0 })}>Clear search</Button>
              ) : undefined
            }
          />
        }
        errorState={
          <ErrorState
            title="Items couldn't be loaded."
            message={query.error?.message ?? ''}
            onRetry={() => void query.refetch()}
          />
        }
      />
      {tableStatus(query) === 'ready' && (
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
