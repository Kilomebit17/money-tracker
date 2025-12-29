import type { ReactElement } from "react";
import { useFinance } from "../providers/FinanceProvider";
// import { useExchangeRates } from "../hooks/useExchangeRates";
import { currencyOrder } from "../utils/currency";
import type { Currency } from "../types/finance";
import { useTelegram } from "../providers/TelegramProvider";
import { triggerHaptic } from "../utils/haptic";

const SettingsPage = (): ReactElement => {
  const { primaryCurrency, setPrimaryCurrency } = useFinance();
  const { webApp } = useTelegram();
  // const { loading, refresh } = useExchangeRates();

  return (
    <div className="settings-page">
      <article className="glass-card settings-card">
        <header className="settings-card__header">
          <h2>Settings</h2>
        </header>

        <div className="settings-card__section">
          <div className="settings-item">
            <div className="settings-item__label">
              <span className="settings-item__icon">💱</span>
              <div>
                <strong>Primary currency</strong>
                <p>Display currency for balances</p>
              </div>
            </div>
            <select
              className="settings-item__select"
              value={primaryCurrency}
              onChange={(event) => {
                triggerHaptic(webApp, 'selection')
                setPrimaryCurrency(event.target.value as Currency)
              }}
            >
              {currencyOrder.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="settings-item">
            <div className="settings-item__label">
              <span className="settings-item__icon">🔄</span>
              <div>
                <strong>Exchange rates</strong>
                <p>Refresh manually if needed</p>
              </div>
            </div>
            <button
              type="button"
              className="settings-item__button"
              onClick={refresh}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div> */}
        </div>
      </article>
    </div>
  );
};

export default SettingsPage;

