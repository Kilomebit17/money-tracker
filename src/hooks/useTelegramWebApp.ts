import { useEffect, useMemo, useState } from "react";
import type { ITelegramWebApp } from "../types/telegram";
import { applyTelegramTheme } from "../services/telegramTheme";

/**
 * Hook to access Telegram Mini App WebApp API
 *
 * @returns Object containing the WebApp instance, initialization status, and utility helpers
 *
 * @example
 * ```tsx
 * const { webApp, isReady, isAvailable } = useTelegramWebApp()
 *
 * useEffect(() => {
 *   if (isReady && webApp) {
 *     // WebApp is ready to use
 *     webApp.MainButton.setText('Submit')
 *     webApp.MainButton.show()
 *   }
 * }, [isReady, webApp])
 * ```
 */
export const useTelegramWebApp = () => {
  const [isReady, setIsReady] = useState(false);

  const webApp = useMemo<ITelegramWebApp | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.Telegram?.WebApp ?? null;
  }, []);

  const isAvailable = useMemo(() => webApp !== null, [webApp]);

  useEffect(() => {
    if (!webApp) {
      return;
    }

    // Initialize the Mini App
    webApp.ready();
    setIsReady(true);

    webApp.expand();

    // Apply Telegram theme colors and styles
    return applyTelegramTheme(webApp);
  }, [webApp]);

  const isInTelegram = useMemo(
    () => isAvailable && isReady,
    [isAvailable, isReady]
  );

  return {
    webApp,
    isReady,
    isAvailable,
    isInTelegram,
  };
};
