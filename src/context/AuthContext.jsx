import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { loadAuth, saveAuth } from '../storage/auth'
import { initTelegramWebApp } from '../utils/telegramWebApp'

export const ROLES = {
  admin: 'admin',
  master: 'master',
  viewer: 'viewer',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(loadAuth)
  const telegramAutoLoginDone = useRef(false)

  useEffect(() => {
    saveAuth(auth)
  }, [auth])

  useEffect(() => {
    if (telegramAutoLoginDone.current) return
    const telegramUser = initTelegramWebApp()
    if (telegramUser) {
      telegramAutoLoginDone.current = true
      setAuthState(prev => {
        const users = { ...prev.users }
        const isFirstUser = Object.keys(users).length === 0
        if (!users[telegramUser.id]) {
          users[telegramUser.id] = {
            id: telegramUser.id,
            firstName: telegramUser.first_name || '',
            lastName: telegramUser.last_name || '',
            username: telegramUser.username || '',
            photoUrl: telegramUser.photo_url || null,
            role: isFirstUser ? ROLES.admin : ROLES.viewer,
          }
        } else {
          users[telegramUser.id] = {
            ...users[telegramUser.id],
            firstName: telegramUser.first_name || '',
            lastName: telegramUser.last_name || '',
            username: telegramUser.username || '',
            photoUrl: telegramUser.photo_url || null,
          }
        }
        return { currentUserId: telegramUser.id, users }
      })
    }
  }, [])

  const login = useCallback((telegramUser) => {
    const id = telegramUser.id
    const user = {
      id,
      firstName: telegramUser.first_name || '',
      lastName: telegramUser.last_name || '',
      username: telegramUser.username || '',
      photoUrl: telegramUser.photo_url || null,
    }
    setAuthState(prev => {
      const users = { ...prev.users }
      const isFirstUser = Object.keys(users).length === 0
      if (!users[id]) {
        users[id] = { ...user, role: isFirstUser ? ROLES.admin : ROLES.viewer }
      } else {
        users[id] = { ...users[id], ...user }
      }
      return { currentUserId: id, users }
    })
    return user
  }, [])

  const logout = useCallback(() => {
    setAuthState(prev => ({ ...prev, currentUserId: null }))
  }, [])

  const setUserRole = useCallback((userId, role) => {
    if (![ROLES.admin, ROLES.master, ROLES.viewer].includes(role)) return
    setAuthState(prev => {
      const users = { ...prev.users }
      if (users[userId]) users[userId] = { ...users[userId], role }
      return { ...prev, users }
    })
  }, [])

  const currentUser = auth.currentUserId ? auth.users[auth.currentUserId] : null
  const role = currentUser?.role || ROLES.viewer

  const canEdit = role === ROLES.admin || role === ROLES.master
  const canAdmin = role === ROLES.admin

  const value = {
    user: currentUser,
    role,
    canEdit,
    canAdmin,
    usersList: Object.entries(auth.users).map(([id, u]) => ({ id: Number(id), ...u })),
    login,
    logout,
    setUserRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
