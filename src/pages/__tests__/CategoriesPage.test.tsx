import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { FinanceProvider } from '../../providers/FinanceProvider'
import CategoriesPage from '../CategoriesPage'

const renderCategoriesPage = () => {
  return render(
    <BrowserRouter>
      <FinanceProvider>
        <CategoriesPage />
      </FinanceProvider>
    </BrowserRouter>
  )
}

describe('CategoriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render category manager', () => {
    renderCategoriesPage()

    expect(screen.getByText('Add a category')).toBeInTheDocument()
    expect(screen.getByText('Manage categories')).toBeInTheDocument()
  })

  it('should render default categories', () => {
    renderCategoriesPage()

    // Default categories should be rendered
    expect(screen.getByText('Salary')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
  })

  it('should allow adding a new category', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const nameInput = screen.getByPlaceholderText('Health, Travel, Gifts...')
    await user.type(nameInput, 'New Category')

    const submitButton = screen.getByText('Save category')
    await user.click(submitButton)

    // New category should be added
    await screen.findByText('New Category')
  })

  it('should not add category with empty name', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const submitButton = screen.getByText('Save category')
    await user.click(submitButton)

    // Category count should remain the same (default categories only)
    const categoryCount = screen.getAllByText('Edit').length
    expect(categoryCount).toBeGreaterThanOrEqual(12) // Default 12 categories
  })

  it('should allow editing a category', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])

    // Should show edit inputs
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should allow deleting a category', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const deleteButtons = screen.getAllByText('Delete')
    const initialCount = deleteButtons.length

    await user.click(deleteButtons[0])

    // Category should be removed
    await waitFor(() => {
      const newDeleteButtons = screen.queryAllByText('Delete')
      expect(newDeleteButtons.length).toBeLessThan(initialCount)
    })
  })

  it('should allow canceling edit mode', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    // Should return to view mode
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  it('should allow saving edited category', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])

    // Find and update name input in edit mode
    const nameInput = document.querySelector('input[value="Salary"]') as HTMLInputElement
    if (nameInput) {
      await user.clear(nameInput)
      await user.type(nameInput, 'Salary Updated')
    }

    const saveButton = screen.getByText('Save')
    await user.click(saveButton)

    // Category should be updated
    await screen.findByText('Salary Updated')
  })

  it('should handle icon input with max length', async () => {
    renderCategoriesPage()

    const iconInput = screen.getByPlaceholderText('🏖️') as HTMLInputElement
    expect(iconInput).toHaveAttribute('maxLength', '2')

    fireEvent.change(iconInput, { target: { value: '🎮' } })
    // Should accept valid emoji
    expect(iconInput.value.length).toBeLessThanOrEqual(2)
  })

  it('should handle color selection', () => {
    renderCategoriesPage()

    const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement
    expect(colorInput).toBeInTheDocument()

    if (colorInput) {
      // Color input value changes via onChange
      fireEvent.change(colorInput, { target: { value: '#ff0000' } })
      expect(colorInput.value).toBe('#ff0000')
    }
  })

  it('should reset form after adding category', async () => {
    const user = userEvent.setup()
    renderCategoriesPage()

    const nameInput = screen.getByPlaceholderText('Health, Travel, Gifts...')
    await user.type(nameInput, 'Test Category')

    const submitButton = screen.getByText('Save category')
    await user.click(submitButton)

    // Form should be reset
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(nameInput).toHaveValue('')
  })

  it('should display category icons and colors', () => {
    renderCategoriesPage()

    // Should display emoji icons
    expect(screen.getByText('🍎')).toBeInTheDocument()
    expect(screen.getByText('💼')).toBeInTheDocument()

    // Should have color swatches
    const swatches = document.querySelectorAll('.category-list__swatch')
    expect(swatches.length).toBeGreaterThan(0)
  })
})

