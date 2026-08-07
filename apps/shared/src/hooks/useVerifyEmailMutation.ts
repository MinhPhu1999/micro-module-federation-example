import { useMutation } from '@tanstack/react-query'
import { authApi } from '@micro-fe/shared/authApi'
import type { VerifyEmailRequest } from '@micro-fe/shared/types'

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      const { data: res } = await authApi.verifyEmail(data)
      return res
    },
  })
}