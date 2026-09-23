/** dbo.CustomerMaster — 28 confirmed columns (docs/04 §3). Exact column names. */
export interface CustomerMaster {
  Id: number
  CustCode: string | null
  CustName: string | null
  ContactPerson: string | null
  Branch: string | null
  Address1: string | null
  Address2: string | null
  City: string | null
  State: string | null
  PinCode: string | null
  Country: string | null
  EmailID: string | null
  Telephone: string | null
  Mobile: string | null
  Fax: string | null
  Website: string | null
  GSTIN: string | null
  Remarks: string | null
  Username: string | null
  LoginBranch: string | null
  SystEmentryDate: string | null
  CustomerTypeId: number | null
  CityId: number | null
  StateId: number | null
  CountryId: number | null
  BranchId: number | null
  LoginUserId: number | null
  ConsigneeId: number | null
}

/** Option row for the mapping Select Code / Select Name controls (docs/07 §1, PROPOSED). */
export type CustomerOption = Pick<CustomerMaster, 'Id' | 'CustCode' | 'CustName'>
