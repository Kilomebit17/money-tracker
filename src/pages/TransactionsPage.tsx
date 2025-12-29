import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFinance } from "../providers/FinanceProvider";
import { useExchangeRates } from "../hooks/useExchangeRates";
import TransactionForm, {
  type TransactionFormState,
} from "../components/TransactionForm";
import { convertCurrency } from "../utils/currency";
import type { TransactionType } from "../types/finance";

const today = new Date().toISOString().split("T")[0];

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTransactions, categories } = useFinance();
  const { rates, loading } = useExchangeRates();
  
  const transactionTypeFromUrl = searchParams.get("type");
  const initialType: TransactionType = 
    transactionTypeFromUrl === "income" ? "income" : "expense";
  
  const [transactionForm, setTransactionForm] = useState<TransactionFormState>(
    () => ({
      type: initialType,
      amount: "0",
      currency: "UAH",
      categoryId: categories[0]?.id || "",
      date: today,
      note: "",
    })
  );

  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 1,
    UAH: 1,
  };
  const activeRates = rates ?? fallbackRates;

  const handleTransactionChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setTransactionForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
    }));
  };

  const handleAmountBlur = () => {
    if (transactionForm.amount === "" || transactionForm.amount === "0") {
      setTransactionForm((prev) => ({ ...prev, amount: "0" }));
    }
  };

  const handleTransactionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(transactionForm.amount.replace(/,/g, ""));

    if (!parsedAmount || parsedAmount <= 0) {
      return;
    }

    const newTransaction = {
      id: `tx-${Date.now()}`,
      type: transactionForm.type,
      amount: parsedAmount,
      currency: transactionForm.currency,
      categoryId: transactionForm.categoryId,
      note: transactionForm.note,
      date: transactionForm.date,
      usdValueAtEntry: convertCurrency(
        parsedAmount,
        transactionForm.currency,
        "USD",
        activeRates
      ),
      exchangeRatesAtEntry: activeRates ?? {},
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setTransactionForm((prev) => ({
      ...prev,
      amount: "0",
      note: "",
      date: today,
    }));
    navigate("/");
  };

  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl === "income" && transactionForm.type !== "income") {
      setTransactionForm((prev) => ({ ...prev, type: "income" }));
    } else if (typeFromUrl === "expense" && transactionForm.type !== "expense") {
      setTransactionForm((prev) => ({ ...prev, type: "expense" }));
    }
  }, [searchParams, transactionForm.type]);

  useEffect(() => {
    if (categories.length > 0 && !categories.find((c) => c.id === transactionForm.categoryId)) {
      setTransactionForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, transactionForm.categoryId]);

  return (
    <TransactionForm
      formState={transactionForm}
      categories={categories}
      onChange={handleTransactionChange}
      onSubmit={handleTransactionSubmit}
      onAmountBlur={handleAmountBlur}
      loading={loading}
    />
  );
};

export default TransactionsPage;

