import type { Currency } from '../types/finance'
import { formatCurrency, convertCurrency } from '../utils/currency'
import { HiBanknotes, HiPlus } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'

interface BalanceCardProps {
  primaryCurrency: Currency
  primaryAmount: number
  secondaryCurrency: Currency
  secondaryAmount: number
  loading: boolean
  rates: Record<string, number>
}

const BalanceCard = ({
  primaryAmount,
  primaryCurrency,
  secondaryAmount,
  secondaryCurrency,
  loading,
  rates,
}: BalanceCardProps) => {
  const navigate = useNavigate()
  const usdToUah = convertCurrency(1, 'USD', 'UAH', rates)
  const eurToUah = convertCurrency(1, 'EUR', 'UAH', rates)

  const handleAddTransaction = () => {
    navigate('/transactions?type=income')
  }

  return (
    <article className="balance-card balance-card--premium">
      <div className="balance-card__content">
        <div className="balance-card__header">
          <span className="balance-card__label">Balance</span>
          {loading && <span className="balance-card__tag">Updating…</span>}
        </div>
        <div className="balance-card__amount-wrapper">
          <p className="balance-card__amount">
            {formatCurrency(primaryAmount, primaryCurrency)}
          </p>
          <button
            type="button"
            className="balance-card__add-button"
            onClick={handleAddTransaction}
            aria-label="Add transaction"
          >
            <HiPlus className="balance-card__add-icon" />
          </button>
        </div>
        <p className="balance-card__secondary">
          {formatCurrency(secondaryAmount, secondaryCurrency)}
        </p>
        <div className="balance-card__rates">
          <span className="balance-card__rate">
            <HiBanknotes className="balance-card__rate-icon" />
            <span className="balance-card__rate-label">USD</span>
            {usdToUah.toFixed(2)}
          </span>
          <span className="balance-card__rate">
            <HiBanknotes className="balance-card__rate-icon" />
            <span className="balance-card__rate-label">EUR</span>
            {eurToUah.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  )
}

export default BalanceCard
