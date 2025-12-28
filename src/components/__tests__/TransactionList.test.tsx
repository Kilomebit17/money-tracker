import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransactionList from '../TransactionList'
import type { Transaction, Category, Currency } from '../../types/finance'

const mockCategories: Category[] = [
  { id: 'food', name: 'Food', color: '#fb7185', icon: '🍎' },
  { id: 'salary', name: 'Salary', color: '#4ade80', icon: '💼' },
]

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
    currency: 'UAH',
    note: 'Lunch',
    categoryId: 'food',
    date: '2024-01-16',
    usdValueAtEntry: 1.35,
    exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
  },
]

const mockRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  UAH: 37.1,
}

const defaultProps = {
  transactions: mockTransactions,
  categories: mockCategories,
  primaryCurrency: 'USD' as Currency,
  rates: mockRates,
}

describe('TransactionList', () => {
  it('should render transaction list header', () => {
    render(<TransactionList {...defaultProps} />)

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  it('should render all transactions', () => {
    render(<TransactionList {...defaultProps} />)

    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
  })

  it('should display transaction amounts with correct format', () => {
    render(<TransactionList {...defaultProps} />)

    expect(screen.getByText(/\+/)).toBeInTheDocument() // Income indicator
    expect(screen.getByText(/-/)).toBeInTheDocument() // Expense indicator
  })

  it('should display transaction dates', () => {
    render(<TransactionList {...defaultProps} />)

    const dates = screen.getAllByText(/1\/1[56]\/2024/)
    expect(dates.length).toBeGreaterThan(0)
  })

  it('should handle empty transactions array', () => {
    render(<TransactionList {...defaultProps} transactions={[]} />)

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    // No transaction items should be rendered
    expect(screen.queryByText('Salary')).not.toBeInTheDocument()
  })

  it('should display "Uncategorized" for transactions with unknown category', () => {
    const transactionWithoutCategory: Transaction = {
      id: 'tx-3',
      type: 'expense',
      amount: 100,
      currency: 'USD',
      note: 'Unknown',
      categoryId: 'unknown',
      date: '2024-01-17',
      usdValueAtEntry: 100,
      exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
    }

    render(
      <TransactionList
        {...defaultProps}
        transactions={[transactionWithoutCategory]}
      />
    )

    expect(screen.getByText('Uncategorized')).toBeInTheDocument()
  })

  it('should render income transactions with income icon', () => {
    const incomeTransactions: Transaction[] = [
      {
        id: 'tx-income',
        type: 'income',
        amount: 500,
        currency: 'USD',
        note: 'Bonus',
        categoryId: 'salary',
        date: '2024-01-18',
        usdValueAtEntry: 500,
        exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
      },
    ]

    render(
      <TransactionList
        {...defaultProps}
        transactions={incomeTransactions}
      />
    )

    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText(/\+/)).toBeInTheDocument()
  })

  it('should render expense transactions with expense icon', () => {
    const expenseTransactions: Transaction[] = [
      {
        id: 'tx-expense',
        type: 'expense',
        amount: 25,
        currency: 'EUR',
        note: 'Coffee',
        categoryId: 'food',
        date: '2024-01-19',
        usdValueAtEntry: 27.5,
        exchangeRatesAtEntry: { USD: 1, EUR: 0.93, UAH: 37.1 },
      },
    ]

    render(
      <TransactionList
        {...defaultProps}
        transactions={expenseTransactions}
      />
    )

    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText(/-/)).toBeInTheDocument()
  })
})

