import type { Currency, Category, Transaction } from '../types/finance'
import { formatCurrency } from '../utils/currency'
import { useNavigate } from 'react-router-dom'
import { HiArrowUp } from 'react-icons/hi2'
import { HiArrowDown } from 'react-icons/hi2'
import { useTelegram } from '../providers/TelegramProvider'
import { triggerHaptic } from '../utils/haptic'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  primaryCurrency: Currency
  rates: Record<Currency, number>
  title?: string
  showViewAll?: boolean
  viewAllPath?: string
}

const TransactionList = ({
  transactions,
  categories,
  primaryCurrency: _primaryCurrency,
  rates: _rates,
  title = 'Recent Transactions',
  showViewAll = false,
  viewAllPath = '/transactions/all'
}: TransactionListProps) => {
  const navigate = useNavigate()
  const { webApp } = useTelegram()

  const handleTransactionClick = (transactionId: string) => {
    triggerHaptic(webApp, 'impact', 'light')
    navigate(`/transactions/${transactionId}`)
  }

  const handleViewAllClick = () => {
    triggerHaptic(webApp, 'selection')
    navigate(viewAllPath)
  }

  return (
    <article className="transaction-list">
      <header className="transaction-list__header">
        <h2>{title}</h2>
        {showViewAll && (
          <button
            type="button"
            className="transaction-list__view-all-button"
            onClick={handleViewAllClick}
            aria-label="View all transactions"
          >
            View all
          </button>
        )}
      </header>
      <ul>
        {transactions.map((transaction) => {
          const category = categories.find((item) => item.id === transaction.categoryId)

          return (
            <li
              key={transaction.id}
              className="transaction-list__item transaction-list__item--clickable"
              onClick={() => handleTransactionClick(transaction.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTransactionClick(transaction.id)
                }
              }}
              aria-label={`View transaction: ${category?.name || 'Uncategorized'}`}
            >
              <div className="transaction-list__icon-wrapper">
                {transaction.type === 'income' ? (
                  <HiArrowUp className="transaction-list__icon transaction-list__icon--income" />
                ) : (
                  <HiArrowDown className="transaction-list__icon transaction-list__icon--expense" />
                )}
              </div>
              <div className="transaction-list__content">
                <strong>{category?.name || 'Uncategorized'}</strong>
                <span className="transaction-list__timestamp">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <p
                className={
                  transaction.type === 'income'
                    ? 'transaction-list__amount--income'
                    : 'transaction-list__amount--expense'
                }
              >
                {transaction.type === 'income' ? '+' : '-'}{' '}
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export default TransactionList
