import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TelegramProvider } from '../../providers/TelegramProvider'
import BottomNav from '../BottomNav'

const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TelegramProvider>
        <BottomNav />
      </TelegramProvider>
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  beforeEach(() => {
    delete (window as Partial<Window>).Telegram
  })

  it('should render navigation links', () => {
    renderWithRouter()

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should highlight active route', () => {
    renderWithRouter(['/'])

    const overviewButton = screen.getByText('Overview').closest('button')
    expect(overviewButton).toHaveClass('bottom-nav__item--active')
    expect(overviewButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should highlight transactions route when active', () => {
    renderWithRouter(['/transactions'])

    const transactionsButton = screen.getByText('Transactions').closest('button')
    expect(transactionsButton).toHaveClass('bottom-nav__item--active')
    expect(transactionsButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should highlight settings route when active', () => {
    renderWithRouter(['/settings'])

    const settingsButton = screen.getByText('Settings').closest('button')
    expect(settingsButton).toHaveClass('bottom-nav__item--active')
    expect(settingsButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('should not highlight inactive routes', () => {
    renderWithRouter(['/'])

    const transactionsButton = screen.getByText('Transactions').closest('button')
    const settingsButton = screen.getByText('Settings').closest('button')

    expect(transactionsButton).not.toHaveClass('bottom-nav__item--active')
    expect(settingsButton).not.toHaveClass('bottom-nav__item--active')
    expect(transactionsButton).toHaveAttribute('aria-pressed', 'false')
    expect(settingsButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('should render icons', () => {
    const { container } = renderWithRouter()

    const icons = container.querySelectorAll('.bottom-nav__icon')
    expect(icons.length).toBe(3) // Overview, Transactions, Settings
  })
})

