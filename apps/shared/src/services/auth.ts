import apiClient from '@/api/client'
import { AUTH_ENDPOINTS } from '@/api/endpoints'
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthPayload,
  ApiSuccess,
} from '@/types'

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<ApiSuccess<AuthPayload>>(AUTH_ENDPOINTS.register(), data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiSuccess<AuthPayload>>(AUTH_ENDPOINTS.login(), data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<ApiSuccess<{ message: string }>>(AUTH_ENDPOINTS.forgotPassword(), data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ApiSuccess<{ message: string }>>(AUTH_ENDPOINTS.resetPassword(), data),

  getGoogleUrl: () =>
    apiClient.get<ApiSuccess<{ url: string }>>(AUTH_ENDPOINTS.googleUrl()),

  googleCallback: (params: { state: string; code: string }) =>
    apiClient.get<ApiSuccess<AuthPayload>>(AUTH_ENDPOINTS.googleCallback(), { params }),

  getMe: () =>
    apiClient.get<ApiSuccess<AuthPayload['user']>>(AUTH_ENDPOINTS.me()),
}
