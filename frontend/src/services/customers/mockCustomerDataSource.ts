import type { CustomerMaster } from '@/types/customer'
import { ApiError } from '../http/apiError'
import { isEmptyMode, matches, mockCall, paginate } from '../mock/mockRuntime'
import type { CustomerDataSource } from './customerDataSource'

/**
 * Fictitious SAMPLE customers using confirmed CustomerMaster columns only. Codes follow the SMCX…
 * pattern seen in the Reference UI (a sample pattern, not a generation rule — docs/10 §2H). Duplicate
 * names are intentional: the Reference UI shows that names are not unique (docs/10 C9).
 */
const SEED: Array<[code: string, name: string, contact: string, city: string, state: string, mobile: string, gstin: string]> = [
  ['SMCX0001', 'ABCDXYZ', 'R. Kulkarni', 'Pune', 'Maharashtra', '9822012345', '27AAACA1234A1Z5'],
  ['SMCX0002', 'A-One Aluminium Works', 'S. Patil', 'Pune', 'Maharashtra', '9890123456', '27AAECA5678B1Z2'],
  ['SMCX0003', 'A-One Aluminium Works', 'S. Patil', 'Chakan', 'Maharashtra', '9890123457', '27AAECA5678B2Z1'],
  ['SMCX0004', 'Shree Fabricators', 'M. Joshi', 'Nashik', 'Maharashtra', '9765012345', '27AAFFS9012C1Z8'],
  ['SMCX0005', 'Deccan Engineering Co.', 'A. Deshmukh', 'Aurangabad', 'Maharashtra', '9423012345', '27AADCD3456D1Z4'],
  ['SMCX0006', 'Precision Tools & Dies', 'K. Iyer', 'Bengaluru', 'Karnataka', '9845012345', '29AAHCP7890E1Z6'],
  ['SMCX0007', 'Western Conveyors Pvt Ltd', 'N. Shah', 'Ahmedabad', 'Gujarat', '9825012345', '24AAACW2345F1Z9'],
  ['SMCX0008', 'Om Sai Industries', 'P. More', 'Pune', 'Maharashtra', '9011012345', '27AAHFO6789G1Z3'],
]

const customers: CustomerMaster[] = SEED.map(([code, name, contact, city, state, mobile, gstin], index) => ({
  Id: index + 1,
  CustCode: code,
  CustName: name,
  ContactPerson: contact,
  Branch: null,
  Address1: null,
  Address2: null,
  City: city,
  State: state,
  PinCode: null,
  Country: 'India',
  EmailID: null,
  Telephone: null,
  Mobile: mobile,
  Fax: null,
  Website: null,
  GSTIN: gstin,
  Remarks: null,
  Username: null,
  LoginBranch: null,
  SystEmentryDate: null,
  CustomerTypeId: null,
  CityId: null,
  StateId: null,
  CountryId: null,
  BranchId: null,
  LoginUserId: null,
  ConsigneeId: null,
}))

export const mockCustomerDataSource: CustomerDataSource = {
  search: ({ q, page, size }) =>
    mockCall(() => paginate(isEmptyMode() ? [] : customers.filter((c) => matches(q, c.CustCode, c.CustName)), page, size)),
  getById: (id) =>
    mockCall(() => {
      const found = customers.find((c) => c.Id === id)
      if (!found) throw new ApiError('NOT_FOUND', `Customer ${id} was not found.`, { status: 404 })
      return { ...found }
    }),
  listOptions: () =>
    mockCall(() => customers.map(({ Id, CustCode, CustName }) => ({ Id, CustCode, CustName }))),
}
