import { assertMockMode } from '../dataSourceMode'
import type { ItemDataSource } from './itemDataSource'
import { mockItemDataSource } from './mockItemDataSource'

assertMockMode('Item Master')

/** Swap for an HTTP adapter when /api/items is implemented (docs/10 §10). */
export const itemDataSource: ItemDataSource = mockItemDataSource
export type { ItemDataSource }
