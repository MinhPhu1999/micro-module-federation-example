import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/auth'
import type { ForgotPasswordRequest } from '@/types'

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const { data: res } = await authApi.forgotPassword(data)
      return res.data
    },
  })
}
