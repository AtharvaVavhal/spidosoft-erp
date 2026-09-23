import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { supplierDataSource } from '@/services/suppliers'

interface SearchParams {
  q: string
  page: number
  size: number
}

export function useSupplierSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['suppliers', 'search', params],
    queryFn: () => supplierDataSource.search(params),
    placeholderData: keepPreviousData,
  })
}

export function useSupplier(id: number | null) {
  return useQuery({
    queryKey: ['suppliers', 'detail', id],
    queryFn: () => supplierDataSource.getById(id as number),
    enabled: id !== null,
  })
}
