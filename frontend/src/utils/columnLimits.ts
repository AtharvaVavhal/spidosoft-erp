/**
 * Confirmed column type limits (docs/04, evidence E1–E6). Mirrors backend
 * com.spidosoft.erp.validation.ColumnLimits. These are type limits, NOT business rules.
 * varchar(max) columns have no limit here (engine TBD).
 */
export const ColumnLimits = {
  item: {
    ItemCode: 255,
    UOM: 255,
    HSNCODE: 255,
    RawMaterial: 50,
    DrawingNo: 50,
    Specification: 500,
  },
  /** decimal(20,2): 18 integer digits, 2 fraction digits. */
  decimal20_2: { integer: 18, fraction: 2 },
  customer: { PinCode: 20, Telephone: 20, Mobile: 20 },
  /** numeric(p,0) digit counts. */
  supplier: { PinCode: 6, Telephone: 18, Mobile: 10 },
} as const
