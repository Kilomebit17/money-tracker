import { describe, it, expect, vi, beforeEach } from 'vitest'
import { triggerHaptic } from '../haptic'
import type { ITelegramHapticFeedback, ITelegramWebApp } from '../../types/telegram'

describe('triggerHaptic', () => {
  let mockHapticFeedback: ITelegramHapticFeedback
  let mockWebApp: ITelegramWebApp

  beforeEach(() => {
    mockHapticFeedback = {
      impactOccurred: vi.fn(),
      notificationOccurred: vi.fn(),
      selectionChanged: vi.fn(),
    }

    mockWebApp = {
      HapticFeedback: mockHapticFeedback,
    } as unknown as ITelegramWebApp

    vi.clearAllMocks()
  })

  it('should do nothing when webApp is null', () => {
    triggerHaptic(null, 'impact', 'light')

    expect(mockHapticFeedback.impactOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.notificationOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.selectionChanged).not.toHaveBeenCalled()
  })

  it('should do nothing when webApp is undefined', () => {
    triggerHaptic(undefined, 'impact', 'light')

    expect(mockHapticFeedback.impactOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.notificationOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.selectionChanged).not.toHaveBeenCalled()
  })

  it('should do nothing when HapticFeedback is not available', () => {
    const webAppWithoutHaptic = {} as ITelegramWebApp

    triggerHaptic(webAppWithoutHaptic, 'impact', 'light')

    expect(mockHapticFeedback.impactOccurred).not.toHaveBeenCalled()
  })

  it('should trigger impact feedback with light style by default', () => {
    triggerHaptic(mockWebApp, 'impact', 'light')

    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledWith('light')
    expect(mockHapticFeedback.notificationOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.selectionChanged).not.toHaveBeenCalled()
  })

  it('should trigger impact feedback with medium style', () => {
    triggerHaptic(mockWebApp, 'impact', 'medium')

    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledWith('medium')
  })

  it('should trigger impact feedback with heavy style', () => {
    triggerHaptic(mockWebApp, 'impact', 'heavy')

    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledWith('heavy')
  })

  it('should trigger impact feedback with rigid style', () => {
    triggerHaptic(mockWebApp, 'impact', 'rigid')

    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledWith('rigid')
  })

  it('should trigger impact feedback with soft style', () => {
    triggerHaptic(mockWebApp, 'impact', 'soft')

    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledWith('soft')
  })

  it('should trigger notification feedback with success', () => {
    triggerHaptic(mockWebApp, 'notification', 'success')

    expect(mockHapticFeedback.notificationOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.notificationOccurred).toHaveBeenCalledWith('success')
    expect(mockHapticFeedback.impactOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.selectionChanged).not.toHaveBeenCalled()
  })

  it('should trigger notification feedback with error', () => {
    triggerHaptic(mockWebApp, 'notification', 'error')

    expect(mockHapticFeedback.notificationOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.notificationOccurred).toHaveBeenCalledWith('error')
  })

  it('should trigger notification feedback with warning', () => {
    triggerHaptic(mockWebApp, 'notification', 'warning')

    expect(mockHapticFeedback.notificationOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.notificationOccurred).toHaveBeenCalledWith('warning')
  })

  it('should trigger selection feedback', () => {
    triggerHaptic(mockWebApp, 'selection')

    expect(mockHapticFeedback.selectionChanged).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).not.toHaveBeenCalled()
    expect(mockHapticFeedback.notificationOccurred).not.toHaveBeenCalled()
  })

  it('should default to impact with light style when type is not specified', () => {
    triggerHaptic(mockWebApp)

    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledTimes(1)
    expect(mockHapticFeedback.impactOccurred).toHaveBeenCalledWith('light')
  })

  it('should handle errors gracefully', () => {
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const error = new Error('Haptic feedback error')
    mockHapticFeedback.impactOccurred = vi.fn().mockImplementation(() => {
      throw error
    })

    // Should not throw
    expect(() => {
      triggerHaptic(mockWebApp, 'impact', 'light')
    }).not.toThrow()

    expect(consoleDebugSpy).toHaveBeenCalledWith('Haptic feedback not available:', error)

    consoleDebugSpy.mockRestore()
  })

  it('should handle errors for notification gracefully', () => {
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const error = new Error('Notification error')
    mockHapticFeedback.notificationOccurred = vi.fn().mockImplementation(() => {
      throw error
    })

    expect(() => {
      triggerHaptic(mockWebApp, 'notification', 'success')
    }).not.toThrow()

    expect(consoleDebugSpy).toHaveBeenCalledWith('Haptic feedback not available:', error)

    consoleDebugSpy.mockRestore()
  })

  it('should handle errors for selection gracefully', () => {
    const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const error = new Error('Selection error')
    mockHapticFeedback.selectionChanged = vi.fn().mockImplementation(() => {
      throw error
    })

    expect(() => {
      triggerHaptic(mockWebApp, 'selection')
    }).not.toThrow()

    expect(consoleDebugSpy).toHaveBeenCalledWith('Haptic feedback not available:', error)

    consoleDebugSpy.mockRestore()
  })
})

