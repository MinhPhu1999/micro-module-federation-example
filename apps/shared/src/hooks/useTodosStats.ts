import { useQuery } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import { todoKeys } from './useTodos'

export function useTodosStats() {
  return useQuery({
    queryKey: todoKeys.stats(),
    queryFn: async () => {
      const { data } = await todoApi.stats()
      return data.data
    },
  })
}
