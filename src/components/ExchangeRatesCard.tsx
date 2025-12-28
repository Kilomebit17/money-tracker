interface ExchangeRatePair {
  label: string
  rate?: number
}

interface ExchangeRatesCardProps {
  ratePairs: ExchangeRatePair[]
  loading: boolean
  onRefresh: () => void
}

const ExchangeRatesCard = ({ ratePairs, loading, onRefresh }: ExchangeRatesCardProps) => (
  <article className="glass-card exchange-card">
    <header className="exchange-card__header">
      <div>
        <p className="exchange-card__title">Exchange rates</p>
        <small>USD, EUR, UAH with live refresh</small>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="exchange-card__refresh"
      >
        Refresh
      </button>
    </header>
    <div className="exchange-card__list">
      {ratePairs.map(({ label, rate }) => (
        <div key={label} className="exchange-card__item">
          <span>{label}</span>
          <strong>{rate ? rate.toFixed(4) : '—'}</strong>
        </div>
      ))}
    </div>
  </article>
)

export default ExchangeRatesCard
