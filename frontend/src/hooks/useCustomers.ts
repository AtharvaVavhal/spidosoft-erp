import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { customerDataSource } from '@/services/customers'

interface SearchParams {
  q: string
  page: number
  size: number
}

export function useCustomerSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['customers', 'search', params],
    queryFn: () => customerDataSource.search(params),
    placeholderData: keepPreviousData,
  })
}

export function useCustomer(id: number | null) {
  return useQuery({
    queryKey: ['customers', 'detail', id],
    queryFn: () => customerDataSource.getById(id as number),
    enabled: id !== null,
  })
}
