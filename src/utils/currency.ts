import type { Currency } from '../types/finance'

export const currencyOrder: Currency[] = ['UAH', 'USD', 'EUR']

export const currencyLocales: Record<Currency, string> = {
  UAH: 'uk-UA',
  USD: 'en-US',
  EUR: 'de-DE'
}

export const formatCurrency = (value: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat(currencyLocales[currency], {
    style: 'currency',
    currency
  })

  return formatter.format(value)
}

export const convertCurrency = (
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<Currency, number> | null
): number => {
  if (from === to || !rates) {
    return amount
  }

  const fromRate = rates[from] ?? 1
  const toRate = rates[to] ?? 1

  if (fromRate === 0) {
    return amount
  }

  return (amount * toRate) / fromRate
}

