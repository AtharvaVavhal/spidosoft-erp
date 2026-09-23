/**
 * dbo.ItemMaster — 25 confirmed columns (docs/04 §2). Property names are the exact column names,
 * including source spellings (HSNCODE, SystEmentryDate). No column is added.
 *
 * TBD — pending Spidosoft confirmation:
 *  - which key identifies an Item: ID and ItemCode are both marked PK (docs/10 C3)
 *  - FK target tables for the *Id columns (docs/10 §9-8)
 *  - Status / Last Modified / Item Group / Base Unit do NOT exist in this table (docs/10 §2G)
 */
export interface ItemMaster {
  ID: number
  ItemCode: string
  ItemName: string | null
  Material: string | null
  ItemType: string | null
  ItemSubType: string | null
  Color: string | null
  UOM: string | null
  HSNCODE: string | null
  GSTRate: number | null
  PurchaseCost: number | null
  SellingPrice: number | null
  Username: string | null
  LoginBranch: string | null
  SystEmentryDate: string | null
  RawMaterial: string | null
  SubCategoryId: number | null
  ManufacturerId: number | null
  ColourId: number | null
  UnitId: number | null
  UserId: number | null
  BranchId: number | null
  CategoryId: number | null
  DrawingNo: string | null
  Specification: string | null
}

/**
 * Write model — mirrors backend ItemRequest. Excludes ID (identity TBD, C15) and audit columns
 * Username, LoginBranch, SystEmentryDate, UserId, BranchId (population TBD, §9-9).
 */
export type ItemWrite = Omit<
  ItemMaster,
  'ID' | 'Username' | 'LoginBranch' | 'SystEmentryDate' | 'UserId' | 'BranchId'
>

export interface ItemSearchParams {
  /** Matched against ItemCode and ItemName. */
  q: string
  page: number
  size: number
}
