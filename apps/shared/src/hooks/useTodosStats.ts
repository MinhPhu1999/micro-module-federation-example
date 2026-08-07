import { useQuery } from '@tanstack/react-query'
import { todoApi } from "@micro-fe/shared/todoApi"
import { todoKeys } from '@micro-fe/shared/useTodos'

export function useTodosStats() {
  return useQuery({
    queryKey: todoKeys.stats(),
    queryFn: async () => {
      const { data } = await todoApi.stats()
      return data.data
    },
  })
}
