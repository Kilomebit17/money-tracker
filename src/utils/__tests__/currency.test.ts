import { describe, it, expect } from 'vitest'
import { formatCurrency, convertCurrency, currencyOrder, currencyLocales } from '../currency'
import type { Currency } from '../../types/finance'

describe('currency utils', () => {
  describe('formatCurrency', () => {
    it('should format UAH currency correctly', () => {
      const result = formatCurrency(1000, 'UAH')
      // UAH uses Ukrainian locale formatting (1 000,00 instead of 1,000.00)
      expect(result).toMatch(/1[\s,]?000|1,000/)
      expect(result).toMatch(/грн|₴|UAH/i)
    })

    it('should format USD currency correctly', () => {
      const result = formatCurrency(1000.5, 'USD')
      // USD uses US locale formatting
      expect(result).toMatch(/1[\s,]?000[.,]5|1,000\.5/)
      expect(result).toMatch(/\$|USD/i)
    })

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(500.25, 'EUR')
      // EUR uses German locale formatting (500,25 instead of 500.25)
      expect(result).toMatch(/500[.,]25/)
      expect(result).toMatch(/€|EUR/i)
    })

    it('should handle zero values', () => {
      const result = formatCurrency(0, 'USD')
      expect(result).toMatch(/0|zero/i)
    })

    it('should handle negative values', () => {
      const result = formatCurrency(-100, 'USD')
      expect(result).toContain('-')
    })

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000, 'USD')
      expect(result).toContain('1,000,000')
    })
  })

  describe('convertCurrency', () => {
    const mockRates: Record<Currency, number> = {
      USD: 1,
      EUR: 0.93,
      UAH: 37.1,
    }

    it('should return same amount if currencies are the same', () => {
      expect(convertCurrency(100, 'USD', 'USD', mockRates)).toBe(100)
      expect(convertCurrency(50, 'EUR', 'EUR', mockRates)).toBe(50)
      expect(convertCurrency(200, 'UAH', 'UAH', mockRates)).toBe(200)
    })

    it('should return same amount if rates are null', () => {
      expect(convertCurrency(100, 'USD', 'EUR', null)).toBe(100)
    })

    it('should convert USD to EUR correctly', () => {
      const result = convertCurrency(100, 'USD', 'EUR', mockRates)
      // 100 USD * 0.93 (EUR rate) / 1 (USD rate) = 93 EUR
      expect(result).toBeCloseTo(93, 2)
    })

    it('should convert USD to UAH correctly', () => {
      const result = convertCurrency(10, 'USD', 'UAH', mockRates)
      // 10 USD * 37.1 (UAH rate) / 1 (USD rate) = 371 UAH
      expect(result).toBeCloseTo(371, 2)
    })

    it('should convert EUR to USD correctly', () => {
      const result = convertCurrency(93, 'EUR', 'USD', mockRates)
      // 93 EUR * 1 (USD rate) / 0.93 (EUR rate) = 100 USD
      expect(result).toBeCloseTo(100, 2)
    })

    it('should convert UAH to USD correctly', () => {
      const result = convertCurrency(371, 'UAH', 'USD', mockRates)
      // 371 UAH * 1 (USD rate) / 37.1 (UAH rate) = 10 USD
      expect(result).toBeCloseTo(10, 2)
    })

    it('should handle zero from rate gracefully', () => {
      const ratesWithZero: Record<Currency, number> = {
        USD: 0,
        EUR: 0.93,
        UAH: 37.1,
      }
      const result = convertCurrency(100, 'USD', 'EUR', ratesWithZero)
      expect(result).toBe(100)
    })

    it('should handle missing rates by using fallback', () => {
      const incompleteRates = {
        USD: 1,
        EUR: 0.93,
      } as Record<Currency, number>
      // Should not throw, but behavior may vary
      expect(() => convertCurrency(100, 'USD', 'UAH', incompleteRates)).not.toThrow()
    })
  })

  describe('currencyOrder', () => {
    it('should contain all three currencies', () => {
      expect(currencyOrder).toHaveLength(3)
      expect(currencyOrder).toContain('UAH')
      expect(currencyOrder).toContain('USD')
      expect(currencyOrder).toContain('EUR')
    })

    it('should have UAH as first currency', () => {
      expect(currencyOrder[0]).toBe('UAH')
    })
  })

  describe('currencyLocales', () => {
    it('should have locale for each currency', () => {
      expect(currencyLocales.UAH).toBe('uk-UA')
      expect(currencyLocales.USD).toBe('en-US')
      expect(currencyLocales.EUR).toBe('de-DE')
    })
  })
})

