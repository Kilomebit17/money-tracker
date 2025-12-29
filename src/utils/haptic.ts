import type { ITelegramHapticFeedback } from '../types/telegram'

/**
 * Triggers haptic feedback if Telegram WebApp is available
 * 
 * @param webApp - Telegram WebApp instance (can be null)
 * @param type - Type of haptic feedback
 * @param style - Style for impact/notification feedback
 */
export const triggerHaptic = (
  webApp: { HapticFeedback?: ITelegramHapticFeedback } | null | undefined,
  type: 'impact' | 'notification' | 'selection' = 'impact',
  style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'success' | 'warning' = 'light'
): void => {
  if (!webApp?.HapticFeedback) {
    return
  }

  try {
    switch (type) {
      case 'impact':
        webApp.HapticFeedback.impactOccurred(style as 'light' | 'medium' | 'heavy' | 'rigid' | 'soft')
        break
      case 'notification':
        webApp.HapticFeedback.notificationOccurred(style as 'error' | 'success' | 'warning')
        break
      case 'selection':
        webApp.HapticFeedback.selectionChanged()
        break
    }
  } catch (error) {
    // Silently fail if haptic feedback is not available
    console.debug('Haptic feedback not available:', error)
  }
}

