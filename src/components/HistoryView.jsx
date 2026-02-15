import './HistoryView.css'

export function HistoryView({ cars }) {
  const items = cars.flatMap(car =>
    car.expenses.map(exp => ({
      id: exp.id,
      carId: car.id,
      carName: `${car.brand} ${car.model}`,
      amount: exp.amount,
      comment: exp.comment,
      date: exp.date,
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  if (items.length === 0) {
    return (
      <div className="history-view history-view--empty">
        <p>Расходов пока нет</p>
        <p className="history-view__hint">Добавьте авто на главной и укажите расходы</p>
      </div>
    )
  }

  return (
    <div className="history-view">
      <h2 className="history-view__title">История расходов</h2>
      <ul className="history-view__list">
        {items.map(item => (
          <li key={item.id} className="history-view__item">
            <span className="history-view__car">{item.carName}</span>
            <span className="history-view__amount">−{formatMoney(item.amount)} ₽</span>
            {item.comment && <span className="history-view__comment">{item.comment}</span>}
            <span className="history-view__date">{formatDate(item.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}
