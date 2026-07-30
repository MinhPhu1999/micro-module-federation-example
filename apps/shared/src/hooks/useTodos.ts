import { useQuery } from '@tanstack/react-query'
import { todoApi } from '@/services/todo'
import type { TodoListParams } from '@/types'

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params?: TodoListParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

export function useTodos(params?: TodoListParams) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: async () => {
      const { data } = await todoApi.list(params)
      return {
        todos: data.data,
        meta: data.meta,
      }
    },
    placeholderData: (prev) => prev,
  })
}
