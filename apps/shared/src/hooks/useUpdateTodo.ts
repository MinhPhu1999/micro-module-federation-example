import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import { todoKeys } from './useTodos'
import type { UpdateTodoRequest } from '@/types'

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTodoRequest }) => {
      const { data: res } = await todoApi.update(id, data)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: todoKeys.details() })
    },
  })
}
