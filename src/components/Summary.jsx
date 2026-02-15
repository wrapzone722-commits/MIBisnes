import { useSettings } from '../context/SettingsContext'
import './Summary.css'

function getEffectivePrice(car, cardDiscountPercent) {
  if (car.paymentType !== 'card') return car.price
  const percent = Math.min(50, Math.max(0, Number(cardDiscountPercent) || 0))
  return car.price * (1 - percent / 100)
}

export function Summary({ cars }) {
  const { settings } = useSettings()
  const currency = settings.currency || '₽'
  const totalIncome = cars.reduce((sum, c) => sum + getEffectivePrice(c, settings.cardDiscountPercent), 0)
  const totalExpenses = cars.reduce((sum, c) =>
    sum + c.expenses.reduce((s, e) => s + e.amount, 0), 0
  )
  const totalBalance = totalIncome - totalExpenses

  if (cars.length === 0) return null

  return (
    <div className="summary">
      <p className="summary__title">Итого по всем авто</p>
      <p className="summary__main">{formatMoney(totalBalance)} {currency}</p>
      <div className="summary__details">
        <span className="summary__item summary__item--income">
          Доход: <strong>{formatMoney(totalIncome)} {currency}</strong>
        </span>
        <span className="summary__item summary__item--expense">
          Расход: <strong>{formatMoney(totalExpenses)} {currency}</strong>
        </span>
      </div>
    </div>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}
