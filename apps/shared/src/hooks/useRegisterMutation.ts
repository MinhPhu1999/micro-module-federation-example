import { useMutation } from '@tanstack/react-query'
import { authApi } from "@micro-fe/shared/authApi"
import type { RegisterRequest } from "@micro-fe/shared/types"

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const { data: res } = await authApi.register(data)
      return res.data
    },
  })
}
