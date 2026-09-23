/**
 * dbo.SupplierMaster — 27 confirmed columns (docs/04 §4). Exact column names, including lower-case
 * `supptypeid`. PinCode/Telephone/Mobile are numeric in this table (docs/10 C7 — not reconciled).
 */
export interface SupplierMaster {
  Id: number
  SuppCode: string | null
  SuppName: string | null
  ContactPerson: string | null
  Branch: string | null
  Address1: string | null
  Address2: string | null
  City: string | null
  State: string | null
  PinCode: number | null
  Country: string | null
  EmailID: string | null
  /**
   * numeric(18,0). TODO(api-contract): values above Number.MAX_SAFE_INTEGER (16 digits) lose precision in
   * JSON → JS number. Transport as string is a backend contract decision (docs/10 C7) — not decided here.
   */
  Telephone: number | null
  Mobile: number | null
  Fax: string | null
  Website: string | null
  GSTIN: string | null
  Remarks: string | null
  Username: string | null
  LoginBranch: string | null
  SystEmentryDate: string | null
  supptypeid: number | null
  CountryId: number | null
  StateId: number | null
  CityId: number | null
  BranchId: number | null
  LoginUserId: number | null
}

export type SupplierOption = Pick<SupplierMaster, 'Id' | 'SuppCode' | 'SuppName'>
