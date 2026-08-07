import { useMutation } from '@tanstack/react-query'
import { authApi } from "@micro-fe/shared/authApi"
import type { ForgotPasswordRequest } from "@micro-fe/shared/types"

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const { data: res } = await authApi.forgotPassword(data)
      return res.data
    },
  })
}
