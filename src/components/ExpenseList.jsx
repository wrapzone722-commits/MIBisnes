import './ExpenseList.css'

export function ExpenseList({ expenses, onRemove, currency = '₽' }) {
  if (!expenses.length) return null

  return (
    <ul className="expense-list">
      {expenses.map(exp => (
        <li key={exp.id} className="expense-list__item">
          <span className="expense-list__amount">{formatMoney(exp.amount)} {currency}</span>
          {(exp.comment || exp.contractor) && (
            <span className="expense-list__meta">
              {exp.comment && <span className="expense-list__comment">{exp.comment}</span>}
              {exp.contractor && <span className="expense-list__contractor">Подрядчик: {exp.contractor}</span>}
            </span>
          )}
          <button
            type="button"
            className="expense-list__remove"
            onClick={() => onRemove(exp.id)}
            title="Удалить"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}
