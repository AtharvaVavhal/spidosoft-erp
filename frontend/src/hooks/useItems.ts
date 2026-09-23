import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { itemDataSource } from '@/services/items'
import type { ItemSearchParams, ItemWrite } from '@/types/item'

export const itemKeys = {
  all: ['items'] as const,
  search: (params: ItemSearchParams) => ['items', 'search', params] as const,
  detail: (id: number) => ['items', 'detail', id] as const,
}

export function useItemSearch(params: ItemSearchParams) {
  return useQuery({
    queryKey: itemKeys.search(params),
    queryFn: () => itemDataSource.search(params),
    placeholderData: keepPreviousData,
  })
}

export function useItem(id: number | null) {
  return useQuery({
    queryKey: itemKeys.detail(id ?? -1),
    queryFn: () => itemDataSource.getById(id as number),
    enabled: id !== null,
  })
}

export function useCreateItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ItemWrite) => itemDataSource.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  })
}

export function useUpdateItem(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ItemWrite) => itemDataSource.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  })
}
