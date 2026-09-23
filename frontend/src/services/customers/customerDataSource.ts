import type { PageResponse } from '@/types/api'
import type { CustomerMaster, CustomerOption } from '@/types/customer'

/** Customer Master data source (read-only; create/edit is outside the confirmed scope — docs/10 §11). */
export interface CustomerDataSource {
  search(params: { q: string; page: number; size: number }): Promise<PageResponse<CustomerMaster>>
  /** `id` is CustomerMaster.Id — the confirmed primary key. */
  getById(id: number): Promise<CustomerMaster>
  /** Filtering/ordering of options is TBD (docs/02 Q-12). */
  listOptions(): Promise<CustomerOption[]>
}
