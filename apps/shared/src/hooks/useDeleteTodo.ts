import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import { todoKeys } from './useTodos'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await todoApi.delete(id)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
