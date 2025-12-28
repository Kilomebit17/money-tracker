import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav'

const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <BottomNav />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('should render navigation links', () => {
    renderWithRouter()

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should highlight active route', () => {
    renderWithRouter(['/'])

    const overviewLink = screen.getByText('Overview').closest('a')
    expect(overviewLink).toHaveClass('bottom-nav__item--active')
    expect(overviewLink).toHaveAttribute('aria-pressed', 'true')
  })

  it('should highlight transactions route when active', () => {
    renderWithRouter(['/transactions'])

    const transactionsLink = screen.getByText('Transactions').closest('a')
    expect(transactionsLink).toHaveClass('bottom-nav__item--active')
    expect(transactionsLink).toHaveAttribute('aria-pressed', 'true')
  })

  it('should highlight settings route when active', () => {
    renderWithRouter(['/settings'])

    const settingsLink = screen.getByText('Settings').closest('a')
    expect(settingsLink).toHaveClass('bottom-nav__item--active')
    expect(settingsLink).toHaveAttribute('aria-pressed', 'true')
  })

  it('should not highlight inactive routes', () => {
    renderWithRouter(['/'])

    const transactionsLink = screen.getByText('Transactions').closest('a')
    const settingsLink = screen.getByText('Settings').closest('a')

    expect(transactionsLink).not.toHaveClass('bottom-nav__item--active')
    expect(settingsLink).not.toHaveClass('bottom-nav__item--active')
    expect(transactionsLink).toHaveAttribute('aria-pressed', 'false')
    expect(settingsLink).toHaveAttribute('aria-pressed', 'false')
  })

  it('should have correct href attributes', () => {
    renderWithRouter()

    const overviewLink = screen.getByText('Overview').closest('a')
    const transactionsLink = screen.getByText('Transactions').closest('a')
    const settingsLink = screen.getByText('Settings').closest('a')

    expect(overviewLink).toHaveAttribute('href', '/')
    expect(transactionsLink).toHaveAttribute('href', '/transactions')
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })

  it('should render icons', () => {
    const { container } = renderWithRouter()

    const icons = container.querySelectorAll('.bottom-nav__icon')
    expect(icons.length).toBe(3) // Overview, Transactions, Settings
  })
})

