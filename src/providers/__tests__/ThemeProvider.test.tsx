import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeProvider'
import type { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('should provide dark theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(result.current.theme).toBe('dark')
  })

  it('should set data-theme attribute on document element', () => {
    renderHook(() => useTheme(), { wrapper })

    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('should remove theme from localStorage', () => {
    localStorage.setItem('my-finance-theme', 'light')

    renderHook(() => useTheme(), { wrapper })

    expect(localStorage.getItem('my-finance-theme')).toBeNull()
  })

  it('should provide toggleTheme function (no-op)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })

    expect(typeof result.current.toggleTheme).toBe('function')

    // Should not throw
    expect(() => {
      result.current.toggleTheme()
    }).not.toThrow()
  })

  it('should throw error when useTheme is used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme())
    }).toThrow('useTheme must be used within a ThemeProvider')
  })
})

