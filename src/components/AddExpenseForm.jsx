import { useState } from 'react'
import './AddExpenseForm.css'

export function AddExpenseForm({ onSubmit, onCancel }) {
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (amount === '' || Number(amount) < 0) return
    onSubmit(amount, comment)
    setAmount('')
    setComment('')
  }

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Сумма, ₽"
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
      <div className="add-expense-form__actions">
        <button type="submit">Добавить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}
