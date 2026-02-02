import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar se há token salvo ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Modo desenvolvimento - simulação de login sem backend
      if (process.env.NODE_ENV === 'development') {
        // Simulação de dados do usuário
        const mockUser = {
          id: 1,
          name: 'Admin Demo',
          email: email
        }
        
        const mockToken = 'demo-token-' + Date.now()
        
        // Salvar token e dados do usuário
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        setUser(mockUser)
        
        toast.success('Login realizado com sucesso! (Modo desenvolvimento)')
        return { success: true }
      }

      // Código original para produção
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const { access_token, user } = response.data
      
      // Salvar token e dados do usuário
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      toast.success('Login realizado com sucesso!')
      return { success: true }
      
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (name, email, password) => {
    try {
      // Modo desenvolvimento - simulação de registro sem backend
      if (process.env.NODE_ENV === 'development') {
        toast.success('Usuário criado com sucesso! Faça login para continuar. (Modo desenvolvimento)')
        return { success: true }
      }

      // Código original para produção
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      })

      toast.success('Usuário criado com sucesso! Faça login para continuar.')
      return { success: true }
      
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar usuário'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logout realizado com sucesso!')
  }

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me')
      const userData = response.data.user
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      logout()
      return null
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })

      toast.success('Senha alterada com sucesso!')
      return { success: true }
      
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao alterar senha'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Verificar se usuario e admin
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin'
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    register,
    logout,
    getCurrentUser,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}