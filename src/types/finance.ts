export type Currency = 'UAH' | 'USD' | 'EUR'

export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: Currency
  note: string
  categoryId: string
  date: string
  usdValueAtEntry: number
  exchangeRatesAtEntry: Record<Currency, number>
}

