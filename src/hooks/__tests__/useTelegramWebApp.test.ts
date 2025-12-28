import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTelegramWebApp } from '../useTelegramWebApp'
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
  themeParams: {},
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

describe('useTelegramWebApp', () => {
  beforeEach(() => {
    // Clear Telegram from window before each test
    delete (window as Partial<Window>).Telegram
    vi.clearAllMocks()
  })

  afterEach(() => {
    delete (window as Partial<Window>).Telegram
    vi.restoreAllMocks()
  })

  it('should return null webApp when Telegram is not available', () => {
    const { result } = renderHook(() => useTelegramWebApp())

    expect(result.current.webApp).toBeNull()
    expect(result.current.isAvailable).toBe(false)
    expect(result.current.isReady).toBe(false)
    expect(result.current.isInTelegram).toBe(false)
  })

  it('should return webApp when Telegram is available', () => {
    const mockWebApp = createMockWebApp()
    ;(window as Window & { Telegram?: { WebApp: ITelegramWebApp } }).Telegram = {
      WebApp: mockWebApp,
    }

    const { result } = renderHook(() => useTelegramWebApp())

    expect(result.current.webApp).toBeDefined()
    expect(result.current.isAvailable).toBe(true)
  })

  it('should initialize WebApp when available', async () => {
    const mockWebApp = createMockWebApp()
    const readySpy = vi.spyOn(mockWebApp, 'ready')
    const expandSpy = vi.spyOn(mockWebApp, 'expand')
    
    ;(window as Window & { Telegram?: { WebApp: ITelegramWebApp } }).Telegram = {
      WebApp: mockWebApp,
    }

    const { result } = renderHook(() => useTelegramWebApp())

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })

    expect(readySpy).toHaveBeenCalledTimes(1)
    expect(expandSpy).toHaveBeenCalledTimes(1)
  })

  it('should call expand when WebApp is not expanded', async () => {
    const mockWebApp = createMockWebApp()
    mockWebApp.isExpanded = false
    const expandSpy = vi.spyOn(mockWebApp, 'expand')
    
    ;(window as Window & { Telegram?: { WebApp: ITelegramWebApp } }).Telegram = {
      WebApp: mockWebApp,
    }

    renderHook(() => useTelegramWebApp())

    await waitFor(() => {
      expect(expandSpy).toHaveBeenCalled()
    })
  })

  it('should set isInTelegram to true when available and ready', async () => {
    const mockWebApp = createMockWebApp()
    
    ;(window as Window & { Telegram?: { WebApp: ITelegramWebApp } }).Telegram = {
      WebApp: mockWebApp,
    }

    const { result } = renderHook(() => useTelegramWebApp())

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })

    expect(result.current.isInTelegram).toBe(true)
  })
})

