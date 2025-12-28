import type { Currency, Category, Transaction } from '../types/finance'
import { formatCurrency } from '../utils/currency'
import { useNavigate } from 'react-router-dom'
import { HiArrowUp } from 'react-icons/hi2'
import { HiArrowDown } from 'react-icons/hi2'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  primaryCurrency: Currency
  rates: Record<Currency, number>
}

const TransactionList = ({
  transactions,
  categories,
  primaryCurrency: _primaryCurrency,
  rates: _rates
}: TransactionListProps) => {
  const navigate = useNavigate()

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`)
  }

  return (
    <article className="transaction-list">
      <header className="transaction-list__header">
        <h2>Recent Transactions</h2>
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
