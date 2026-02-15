import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import './AddExpenseForm.css'

export function AddExpenseForm({ onSubmit, onCancel }) {
  const { settings } = useSettings()
  const currency = settings.currency || '₽'
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [contractor, setContractor] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (amount === '' || Number(amount) < 0) return
    onSubmit(amount, comment, contractor)
    setAmount('')
    setComment('')
    setContractor('')
  }

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder={`Сумма, ${currency}`}
        value={amount}
        onChange={e => setAmount(e.target.value)}
        min="0"
        step="1"
        required
      />
      <input
        type="text"
        placeholder="Комментарий"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <input
        type="text"
        placeholder="Имя подрядчика"
        value={contractor}
        onChange={e => setContractor(e.target.value)}
        className="add-expense-form__contractor"
      />
      <div className="add-expense-form__actions">
        <button type="submit">Добавить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}
