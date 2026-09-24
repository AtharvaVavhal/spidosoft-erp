import { describe, expect, it } from 'vitest'
import type { ItemMaster } from '@/types/item'
import { EMPTY_ITEM_FORM, formValuesToItemWrite, itemFormSchema, itemToFormInput } from './itemFormSchema'

describe('itemFormSchema', () => {
  it('requires only ItemCode (the only NOT NULL user-entered column)', () => {
    const result = itemFormSchema.safeParse(EMPTY_ITEM_FORM)
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((i) => i.path.join('.'))).toEqual(['ItemCode'])

    const ok = itemFormSchema.parse({ ...EMPTY_ITEM_FORM, ItemCode: 'RM-1001' })
    expect(ok.ItemCode).toBe('RM-1001')
    expect(ok.ItemName).toBeNull()
    expect(ok.GSTRate).toBeNull()
  })

  it('applies the confirmed varchar limits', () => {
    const tooLong = { ...EMPTY_ITEM_FORM, ItemCode: 'x'.repeat(256), DrawingNo: 'd'.repeat(51), Specification: 's'.repeat(501) }
    const paths = itemFormSchema.safeParse(tooLong).error?.issues.map((i) => i.path.join('.'))
    expect(paths).toEqual(expect.arrayContaining(['ItemCode', 'DrawingNo', 'Specification']))
  })
})

describe('item form mapping', () => {
  const item = {
    ID: 7, ItemCode: 'RM-1007', ItemName: 'Copper Busbar', Material: null, ItemType: null, ItemSubType: null,
    Color: null, UOM: 'KG', HSNCODE: '74071010', GSTRate: 18, PurchaseCost: 905, SellingPrice: null,
    Username: null, LoginBranch: null, SystEmentryDate: null, RawMaterial: null, SubCategoryId: 3,
    ManufacturerId: 4, ColourId: null, UnitId: 9, UserId: null, BranchId: null, CategoryId: 2,
    DrawingNo: null, Specification: null,
  } satisfies ItemMaster

  it('round-trips an item into form input with fixed-scale decimals', () => {
    const input = itemToFormInput(item)
    expect(input.GSTRate).toBe('18.00')
    expect(input.SellingPrice).toBe('')
    expect(input.ItemName).toBe('Copper Busbar')
  })

  it('keeps existing FK ids on update and sends null on create (lookup tables unknown)', () => {
    const values = itemFormSchema.parse(itemToFormInput(item))
    expect(formValuesToItemWrite(values, item)).toMatchObject({ SubCategoryId: 3, ManufacturerId: 4, UnitId: 9, CategoryId: 2 })
    expect(formValuesToItemWrite(values)).toMatchObject({ SubCategoryId: null, ManufacturerId: null, UnitId: null, CategoryId: null })
  })
})
