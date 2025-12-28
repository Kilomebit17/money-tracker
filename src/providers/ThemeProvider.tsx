import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactElement, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'my-finance-theme'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps): ReactElement => {
  const theme: Theme = 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    // Remove any stored theme preference to ensure dark theme
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () => {} // No-op function for backward compatibility
    }),
    [],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

