import { useCallback, useEffect, useState } from 'react'
import type { Currency } from '../types/finance'

const API_URL = 'https://open.er-api.com/v6/latest/USD'

const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  UAH: 37.1
}

const CACHE_KEY = 'my-finance-exchange-rates'
const REFRESH_INTERVAL_MS = 1000 * 60 * 15

interface ExchangeRateCache {
  timestamp: number
  rates: Record<Currency, number>
}

const isTimestampFresh = (timestamp: number): boolean =>
  Date.now() - timestamp < REFRESH_INTERVAL_MS

const storeRates = (payload: ExchangeRateCache): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}

const parseStoredRates = (value: string): ExchangeRateCache | null => {
  try {
    const parsed = JSON.parse(value) as ExchangeRateCache

    if (
      parsed &&
      typeof parsed.timestamp === 'number' &&
      typeof parsed.rates === 'object'
    ) {
      return parsed
    }

    return null
  } catch {
    return null
  }
}

export const useExchangeRates = () => {
  const [rates, setRates] = useState<Record<Currency, number> | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRates = useCallback(async () => {
    setLoading(true)

    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Unable to fetch exchange rates.')
      }

      const data = (await response.json()) as {
        result?: string
        rates?: Record<Currency, number>
      }
      const remoteRates = data.rates ?? null

      const normalizedRates: Record<Currency, number> = {
        USD: remoteRates?.USD ?? FALLBACK_RATES.USD,
        EUR: remoteRates?.EUR ?? FALLBACK_RATES.EUR,
        UAH: remoteRates?.UAH ?? FALLBACK_RATES.UAH
      }

      const payload: ExchangeRateCache = {
        timestamp: Date.now(),
        rates: normalizedRates
      }

      setRates(payload.rates)
      setLastUpdated(payload.timestamp)
      storeRates(payload)
    } catch (error) {
      console.error('Exchange rate refresh failed:', error)
      setRates((prev) => prev ?? FALLBACK_RATES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const cached = window.localStorage.getItem(CACHE_KEY)

    if (cached) {
      const parsed = parseStoredRates(cached)

      if (parsed && isTimestampFresh(parsed.timestamp)) {
        setRates(parsed.rates)
        setLastUpdated(parsed.timestamp)
        setLoading(false)
      }
    }

    fetchRates()

    const intervalId = window.setInterval(fetchRates, REFRESH_INTERVAL_MS)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [fetchRates])

  return {
    rates,
    loading,
    lastUpdated,
    refresh: fetchRates
  }
}

