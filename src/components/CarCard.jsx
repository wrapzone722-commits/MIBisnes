import { useState } from 'react'
import { AddExpenseForm } from './AddExpenseForm'
import { ExpenseList } from './ExpenseList'
import './CarCard.css'

export function CarCard({ car, onAddExpense, onRemoveExpense, onRemoveCar }) {
  const [showForm, setShowForm] = useState(false)
  const totalExpenses = car.expenses.reduce((sum, e) => sum + e.amount, 0)
  const balance = car.price - totalExpenses

  return (
    <article className="car-card">
      <div className="car-card__head">
        <div>
          <h3 className="car-card__title">
            {car.brand} {car.model}
          </h3>
          <p className="car-card__price">Цена: {formatMoney(car.price)} ₽</p>
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

      <div className="car-card__totals">
        <span className="total total--income">Доход: {formatMoney(car.price)} ₽</span>
        <span className="total total--expense">Расход: {formatMoney(totalExpenses)} ₽</span>
        <span className="total total--balance">Остаток: {formatMoney(balance)} ₽</span>
      </div>

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
    </article>
  )
}

function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU').format(n)
}
