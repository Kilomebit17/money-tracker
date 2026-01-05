import type { ReactElement } from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

export type StatisticsPeriod = "day" | "month" | "year";

interface CategoryStats {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
}

const StatisticsPage = (): ReactElement => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatisticsPeriod>("month");
  const [currentPeriodDate, setCurrentPeriodDate] = useState<Date>(new Date());
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const { transactions, categories, primaryCurrency } = useFinance();
  const { rates } = useExchangeRates();

  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 1,
    UAH: 1,
  };
  const activeRates = rates ?? fallbackRates;

  const stats = useMemo(() => {
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

    return {
      totalIncome,
      totalExpenses,
      categoryIncome,
      categoryExpenses,
    };
  }, [transactions, categories, selectedPeriod, currentPeriodDate, primaryCurrency, activeRates]);

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

  const handleCategoryClick = (category: CategoryStats, transactionType: "income" | "expense") => {
    triggerHaptic(webApp, "impact", "light");
    navigate("/transactions/category", {
      state: {
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color,
        period: selectedPeriod,
        periodDate: currentPeriodDate,
        transactionType,
      },
    });
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
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
            initialSlide={0}
          >
            <SwiperSlide>
              <div className="statistics-card__slide statistics-card__slide--expense">
                <div className="statistics-card__slide-label">Total Expenses</div>
                <div className="statistics-card__slide-amount">
                  {formatCurrency(stats.totalExpenses, primaryCurrency)}
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="statistics-card__slide statistics-card__slide--income">
                <div className="statistics-card__slide-label">Total Income</div>
                <div className="statistics-card__slide-amount">
                  {formatCurrency(stats.totalIncome, primaryCurrency)}
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {activeSlideIndex === 0 && stats.categoryExpenses.length > 0 && (
          <div className="statistics-card__categories-section">
            <div className="statistics-card__categories">
              {stats.categoryExpenses.map((category) => (
                <div
                  key={category.id}
                  className="statistics-card__category-card statistics-card__category-card--clickable"
                  onClick={() => handleCategoryClick(category, "expense")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCategoryClick(category, "expense");
                    }
                  }}
                  aria-label={`View ${category.name} transactions`}
                >
                  <div className="statistics-card__category-card-icon" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                    {category.icon}
                  </div>
                  <div className="statistics-card__category-card-content">
                    <div className="statistics-card__category-card-name">{category.name}</div>
                    <div className="statistics-card__category-card-amount">
                      {formatCurrency(category.total, primaryCurrency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSlideIndex === 1 && stats.categoryIncome.length > 0 && (
          <div className="statistics-card__categories-section">
            <div className="statistics-card__categories">
              {stats.categoryIncome.map((category) => (
                <div
                  key={category.id}
                  className="statistics-card__category-card statistics-card__category-card--clickable"
                  onClick={() => handleCategoryClick(category, "income")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCategoryClick(category, "income");
                    }
                  }}
                  aria-label={`View ${category.name} transactions`}
                >
                  <div className="statistics-card__category-card-icon" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                    {category.icon}
                  </div>
                  <div className="statistics-card__category-card-content">
                    <div className="statistics-card__category-card-name">{category.name}</div>
                    <div className="statistics-card__category-card-amount">
                      {formatCurrency(category.total, primaryCurrency)}
                    </div>
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
