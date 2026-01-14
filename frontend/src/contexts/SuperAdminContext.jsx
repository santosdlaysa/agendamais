import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'

const SuperAdminContext = createContext()

export function SuperAdminProvider({ children }) {
  const { user, loading, isAuthenticated, logout } = useAuth()

  // Verificar se o usuário tem permissão de super admin
  // Aceita role 'admin' ou 'superadmin'
  const isSuperAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  const value = {
    superAdmin: isSuperAdmin ? user : null,
    loading,
    isAuthenticated: isAuthenticated && isSuperAdmin,
    isSuperAdmin,
    logout
  }

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  )
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext)
  if (!context) {
    throw new Error('useSuperAdmin deve ser usado dentro de um SuperAdminProvider')
  }
  return context
}
