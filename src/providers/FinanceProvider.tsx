import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Category, Currency, Transaction } from "../types/finance";

const TRANSACTIONS_STORAGE_KEY = "my-finance-transactions";
const PRIMARY_CURRENCY_KEY = "my-finance-primary-currency";

const defaultCategories: Category[] = [
  { id: "salary", name: "Salary", color: "#4ade80", icon: "💼" },
  { id: "food", name: "Food", color: "#fb7185", icon: "🍎" },
  { id: "car", name: "Car", color: "#38bdf8", icon: "🚇" },
  { id: "clothing", name: "Clothing and Shoes", color: "#ec4899", icon: "👕" },
  { id: "health", name: "Health", color: "#10b981", icon: "🏥" },
  { id: "entertainment", name: "Entertainment", color: "#22d3ee", icon: "🎬" },
  { id: "rent", name: "Rent", color: "#a855f7", icon: "🏠" },
  { id: "travel", name: "Travel", color: "#06b6d4", icon: "✈️" },
  { id: "invests", name: "Invests", color: "#22d3ee", icon: "📈" },
  { id: "dividends", name: "Dividends", color: "#fde047", icon: "💰" },
  { id: "debts", name: "Debts", color: "#f43f5e", icon: "💸" },
  { id: "subscriptions", name: "Subscriptions", color: "#fbbf24", icon: "💳" },
];

interface FinanceContextValue {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  primaryCurrency: Currency;
  setPrimaryCurrency: (currency: Currency) => void;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

interface FinanceProviderProps {
  children: ReactNode;
}

const readStoredTransactions = (): Transaction[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as Transaction[];
  } catch {
    return [];
  }
};

const readStoredCurrency = (): Currency => {
  if (typeof window === "undefined") {
    return "UAH";
  }

  const stored = window.localStorage.getItem(PRIMARY_CURRENCY_KEY);

  if (stored === "USD" || stored === "EUR" || stored === "UAH") {
    return stored;
  }

  return "UAH";
};

export const FinanceProvider = ({ children }: FinanceProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(
    readStoredTransactions
  );
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [primaryCurrency, setPrimaryCurrencyState] = useState<Currency>(
    readStoredCurrency
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      TRANSACTIONS_STORAGE_KEY,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const setPrimaryCurrency = (currency: Currency) => {
    setPrimaryCurrencyState(currency);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PRIMARY_CURRENCY_KEY, currency);
    }
  };

  const value: FinanceContextValue = {
    transactions,
    setTransactions,
    categories,
    setCategories,
    primaryCurrency,
    setPrimaryCurrency,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextValue => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }

  return context;
};

