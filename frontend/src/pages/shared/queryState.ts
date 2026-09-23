import type { DataTableStatus } from '@/components/DataTable/DataTable'

/** Maps TanStack Query state to the DataTable status (loading and loaded share one geometry). */
export function tableStatus(query: { isPending: boolean; isError: boolean; data?: { content: unknown[] } }): DataTableStatus {
  if (query.isPending) return 'loading'
  if (query.isError) return 'error'
  return query.data && query.data.content.length > 0 ? 'ready' : 'empty'
}
