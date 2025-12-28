import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../Layout'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Layout', () => {
  it('should render children', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render BottomNav component', () => {
    renderWithRouter(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should apply correct CSS classes', () => {
    const { container } = renderWithRouter(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    expect(container.querySelector('.finance-app')).toBeInTheDocument()
    expect(container.querySelector('.finance-app__view')).toBeInTheDocument()
  })
})

