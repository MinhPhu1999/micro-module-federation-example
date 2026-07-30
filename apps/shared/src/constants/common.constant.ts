export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_PAGE: 1,
} as const
