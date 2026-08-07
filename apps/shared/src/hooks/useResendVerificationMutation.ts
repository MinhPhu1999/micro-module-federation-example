import { useMutation } from '@tanstack/react-query'
import { authApi } from '@micro-fe/shared/authApi'
import type { ResendVerificationRequest } from '@micro-fe/shared/types'

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async (data: ResendVerificationRequest) => {
      const { data: res } = await authApi.verifyEmailResend(data)
      return res
    },
  })
}