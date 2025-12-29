import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import TransactionList from "../components/TransactionList";

const AllTransactionsPage = () => {
  const { transactions, categories, primaryCurrency } = useFinance();
  const { rates } = useExchangeRates();

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

