import { useMutation } from '@tanstack/react-query'
import { authApi } from "@micro-fe/shared/authApi"
import type { ResetPasswordRequest } from "@micro-fe/shared/types"

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const { data: res } = await authApi.resetPassword(data)
      return res.data
    },
  })
}
