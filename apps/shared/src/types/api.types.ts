export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'ACCOUNT_LOCKED'
  | 'TODO_NOT_FOUND'
  | 'INVALID_REFRESH_TOKEN'
  | 'GOOGLE_AUTH_UNAVAILABLE'
  | 'GOOGLE_PROFILE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'
  | 'RATE_LIMITED'
  | 'INVALID_AUTH_REQUEST'
  | 'INVALID_PASSWORD'
  | 'TOO_MANY_LOGIN_ATTEMPTS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'INVALID_GOOGLE_OAUTH_STATE'
  | 'GOOGLE_EMAIL_NOT_VERIFIED'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiSuccess<T> {
  success: true
  message?: string
  data: T
}

export interface ApiMessageResponse {
  success: true
  message?: string
}

export interface ApiListResponse<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiListResponse<T> | ApiError
