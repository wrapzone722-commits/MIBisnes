import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { AddExpenseForm } from './AddExpenseForm'
import { ExpenseList } from './ExpenseList'
import './CarCard.css'

function getEffectivePrice(car, cardDiscountPercent) {
  if (car.paymentType !== 'card') return car.price
  const percent = Math.min(50, Math.max(0, Number(cardDiscountPercent) || 0))
  return car.price * (1 - percent / 100)
}

export function CarCard({ car, canEdit = true, onAddExpense, onRemoveExpense, onRemoveCar }) {
  const { settings } = useSettings()
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const effectivePrice = getEffectivePrice(car, settings.cardDiscountPercent)
  const totalExpenses = car.expenses.reduce((sum, e) => sum + e.amount, 0)
  const balance = effectivePrice - totalExpenses
  const hasPositiveBalance = balance > 0
  const isCard = car.paymentType === 'card'
  const currency = settings.currency || '₽'

  return (
    <article
      className={`car-card ${hasPositiveBalance ? 'car-card--highlight' : ''}`}
      onClick={() => !showForm && setExpanded(!expanded)}
    >
      <div className="car-card__top" onClick={e => e.stopPropagation()}>
        <div className={`car-card__icon ${car.image ? 'car-card__icon--photo' : ''}`}>
          {car.image ? (
            <img src={car.image} alt="" className="car-card__thumb" />
          ) : (
            <CarIcon />
          )}
        </div>
        {canEdit && (
          <button
            type="button"
            className="car-card__remove"
            onClick={() => onRemoveCar(car.id)}
            title="Удалить авто"
          >
            ×
          </button>
        )}
      </div>
      <h3 className="car-card__title">{car.brand} {car.model}</h3>
      <p className="car-card__subtitle">
        {isCard ? 'Безнал' : 'Нал'}
        {car.phone && <> · {formatPhone(car.phone)}</>}
        {' · '}{car.expenses.length} {car.expenses.length === 1 ? 'расход' : 'расходов'} · Остаток {formatMoney(balance)} {currency}
      </p>
      <div className="car-card__totals">
        <span className="total total--income" title={isCard ? `Было ${formatMoney(car.price)} ${currency}, −${settings.cardDiscountPercent}%` : undefined}>
          {formatMoney(effectivePrice)} {currency}
        </span>
        <span className="total total--expense">−{formatMoney(totalExpenses)} {currency}</span>
        <span className="total total--balance">{formatMoney(balance)} {currency}</span>
      </div>

      {expanded && (
        <div className="car-card__details" onClick={e => e.stopPropagation()}>
          {car.phone && (
            <p className="car-card__phone">
              <a href={`tel:${car.phone.replace(/\D/g, '')}`}>{formatPhone(car.phone)}</a>
            </p>
          )}
          <ExpenseList
            expenses={car.expenses}
            onRemove={id => onRemoveExpense(car.id, id)}
            currency={currency}
            canEdit={canEdit}
          />
          {canEdit && (showForm ? (
            <AddExpenseForm
              onSubmit={(amount, comment, contractor) => {
                onAddExpense(car.id, amount, comment, contractor)
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
          ))}
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

function formatPhone(s) {
  const digits = s.replace(/\D/g, '')
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}‑${digits.slice(7, 9)}‑${digits.slice(9)}`
  }
  if (digits.length === 10) {
    return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)}‑${digits.slice(6, 8)}‑${digits.slice(8)}`
  }
  return s
}
