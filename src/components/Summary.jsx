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
      <h2>Итого по всем авто</h2>
      <div className="summary__grid">
        <div className="summary__item summary__item--income">
          <span className="summary__label">Доход</span>
          <span className="summary__value">{formatMoney(totalIncome)} ₽</span>
        </div>
        <div className="summary__item summary__item--expense">
          <span className="summary__label">Расход</span>
          <span className="summary__value">{formatMoney(totalExpenses)} ₽</span>
        </div>
        <div className="summary__item summary__item--balance">
          <span className="summary__label">Остаток</span>
          <span className="summary__value">{formatMoney(totalBalance)} ₽</span>
        </div>
      </div>
    </div>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}
