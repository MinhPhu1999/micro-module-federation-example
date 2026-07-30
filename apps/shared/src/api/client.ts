import axios from 'axios'
import { API_BASE_URL, ERROR_MESSAGES } from '@/constants'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuth } from '@/utils/storage'
import i18n from '@/i18n'
import { API_PREFIX } from './endpoints'

let onUnauthorized: (() => void) | null = null

export const setOnUnauthorized = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

const handleUnauthorized = () => {
  clearAuth()
  if (onUnauthorized) {
    onUnauthorized()
  } else {
    window.location.href = '/login'
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const code = error.response?.data?.error?.code
    if (code && ERROR_MESSAGES[code]) {
      error.displayMessage = i18n.t(ERROR_MESSAGES[code])
    } else {
      error.displayMessage = i18n.t(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
    }

    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (code === 'INVALID_CREDENTIALS') {
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        handleUnauthorized()
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        const newToken = data.data.access_token
        setAccessToken(newToken)
        setRefreshToken(data.data.refresh_token)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleUnauthorized()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
