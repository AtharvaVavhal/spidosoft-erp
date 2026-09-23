/**
 * Item ↔ Customer/Supplier mapping — UI state only.
 * Persistence model intentionally deferred (docs/10 §9 decisions 3–6).
 */

/** The confirmed "Is Supplier" / "Is Customer" choice (docs/02 R-4). */
export type PartyType = 'SUPPLIER' | 'CUSTOMER'

/** A party as offered by Select Code / Select Name. `id` is the master table's Id (PK). */
export interface PartyOption {
  id: number
  code: string | null
  name: string | null
}

/** One row bound into the GridView by Add (docs/02 R-5). Not persisted. */
export interface MappingGridRow {
  /** Client-only key for list rendering. */
  rowKey: string
  partyType: PartyType
  party: PartyOption
}
