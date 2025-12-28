import type { Currency } from '../types/finance'
import { formatCurrency } from '../utils/currency'

export interface SalaryInput {
  amount: number
  currency: Currency
}

interface SalaryCardProps {
  salary: SalaryInput
  history: Array<{ label: string; amount: number; currency: Currency }>
  onSalaryUpdate: (payload: Partial<SalaryInput>) => void
}

const SalaryCard = ({ salary, history, onSalaryUpdate }: SalaryCardProps) => (
  <article className="glass-card salary-card">
    <header>
      <p className="salary-card__title">My salary</p>
      <p className="salary-card__description">
        Monthly salary updates your balance automatically.
      </p>
    </header>
    <div className="salary-card__form">
      <label>
        Amount
        <input
          type="number"
          min="0"
          placeholder="0.00"
          value={salary.amount}
          onChange={(event) =>
            onSalaryUpdate({ amount: Number(event.target.value) })
          }
        />
      </label>
      <label>
        Currency
        <select
          value={salary.currency}
          onChange={(event) =>
            onSalaryUpdate({ currency: event.target.value as Currency })
          }
        >
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </label>
    </div>
    <div className="salary-card__history">
      {history.map((entry) => (
        <div key={entry.label}>
          <span>{entry.label}</span>
          <strong>{formatCurrency(entry.amount, entry.currency)}</strong>
        </div>
      ))}
    </div>
  </article>
)

export default SalaryCard
