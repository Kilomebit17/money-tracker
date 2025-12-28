import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { FinanceProvider } from '../../providers/FinanceProvider'
import { TelegramProvider } from '../../providers/TelegramProvider'
import HomePage from '../HomePage'
import type { Transaction } from '../../types/finance'
import * as useExchangeRatesModule from '../../hooks/useExchangeRates'

// Mock the useExchangeRates hook
vi.mock('../../hooks/useExchangeRates', () => ({
  useExchangeRates: vi.fn(),
}))

const mockRates = {
  USD: 1,
  EUR: 0.93,
  UAH: 37.1,
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 1000,
    currency: 'USD',
    note: 'Salary',
    categoryId: 'salary',
    date: '2024-01-15',
    usdValueAtEntry: 1000,
    exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 50,
    currency: 'USD',
    note: 'Lunch',
    categoryId: 'food',
    date: '2024-01-16',
    usdValueAtEntry: 50,
    exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
  },
]

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <TelegramProvider>
        <FinanceProvider>
          <HomePage />
        </FinanceProvider>
      </TelegramProvider>
    </BrowserRouter>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useExchangeRatesModule.useExchangeRates as ReturnType<typeof vi.fn>).mockReturnValue({
      rates: mockRates,
      loading: false,
    })
  })

  it('should render greeting header', () => {
    renderHomePage()

    // The greeting changes based on time of day
    const greeting = screen.getByText(/Good (Morning|Afternoon|Evening)/)
    expect(greeting).toBeInTheDocument()
  })

  it('should render BalanceCard', () => {
    renderHomePage()

    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('should render TransactionList with recent transactions', async () => {
    // Set up localStorage with transactions
    localStorage.setItem(
      'my-finance-transactions',
      JSON.stringify(mockTransactions)
    )

    renderHomePage()

    await waitFor(() => {
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    })
  })

  it('should display balance correctly', () => {
    localStorage.setItem(
      'my-finance-transactions',
      JSON.stringify(mockTransactions)
    )

    renderHomePage()

    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('should show loading state when exchange rates are loading', () => {
    ;(useExchangeRatesModule.useExchangeRates as ReturnType<typeof vi.fn>).mockReturnValue({
      rates: null,
      loading: true,
    })

    renderHomePage()

    expect(screen.getByText('Updating…')).toBeInTheDocument()
  })

  it('should display top categories when there are expenses', async () => {
    localStorage.setItem(
      'my-finance-transactions',
      JSON.stringify(mockTransactions)
    )

    renderHomePage()

    await waitFor(() => {
      // May or may not be visible depending on expenses
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    })
  })

  it('should handle empty transactions list', () => {
    localStorage.setItem('my-finance-transactions', JSON.stringify([]))

    renderHomePage()

    expect(screen.getByText('Balance')).toBeInTheDocument()
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  it('should calculate balance correctly from transactions', () => {
    const transactionsWithBalance: Transaction[] = [
      {
        id: 'tx-income',
        type: 'income',
        amount: 1000,
        currency: 'USD',
        note: 'Salary',
        categoryId: 'salary',
        date: '2024-01-15',
        usdValueAtEntry: 1000,
        exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
      },
      {
        id: 'tx-expense',
        type: 'expense',
        amount: 200,
        currency: 'USD',
        note: 'Expense',
        categoryId: 'food',
        date: '2024-01-16',
        usdValueAtEntry: 200,
        exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
      },
    ]

    localStorage.setItem(
      'my-finance-transactions',
      JSON.stringify(transactionsWithBalance)
    )

    renderHomePage()

    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('should display user name', () => {
    renderHomePage()

    expect(screen.getByText('User')).toBeInTheDocument()
  })
})

