export const API_PREFIX = '/api/v1'

export const AUTH_ENDPOINTS = {
  register: () => `${API_PREFIX}/auth/register`,
  login: () => `${API_PREFIX}/auth/login`,
  forgotPassword: () => `${API_PREFIX}/auth/forgot-password`,
  resetPassword: () => `${API_PREFIX}/auth/reset-password`,
  googleUrl: () => `${API_PREFIX}/auth/google/url`,
  googleCallback: () => `${API_PREFIX}/auth/google/callback`,
  me: () => `${API_PREFIX}/auth/me`,
  refresh: () => `${API_PREFIX}/auth/refresh`,
  logout: () => `${API_PREFIX}/auth/logout`,
  verifyEmail: () => `${API_PREFIX}/auth/verify-email`,
  verifyEmailResend: () => `${API_PREFIX}/auth/verify-email/resend`,
} as const

export const TODO_ENDPOINTS = {
  list: () => `${API_PREFIX}/todos`,
  getById: (id: string) => `${API_PREFIX}/todos/${id}`,
  create: () => `${API_PREFIX}/todos`,
  update: (id: string) => `${API_PREFIX}/todos/${id}`,
  delete: (id: string) => `${API_PREFIX}/todos/${id}`,
  restore: (id: string) => `${API_PREFIX}/todos/${id}`,
  bulkCreate: () => `${API_PREFIX}/todos/bulk`,
  bulkUpdate: () => `${API_PREFIX}/todos/bulk`,
  bulkDelete: () => `${API_PREFIX}/todos/bulk`,
  stats: () => `${API_PREFIX}/todos/stats`,
} as const
