import { useParams, useNavigate } from 'react-router-dom';
import { useFinance } from '../providers/FinanceProvider';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import { formatCurrency } from '../utils/currency';
import type { TransactionType } from '../types/finance';
import { HiArrowUp } from 'react-icons/hi2';
import { HiArrowDown } from 'react-icons/hi2';
import { HiTrash } from 'react-icons/hi2';
import { HiArrowLeft } from 'react-icons/hi2';

const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, setTransactions, categories } = useFinance();
  const { webApp } = useTelegramWebApp();

  const transaction = transactions.find((tx) => tx.id === id);

  if (!transaction) {
    return (
      <div className="transaction-page">
        <div className="transaction-page__header">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="transaction-page__back-button"
            aria-label="Go back"
          >
            <HiArrowLeft className="transaction-page__back-icon" />
          </button>
          <h1 className="transaction-page__title">Transaction Not Found</h1>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === transaction.categoryId);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleTypeChange = (newType: TransactionType) => {
    if (newType === transaction.type) {
      return;
    }

    setTransactions((prev) =>
      prev.map((tx) => (tx.id === transaction.id ? { ...tx, type: newType } : tx))
    );
  };

  const handleDelete = () => {
    const confirmMessage = 'Are you sure you want to delete this transaction?';

    if (webApp?.showConfirm) {
      webApp.showConfirm(confirmMessage, (confirmed: boolean) => {
        if (confirmed) {
          setTransactions((prev) => prev.filter((tx) => tx.id !== transaction.id));
          navigate('/');
        }
      });
    } else if (window.confirm(confirmMessage)) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== transaction.id));
      navigate('/');
    }
  };

  return (
    <div className="transaction-page">
      <div className="transaction-page__header">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="transaction-page__back-button"
          aria-label="Go back"
        >
          <HiArrowLeft className="transaction-page__back-icon" />
        </button>
        <h1
          className={`transaction-page__title ${
            transaction.type === 'expense'
              ? 'transaction-page__title--expense'
              : 'transaction-page__title--income'
          }`}
        >
          {transaction.type === 'income' ? 'Income' : 'Expense'}
        </h1>
        <button
          type="button"
          onClick={handleDelete}
          className="transaction-page__delete-button"
          aria-label="Delete transaction"
        >
          <HiTrash className="transaction-page__delete-icon" />
        </button>
      </div>

      <div className="transaction-detail">
        <div className="transaction-detail__amount-section">
          <div className="transaction-detail__amount-display">
            <span className="transaction-detail__amount-sign">
              {transaction.type === 'income' ? '+' : '-'}
            </span>
            <span className="transaction-detail__amount-value">
              {formatCurrency(transaction.amount, transaction.currency)}
            </span>
          </div>
        </div>

        <div className="transaction-form-new__tabs">
          <button
            type="button"
            className={`transaction-form-new__tab ${
              transaction.type === 'expense'
                ? 'transaction-form-new__tab--active expense-active'
                : ''
            }`}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`transaction-form-new__tab ${
              transaction.type === 'income'
                ? 'transaction-form-new__tab--active'
                : ''
            }`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>

        <div className="transaction-form-new__assignment">
          <h2 className="transaction-form-new__section-title">Details</h2>

          <div className="transaction-form-new__field">
            <div className="transaction-form-new__field-icon">
              {transaction.type === 'income' ? (
                <HiArrowUp className="transaction-detail__type-icon transaction-detail__type-icon--income" />
              ) : (
                <HiArrowDown className="transaction-detail__type-icon transaction-detail__type-icon--expense" />
              )}
            </div>
            <label className="transaction-form-new__field-label">
              <span className="transaction-form-new__field-name">Category</span>
              <span className="transaction-form-new__field-display">
                {category?.name || 'Uncategorized'}
              </span>
            </label>
          </div>

          <div className="transaction-form-new__field">
            <div className="transaction-form-new__field-icon">📅</div>
            <label className="transaction-form-new__field-label">
              <span className="transaction-form-new__field-name">Date</span>
              <span className="transaction-form-new__field-display">
                {formatDate(transaction.date)}
              </span>
            </label>
          </div>

          {transaction.note && (
            <div className="transaction-form-new__field transaction-form-new__field--textarea">
              <div className="transaction-form-new__field-icon">📝</div>
              <label className="transaction-form-new__field-label transaction-form-new__field-label--textarea">
                <span className="transaction-form-new__field-name">Note</span>
                <div className="transaction-form-new__field-display transaction-form-new__field-display--multiline">
                  {transaction.note}
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
