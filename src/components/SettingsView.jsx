import { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { downloadMonthReportHtml } from '../utils/monthReportHtml'
import { TelegramLogin } from './TelegramLogin'
import './SettingsView.css'

const ROLE_LABELS = { admin: 'Админ', master: 'Мастер', viewer: 'Только просмотр' }

export function SettingsView({ cars = [], onClearData }) {
  const { settings, setSettings } = useSettings()
  const { user, role, canAdmin, usersList, login, logout, setUserRole } = useAuth()
  const [userName, setUserName] = useState(settings.userName)
  const [currency, setCurrency] = useState(settings.currency)
  const [cardPercent, setCardPercent] = useState(String(settings.cardDiscountPercent))
  const [telegramBot, setTelegramBot] = useState(settings.telegramBotName || '')
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    setUserName(settings.userName)
    setCurrency(settings.currency)
    setCardPercent(String(settings.cardDiscountPercent))
    setTelegramBot(settings.telegramBotName || '')
  }, [settings.userName, settings.currency, settings.cardDiscountPercent, settings.telegramBotName])

  const save = () => {
    const percent = Math.min(50, Math.max(0, Number(cardPercent) || 0))
    setSettings({
      userName: userName.trim(),
      currency: currency.trim() || '₽',
      cardDiscountPercent: percent,
      telegramBotName: telegramBot.trim(),
    })
    setCardPercent(String(percent))
  }

  const handleClearData = () => {
    if (confirm('Удалить все данные (авто, расходы)? Это нельзя отменить.')) {
      onClearData?.()
    }
  }

  const handleDownloadReport = () => {
    downloadMonthReportHtml({
      cars,
      yearMonth: reportMonth,
      currency: settings.currency || '₽',
      cardDiscountPercent: settings.cardDiscountPercent ?? 10,
    })
  }

  return (
    <div className="settings-view">
      <h2 className="settings-view__title">Настройки</h2>

      <section className="settings-view__section">
        <label className="settings-view__label">Авторизация через Telegram</label>
        {user ? (
          <div className="settings-view__auth-user">
            {user.photoUrl && <img src={user.photoUrl} alt="" className="settings-view__avatar" />}
            <div>
              <p className="settings-view__auth-name">{user.firstName} {user.lastName}</p>
              {user.username && <p className="settings-view__auth-username">@{user.username}</p>}
              <p className="settings-view__auth-role">Роль: {ROLE_LABELS[role] || role}</p>
              <button type="button" className="settings-view__logout" onClick={logout}>Выйти</button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="text"
              className="settings-view__input"
              placeholder="Имя бота от @BotFather (например: MyMibisnesBot)"
              value={telegramBot}
              onChange={e => setTelegramBot(e.target.value)}
              onBlur={() => setSettings({ telegramBotName: telegramBot.trim() })}
            />
            <TelegramLogin botName={settings.telegramBotName || telegramBot} onAuth={login} />
          </>
        )}
      </section>

      {canAdmin && usersList.length > 0 && (
        <section className="settings-view__section">
          <label className="settings-view__label">Пользователи и роли</label>
          <ul className="settings-view__users">
            {usersList.map(u => (
              <li key={u.id} className="settings-view__user-row">
                <span>{u.firstName} {u.lastName} {u.username ? `@${u.username}` : ''}</span>
                <select
                  value={u.role}
                  onChange={e => setUserRole(u.id, e.target.value)}
                  className="settings-view__role-select"
                >
                  <option value="admin">{ROLE_LABELS.admin}</option>
                  <option value="master">{ROLE_LABELS.master}</option>
                  <option value="viewer">{ROLE_LABELS.viewer}</option>
                </select>
              </li>
            ))}
          </ul>
        </section>
      )}

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

      <section className="settings-view__section">
        <label className="settings-view__label">Выгрузка отчёта за месяц</label>
        <div className="settings-view__report-row">
          <input
            type="month"
            className="settings-view__input settings-view__input--month"
            value={reportMonth}
            onChange={e => setReportMonth(e.target.value)}
          />
          <button type="button" className="settings-view__download" onClick={handleDownloadReport}>
            Скачать отчёт (HTML)
          </button>
        </div>
        <p className="settings-view__hint">Откроется сохранение файла с таблицей: дата, авто, телефон, оплата, доход, расход, остаток и итоги за месяц.</p>
      </section>

      {canAdmin && (
        <section className="settings-view__section settings-view__section--danger">
          <button type="button" className="settings-view__clear" onClick={handleClearData}>
            Очистить все данные
          </button>
          <p className="settings-view__hint">Удалит все авто и расходы. Нельзя отменить.</p>
        </section>
      )}
    </div>
  )
}
