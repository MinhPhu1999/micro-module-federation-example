import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import { todoKeys } from './useTodos'
import type { BulkDeleteTodosRequest } from '@/types'

export function useBulkDeleteTodos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: BulkDeleteTodosRequest) => {
      const { data } = await todoApi.bulkDelete(payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() })
    },
  })
}
