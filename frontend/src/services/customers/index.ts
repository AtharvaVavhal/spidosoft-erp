import { assertMockMode } from '../dataSourceMode'
import type { CustomerDataSource } from './customerDataSource'
import { mockCustomerDataSource } from './mockCustomerDataSource'

assertMockMode('Customer Master')

export const customerDataSource: CustomerDataSource = mockCustomerDataSource
export type { CustomerDataSource }
