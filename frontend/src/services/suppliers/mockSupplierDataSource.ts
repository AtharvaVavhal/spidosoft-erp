import type { SupplierMaster } from '@/types/supplier'
import { ApiError } from '../http/apiError'
import { isEmptyMode, matches, mockCall, paginate } from '../mock/mockRuntime'
import type { SupplierDataSource } from './supplierDataSource'

/**
 * Fictitious SAMPLE suppliers using confirmed SupplierMaster columns only. Codes SMSP0001–0007 match the
 * Reference UI sample (a sample pattern, not a generation rule — docs/10 §2H).
 */
const SEED: Array<[code: string, name: string, contact: string, city: string, state: string, mobile: number]> = [
  ['SMSP0001', 'Hindalco Industries Ltd', 'V. Rao', 'Mumbai', 'Maharashtra', 9820011111],
  ['SMSP0002', 'Jindal Aluminium Ltd', 'R. Gupta', 'Bengaluru', 'Karnataka', 9845022222],
  ['SMSP0003', 'Deccan Metal Traders', 'S. Kale', 'Pune', 'Maharashtra', 9822033333],
  ['SMSP0004', 'Sai Extrusions Pvt Ltd', 'A. Pawar', 'Pune', 'Maharashtra', 9890044444],
  ['SMSP0005', 'Om Industrial Supplies', 'D. Shinde', 'Nashik', 'Maharashtra', 9765055555],
  ['SMSP0006', 'Precision Fasteners Co.', 'H. Mehta', 'Ludhiana', 'Punjab', 9814066666],
  ['SMSP0007', 'Western Bearings Agency', 'J. Desai', 'Ahmedabad', 'Gujarat', 9825077777],
]

const suppliers: SupplierMaster[] = SEED.map(([code, name, contact, city, state, mobile], index) => ({
  Id: index + 1,
  SuppCode: code,
  SuppName: name,
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
  GSTIN: null,
  Remarks: null,
  Username: null,
  LoginBranch: null,
  SystEmentryDate: null,
  supptypeid: null,
  CountryId: null,
  StateId: null,
  CityId: null,
  BranchId: null,
  LoginUserId: null,
}))

export const mockSupplierDataSource: SupplierDataSource = {
  search: ({ q, page, size }) =>
    mockCall(() => paginate(isEmptyMode() ? [] : suppliers.filter((s) => matches(q, s.SuppCode, s.SuppName)), page, size)),
  getById: (id) =>
    mockCall(() => {
      const found = suppliers.find((s) => s.Id === id)
      if (!found) throw new ApiError('NOT_FOUND', `Supplier ${id} was not found.`, { status: 404 })
      return { ...found }
    }),
  listOptions: () =>
    mockCall(() => suppliers.map(({ Id, SuppCode, SuppName }) => ({ Id, SuppCode, SuppName }))),
}
