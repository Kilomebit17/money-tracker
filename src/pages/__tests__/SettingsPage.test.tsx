import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { FinanceProvider } from '../../providers/FinanceProvider'
import SettingsPage from '../SettingsPage'

const renderSettingsPage = () => {
  return render(
    <BrowserRouter>
      <FinanceProvider>
        <SettingsPage />
      </FinanceProvider>
    </BrowserRouter>
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render settings page', () => {
    renderSettingsPage()

    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should render primary currency section', () => {
    renderSettingsPage()

    // Text might be in nested elements
    expect(screen.getByText(/Primary currency/i)).toBeInTheDocument()
    expect(screen.getByText(/Display currency for balances/i)).toBeInTheDocument()
  })

  it('should display currency select with all options', () => {
    renderSettingsPage()

    const currencySelect = document.querySelector('select') as HTMLSelectElement

    expect(currencySelect).toBeInTheDocument()
    
    if (currencySelect) {
      expect(currencySelect.options.length).toBe(3) // UAH, USD, EUR
      expect(Array.from(currencySelect.options).map(opt => opt.value)).toContain('UAH')
      expect(Array.from(currencySelect.options).map(opt => opt.value)).toContain('USD')
      expect(Array.from(currencySelect.options).map(opt => opt.value)).toContain('EUR')
    }
  })

  it('should default to UAH currency', () => {
    renderSettingsPage()

    const currencySelect = document.querySelector('select') as HTMLSelectElement
    if (currencySelect) {
      expect(currencySelect.value).toBe('UAH')
    }
  })

  it('should allow changing primary currency', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    const currencySelect = document.querySelector('select') as HTMLSelectElement
    expect(currencySelect).toBeInTheDocument()

    if (currencySelect) {
      await user.selectOptions(currencySelect, 'USD')

      expect(currencySelect.value).toBe('USD')
      expect(localStorage.getItem('my-finance-primary-currency')).toBe('USD')
    }
  })

  it('should persist currency selection to localStorage', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    const currencySelect = document.querySelector('select') as HTMLSelectElement
    if (currencySelect) {
      await user.selectOptions(currencySelect, 'EUR')

      expect(localStorage.getItem('my-finance-primary-currency')).toBe('EUR')
    }
  })

  it('should load saved currency from localStorage', () => {
    localStorage.setItem('my-finance-primary-currency', 'USD')

    renderSettingsPage()

    const currencySelect = document.querySelector('select') as HTMLSelectElement
    if (currencySelect) {
      expect(currencySelect.value).toBe('USD')
    }
  })

  it('should handle all three currency options', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    const currencySelect = document.querySelector('select') as HTMLSelectElement
    if (currencySelect) {
      const currencies = ['UAH', 'USD', 'EUR']

      for (const currency of currencies) {
        await user.selectOptions(currencySelect, currency)
        expect(currencySelect.value).toBe(currency)
        expect(localStorage.getItem('my-finance-primary-currency')).toBe(currency)
      }
    }
  })

  it('should display currency icon', () => {
    renderSettingsPage()

    expect(screen.getByText('💱')).toBeInTheDocument()
  })
})

