import { useState } from 'react'
import { AddExpenseForm } from './AddExpenseForm'
import { ExpenseList } from './ExpenseList'
import './CarCard.css'

export function CarCard({ car, onAddExpense, onRemoveExpense, onRemoveCar }) {
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const totalExpenses = car.expenses.reduce((sum, e) => sum + e.amount, 0)
  const balance = car.price - totalExpenses
  const hasPositiveBalance = balance > 0

  return (
    <article
      className={`car-card ${hasPositiveBalance ? 'car-card--highlight' : ''}`}
      onClick={() => !showForm && setExpanded(!expanded)}
    >
      <div className="car-card__top" onClick={e => e.stopPropagation()}>
        <div className="car-card__icon">
          <CarIcon />
        </div>
        <button
          type="button"
          className="car-card__remove"
          onClick={() => onRemoveCar(car.id)}
          title="Удалить авто"
        >
          ×
        </button>
      </div>
      <h3 className="car-card__title">{car.brand} {car.model}</h3>
      <p className="car-card__subtitle">
        {car.expenses.length} {car.expenses.length === 1 ? 'расход' : 'расходов'} · Остаток {formatMoney(balance)} ₽
      </p>
      <div className="car-card__totals">
        <span className="total total--income">{formatMoney(car.price)} ₽</span>
        <span className="total total--expense">−{formatMoney(totalExpenses)} ₽</span>
        <span className="total total--balance">{formatMoney(balance)} ₽</span>
      </div>

      {expanded && (
        <div className="car-card__details" onClick={e => e.stopPropagation()}>
          <ExpenseList
            expenses={car.expenses}
            onRemove={id => onRemoveExpense(car.id, id)}
          />
          {showForm ? (
            <AddExpenseForm
              onSubmit={(amount, comment) => {
                onAddExpense(car.id, amount, comment)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <button
              type="button"
              className="car-card__add-expense"
              onClick={() => setShowForm(true)}
            >
              + Добавить расход
            </button>
          )}
        </div>
      )}
    </article>
  )
}

function CarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m5 0v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2m5 0h6l2-6H6l2 6z" />
      <path d="M5 16l-2-6 3-2h12l3 2-2 6" />
    </svg>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}
