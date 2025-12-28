/**
 * TypeScript definitions for Telegram Mini Apps WebApp API
 * Based on: https://core.telegram.org/bots/webapps
 */

export interface ITelegramWebAppUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
  allows_write_to_pm?: boolean
  added_to_attachment_menu?: boolean
}

export interface ITelegramWebAppChat {
  id: number
  type: 'group' | 'supergroup' | 'channel'
  title: string
  username?: string
  photo_url?: string
}

export interface ITelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
  bottom_bar_bg_color?: string
  section_separator_color?: string
}

export interface ITelegramBackButton {
  isVisible: boolean
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
}

export interface ITelegramMainButton {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  isProgressVisible: boolean
  setText: (text: string) => void
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
  enable: () => void
  disable: () => void
  showProgress: (leaveActive?: boolean) => void
  hideProgress: () => void
  setParams: (params: {
    text?: string
    color?: string
    text_color?: string
    is_active?: boolean
    is_visible?: boolean
  }) => void
}

export interface ITelegramSecondaryButton {
  text: string
  isVisible: boolean
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
  setText: (text: string) => void
}

export interface ITelegramSettingsButton {
  isVisible: boolean
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
}

export interface ITelegramHapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  selectionChanged: () => void
}

export interface ITelegramCloudStorage {
  setItem: (key: string, value: string, callback?: (error: Error | null, success: boolean) => void) => void
  getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void
  getItems: (keys: string[], callback: (error: Error | null, values: Record<string, string>) => void) => void
  removeItem: (key: string, callback?: (error: Error | null, success: boolean) => void) => void
  removeItems: (keys: string[], callback?: (error: Error | null, success: boolean) => void) => void
  getKeys: (callback: (error: Error | null, keys: string[]) => void) => void
}

export interface ITelegramDeviceStorage {
  setItem: (key: string, value: string, callback?: (error: Error | null, success: boolean) => void) => void
  getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void
  getItems: (keys: string[], callback: (error: Error | null, values: Record<string, string>) => void) => void
  removeItem: (key: string, callback?: (error: Error | null, success: boolean) => void) => void
  removeItems: (keys: string[], callback?: (error: Error | null, success: boolean) => void) => void
  getKeys: (callback: (error: Error | null, keys: string[]) => void) => void
}

export interface ITelegramSecureStorage {
  setItem: (key: string, value: string, callback?: (error: Error | null, success: boolean) => void) => void
  getItem: (key: string, callback: (error: Error | null, value: string | null) => void) => void
  getItems: (keys: string[], callback: (error: Error | null, values: Record<string, string>) => void) => void
  removeItem: (key: string, callback?: (error: Error | null, success: boolean) => void) => void
  removeItems: (keys: string[], callback?: (error: Error | null, success: boolean) => void) => void
  getKeys: (callback: (error: Error | null, keys: string[]) => void) => void
}

export interface ITelegramBiometricManager {
  isInited: boolean
  isBiometricAvailable: boolean
  biometricType: 'finger' | 'face' | 'unknown'
  isAccessRequested: boolean
  isAccessGranted: boolean
  isLocked: boolean
  init: (callback?: (success: boolean) => void) => void
  requestAccess: (
    params: { reason?: string },
    callback?: (granted: boolean) => void
  ) => void
  authenticate: (
    params: { reason?: string },
    callback?: (success: boolean, token?: string) => void
  ) => void
  updateBiometricToken: (
    token: string,
    callback?: (success: boolean) => void
  ) => void
  openSettings: (callback?: () => void) => void
}

export interface ITelegramWebApp {
  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: ITelegramWebAppUser
    receiver?: ITelegramWebAppUser
    chat?: ITelegramWebAppChat
    chat_type?: string
    chat_instance?: string
    start_param?: string
    can_send_after?: number
    auth_date: number
    hash: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: ITelegramThemeParams
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  safeAreaInset: {
    top: number
    right: number
    bottom: number
    left: number
  }
  contentSafeAreaInset: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  BackButton: ITelegramBackButton
  MainButton: ITelegramMainButton
  SecondaryButton?: ITelegramSecondaryButton
  SettingsButton?: ITelegramSettingsButton
  HapticFeedback: ITelegramHapticFeedback
  CloudStorage?: ITelegramCloudStorage
  DeviceStorage?: ITelegramDeviceStorage
  SecureStorage?: ITelegramSecureStorage
  BiometricManager?: ITelegramBiometricManager
  isActive: boolean
  isFullscreen: boolean
  isVerticalSwipesEnabled: boolean
  isOrientationLocked: boolean
  ready: () => void
  expand: () => void
  close: () => void
  sendData: (data: string) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text?: string
    }>
  }, callback?: (id: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: {
    text?: string
  }, callback?: (data: string) => void) => void
  closeScanQrPopup: (callback?: () => void) => void
  readTextFromClipboard: (callback?: (text: string) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (granted: boolean) => void) => void
  enableVerticalSwipes: () => void
  disableVerticalSwipes: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void
  sendEvent: (eventType: string, eventData: Record<string, unknown>) => void
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
  shareToStory: (params: {
    url?: string
    text?: string
    assetType?: 'photo' | 'video'
  }, callback?: (success: boolean) => void) => void
  shareMessage: (params: {
    text: string
    url?: string
  }, callback?: (success: boolean) => void) => void
  downloadFile: (url: string, callback?: (success: boolean) => void) => void
  requestFullscreen: () => void
  exitFullscreen: () => void
  addToHomeScreen: (callback?: (success: boolean) => void) => void
  checkHomeScreenStatus: (callback?: (available: boolean, added: boolean) => void) => void
  setEmojiStatus: (emoji_identifier: string, duration?: number, callback?: (success: boolean) => void) => void
  requestEmojiStatusAccess: (callback?: (granted: boolean) => void) => void
  lockOrientation: (orientation: 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary') => void
  unlockOrientation: () => void
  setBottomBarColor: (color: string) => void
  hideKeyboard: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: ITelegramWebApp
    }
  }
}

