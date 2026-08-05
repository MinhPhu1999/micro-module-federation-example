import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import { todoKeys } from './useTodos'

export function useRestoreTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await todoApi.restore(id)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: todoKeys.details() })
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() })
    },
  })
}
