/**
 * Поддержка запуска приложения внутри Telegram (Mini App / Web App).
 * Когда пользователь открывает приложение из бота, Telegram передаёт initData с данными пользователя.
 */

/**
 * @returns {typeof window.Telegram extends undefined ? null : Telegram.WebApp} Web App API или null
 */
export function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  const tw = window.Telegram?.WebApp
  if (!tw) return null
  return tw
}

/**
 * Парсит initData от Telegram и возвращает объект пользователя в формате для login().
 * @param {string} initDataRaw - строка initData из Telegram.WebApp.initData
 * @returns {{ id: number, first_name: string, last_name?: string, username?: string, photo_url?: string } | null}
 */
export function parseInitDataUser(initDataRaw) {
  if (!initDataRaw || typeof initDataRaw !== 'string') return null
  try {
    const params = new URLSearchParams(initDataRaw)
    const userStr = params.get('user')
    if (!userStr) return null
    const user = JSON.parse(decodeURIComponent(userStr))
    if (!user || typeof user.id !== 'number') return null
    return {
      id: user.id,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || null,
    }
  } catch {
    return null
  }
}

/**
 * Инициализация при открытии в Telegram: ready(), expand(), возвращает пользователя из initData.
 * @returns {ReturnType<parseInitDataUser>}
 */
export function initTelegramWebApp() {
  const tw = getTelegramWebApp()
  if (!tw) return null
  tw.ready()
  tw.expand()
  if (tw.initData) {
    return parseInitDataUser(tw.initData)
  }
  return null
}
