import type { ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { useMemo } from "react";
import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import TransactionList from "../components/TransactionList";
import { useTelegram } from "../providers/TelegramProvider";
import { triggerHaptic } from "../utils/haptic";
import {
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
} from "date-fns";
import type { StatisticsPeriod } from "./StatisticsPage";

interface LocationState {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  period: StatisticsPeriod;
  periodDate: Date;
  transactionType: "income" | "expense";
}

const CategoryTransactionsPage = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactions, categories, primaryCurrency } = useFinance();
  const { rates } = useExchangeRates();
  const { webApp } = useTelegram();

  const locationState = location.state as LocationState | null;

  if (!locationState) {
    // If no state, redirect back to statistics
    navigate("/statistics");
    return <></>;
  }

  const { categoryId, categoryName, categoryIcon, period, periodDate, transactionType } = locationState;

  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 1,
    UAH: 1,
  };
  const activeRates = rates ?? fallbackRates;

  const filteredTransactions = useMemo(() => {
    let periodStart: Date;
    let periodEnd: Date;

    switch (period) {
      case "day":
        periodStart = startOfDay(periodDate);
        periodEnd = new Date(periodDate);
        periodEnd.setHours(23, 59, 59, 999);
        break;
      case "month":
        periodStart = startOfMonth(periodDate);
        periodEnd = endOfMonth(periodDate);
        break;
      case "year":
        periodStart = startOfYear(periodDate);
        periodEnd = endOfYear(periodDate);
        break;
    }

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.categoryId === categoryId &&
          transaction.type === transactionType &&
          transactionDate >= periodStart &&
          transactionDate <= periodEnd
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categoryId, transactionType, period, periodDate]);

  return (
    <div className="category-transactions-page">
      <div className="transaction-page__header">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(webApp, "impact", "light");
            navigate("/statistics");
          }}
          className="transaction-page__back-button"
          aria-label="Go back"
        >
          <HiArrowLeft className="transaction-page__back-icon" />
        </button>
          <div className="category-transactions-page__header-info">
          <div className="category-transactions-page__header-icon" style={{ backgroundColor: `${locationState.categoryColor}20`, color: locationState.categoryColor }}>
            {categoryIcon}
          </div>
          <div className="category-transactions-page__header-content">
            <h1 className="category-transactions-page__header-title">{categoryName}</h1>
            <p className="category-transactions-page__header-subtitle">
              {transactionType === "income" ? "Income" : "Expenses"} transactions
            </p>
          </div>
        </div>
      </div>
      <TransactionList
        transactions={filteredTransactions}
        categories={categories}
        primaryCurrency={primaryCurrency}
        rates={activeRates}
        title=""
      />
    </div>
  );
};

export default CategoryTransactionsPage;

