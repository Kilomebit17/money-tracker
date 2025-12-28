import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { FinanceProvider, useFinance } from '../FinanceProvider'
import type { ReactNode } from 'react'
import type { Transaction, Currency } from '../../types/finance'

const TRANSACTIONS_STORAGE_KEY = 'my-finance-transactions'
const PRIMARY_CURRENCY_KEY = 'my-finance-primary-currency'

const wrapper = ({ children }: { children: ReactNode }) => (
  <FinanceProvider>{children}</FinanceProvider>
)

describe('FinanceProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should provide default categories', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.categories).toHaveLength(12)
    expect(result.current.categories[0].id).toBe('salary')
    expect(result.current.categories[0].name).toBe('Salary')
  })

  it('should initialize with empty transactions', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.transactions).toEqual([])
  })

  it('should initialize with UAH as default currency', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.primaryCurrency).toBe('UAH')
  })

  it('should load transactions from localStorage', () => {
    const mockTransactions: Transaction[] = [
      {
        id: 'tx-1',
        type: 'income',
        amount: 1000,
        currency: 'USD',
        note: 'Test',
        categoryId: 'salary',
        date: '2024-01-01',
        usdValueAtEntry: 1000,
        exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
      },
    ]

    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(mockTransactions))

    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.transactions).toEqual(mockTransactions)
  })

  it('should load currency from localStorage', () => {
    localStorage.setItem(PRIMARY_CURRENCY_KEY, 'EUR')

    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.primaryCurrency).toBe('EUR')
  })

  it('should save transactions to localStorage when updated', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    const newTransaction: Transaction = {
      id: 'tx-2',
      type: 'expense',
      amount: 50,
      currency: 'UAH',
      note: 'Lunch',
      categoryId: 'food',
      date: '2024-01-02',
      usdValueAtEntry: 1.35,
      exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
    }

    act(() => {
      result.current.setTransactions([newTransaction])
    })

    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
    expect(stored).toBeTruthy()

    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed).toEqual([newTransaction])
    }
  })

  it('should update primary currency and save to localStorage', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    act(() => {
      result.current.setPrimaryCurrency('USD')
    })

    expect(result.current.primaryCurrency).toBe('USD')
    expect(localStorage.getItem(PRIMARY_CURRENCY_KEY)).toBe('USD')
  })

  it('should handle invalid currency in localStorage gracefully', () => {
    localStorage.setItem(PRIMARY_CURRENCY_KEY, 'INVALID')

    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.primaryCurrency).toBe('UAH') // Should default to UAH
  })

  it('should handle corrupted transactions in localStorage gracefully', () => {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, 'invalid json')

    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.transactions).toEqual([])
  })

  it('should update categories', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    const newCategory = {
      id: 'test',
      name: 'Test Category',
      color: '#000000',
      icon: '🧪',
    }

    act(() => {
      result.current.setCategories((prev) => [...prev, newCategory])
    })

    expect(result.current.categories).toContainEqual(newCategory)
  })

  it('should throw error when useFinance is used outside provider', () => {
    expect(() => {
      renderHook(() => useFinance())
    }).toThrow('useFinance must be used within a FinanceProvider')
  })

  it('should handle empty localStorage gracefully', () => {
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY)
    localStorage.removeItem(PRIMARY_CURRENCY_KEY)

    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.transactions).toEqual([])
    expect(result.current.primaryCurrency).toBe('UAH')
  })

  it('should handle all valid currencies', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    const currencies: Currency[] = ['UAH', 'USD', 'EUR']

    currencies.forEach((currency) => {
      act(() => {
        result.current.setPrimaryCurrency(currency)
      })

      expect(result.current.primaryCurrency).toBe(currency)
    })
  })
})

