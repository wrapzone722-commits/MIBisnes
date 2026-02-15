import { useEffect, useRef } from 'react'
import './TelegramLogin.css'

const WIDGET_SCRIPT = 'https://telegram.org/js/telegram-widget.js?22'

export function TelegramLogin({ botName, onAuth }) {
  const containerRef = useRef(null)
  const onAuthRef = useRef(onAuth)
  onAuthRef.current = onAuth

  useEffect(() => {
    if (!botName?.trim()) return

    window.handleTelegramAuth = (user) => {
      onAuthRef.current(user)
    }

    const el = containerRef.current
    if (!el) return

    el.innerHTML = ''
    el.setAttribute('data-telegram-login', botName.trim())
    el.setAttribute('data-size', 'large')
    el.setAttribute('data-onauth', 'handleTelegramAuth(user)')
    el.setAttribute('data-request-access', 'write')

    const existing = document.querySelector(`script[src="${WIDGET_SCRIPT}"]`)
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.src = WIDGET_SCRIPT
    script.async = true
    document.body.appendChild(script)

    return () => {
      delete window.handleTelegramAuth
    }
  }, [botName])

  if (!botName?.trim()) {
    return (
      <p className="telegram-login-hint">
        Укажите имя бота в настройках (раздел «Авторизация»). Создайте бота в Telegram через @BotFather.
      </p>
    )
  }

  return <div ref={containerRef} className="telegram-login-widget" /> 
}
