import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoApi } from "@micro-fe/shared/todoApi"
import { todoKeys } from '@micro-fe/shared/useTodos'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await todoApi.delete(id)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() })
    },
  })
}
