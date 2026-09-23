import { z } from 'zod'
import type { ItemMaster, ItemWrite } from '@/types/item'
import { ColumnLimits } from '@/utils/columnLimits'
import { optionalDecimal20_2, optionalText } from '@/utils/schemas'

const L = ColumnLimits.item

/**
 * Item Master form validation — ONLY confirmed column constraints (docs/04 §2):
 *  - ItemCode: NOT NULL, varchar(255). It is the only required field.
 *    TBD — pending Spidosoft confirmation: user-entered or generated? (docs/10 §9-2)
 *  - varchar(n) length limits; decimal(20,2) precision.
 * No business-required field or format rule is invented (docs/10 §9-7).
 */
export const itemFormSchema = z.object({
  ItemCode: z.string().trim().min(1, 'Item Code is required').max(L.ItemCode, `Maximum ${L.ItemCode} characters`),
  ItemName: optionalText(),
  ItemType: optionalText(),
  ItemSubType: optionalText(),
  Material: optionalText(),
  RawMaterial: optionalText(L.RawMaterial),
  Color: optionalText(),
  UOM: optionalText(L.UOM),
  DrawingNo: optionalText(L.DrawingNo),
  HSNCODE: optionalText(L.HSNCODE),
  GSTRate: optionalDecimal20_2(),
  PurchaseCost: optionalDecimal20_2(),
  SellingPrice: optionalDecimal20_2(),
  Specification: optionalText(L.Specification),
})

export type ItemFormInput = z.input<typeof itemFormSchema>
export type ItemFormValues = z.output<typeof itemFormSchema>

export const ITEM_FIELD_LABELS: Record<keyof ItemFormInput, string> = {
  ItemCode: 'Item Code',
  ItemName: 'Item Name',
  ItemType: 'Item Type',
  ItemSubType: 'Item Sub Type',
  Material: 'Material',
  RawMaterial: 'Raw Material',
  Color: 'Color',
  UOM: 'UOM',
  DrawingNo: 'Drawing No',
  HSNCODE: 'HSN Code',
  GSTRate: 'GST Rate',
  PurchaseCost: 'Purchase Cost',
  SellingPrice: 'Selling Price',
  Specification: 'Specification',
}

export const EMPTY_ITEM_FORM: ItemFormInput = {
  ItemCode: '',
  ItemName: '',
  ItemType: '',
  ItemSubType: '',
  Material: '',
  RawMaterial: '',
  Color: '',
  UOM: '',
  DrawingNo: '',
  HSNCODE: '',
  GSTRate: '',
  PurchaseCost: '',
  SellingPrice: '',
  Specification: '',
}

const text = (v: string | null) => v ?? ''
const decimal = (v: number | null) => (v === null ? '' : v.toFixed(2))

export function itemToFormInput(item: ItemMaster): ItemFormInput {
  return {
    ItemCode: item.ItemCode,
    ItemName: text(item.ItemName),
    ItemType: text(item.ItemType),
    ItemSubType: text(item.ItemSubType),
    Material: text(item.Material),
    RawMaterial: text(item.RawMaterial),
    Color: text(item.Color),
    UOM: text(item.UOM),
    DrawingNo: text(item.DrawingNo),
    HSNCODE: text(item.HSNCODE),
    GSTRate: decimal(item.GSTRate),
    PurchaseCost: decimal(item.PurchaseCost),
    SellingPrice: decimal(item.SellingPrice),
    Specification: text(item.Specification),
  }
}

/**
 * Builds the write model. FK id columns are sent as null: their lookup tables are unknown
 * (docs/10 §9-8), so the form cannot offer values for them.
 */
export function formValuesToItemWrite(values: ItemFormValues, existing?: ItemMaster): ItemWrite {
  return {
    ...values,
    SubCategoryId: existing?.SubCategoryId ?? null,
    ManufacturerId: existing?.ManufacturerId ?? null,
    ColourId: existing?.ColourId ?? null,
    UnitId: existing?.UnitId ?? null,
    CategoryId: existing?.CategoryId ?? null,
  }
}
