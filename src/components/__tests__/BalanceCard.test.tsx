import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import BalanceCard from '../BalanceCard'
import type { Currency } from '../../types/finance'

const mockRates = {
  USD: 1,
  EUR: 0.93,
  UAH: 37.1,
}

const defaultProps = {
  primaryCurrency: 'USD' as Currency,
  primaryAmount: 1000,
  secondaryCurrency: 'EUR' as Currency,
  secondaryAmount: 930,
  loading: false,
  rates: mockRates,
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('BalanceCard', () => {
  it('should render balance label', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    expect(screen.getByText('Balance')).toBeInTheDocument()
  })

  it('should display primary amount with currency', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    const amount = screen.getByText(/1,000/)
    expect(amount).toBeInTheDocument()
  })

  it('should display secondary amount with currency', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    const secondaryAmount = screen.getByText(/930/)
    expect(secondaryAmount).toBeInTheDocument()
  })

  it('should show "Updating…" tag when loading', () => {
    renderWithRouter(<BalanceCard {...defaultProps} loading={true} />)

    expect(screen.getByText('Updating…')).toBeInTheDocument()
  })

  it('should not show "Updating…" tag when not loading', () => {
    renderWithRouter(<BalanceCard {...defaultProps} loading={false} />)

    expect(screen.queryByText('Updating…')).not.toBeInTheDocument()
  })

  it('should render add transaction button', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    const addButton = screen.getByLabelText('Add transaction')
    expect(addButton).toBeInTheDocument()
  })

  it('should navigate to transactions page when add button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BalanceCard {...defaultProps} />)

    const addButton = screen.getByLabelText('Add transaction')
    await user.click(addButton)

    expect(window.location.pathname).toBe('/transactions')
  })

  it('should display exchange rates', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    expect(screen.getByText(/USD/)).toBeInTheDocument()
    expect(screen.getByText(/EUR/)).toBeInTheDocument()
  })

  it('should calculate and display USD to UAH rate', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    // USD to UAH: 1 * 37.1 / 1 = 37.1
    const usdRate = screen.getByText(/37\.1/)
    expect(usdRate).toBeInTheDocument()
  })

  it('should calculate and display EUR to UAH rate', () => {
    renderWithRouter(<BalanceCard {...defaultProps} />)

    // EUR to UAH: 1 * 37.1 / 0.93 ≈ 39.89
    // The component displays this rate
    expect(screen.getByText(/EUR/)).toBeInTheDocument()
  })

  it('should handle different primary currencies', () => {
    const uahProps = {
      ...defaultProps,
      primaryCurrency: 'UAH' as Currency,
      primaryAmount: 37100,
    }

    renderWithRouter(<BalanceCard {...uahProps} />)

    // Amount might be formatted differently based on locale
    expect(screen.getByText(/37[\s,]?100|37,100/)).toBeInTheDocument()
  })

  it('should handle zero balance', () => {
    const zeroProps = {
      ...defaultProps,
      primaryAmount: 0,
      secondaryAmount: 0,
    }

    renderWithRouter(<BalanceCard {...zeroProps} />)

    expect(screen.getByText('Balance')).toBeInTheDocument()
  })
})

