import type { ReactElement } from "react";
import { useState, useMemo } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useTelegram } from "../providers/TelegramProvider";
import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import { convertCurrency, formatCurrency } from "../utils/currency";
import { triggerHaptic } from "../utils/haptic";
import {
  startOfDay,
  startOfMonth,
  startOfYear,
  format,
  endOfMonth,
  subDays,
  subMonths,
  subYears,
  endOfYear,
  isBefore,
  addDays,
  addMonths,
  addYears,
} from "date-fns";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/navigation";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/pagination";

type StatisticsPeriod = "day" | "month" | "year";
type ComparisonPeriod = "previous" | "sameLastYear";

interface CategoryStats {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
}

interface PeriodComparison {
  incomeChange: number;
  expenseChange: number;
  balanceChange: number;
  comparisonPeriodLabel: string;
}

const StatisticsPage = (): ReactElement => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatisticsPeriod>("month");
  const [currentPeriodDate, setCurrentPeriodDate] = useState<Date>(new Date());
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>("previous");
  const { webApp } = useTelegram();
  const { transactions, categories, primaryCurrency } = useFinance();
  const { rates } = useExchangeRates();

  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 1,
    UAH: 1,
  };
  const activeRates = rates ?? fallbackRates;

  const { stats, comparison } = useMemo(() => {
    let periodStart: Date;
    let periodEnd: Date;

    switch (selectedPeriod) {
      case "day":
        periodStart = startOfDay(currentPeriodDate);
        periodEnd = new Date(currentPeriodDate);
        periodEnd.setHours(23, 59, 59, 999);
        break;
      case "month":
        periodStart = startOfMonth(currentPeriodDate);
        periodEnd = endOfMonth(currentPeriodDate);
        break;
      case "year":
        periodStart = startOfYear(currentPeriodDate);
        periodEnd = endOfYear(currentPeriodDate);
        break;
    }

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= periodStart && transactionDate <= periodEnd;
    });

    const totalIncome = filtered.reduce((sum, transaction) => {
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

    const totalExpenses = filtered.reduce((sum, transaction) => {
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

    const balance = totalIncome - totalExpenses;

    // Calculate category stats for income
    const incomeCategories = categories.map((category) => {
      const categoryTotal = filtered.reduce((sum, transaction) => {
        if (
          transaction.categoryId === category.id &&
          transaction.type === "income"
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

      return {
        ...category,
        total: categoryTotal,
      };
    });

    const categoryIncome: CategoryStats[] = incomeCategories
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        total: cat.total,
        percentage: totalIncome > 0 ? (cat.total / totalIncome) * 100 : 0,
      }));

    // Calculate category stats for expenses
    const expenseCategories = categories.map((category) => {
      const categoryTotal = filtered.reduce((sum, transaction) => {
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

      return {
        ...category,
        total: categoryTotal,
      };
    });

    const categoryExpenses: CategoryStats[] = expenseCategories
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        total: cat.total,
        percentage: totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0,
      }));

    // Calculate comparison with previous period
    let comparisonData: PeriodComparison | null = null;
    
    let prevPeriodStart: Date;
    let prevPeriodEnd: Date;
    let comparisonPeriodLabel: string;

    if (comparisonPeriod === "previous") {
      // Compare with previous same period
      switch (selectedPeriod) {
        case "day": {
          const prevDay = subDays(currentPeriodDate, 1);
          prevPeriodStart = startOfDay(prevDay);
          prevPeriodEnd = new Date(prevDay);
          prevPeriodEnd.setHours(23, 59, 59, 999);
          comparisonPeriodLabel = "vs Previous Day";
          break;
        }
        case "month": {
          const prevMonth = subMonths(currentPeriodDate, 1);
          prevPeriodStart = startOfMonth(prevMonth);
          prevPeriodEnd = endOfMonth(prevMonth);
          comparisonPeriodLabel = "vs Previous Month";
          break;
        }
        case "year": {
          const prevYear = subYears(currentPeriodDate, 1);
          prevPeriodStart = startOfYear(prevYear);
          prevPeriodEnd = endOfYear(prevYear);
          comparisonPeriodLabel = "vs Previous Year";
          break;
        }
        default: {
          const prevMonth = subMonths(currentPeriodDate, 1);
          prevPeriodStart = startOfMonth(prevMonth);
          prevPeriodEnd = endOfMonth(prevMonth);
          comparisonPeriodLabel = "vs Previous Month";
        }
      }
    } else {
      // Compare with same period last year (only for month and year)
      if (selectedPeriod === "day") {
        // For day, fallback to previous day
        const prevDay = subDays(currentPeriodDate, 1);
        prevPeriodStart = startOfDay(prevDay);
        prevPeriodEnd = new Date(prevDay);
        prevPeriodEnd.setHours(23, 59, 59, 999);
        comparisonPeriodLabel = "vs Previous Day";
      } else if (selectedPeriod === "month") {
        const sameMonthLastYear = subYears(currentPeriodDate, 1);
        prevPeriodStart = startOfMonth(sameMonthLastYear);
        prevPeriodEnd = endOfMonth(sameMonthLastYear);
        comparisonPeriodLabel = "vs Same Month Last Year";
      } else {
        const prevYear = subYears(currentPeriodDate, 1);
        prevPeriodStart = startOfYear(prevYear);
        prevPeriodEnd = endOfYear(prevYear);
        comparisonPeriodLabel = "vs Previous Year";
      }
    }

    const prevPeriodTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= prevPeriodStart && transactionDate <= prevPeriodEnd;
    });

    const prevPeriodIncome = prevPeriodTransactions.reduce((sum, transaction) => {
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

    const prevPeriodExpenses = prevPeriodTransactions.reduce((sum, transaction) => {
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

    const prevPeriodBalance = prevPeriodIncome - prevPeriodExpenses;

    comparisonData = {
      incomeChange: prevPeriodIncome > 0 ? ((totalIncome - prevPeriodIncome) / prevPeriodIncome) * 100 : 0,
      expenseChange: prevPeriodExpenses > 0 ? ((totalExpenses - prevPeriodExpenses) / prevPeriodExpenses) * 100 : 0,
      balanceChange: balance - prevPeriodBalance,
      comparisonPeriodLabel,
    };

    return {
      stats: {
        totalIncome,
        totalExpenses,
        balance,
        categoryIncome,
        categoryExpenses,
      },
      comparison: comparisonData,
    };
  }, [transactions, categories, selectedPeriod, currentPeriodDate, comparisonPeriod, primaryCurrency, activeRates]);

  const handlePeriodChange = (period: StatisticsPeriod) => {
    triggerHaptic(webApp, "selection");
    setSelectedPeriod(period);
    setCurrentPeriodDate(new Date());
  };

  const handlePreviousPeriod = () => {
    triggerHaptic(webApp, "selection");
    switch (selectedPeriod) {
      case "day":
        setCurrentPeriodDate((prev) => subDays(prev, 1));
        break;
      case "month":
        setCurrentPeriodDate((prev) => subMonths(prev, 1));
        break;
      case "year":
        setCurrentPeriodDate((prev) => subYears(prev, 1));
        break;
    }
  };

  const handleNextPeriod = () => {
    if (!canGoNext) {
      return;
    }

    triggerHaptic(webApp, "selection");

    switch (selectedPeriod) {
      case "day":
        setCurrentPeriodDate((prev) => addDays(prev, 1));
        break;
      case "month":
        setCurrentPeriodDate((prev) => addMonths(prev, 1));
        break;
      case "year":
        setCurrentPeriodDate((prev) => addYears(prev, 1));
        break;
    }
  };

  const periodLabel = useMemo(() => {
    switch (selectedPeriod) {
      case "day":
        return format(currentPeriodDate, "d MMM yyyy");
      case "month":
        return format(currentPeriodDate, "MMM yyyy");
      case "year":
        return format(currentPeriodDate, "yyyy");
      default:
        return "";
    }
  }, [selectedPeriod, currentPeriodDate]);

  const canGoNext = useMemo(() => {
    const now = new Date();
    switch (selectedPeriod) {
      case "day":
        return isBefore(startOfDay(currentPeriodDate), startOfDay(now));
      case "month":
        return isBefore(startOfMonth(currentPeriodDate), startOfMonth(now));
      case "year":
        return isBefore(startOfYear(currentPeriodDate), startOfYear(now));
      default:
        return false;
    }
  }, [selectedPeriod, currentPeriodDate]);

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="statistics-page">
      <article className="glass-card statistics-card">
        <header className="statistics-card__header">
          <h2>Statistics</h2>
        </header>

        <div className="statistics-card__tabs">
          <button
            type="button"
            className={`statistics-card__tab ${
              selectedPeriod === "day" ? "statistics-card__tab--active" : ""
            }`}
            onClick={() => handlePeriodChange("day")}
            aria-pressed={selectedPeriod === "day"}
          >
            Day
          </button>
          <button
            type="button"
            className={`statistics-card__tab ${
              selectedPeriod === "month" ? "statistics-card__tab--active" : ""
            }`}
            onClick={() => handlePeriodChange("month")}
            aria-pressed={selectedPeriod === "month"}
          >
            Month
          </button>
          <button
            type="button"
            className={`statistics-card__tab ${
              selectedPeriod === "year" ? "statistics-card__tab--active" : ""
            }`}
            onClick={() => handlePeriodChange("year")}
            aria-pressed={selectedPeriod === "year"}
          >
            Year
          </button>
        </div>

        <div className="statistics-card__period-nav">
          <button
            type="button"
            className="statistics-card__period-nav-button"
            onClick={handlePreviousPeriod}
            aria-label="Previous period"
          >
            <HiChevronLeft />
          </button>
          <div className="statistics-card__period-label">{periodLabel}</div>
          <button
            type="button"
            className="statistics-card__period-nav-button"
            onClick={handleNextPeriod}
            disabled={!canGoNext}
            aria-label="Next period"
          >
            <HiChevronRight />
          </button>
        </div>

        <div className="statistics-card__swiper-wrapper">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="statistics-card__swiper"
          >
            <SwiperSlide>
              <div className="statistics-card__slide statistics-card__slide--income">
                <div className="statistics-card__slide-label">Income</div>
                <div className="statistics-card__slide-amount">
                  {formatCurrency(stats.totalIncome, primaryCurrency)}
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="statistics-card__slide statistics-card__slide--expense">
                <div className="statistics-card__slide-label">Expenses</div>
                <div className="statistics-card__slide-amount">
                  {formatCurrency(stats.totalExpenses, primaryCurrency)}
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="statistics-card__slide statistics-card__slide--balance">
                <div className="statistics-card__slide-label">Balance</div>
                <div className="statistics-card__slide-amount">
                  {stats.balance >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(stats.balance), primaryCurrency)}
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {comparison && (
          <div className="statistics-card__comparison">
            <div className="statistics-card__comparison-header">
              <div className="statistics-card__comparison-title">{comparison.comparisonPeriodLabel}</div>
              <select
                className="statistics-card__comparison-select"
                value={comparisonPeriod}
                onChange={(e) => {
                  triggerHaptic(webApp, "selection");
                  setComparisonPeriod(e.target.value as ComparisonPeriod);
                }}
                aria-label="Comparison period"
              >
                <option value="previous">Previous</option>
                {selectedPeriod !== "day" && (
                  <option value="sameLastYear">Same Last Year</option>
                )}
              </select>
            </div>
            <div className="statistics-card__comparison-items">
              <div className="statistics-card__comparison-item">
                <span className="statistics-card__comparison-label">Income</span>
                <span
                  className={`statistics-card__comparison-value ${
                    comparison.incomeChange >= 0
                      ? "statistics-card__comparison-value--positive"
                      : "statistics-card__comparison-value--negative"
                  }`}
                >
                  {formatChange(comparison.incomeChange)}
                </span>
              </div>
              <div className="statistics-card__comparison-item">
                <span className="statistics-card__comparison-label">Expenses</span>
                <span
                  className={`statistics-card__comparison-value ${
                    comparison.expenseChange <= 0
                      ? "statistics-card__comparison-value--positive"
                      : "statistics-card__comparison-value--negative"
                  }`}
                >
                  {formatChange(comparison.expenseChange)}
                </span>
              </div>
              <div className="statistics-card__comparison-item">
                <span className="statistics-card__comparison-label">Balance</span>
                <span
                  className={`statistics-card__comparison-value ${
                    comparison.balanceChange >= 0
                      ? "statistics-card__comparison-value--positive"
                      : "statistics-card__comparison-value--negative"
                  }`}
                >
                  {comparison.balanceChange >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(comparison.balanceChange), primaryCurrency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {stats.categoryIncome.length > 0 && (
          <div className="statistics-card__categories-section">
            <div className="statistics-card__categories-title">Income by Category</div>
            <div className="statistics-card__categories">
              {stats.categoryIncome.map((category) => (
                <div key={category.id} className="statistics-card__category-item">
                  <div className="statistics-card__category-header">
                    <div className="statistics-card__category-info">
                      <span className="statistics-card__category-icon">{category.icon}</span>
                      <span className="statistics-card__category-name">{category.name}</span>
                    </div>
                    <span className="statistics-card__category-amount">
                      {formatCurrency(category.total, primaryCurrency)}
                    </span>
                  </div>
                  <div className="statistics-card__category-progress-bar">
                    <div
                      className="statistics-card__category-progress-fill"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.categoryExpenses.length > 0 && (
          <div className="statistics-card__categories-section">
            <div className="statistics-card__categories-title">Expenses by Category</div>
            <div className="statistics-card__categories">
              {stats.categoryExpenses.map((category) => (
                <div key={category.id} className="statistics-card__category-item">
                  <div className="statistics-card__category-header">
                    <div className="statistics-card__category-info">
                      <span className="statistics-card__category-icon">{category.icon}</span>
                      <span className="statistics-card__category-name">{category.name}</span>
                    </div>
                    <span className="statistics-card__category-amount">
                      {formatCurrency(category.total, primaryCurrency)}
                    </span>
                  </div>
                  <div className="statistics-card__category-progress-bar">
                    <div
                      className="statistics-card__category-progress-fill"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default StatisticsPage;
