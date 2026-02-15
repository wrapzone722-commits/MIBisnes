import { useState } from 'react'
import './AddCarForm.css'

export function AddCarForm({ onSubmit }) {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!brand.trim() || !model.trim()) return
    onSubmit(brand, model, price)
    setBrand('')
    setModel('')
    setPrice('')
  }

  return (
    <form className="add-car-form" onSubmit={handleSubmit}>
      <h2>Добавить авто</h2>
      <div className="row">
        <input
          type="text"
          placeholder="Марка (напр. Toyota)"
          value={brand}
          onChange={e => setBrand(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Модель (напр. Corolla)"
          value={model}
          onChange={e => setModel(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Цена, ₽"
          value={price}
          onChange={e => setPrice(e.target.value)}
          min="0"
          step="1000"
        />
        <button type="submit">Добавить</button>
      </div>
    </form>
  )
}
