import { createContext, useContext } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { useTelegramWebApp } from '../hooks/useTelegramWebApp'

const TelegramContext = createContext<ReturnType<typeof useTelegramWebApp> | undefined>(
  undefined
)

interface TelegramProviderProps {
  children: ReactNode
}

export const TelegramProvider = ({ children }: TelegramProviderProps): ReactElement => {
  const value = useTelegramWebApp()

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
}

export const useTelegram = (): ReturnType<typeof useTelegramWebApp> => {
  const context = useContext(TelegramContext)

  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider')
  }

  return context
}

