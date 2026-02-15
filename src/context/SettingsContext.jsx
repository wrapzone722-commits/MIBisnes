import { createContext, useContext, useState, useEffect } from 'react'
import { loadSettings, saveSettings } from '../storage/settings'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setSettings = (next) => {
    setSettingsState(prev => (typeof next === 'function' ? next(prev) : { ...prev, ...next }))
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
