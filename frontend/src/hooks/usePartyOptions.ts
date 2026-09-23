import { useQuery } from '@tanstack/react-query'
import { customerDataSource } from '@/services/customers'
import { supplierDataSource } from '@/services/suppliers'
import type { PartyOption, PartyType } from '@/types/mapping'

/** Options for the mapping Select Code / Select Name controls, normalised across both master tables. */
export function usePartyOptions(type: PartyType) {
  return useQuery({
    queryKey: ['party-options', type],
    queryFn: async (): Promise<PartyOption[]> => {
      if (type === 'SUPPLIER') {
        const rows = await supplierDataSource.listOptions()
        return rows.map((r) => ({ id: r.Id, code: r.SuppCode, name: r.SuppName }))
      }
      const rows = await customerDataSource.listOptions()
      return rows.map((r) => ({ id: r.Id, code: r.CustCode, name: r.CustName }))
    },
    staleTime: 60_000,
  })
}
