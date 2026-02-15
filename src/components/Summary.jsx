import './Summary.css'

export function Summary({ cars }) {
  const totalIncome = cars.reduce((sum, c) => sum + c.price, 0)
  const totalExpenses = cars.reduce((sum, c) =>
    sum + c.expenses.reduce((s, e) => s + e.amount, 0), 0
  )
  const totalBalance = totalIncome - totalExpenses

  if (cars.length === 0) return null

  return (
    <div className="summary">
      <p className="summary__title">Итого по всем авто</p>
      <p className="summary__main">{formatMoney(totalBalance)} ₽</p>
      <div className="summary__details">
        <span className="summary__item summary__item--income">
          Доход: <strong>{formatMoney(totalIncome)} ₽</strong>
        </span>
        <span className="summary__item summary__item--expense">
          Расход: <strong>{formatMoney(totalExpenses)} ₽</strong>
        </span>
      </div>
    </div>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}
