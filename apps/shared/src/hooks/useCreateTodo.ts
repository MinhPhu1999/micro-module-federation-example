import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import { todoKeys } from './useTodos'
import type { CreateTodoRequest } from '@/types'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTodoRequest) => {
      const { data } = await todoApi.create(payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
