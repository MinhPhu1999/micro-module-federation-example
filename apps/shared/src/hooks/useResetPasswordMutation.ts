import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/auth'
import type { ResetPasswordRequest } from '@/types'

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const { data: res } = await authApi.resetPassword(data)
      return res.data
    },
  })
}
