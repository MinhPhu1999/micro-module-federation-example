import { describe, it, expect } from 'vitest'
import { formatDate } from '@micro-fe/shared/formatDate'

describe('formatDate', () => {
  it('formats a Date object with default locale', () => {
    const date = new Date('2024-03-15T10:30:00')
    const result = formatDate(date, 'vi-VN')
    expect(result).toContain('15')
    expect(result).toContain('03')
    expect(result).toContain('2024')
  })

  it('formats a date string', () => {
    const result = formatDate('2024-03-15T10:30:00', 'en-US')
    expect(result).toContain('03')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('uses vi-VN locale by default', () => {
    const result = formatDate('2024-12-25T00:00:00')
    expect(result).toContain('25')
    expect(result).toContain('12')
    expect(result).toContain('2024')
  })

  it('handles invalid date gracefully', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('Invalid Date')
  })
})
