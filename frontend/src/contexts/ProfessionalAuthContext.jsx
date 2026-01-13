import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { professionalApi } from '../services/professionalApi'

const ProfessionalAuthContext = createContext()

export function ProfessionalAuthProvider({ children }) {
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar se há token salvo ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('professional_token')
    const savedProfessional = localStorage.getItem('professional')

    if (token && savedProfessional) {
      try {
        setProfessional(JSON.parse(savedProfessional))
      } catch (error) {
        localStorage.removeItem('professional_token')
        localStorage.removeItem('professional')
      }
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await professionalApi.login(email, password)
      const { access_token, professional: professionalData } = response

      // Salvar token e dados do profissional
      localStorage.setItem('professional_token', access_token)
      localStorage.setItem('professional', JSON.stringify(professionalData))
      setProfessional(professionalData)

      toast.success('Login realizado com sucesso!')
      return { success: true }

    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('professional_token')
    localStorage.removeItem('professional')
    setProfessional(null)
    toast.success('Logout realizado com sucesso!')
  }

  const activate = async (token, password) => {
    try {
      await professionalApi.activate(token, password)
      toast.success('Conta ativada com sucesso! Faça login para continuar.')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao ativar conta'
      toast.error(message)
      return { success: false, message }
    }
  }

  const forgotPassword = async (email) => {
    try {
      await professionalApi.forgotPassword(email)
      toast.success('Email de recuperação enviado!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao enviar email'
      toast.error(message)
      return { success: false, message }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      await professionalApi.resetPassword(token, password)
      toast.success('Senha alterada com sucesso!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao resetar senha'
      toast.error(message)
      return { success: false, message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await professionalApi.changePassword(currentPassword, newPassword)
      toast.success('Senha alterada com sucesso!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao alterar senha'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    professional,
    loading,
    isAuthenticated: !!professional,
    login,
    logout,
    activate,
    forgotPassword,
    resetPassword,
    changePassword
  }

  return (
    <ProfessionalAuthContext.Provider value={value}>
      {children}
    </ProfessionalAuthContext.Provider>
  )
}

export function useProfessionalAuth() {
  const context = useContext(ProfessionalAuthContext)
  if (!context) {
    throw new Error('useProfessionalAuth deve ser usado dentro de um ProfessionalAuthProvider')
  }
  return context
}
