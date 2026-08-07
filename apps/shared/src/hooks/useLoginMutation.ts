import { useMutation } from '@tanstack/react-query'
import { authApi } from "@micro-fe/shared/authApi"
import type { LoginRequest, AuthPayload } from "@micro-fe/shared/types"

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthPayload> => {
      const { data: res } = await authApi.login(data)
      return res.data
    },
  })
}
