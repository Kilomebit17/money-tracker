import { useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Category, Currency, TransactionType } from '../types/finance'

interface TransactionFormState {
  type: TransactionType
  amount: string
  currency: Currency
  categoryId: string
  date: string
  note: string
}

interface TransactionFormProps {
  formState: TransactionFormState
  categories: Category[]
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onAmountBlur: () => void
  loading: boolean
}

const TransactionForm = ({
  formState,
  categories,
  onChange,
  onSubmit,
  onAmountBlur,
  loading
}: TransactionFormProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleDateFieldClick = () => {
    dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()
  }

  const handleSelectFieldClick = () => {
    selectRef.current?.click()
  }

  const handleTypeChange = (type: TransactionType) => {
    const syntheticEvent = {
      target: { name: 'type', value: type }
    } as ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  const handleCurrencyChange = (currency: Currency) => {
    const syntheticEvent = {
      target: { name: 'currency', value: currency }
    } as ChangeEvent<HTMLSelectElement>
    onChange(syntheticEvent)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const selectedCategory = categories.find(c => c.id === formState.categoryId)
  const categoryDisplay = selectedCategory ? selectedCategory.name : 'None'

  return (
    <div className="transaction-page">
      <div className="transaction-page__header">
        <h1 className={`transaction-page__title ${formState.type === 'expense' ? 'transaction-page__title--expense' : formState.type === 'income' ? 'transaction-page__title--income' : ''}`}>
          {formState.type === 'income' ? 'New Income' : 'New Expense'}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="transaction-form-new">
        <div className="transaction-form-new__amount-section">
          <div className="transaction-form-new__amount-display">
            <input
              name="amount"
              type="text"
              inputMode="decimal"
              className="transaction-form-new__amount-input"
              value={formState.amount === '0' ? '' : formState.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '')
                const syntheticEvent = {
                  target: { name: 'amount', value }
                } as ChangeEvent<HTMLInputElement>
                onChange(syntheticEvent)
              }}
              onBlur={onAmountBlur}
              placeholder="0"
            />
            <span className="transaction-form-new__amount-currency">
              {formState.currency}
            </span>
            <button
              type="button"
              className="transaction-form-new__currency-selector"
              onClick={() => {
                const currencies: Currency[] = ['UAH', 'USD', 'EUR']
                const currentIndex = currencies.indexOf(formState.currency)
                const nextCurrency = currencies[(currentIndex + 1) % currencies.length]
                handleCurrencyChange(nextCurrency)
              }}
            >
              {formState.currency}
            </button>
          </div>
        </div>

        <div className="transaction-form-new__tabs">
          <button
            type="button"
            className={`transaction-form-new__tab ${formState.type === 'expense' ? 'transaction-form-new__tab--active expense-active' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`transaction-form-new__tab ${formState.type === 'income' ? 'transaction-form-new__tab--active' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>

        <div className="transaction-form-new__assignment">
          <h2 className="transaction-form-new__section-title">Assignment</h2>
          
          <div className="transaction-form-new__field" onClick={handleSelectFieldClick}>
            <select
              ref={selectRef}
              name="categoryId"
              value={formState.categoryId}
              onChange={onChange}
              className="transaction-form-new__field-select"
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="">None</option>
              )}
            </select>
            <div className="transaction-form-new__field-icon">🏷️</div>
            <label className="transaction-form-new__field-label">
              <span className="transaction-form-new__field-name">Category</span>
              <span className="transaction-form-new__field-display">{categoryDisplay}</span>
            </label>
          </div>

          <div className="transaction-form-new__field" onClick={handleDateFieldClick}>
            <div className="transaction-form-new__field-icon">📅</div>
            <label className="transaction-form-new__field-label transaction-form-new__field-label--date">
              <span className="transaction-form-new__field-name">Date</span>
              <input
                ref={dateInputRef}
                name="date"
                type="date"
                value={formState.date}
                onChange={onChange}
                className="transaction-form-new__field-input transaction-form-new__field-input--date"
              />
              <span className="transaction-form-new__field-display">{formatDate(formState.date)}</span>
            </label>
            <span className="transaction-form-new__field-arrow">&gt;</span>
          </div>

          <div className="transaction-form-new__field transaction-form-new__field--textarea">
            <div className="transaction-form-new__field-icon">📝</div>
            <label className="transaction-form-new__field-label transaction-form-new__field-label--textarea">
              <span className="transaction-form-new__field-name">Note</span>
              <textarea
                name="note"
                value={formState.note}
                onChange={onChange}
                className="transaction-form-new__field-textarea"
                placeholder="Add a note..."
                rows={3}
              />
            </label>
          </div>

          <button
            type="submit"
            className={`transaction-page__save transaction-page__save--bottom ${formState.type === 'expense' ? 'transaction-page__save--expense' : formState.type === 'income' ? 'transaction-page__save--income' : ''}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export type { TransactionFormState }
export default TransactionForm
