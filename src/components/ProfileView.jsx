import { useSettings } from '../context/SettingsContext'
import { Summary } from './Summary'
import './ProfileView.css'

function getEffectivePrice(car, cardDiscountPercent) {
  if (car.paymentType !== 'card') return car.price
  const percent = Math.min(50, Math.max(0, Number(cardDiscountPercent) || 0))
  return car.price * (1 - percent / 100)
}

export function ProfileView({ cars }) {
  const { settings } = useSettings()
  const currency = settings.currency || '₽'
  const totalCars = cars.length
  const totalExpenses = cars.reduce((sum, c) =>
    sum + c.expenses.reduce((s, e) => s + e.amount, 0), 0)
  const totalIncome = cars.reduce((sum, c) => sum + getEffectivePrice(c, settings.cardDiscountPercent), 0)

  return (
    <div className="profile-view">
      <h2 className="profile-view__title">Итоги</h2>
      <Summary cars={cars} />
      {cars.length > 0 && (
        <p className="profile-view__meta">
          Авто: {totalCars} · Доход {new Intl.NumberFormat('ru-RU').format(totalIncome)} {currency} · Расход {new Intl.NumberFormat('ru-RU').format(totalExpenses)} {currency}
        </p>
      )}
    </div>
  )
}
