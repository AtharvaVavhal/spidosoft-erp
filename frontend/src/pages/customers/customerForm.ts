import { z } from 'zod'
import { ColumnLimits } from '@/utils/columnLimits'
import { optionalText } from '@/utils/schemas'
import type { ShellSection } from '../masters/PartyFormShell'

const L = ColumnLimits.customer

/** Documented CustomerMaster columns (docs/04 §3). Only the varchar(20) limits are constraints; nothing is required (§9-7). */
export const customerFormSchema = z.object({
  CustCode: optionalText(),
  CustName: optionalText(),
  ContactPerson: optionalText(),
  Branch: optionalText(),
  Address1: optionalText(),
  Address2: optionalText(),
  City: optionalText(),
  State: optionalText(),
  PinCode: optionalText(L.PinCode),
  Country: optionalText(),
  EmailID: optionalText(),
  Telephone: optionalText(L.Telephone),
  Mobile: optionalText(L.Mobile),
  Fax: optionalText(),
  Website: optionalText(),
  GSTIN: optionalText(),
  Remarks: optionalText(),
})

export type CustomerFormInput = z.input<typeof customerFormSchema>

export const EMPTY_CUSTOMER_FORM = Object.fromEntries(
  Object.keys(customerFormSchema.shape).map((k) => [k, '']),
) as CustomerFormInput

export const CUSTOMER_SECTIONS: Array<ShellSection<CustomerFormInput>> = [
  {
    title: 'Customer details',
    fields: [
      { name: 'CustCode', label: 'Customer Code', hint: 'Uniqueness and generation pending confirmation' },
      { name: 'CustName', label: 'Customer Name' },
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
      { name: 'PinCode', label: 'PIN Code', maxLength: L.PinCode },
      { name: 'Country', label: 'Country' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { name: 'EmailID', label: 'Email ID', inputMode: 'email' },
      { name: 'Telephone', label: 'Telephone', maxLength: L.Telephone, inputMode: 'tel' },
      { name: 'Mobile', label: 'Mobile', maxLength: L.Mobile, inputMode: 'tel' },
      { name: 'Fax', label: 'Fax' },
      { name: 'Website', label: 'Website', inputMode: 'url' },
      { name: 'Remarks', label: 'Remarks', multiline: true },
    ],
  },
]
