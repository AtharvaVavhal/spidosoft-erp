import { z } from 'zod'
import { ColumnLimits } from '@/utils/columnLimits'
import { optionalDigits, optionalText } from '@/utils/schemas'
import type { ShellSection } from '../masters/PartyFormShell'

const L = ColumnLimits.supplier

/**
 * Documented SupplierMaster columns (docs/04 §4). PinCode/Telephone/Mobile are numeric(6,0)/(18,0)/(10,0)
 * here — different from CustomerMaster and deliberately not reconciled (docs/10 C7). Nothing is required.
 */
export const supplierFormSchema = z.object({
  SuppCode: optionalText(),
  SuppName: optionalText(),
  ContactPerson: optionalText(),
  Branch: optionalText(),
  Address1: optionalText(),
  Address2: optionalText(),
  City: optionalText(),
  State: optionalText(),
  PinCode: optionalDigits(L.PinCode),
  Country: optionalText(),
  EmailID: optionalText(),
  Telephone: optionalDigits(L.Telephone),
  Mobile: optionalDigits(L.Mobile),
  Fax: optionalText(),
  Website: optionalText(),
  GSTIN: optionalText(),
  Remarks: optionalText(),
})

export type SupplierFormInput = z.input<typeof supplierFormSchema>

export const EMPTY_SUPPLIER_FORM = Object.fromEntries(
  Object.keys(supplierFormSchema.shape).map((k) => [k, '']),
) as SupplierFormInput

export const SUPPLIER_SECTIONS: Array<ShellSection<SupplierFormInput>> = [
  {
    title: 'Supplier details',
    fields: [
      { name: 'SuppCode', label: 'Supplier Code', hint: 'Uniqueness and generation pending confirmation' },
      { name: 'SuppName', label: 'Supplier Name' },
      { name: 'ContactPerson', label: 'Contact Person' },
      { name: 'Branch', label: 'Branch' },
      { name: 'GSTIN', label: 'GSTIN' },
    ],
  },
  {
    title: 'Address',
    fields: [
      { name: 'Address1', label: 'Address 1' },
      { name: 'Address2', label: 'Address 2' },
      { name: 'City', label: 'City' },
      { name: 'State', label: 'State' },
      { name: 'PinCode', label: 'PIN Code', maxLength: L.PinCode, inputMode: 'numeric', hint: 'Digits only (numeric column)' },
      { name: 'Country', label: 'Country' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { name: 'EmailID', label: 'Email ID', inputMode: 'email' },
      { name: 'Telephone', label: 'Telephone', maxLength: L.Telephone, inputMode: 'numeric', hint: 'Digits only (numeric column)' },
      { name: 'Mobile', label: 'Mobile', maxLength: L.Mobile, inputMode: 'numeric', hint: 'Digits only, up to 10' },
      { name: 'Fax', label: 'Fax' },
      { name: 'Website', label: 'Website', inputMode: 'url' },
      { name: 'Remarks', label: 'Remarks', multiline: true },
    ],
  },
]
