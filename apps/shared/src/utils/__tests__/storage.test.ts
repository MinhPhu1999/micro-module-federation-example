import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUser,
  setUser,
  removeUser,
  clearAuth,
} from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('access token', () => {
    it('returns null when no token stored', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('stores and retrieves token', () => {
      setAccessToken('test-token')
      expect(getAccessToken()).toBe('test-token')
    })

    it('removes token', () => {
      setAccessToken('test-token')
      removeAccessToken()
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('refresh token', () => {
    it('stores and retrieves refresh token', () => {
      setRefreshToken('test-refresh')
      expect(getRefreshToken()).toBe('test-refresh')
    })

    it('removes refresh token', () => {
      setRefreshToken('test-refresh')
      removeRefreshToken()
      expect(getRefreshToken()).toBeNull()
    })
  })

  describe('user', () => {
    it('returns null when no user stored', () => {
      expect(getUser()).toBeNull()
    })

    it('stores and retrieves user', () => {
      const user = { id: '1', email: 'test@test.com' }
      setUser(user)
      expect(getUser()).toEqual(user)
    })

    it('removes user', () => {
      setUser({ id: '1' })
      removeUser()
      expect(getUser()).toBeNull()
    })
  })

  describe('clearAuth', () => {
    it('clears all auth data', () => {
      setAccessToken('token')
      setRefreshToken('refresh')
      setUser({ id: '1' })
      clearAuth()
      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
      expect(getUser()).toBeNull()
    })
  })
})
