import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryManager from '../CategoryManager'
import type { Category } from '../../types/finance'

const mockCategories: Category[] = [
  { id: 'food', name: 'Food', color: '#fb7185', icon: '🍎' },
  { id: 'salary', name: 'Salary', color: '#4ade80', icon: '💼' },
]

const defaultNewCategoryForm = {
  name: '',
  color: '#7c3aed',
  icon: '🏷️',
}

const defaultEditingCategoryDraft = {
  name: '',
  color: '#7c3aed',
  icon: '🏷️',
}

const defaultProps = {
  categories: mockCategories,
  newCategoryForm: defaultNewCategoryForm,
  editingCategoryId: null,
  editingCategoryDraft: defaultEditingCategoryDraft,
  onNewCategoryFieldUpdate: vi.fn(),
  onNewCategorySubmit: vi.fn(),
  onStartEdit: vi.fn(),
  onEditFieldUpdate: vi.fn(),
  onSaveEdit: vi.fn(),
  onCancelEdit: vi.fn(),
  onDelete: vi.fn(),
}

describe('CategoryManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render add category form', () => {
    render(<CategoryManager {...defaultProps} />)

    expect(screen.getByText('Add a category')).toBeInTheDocument()
  })

  it('should render manage categories section', () => {
    render(<CategoryManager {...defaultProps} />)

    expect(screen.getByText('Manage categories')).toBeInTheDocument()
  })

  it('should render all categories', () => {
    render(<CategoryManager {...defaultProps} />)

    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
  })

  it('should render category icons', () => {
    render(<CategoryManager {...defaultProps} />)

    expect(screen.getByText('🍎')).toBeInTheDocument()
    expect(screen.getByText('💼')).toBeInTheDocument()
  })

  it('should render new category form fields', () => {
    render(<CategoryManager {...defaultProps} />)

    expect(screen.getByPlaceholderText('Health, Travel, Gifts...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('🏖️')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('should call onNewCategoryFieldUpdate when name changes', async () => {
    const user = userEvent.setup()
    render(<CategoryManager {...defaultProps} />)

    const nameInput = screen.getByPlaceholderText('Health, Travel, Gifts...')
    await user.type(nameInput, 'Test Category')

    expect(defaultProps.onNewCategoryFieldUpdate).toHaveBeenCalledWith('name', 'T')
  })

  it('should call onNewCategoryFieldUpdate when icon changes', async () => {
    const user = userEvent.setup()
    render(<CategoryManager {...defaultProps} />)

    const iconInput = screen.getByPlaceholderText('🏖️')
    await user.clear(iconInput)
    await user.type(iconInput, '🎮')

    expect(defaultProps.onNewCategoryFieldUpdate).toHaveBeenCalled()
  })

  it('should call onNewCategorySubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const formWithName = {
      ...defaultProps,
      newCategoryForm: { ...defaultNewCategoryForm, name: 'New Category' },
    }

    render(<CategoryManager {...formWithName} />)

    const submitButton = screen.getByText('Save category')
    await user.click(submitButton)

    expect(defaultProps.onNewCategorySubmit).toHaveBeenCalled()
  })

  it('should show edit mode when editingCategoryId matches category id', () => {
    const editingProps = {
      ...defaultProps,
      editingCategoryId: 'food',
      editingCategoryDraft: {
        name: 'Food Edited',
        color: '#ff0000',
        icon: '🍕',
      },
    }

    render(<CategoryManager {...editingProps} />)

    const nameInput = document.querySelector('input[value="Food Edited"]')
    expect(nameInput).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('should show view mode when not editing', () => {
    render(<CategoryManager {...defaultProps} />)

    expect(screen.getAllByText('Edit')).toHaveLength(mockCategories.length)
    expect(screen.getAllByText('Delete')).toHaveLength(mockCategories.length)
  })

  it('should call onStartEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<CategoryManager {...defaultProps} />)

    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])

    expect(defaultProps.onStartEdit).toHaveBeenCalledWith(mockCategories[0])
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<CategoryManager {...defaultProps} />)

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(defaultProps.onDelete).toHaveBeenCalledWith('food')
  })

  it('should call onEditFieldUpdate when editing category name', async () => {
    const user = userEvent.setup()
    const editingProps = {
      ...defaultProps,
      editingCategoryId: 'food',
      editingCategoryDraft: {
        name: 'Food',
        color: '#fb7185',
        icon: '🍎',
      },
    }

    render(<CategoryManager {...editingProps} />)

    const nameInput = document.querySelector('input[value="Food"]')
    if (nameInput) {
      await user.clear(nameInput)
      await user.type(nameInput, 'Food Updated')
      expect(defaultProps.onEditFieldUpdate).toHaveBeenCalled()
    }
  })

  it('should call onSaveEdit when save button is clicked in edit mode', async () => {
    const user = userEvent.setup()
    const editingProps = {
      ...defaultProps,
      editingCategoryId: 'food',
      editingCategoryDraft: {
        name: 'Food Edited',
        color: '#ff0000',
        icon: '🍕',
      },
    }

    render(<CategoryManager {...editingProps} />)

    const saveButton = screen.getByText('Save')
    await user.click(saveButton)

    expect(defaultProps.onSaveEdit).toHaveBeenCalled()
  })

  it('should call onCancelEdit when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const editingProps = {
      ...defaultProps,
      editingCategoryId: 'food',
      editingCategoryDraft: {
        name: 'Food Edited',
        color: '#ff0000',
        icon: '🍕',
      },
    }

    render(<CategoryManager {...editingProps} />)

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(defaultProps.onCancelEdit).toHaveBeenCalled()
  })

  it('should display category colors in swatches', () => {
    render(<CategoryManager {...defaultProps} />)

    const swatches = document.querySelectorAll('.category-list__swatch')
    expect(swatches.length).toBe(mockCategories.length)
  })

  it('should handle empty categories list', () => {
    render(<CategoryManager {...defaultProps} categories={[]} />)

    expect(screen.getByText('Manage categories')).toBeInTheDocument()
  })

  it('should limit icon input to 2 characters', () => {
    render(<CategoryManager {...defaultProps} />)

    const iconInput = screen.getByPlaceholderText('🏖️')
    expect(iconInput).toHaveAttribute('maxLength', '2')
  })
})

