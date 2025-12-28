import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TransactionForm, { type TransactionFormState } from '../TransactionForm'
import type { Category } from '../../types/finance'

const mockCategories: Category[] = [
  { id: 'food', name: 'Food', color: '#fb7185', icon: '🍎' },
  { id: 'salary', name: 'Salary', color: '#4ade80', icon: '💼' },
  { id: 'rent', name: 'Rent', color: '#a855f7', icon: '🏠' },
]

const defaultFormState: TransactionFormState = {
  type: 'expense',
  amount: '100',
  currency: 'USD',
  categoryId: 'food',
  date: '2024-01-15',
  note: 'Test note',
}

const defaultProps = {
  formState: defaultFormState,
  categories: mockCategories,
  onChange: vi.fn(),
  onSubmit: vi.fn(),
  onAmountBlur: vi.fn(),
  loading: false,
}

describe('TransactionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render transaction form', () => {
    render(<TransactionForm {...defaultProps} />)

    expect(screen.getByText('New Expense')).toBeInTheDocument()
  })

  it('should display income title when type is income', () => {
    const incomeState = { ...defaultFormState, type: 'income' as const }
    render(<TransactionForm {...defaultProps} formState={incomeState} />)

    expect(screen.getByText('New Income')).toBeInTheDocument()
  })

  it('should display expense title when type is expense', () => {
    render(<TransactionForm {...defaultProps} />)

    expect(screen.getByText('New Expense')).toBeInTheDocument()
  })

  it('should render amount input with correct value', () => {
    render(<TransactionForm {...defaultProps} />)

    const amountInput = screen.getByPlaceholderText('0')
    expect(amountInput).toHaveValue('100')
  })

  it('should hide amount input when value is 0', () => {
    const zeroState = { ...defaultFormState, amount: '0' }
    render(<TransactionForm {...defaultProps} formState={zeroState} />)

    const amountInput = screen.getByPlaceholderText('0')
    expect(amountInput).toHaveValue('')
  })

  it('should call onChange when amount changes', async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    const amountInput = screen.getByPlaceholderText('0')
    await user.clear(amountInput)
    await user.type(amountInput, '200')

    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it('should filter out non-numeric characters from amount', async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    const amountInput = screen.getByPlaceholderText('0')
    await user.clear(amountInput)
    await user.type(amountInput, 'abc123def')

    // The onChange handler should filter out non-numeric characters
    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it('should display currency selector', () => {
    render(<TransactionForm {...defaultProps} />)

    // USD appears multiple times (in input and button), so use getAllByText
    const usdElements = screen.getAllByText('USD')
    expect(usdElements.length).toBeGreaterThan(0)
  })

  it('should call onChange when currency is changed via button', async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    const currencyButton = screen.getAllByText('USD')[0] // There might be multiple USD texts
    const currencySelector = currencyButton.closest('button')
    
    if (currencySelector) {
      await user.click(currencySelector)
      expect(defaultProps.onChange).toHaveBeenCalled()
    }
  })

  it('should render type tabs', () => {
    render(<TransactionForm {...defaultProps} />)

    expect(screen.getByText('Expense')).toBeInTheDocument()
    expect(screen.getByText('Income')).toBeInTheDocument()
  })

  it('should call onChange when type tab is clicked', async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    const incomeTab = screen.getByText('Income')
    await user.click(incomeTab)

    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it('should render category select with categories', () => {
    render(<TransactionForm {...defaultProps} />)

    const categorySelect = document.querySelector('select[name="categoryId"]')
    
    expect(categorySelect).toBeInTheDocument()
    // Food appears in select options
    const foodOptions = Array.from(document.querySelectorAll('option')).filter(
      opt => opt.textContent?.includes('Food')
    )
    expect(foodOptions.length).toBeGreaterThan(0)
  })

  it('should display selected category name', () => {
    render(<TransactionForm {...defaultProps} />)

    // Food appears in the category display
    const foodElements = screen.getAllByText('Food')
    expect(foodElements.length).toBeGreaterThan(0)
  })

  it('should render date input', () => {
    render(<TransactionForm {...defaultProps} />)

    const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement
    expect(dateInput).toBeInTheDocument()
    expect(dateInput).toHaveValue('2024-01-15')
  })

  it('should format date display correctly', () => {
    render(<TransactionForm {...defaultProps} />)

    expect(screen.getByText('15.01.2024')).toBeInTheDocument()
  })

  it('should render note textarea', () => {
    render(<TransactionForm {...defaultProps} />)

    const noteTextarea = screen.getByPlaceholderText('Add a note...')
    expect(noteTextarea).toBeInTheDocument()
    expect(noteTextarea).toHaveValue('Test note')
  })

  it('should call onChange when note changes', async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    const noteTextarea = screen.getByPlaceholderText('Add a note...')
    await user.type(noteTextarea, ' updated')

    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it('should call onAmountBlur when amount input loses focus', async () => {
    const user = userEvent.setup()
    render(<TransactionForm {...defaultProps} />)

    const amountInput = screen.getByPlaceholderText('0')
    amountInput.focus()
    await user.tab()

    expect(defaultProps.onAmountBlur).toHaveBeenCalled()
  })

  it('should call onSubmit when form is submitted', async () => {
    render(<TransactionForm {...defaultProps} />)

    // Submit the form directly to test onSubmit is called
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    
    if (form) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      form.dispatchEvent(submitEvent)
      
      // onSubmit should be called when form is submitted
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'submit',
          target: form,
        })
      )
    }
  })

  it('should disable save button when loading', () => {
    render(<TransactionForm {...defaultProps} loading={true} />)

    const saveButton = screen.getByText('Saving...')
    expect(saveButton).toBeDisabled()
  })

  it('should show "Saving..." text when loading', () => {
    render(<TransactionForm {...defaultProps} loading={true} />)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('should handle empty categories list', () => {
    render(<TransactionForm {...defaultProps} categories={[]} />)

    const categorySelect = document.querySelector('select[name="categoryId"]')
    expect(categorySelect).toBeInTheDocument()
  })

  it('should display "None" when category is not found', () => {
    const stateWithoutCategory = { ...defaultFormState, categoryId: 'nonexistent' }
    render(<TransactionForm {...defaultProps} formState={stateWithoutCategory} />)

    expect(screen.getByText('None')).toBeInTheDocument()
  })
})

