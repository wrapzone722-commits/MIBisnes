const STORAGE_KEY = 'mibisnes-auth'

const DEFAULT_STATE = {
  currentUserId: null,
  users: {},
}

export function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const saved = JSON.parse(raw)
    return {
      currentUserId: saved.currentUserId ?? null,
      users: saved.users && typeof saved.users === 'object' ? saved.users : {},
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveAuth(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Не удалось сохранить авторизацию', e)
  }
}
