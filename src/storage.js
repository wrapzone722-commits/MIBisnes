const STORAGE_KEY = 'mibisnes-cars'

export function loadCars() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCars(cars) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
  } catch (e) {
    console.error('Не удалось сохранить данные', e)
  }
}
