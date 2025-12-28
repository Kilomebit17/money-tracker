import type { ITelegramWebApp } from '../types/telegram'

/**
 * Applies Telegram theme colors to CSS variables and WebApp
 * 
 * @param webApp - Telegram WebApp instance
 * @returns Cleanup function to remove event listeners
 */
export const applyTelegramTheme = (webApp: ITelegramWebApp): (() => void) => {
  const themeParams = webApp.themeParams

  // Apply background color from Telegram theme
  if (themeParams.bg_color) {
    webApp.setBackgroundColor(themeParams.bg_color)
    document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color)
  }

  // Apply header color if available
  if (themeParams.header_bg_color) {
    webApp.setHeaderColor(themeParams.header_bg_color)
    document.documentElement.style.setProperty(
      '--tg-theme-header-bg-color',
      themeParams.header_bg_color
    )
  }

  // Apply text colors
  if (themeParams.text_color) {
    document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color)
  }

  if (themeParams.hint_color) {
    document.documentElement.style.setProperty('--tg-theme-hint-color', themeParams.hint_color)
  }

  if (themeParams.link_color) {
    document.documentElement.style.setProperty('--tg-theme-link-color', themeParams.link_color)
  }

  if (themeParams.button_color) {
    document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.button_color)
  }

  if (themeParams.button_text_color) {
    document.documentElement.style.setProperty(
      '--tg-theme-button-text-color',
      themeParams.button_text_color
    )
  }

  // Apply secondary background color if available
  if (themeParams.secondary_bg_color) {
    document.documentElement.style.setProperty(
      '--tg-theme-secondary-bg-color',
      themeParams.secondary_bg_color
    )
  }

  // Listen for theme changes
  const handleThemeChanged = (): void => {
    const updatedThemeParams = webApp.themeParams

    if (updatedThemeParams.bg_color) {
      webApp.setBackgroundColor(updatedThemeParams.bg_color)
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color',
        updatedThemeParams.bg_color
      )
    }
  }

  webApp.onEvent('themeChanged', handleThemeChanged)

  // Return cleanup function
  return (): void => {
    webApp.offEvent('themeChanged', handleThemeChanged)
  }
}

