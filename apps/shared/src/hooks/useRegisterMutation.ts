import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/auth'
import type { RegisterRequest } from '@/types'

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const { data: res } = await authApi.register(data)
      return res.data
    },
  })
}
