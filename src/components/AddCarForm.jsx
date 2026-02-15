import { useState, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { fileToThumbDataUrl } from '../utils/imageThumb'
import './AddCarForm.css'

export function AddCarForm({ onSubmit }) {
  const { settings } = useSettings()
  const currency = settings.currency || '₽'
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [price, setPrice] = useState('')
  const [paymentType, setPaymentType] = useState('cash')
  const [phone, setPhone] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setImagePreview(null)
    setImageData(null)
    try {
      const dataUrl = await fileToThumbDataUrl(file)
      if (dataUrl) {
        setImageData(dataUrl)
        setImagePreview(dataUrl)
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!brand.trim() || !model.trim()) return
    onSubmit(brand, model, price, paymentType, phone, imageData)
    setBrand('')
    setModel('')
    setPrice('')
    setPaymentType('cash')
    setPhone('')
    setImagePreview(null)
    setImageData(null)
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
          placeholder={`Цена, ${currency}`}
          value={price}
          onChange={e => setPrice(e.target.value)}
          min="0"
          step="1000"
        />
        <input
          type="tel"
          placeholder="Телефон клиента"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="add-car-form__phone"
        />
        <div className="add-car-form__payment">
          <span className="add-car-form__payment-label">Оплата:</span>
          <div className="add-car-form__payment-options">
            <label className={`add-car-form__payment-option ${paymentType === 'cash' ? 'add-car-form__payment-option--active' : ''}`}>
              <input
                type="radio"
                name="paymentType"
                value="cash"
                checked={paymentType === 'cash'}
                onChange={() => setPaymentType('cash')}
              />
              Нал
            </label>
            <label className={`add-car-form__payment-option ${paymentType === 'card' ? 'add-car-form__payment-option--active' : ''}`}>
              <input
                type="radio"
                name="paymentType"
                value="card"
                checked={paymentType === 'card'}
                onChange={() => setPaymentType('card')}
              />
              Безнал (−{settings.cardDiscountPercent}%)
            </label>
          </div>
        </div>
        <div className="add-car-form__photo">
          <span className="add-car-form__photo-label">Фото работы:</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="add-car-form__file"
          />
          <div className="add-car-form__photo-area">
            {uploading && <span className="add-car-form__photo-loading">Загрузка…</span>}
            {imagePreview && !uploading && (
              <>
                <img src={imagePreview} alt="" className="add-car-form__photo-preview" />
                <button
                  type="button"
                  className="add-car-form__photo-remove"
                  onClick={() => { setImagePreview(null); setImageData(null) }}
                  aria-label="Удалить фото"
                >
                  ×
                </button>
              </>
            )}
            {!imagePreview && !uploading && (
              <button
                type="button"
                className="add-car-form__photo-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                + Добавить фото
              </button>
            )}
          </div>
        </div>
        <button type="submit">Добавить</button>
      </div>
    </form>
  )
}
