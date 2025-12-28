import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { applyTelegramTheme } from '../telegramTheme'
import type { ITelegramWebApp } from '../../types/telegram'

const createMockWebApp = (): ITelegramWebApp => ({
  initData: '',
  initDataUnsafe: {
    auth_date: Date.now(),
    hash: '',
  },
  version: '6.0',
  platform: 'web',
  colorScheme: 'light',
  themeParams: {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    link_color: '#0066cc',
    button_color: '#0088cc',
    button_text_color: '#ffffff',
    header_bg_color: '#0088cc',
    secondary_bg_color: '#f0f0f0',
  },
  isExpanded: false,
  viewportHeight: 600,
  viewportStableHeight: 600,
  safeAreaInset: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  contentSafeAreaInset: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  headerColor: '',
  backgroundColor: '',
  isClosingConfirmationEnabled: false,
  BackButton: {
    isVisible: false,
    onClick: vi.fn(),
    offClick: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
  },
  MainButton: {
    text: '',
    color: '',
    textColor: '',
    isVisible: false,
    isActive: false,
    isProgressVisible: false,
    setText: vi.fn(),
    onClick: vi.fn(),
    offClick: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    showProgress: vi.fn(),
    hideProgress: vi.fn(),
    setParams: vi.fn(),
  },
  HapticFeedback: {
    impactOccurred: vi.fn(),
    notificationOccurred: vi.fn(),
    selectionChanged: vi.fn(),
  },
  isActive: true,
  isFullscreen: false,
  isVerticalSwipesEnabled: true,
  isOrientationLocked: false,
  ready: vi.fn(),
  expand: vi.fn(),
  close: vi.fn(),
  sendData: vi.fn(),
  openLink: vi.fn(),
  openTelegramLink: vi.fn(),
  openInvoice: vi.fn(),
  showPopup: vi.fn(),
  showAlert: vi.fn(),
  showConfirm: vi.fn(),
  showScanQrPopup: vi.fn(),
  closeScanQrPopup: vi.fn(),
  readTextFromClipboard: vi.fn(),
  requestWriteAccess: vi.fn(),
  requestContact: vi.fn(),
  enableVerticalSwipes: vi.fn(),
  disableVerticalSwipes: vi.fn(),
  setHeaderColor: vi.fn(),
  setBackgroundColor: vi.fn(),
  enableClosingConfirmation: vi.fn(),
  disableClosingConfirmation: vi.fn(),
  onEvent: vi.fn(),
  offEvent: vi.fn(),
  sendEvent: vi.fn(),
  switchInlineQuery: vi.fn(),
  shareToStory: vi.fn(),
  shareMessage: vi.fn(),
  downloadFile: vi.fn(),
  requestFullscreen: vi.fn(),
  exitFullscreen: vi.fn(),
  addToHomeScreen: vi.fn(),
  checkHomeScreenStatus: vi.fn(),
  setEmojiStatus: vi.fn(),
  requestEmojiStatusAccess: vi.fn(),
  lockOrientation: vi.fn(),
  unlockOrientation: vi.fn(),
  setBottomBarColor: vi.fn(),
  hideKeyboard: vi.fn(),
})

describe('telegramTheme', () => {
  beforeEach(() => {
    document.documentElement.style.cssText = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.documentElement.style.cssText = ''
    vi.restoreAllMocks()
  })

  it('should apply theme colors to CSS variables', () => {
    const mockWebApp = createMockWebApp()
    const setBackgroundColorSpy = vi.spyOn(mockWebApp, 'setBackgroundColor')
    const setHeaderColorSpy = vi.spyOn(mockWebApp, 'setHeaderColor')

    applyTelegramTheme(mockWebApp)

    expect(setBackgroundColorSpy).toHaveBeenCalledWith('#ffffff')
    expect(setHeaderColorSpy).toHaveBeenCalledWith('#0088cc')
    expect(document.documentElement.style.getPropertyValue('--tg-theme-bg-color')).toBe('#ffffff')
    expect(document.documentElement.style.getPropertyValue('--tg-theme-text-color')).toBe('#000000')
    expect(document.documentElement.style.getPropertyValue('--tg-theme-hint-color')).toBe('#999999')
    expect(document.documentElement.style.getPropertyValue('--tg-theme-link-color')).toBe('#0066cc')
    expect(document.documentElement.style.getPropertyValue('--tg-theme-button-color')).toBe(
      '#0088cc'
    )
    expect(document.documentElement.style.getPropertyValue('--tg-theme-button-text-color')).toBe(
      '#ffffff'
    )
    expect(document.documentElement.style.getPropertyValue('--tg-theme-secondary-bg-color')).toBe(
      '#f0f0f0'
    )
  })

  it('should register theme changed event listener', () => {
    const mockWebApp = createMockWebApp()
    const onEventSpy = vi.spyOn(mockWebApp, 'onEvent')

    applyTelegramTheme(mockWebApp)

    expect(onEventSpy).toHaveBeenCalledWith('themeChanged', expect.any(Function))
  })

  it('should return cleanup function that removes event listener', () => {
    const mockWebApp = createMockWebApp()
    const offEventSpy = vi.spyOn(mockWebApp, 'offEvent')

    const cleanup = applyTelegramTheme(mockWebApp)

    expect(typeof cleanup).toBe('function')

    cleanup()

    expect(offEventSpy).toHaveBeenCalledWith('themeChanged', expect.any(Function))
  })

  it('should handle missing theme params gracefully', () => {
    const mockWebApp = createMockWebApp()
    mockWebApp.themeParams = {}

    expect(() => {
      applyTelegramTheme(mockWebApp)
    }).not.toThrow()
  })

  it('should update background color on theme change', () => {
    const mockWebApp = createMockWebApp()
    const setBackgroundColorSpy = vi.spyOn(mockWebApp, 'setBackgroundColor')
    let themeChangedHandler: (() => void) | undefined

    // Capture the event handler
    vi.spyOn(mockWebApp, 'onEvent').mockImplementation((event, handler) => {
      if (event === 'themeChanged') {
        themeChangedHandler = handler as () => void
      }
    })

    applyTelegramTheme(mockWebApp)

    // Simulate theme change
    mockWebApp.themeParams.bg_color = '#000000'

    if (themeChangedHandler) {
      themeChangedHandler()
    }

    expect(setBackgroundColorSpy).toHaveBeenCalledTimes(2) // Once initially, once on change
    expect(setBackgroundColorSpy).toHaveBeenLastCalledWith('#000000')
    expect(document.documentElement.style.getPropertyValue('--tg-theme-bg-color')).toBe('#000000')
  })
})

