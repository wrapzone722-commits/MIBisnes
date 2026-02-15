import { Summary } from './Summary'
import './ProfileView.css'

export function ProfileView({ cars }) {
  const totalCars = cars.length
  const totalExpenses = cars.reduce((sum, c) =>
    sum + c.expenses.reduce((s, e) => s + e.amount, 0), 0)
  const totalIncome = cars.reduce((sum, c) => sum + c.price, 0)

  return (
    <div className="profile-view">
      <h2 className="profile-view__title">Итоги</h2>
      <Summary cars={cars} />
      {cars.length > 0 && (
        <p className="profile-view__meta">
          Авто: {totalCars} · Доход {new Intl.NumberFormat('ru-RU').format(totalIncome)} ₽ · Расход {new Intl.NumberFormat('ru-RU').format(totalExpenses)} ₽
        </p>
      )}
    </div>
  )
}
