import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from "@micro-fe/shared/todoApi"
import { todoKeys } from '@micro-fe/shared/useTodos'
import type { BulkDeleteTodosRequest } from "@micro-fe/shared/types"

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
