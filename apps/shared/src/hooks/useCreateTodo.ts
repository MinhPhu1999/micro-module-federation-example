import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from "@micro-fe/shared/todoApi"
import { todoKeys } from '@micro-fe/shared/useTodos'
import type { CreateTodoRequest } from "@micro-fe/shared/types"

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTodoRequest) => {
      const { data } = await todoApi.create(payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() })
    },
  })
}
