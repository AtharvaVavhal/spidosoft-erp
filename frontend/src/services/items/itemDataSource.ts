import type { PageResponse } from '@/types/api'
import type { ItemMaster, ItemSearchParams, ItemWrite } from '@/types/item'

/**
 * Item Master data source. Implemented by the mock adapter today; an HTTP adapter against the
 * provisional /api/items contract replaces it once docs/10 §10 is resolved.
 *
 * TBD — pending Spidosoft confirmation: `id` is ItemMaster.ID. ID and ItemCode are both marked PK,
 * and which one identifies an Item is undecided (docs/10 C3).
 */
export interface ItemDataSource {
  search(params: ItemSearchParams): Promise<PageResponse<ItemMaster>>
  getById(id: number): Promise<ItemMaster>
  create(input: ItemWrite): Promise<ItemMaster>
  update(id: number, input: ItemWrite): Promise<ItemMaster>
}
