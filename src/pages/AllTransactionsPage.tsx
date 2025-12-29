import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import TransactionList from "../components/TransactionList";
import { useTelegram } from "../providers/TelegramProvider";
import { triggerHaptic } from "../utils/haptic";

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

