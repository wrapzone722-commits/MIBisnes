const STORAGE_KEY = 'mibisnes-settings'

const DEFAULTS = {
  userName: '',
  currency: '₽',
  cardDiscountPercent: 10,
  telegramBotName: '',
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const saved = JSON.parse(raw)
    return { ...DEFAULTS, ...saved }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Не удалось сохранить настройки', e)
  }
}
