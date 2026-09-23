import { assertMockMode } from '../dataSourceMode'
import type { SupplierDataSource } from './supplierDataSource'
import { mockSupplierDataSource } from './mockSupplierDataSource'

assertMockMode('Supplier Master')

export const supplierDataSource: SupplierDataSource = mockSupplierDataSource
export type { SupplierDataSource }
