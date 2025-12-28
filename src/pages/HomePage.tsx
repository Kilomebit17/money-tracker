import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import BalanceCard from "../components/BalanceCard";
import TransactionList from "../components/TransactionList";
import { convertCurrency, currencyOrder, formatCurrency } from "../utils/currency";

const HomePage = () => {
  const { transactions, categories, primaryCurrency } = useFinance();
  const { rates, loading } = useExchangeRates();

  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 1,
    UAH: 1,
  };
  const activeRates = rates ?? fallbackRates;

  const salaryUsdValue = 0;
  const transactionUsdTotal = transactions.reduce((acc, transaction) => {
    return transaction.type === "income"
      ? acc + transaction.usdValueAtEntry
      : acc - transaction.usdValueAtEntry;
  }, 0);

  const balanceInUsd = transactionUsdTotal + salaryUsdValue;
  const balancePrimary = convertCurrency(
    balanceInUsd,
    "USD",
    primaryCurrency,
    activeRates
  );

  const secondaryCurrency =
    currencyOrder.find((currency) => currency !== primaryCurrency) ??
    primaryCurrency;

  const balanceSecondary = convertCurrency(
    balanceInUsd,
    "USD",
    secondaryCurrency,
    activeRates
  );

  const categoryAnalytics = categories.map((category) => {
    const total = transactions.reduce((sum, transaction) => {
      if (
        transaction.categoryId === category.id &&
        transaction.type === "expense"
      ) {
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

    return { ...category, total };
  });

  const totalExpenses = categoryAnalytics.reduce(
    (sum, category) => sum + category.total,
    0
  );

  const featuredCategories = categoryAnalytics
    .filter((category) => category.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  const username = "User"; // TODO: Get from user settings or context

  return (
    <div className="overview-page">
      <div className="greeting-header">
        <div className="greeting-header__content">
          <span className="greeting-header__greeting">{greeting}</span>
          <span className="greeting-header__username">{username}</span>
        </div>
        <div className="greeting-header__avatar">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="rgba(255, 255, 255, 0.1)"/>
            <circle cx="20" cy="16" r="6" fill="rgba(255, 255, 255, 0.6)"/>
            <path d="M8 32C8 26 13 22 20 22C27 22 32 26 32 32" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <BalanceCard
        primaryCurrency={primaryCurrency}
        primaryAmount={balancePrimary}
        secondaryCurrency={secondaryCurrency}
        secondaryAmount={balanceSecondary}
        loading={loading}
        rates={activeRates}
      />
      <TransactionList
        transactions={recentTransactions}
        categories={categories}
        primaryCurrency={primaryCurrency}
        rates={activeRates}
      />
      {featuredCategories.length > 0 && (
        <article className="category-summary">
          <header className="category-summary__header">
            <h2 className="category-summary__title">Top Categories</h2>
            <p className="category-summary__total">
              {formatCurrency(totalExpenses, primaryCurrency)}
            </p>
          </header>
          <div className="category-summary__list">
            {featuredCategories.map((category) => (
              <div key={category.id} className="category-summary__item">
                <div className="category-summary__item-content">
                  <span className="category-summary__icon">{category.icon}</span>
                  <span className="category-summary__name">{category.name}</span>
                </div>
                <span className="category-summary__amount">
                  {formatCurrency(category.total, primaryCurrency)}
                </span>
              </div>
            ))}
          </div>
        </article>
      )}
    </div>
  );
};

export default HomePage;
