import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { useMemo } from "react";
import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import TransactionList from "../components/TransactionList";
import { useTelegram } from "../providers/TelegramProvider";
import { triggerHaptic } from "../utils/haptic";
import { convertCurrency } from "../utils/currency";
import { startOfMonth, endOfMonth } from "date-fns";

const AllTransactionsPage = () => {
  const navigate = useNavigate();
  const { transactions, categories, primaryCurrency } = useFinance();
  const { rates } = useExchangeRates();
  const { webApp } = useTelegram();

  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 1,
    UAH: 1,
  };
  const activeRates = rates ?? fallbackRates;

  const allTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const { incomePercentage, expensePercentage } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const currentMonthTransactions = allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = currentMonthTransactions.reduce((sum, transaction) => {
      if (transaction.type === "income") {
        return (
          sum +
          convertCurrency(
            transaction.usdValueAtEntry,
            "USD",
            primaryCurrency,
            activeRates
          )
        );
      }
      return sum;
    }, 0);

    const expenses = currentMonthTransactions.reduce((sum, transaction) => {
      if (transaction.type === "expense") {
        return (
          sum +
          convertCurrency(
            transaction.usdValueAtEntry,
            "USD",
            primaryCurrency,
            activeRates
          )
        );
      }
      return sum;
    }, 0);

    const total = income + expenses;
    const incomePercent = total > 0 ? (income / total) * 100 : 0;
    const expensePercent = total > 0 ? (expenses / total) * 100 : 0;

    return {
      incomePercentage: incomePercent,
      expensePercentage: expensePercent,
    };
  }, [allTransactions, primaryCurrency, activeRates]);

  return (
    <div className="all-transactions-page">
      <div className="transaction-page__header">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(webApp, 'impact', 'light')
            navigate("/")
          }}
          className="transaction-page__back-button"
          aria-label="Go back"
        >
          <HiArrowLeft className="transaction-page__back-icon" />
        </button>
      </div>
      <div className="transaction-list__progress-wrapper">
        <div className="transaction-list__progress-labels">
          <span className="transaction-list__progress-label">
            {incomePercentage.toFixed(0)} %
          </span>
          <span className="transaction-list__progress-label">
            {expensePercentage.toFixed(0)} %
          </span>
        </div>
        <div className="transaction-list__progress-bar">
          <div
            className="transaction-list__progress-fill transaction-list__progress-fill--income"
            style={{ width: `${incomePercentage}%` }}
          />
          <div
            className="transaction-list__progress-fill transaction-list__progress-fill--expense"
            style={{ width: `${expensePercentage}%` }}
          />
        </div>
      </div>
      <TransactionList
        transactions={allTransactions}
        categories={categories}
        primaryCurrency={primaryCurrency}
        rates={activeRates}
        title="All Transactions"
      />
    </div>
  );
};

export default AllTransactionsPage;

