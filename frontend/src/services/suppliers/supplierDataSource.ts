import type { PageResponse } from '@/types/api'
import type { SupplierMaster, SupplierOption } from '@/types/supplier'

/** Supplier Master data source (read-only; create/edit is outside the confirmed scope — docs/10 §11). */
export interface SupplierDataSource {
  search(params: { q: string; page: number; size: number }): Promise<PageResponse<SupplierMaster>>
  /** `id` is SupplierMaster.Id — the confirmed primary key. */
  getById(id: number): Promise<SupplierMaster>
  listOptions(): Promise<SupplierOption[]>
}
