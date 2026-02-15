import { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'
import './SettingsView.css'

export function SettingsView({ onClearData }) {
  const { settings, setSettings } = useSettings()
  const [userName, setUserName] = useState(settings.userName)
  const [currency, setCurrency] = useState(settings.currency)
  const [cardPercent, setCardPercent] = useState(String(settings.cardDiscountPercent))

  useEffect(() => {
    setUserName(settings.userName)
    setCurrency(settings.currency)
    setCardPercent(String(settings.cardDiscountPercent))
  }, [settings.userName, settings.currency, settings.cardDiscountPercent])

  const save = () => {
    const percent = Math.min(50, Math.max(0, Number(cardPercent) || 0))
    setSettings({ userName: userName.trim(), currency: currency.trim() || '₽', cardDiscountPercent: percent })
    setCardPercent(String(percent))
  }

  const handleClearData = () => {
    if (confirm('Удалить все данные (авто, расходы)? Это нельзя отменить.')) {
      onClearData?.()
    }
  }

  return (
    <div className="settings-view">
      <h2 className="settings-view__title">Настройки</h2>

      <section className="settings-view__section">
        <label className="settings-view__label">Ваше имя (в приветствии)</label>
        <input
          type="text"
          className="settings-view__input"
          placeholder="Например: Алексей"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          onBlur={save}
        />
      </section>

      <section className="settings-view__section">
        <label className="settings-view__label">Валюта</label>
        <input
          type="text"
          className="settings-view__input"
          placeholder="₽"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          onBlur={save}
          maxLength={6}
        />
      </section>

      <section className="settings-view__section">
        <label className="settings-view__label">Процент вычета при оплате «Безнал», %</label>
        <input
          type="number"
          className="settings-view__input"
          min="0"
          max="50"
          value={cardPercent}
          onChange={e => setCardPercent(e.target.value)}
          onBlur={save}
        />
        <p className="settings-view__hint">От суммы заказа вычитается этот процент при выборе безнала.</p>
      </section>

      <section className="settings-view__section settings-view__section--danger">
        <button type="button" className="settings-view__clear" onClick={handleClearData}>
          Очистить все данные
        </button>
        <p className="settings-view__hint">Удалит все авто и расходы. Нельзя отменить.</p>
      </section>
    </div>
  )
}
