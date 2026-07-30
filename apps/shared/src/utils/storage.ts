export const getAccessToken = (): string | null => localStorage.getItem('access_token')
export const setAccessToken = (token: string) => localStorage.setItem('access_token', token)
export const removeAccessToken = () => localStorage.removeItem('access_token')

export const getRefreshToken = (): string | null => localStorage.getItem('refresh_token')
export const setRefreshToken = (token: string) => localStorage.setItem('refresh_token', token)
export const removeRefreshToken = () => localStorage.removeItem('refresh_token')

export const getUser = (): Record<string, unknown> | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
export const setUser = (user: Record<string, unknown>) => localStorage.setItem('user', JSON.stringify(user))
export const removeUser = () => localStorage.removeItem('user')

export const clearAuth = () => {
  removeAccessToken()
  removeRefreshToken()
  removeUser()
}
