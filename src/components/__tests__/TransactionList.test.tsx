import type { ReactElement } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TelegramProvider } from '../../providers/TelegramProvider'
import TransactionList from '../TransactionList'
import type { Transaction, Category, Currency } from '../../types/finance'
import type { ITelegramWebApp } from '../../types/telegram'

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

const createMockWebApp = (): ITelegramWebApp => ({
  HapticFeedback: {
    impactOccurred: vi.fn(),
    notificationOccurred: vi.fn(),
    selectionChanged: vi.fn(),
  },
  ready: vi.fn(),
  expand: vi.fn(),
  setBackgroundColor: vi.fn(),
  setHeaderColor: vi.fn(),
  onEvent: vi.fn(),
  offEvent: vi.fn(),
  themeParams: {},
} as unknown as ITelegramWebApp)

const renderWithRouter = (component: ReactElement, mockWebApp?: ITelegramWebApp | null) => {
  if (mockWebApp) {
    ;(window as Window & { Telegram?: { WebApp: ITelegramWebApp } }).Telegram = {
      WebApp: mockWebApp,
    }
  } else {
    delete (window as Partial<Window>).Telegram
  }

  return render(
    <MemoryRouter>
      <TelegramProvider>{component}</TelegramProvider>
    </MemoryRouter>
  )
}

describe('TransactionList', () => {
  beforeEach(() => {
    delete (window as Partial<Window>).Telegram
    vi.clearAllMocks()
  })

  it('should render transaction list header', () => {
    renderWithRouter(<TransactionList {...defaultProps} />)

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  it('should render all transactions', () => {
    renderWithRouter(<TransactionList {...defaultProps} />)

    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
  })

  it('should display transaction amounts with correct format', () => {
    renderWithRouter(<TransactionList {...defaultProps} />)

    expect(screen.getByText(/\+/)).toBeInTheDocument() // Income indicator
    expect(screen.getByText(/-/)).toBeInTheDocument() // Expense indicator
  })

  it('should display transaction dates', () => {
    renderWithRouter(<TransactionList {...defaultProps} />)

    const dates = screen.getAllByText(/1\/1[56]\/2024/)
    expect(dates.length).toBeGreaterThan(0)
  })

  it('should handle empty transactions array', () => {
    renderWithRouter(<TransactionList {...defaultProps} transactions={[]} />)

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

    renderWithRouter(
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

    renderWithRouter(
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

    renderWithRouter(
      <TransactionList
        {...defaultProps}
        transactions={expenseTransactions}
      />
    )

    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText(/-/)).toBeInTheDocument()
  })

  it('should trigger haptic feedback when transaction is clicked in Telegram', async () => {
    const user = userEvent.setup()
    const mockWebApp = createMockWebApp()
    const impactSpy = vi.spyOn(mockWebApp.HapticFeedback, 'impactOccurred')
    renderWithRouter(<TransactionList {...defaultProps} />, mockWebApp)

    const transactionItem = screen.getByText('Salary').closest('li')
    expect(transactionItem).toBeInTheDocument()
    
    if (transactionItem) {
      await user.click(transactionItem)
      expect(impactSpy).toHaveBeenCalledTimes(1)
      expect(impactSpy).toHaveBeenCalledWith('light')
    }
  })

  it('should show "View all" button when showViewAll is true', () => {
    renderWithRouter(<TransactionList {...defaultProps} showViewAll={true} />)

    expect(screen.getByText('View all')).toBeInTheDocument()
  })

  it('should trigger haptic feedback when "View all" button is clicked in Telegram', async () => {
    const user = userEvent.setup()
    const mockWebApp = createMockWebApp()
    const selectionSpy = vi.spyOn(mockWebApp.HapticFeedback, 'selectionChanged')
    renderWithRouter(
      <TransactionList {...defaultProps} showViewAll={true} />,
      mockWebApp
    )

    const viewAllButton = screen.getByText('View all')
    await user.click(viewAllButton)

    expect(selectionSpy).toHaveBeenCalledTimes(1)
  })

  it('should use custom title when provided', () => {
    renderWithRouter(<TransactionList {...defaultProps} title="All Transactions" />)

    expect(screen.getByText('All Transactions')).toBeInTheDocument()
    expect(screen.queryByText('Recent Transactions')).not.toBeInTheDocument()
  })
})

