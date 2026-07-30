import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/auth'
import type { LoginRequest, AuthPayload } from '@/types'

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthPayload> => {
      const { data: res } = await authApi.login(data)
      return res.data
    },
  })
}
