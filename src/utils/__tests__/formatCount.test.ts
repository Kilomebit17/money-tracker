import { describe, it, expect } from 'vitest'
import { formatCount } from '../formatCount'

describe('formatCount', () => {
  it('should format positive integers', () => {
    expect(formatCount(0)).toBe('0')
    expect(formatCount(1)).toBe('1')
    expect(formatCount(100)).toBe('100')
    expect(formatCount(1000)).toBe('1,000')
    expect(formatCount(1000000)).toBe('1,000,000')
  })

  it('should format numbers with decimal parts by rounding', () => {
    expect(formatCount(100.4)).toBe('100')
    expect(formatCount(100.5)).toBe('101')
    expect(formatCount(999.9)).toBe('1,000')
  })

  it('should handle negative numbers', () => {
    expect(formatCount(-100)).toBe('-100')
    expect(formatCount(-1000)).toBe('-1,000')
  })

  it('should format large numbers with commas', () => {
    expect(formatCount(1234567)).toBe('1,234,567')
    expect(formatCount(9876543210)).toBe('9,876,543,210')
  })
})

