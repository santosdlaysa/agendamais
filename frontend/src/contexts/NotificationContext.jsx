import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import { useProfessionalAuth } from './ProfessionalAuthContext'
import notificationService from '../services/notificationService'

const NotificationContext = createContext()

// Intervalo de polling em milissegundos (30 segundos)
const POLLING_INTERVAL = 30000

// Tipos de notificacao validos
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  CLIENT: 'client',
  REMINDER: 'reminder',
  SYSTEM: 'system'
}

export function NotificationProvider({ children }) {
  const { isAuthenticated: isAdminAuthenticated, loading: isLoading } = useAuth()
  const { isAuthenticated: isProfessionalAuthenticated, loading: professionalLoading } = useProfessionalAuth()

  // Usuario esta autenticado se for admin OU profissional
  const isAuthenticated = isAdminAuthenticated || isProfessionalAuthenticated
  const isLoading = isLoading || professionalLoading

  // Estado das notificacoes
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  // Refs para controle do polling
  const pollingIntervalRef = useRef(null)
  const isMountedRef = useRef(true)

  /**
   * Calcular contagem de nao lidas
   */
  const calculateUnreadCount = useCallback((notificationList) => {
    return notificationList.filter(n => !n.read).length
  }, [])

  /**
   * Buscar notificacoes do backend ou localStorage
   */
  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!isAuthenticated) return

    try {
      if (showLoading) setLoading(true)
      setError(null)

      const result = await notificationService.getNotifications()

      if (result.success && isMountedRef.current) {
        const notificationList = result.data.notifications || []

        // Sincronizar com localStorage se veio do backend
        if (!result.fromCache) {
          notificationService.syncWithBackend(notificationList)
        }

        setNotifications(notificationList)
        setUnreadCount(result.data.unread_count || calculateUnreadCount(notificationList))
      }
    } catch (err) {
      console.error('Erro ao buscar notificacoes:', err)
      if (isMountedRef.current) {
        setError('Erro ao carregar notificacoes')
        // Tentar carregar do localStorage como fallback
        const localNotifications = notificationService.getLocalNotifications()
        setNotifications(localNotifications)
        setUnreadCount(calculateUnreadCount(localNotifications))
      }
    } finally {
      if (isMountedRef.current && showLoading) {
        setLoading(false)
      }
    }
  }, [isAuthenticated, calculateUnreadCount])

  /**
   * Adicionar uma nova notificacao local
   */
  const addNotification = useCallback((type, title, message, data = {}) => {
    const newNotification = notificationService.createLocalNotification(type, title, message, data)

    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
    setHasNewNotifications(true)

    // Resetar flag apos 5 segundos
    setTimeout(() => {
      setHasNewNotifications(false)
    }, 5000)

    return newNotification
  }, [])

  /**
   * Marcar notificacao como lida
   */
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id)

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))

      return { success: true }
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Marcar todas as notificacoes como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)

      return { success: true }
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Remover uma notificacao
   */
  const removeNotification = useCallback(async (id) => {
    try {
      // Verificar se a notificacao e nao lida antes de remover
      const notification = notifications.find(n => n.id === id)
      const wasUnread = notification && !notification.read

      await notificationService.deleteNotification(id)

      setNotifications(prev => prev.filter(n => n.id !== id))
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }

      return { success: true }
    } catch (err) {
      console.error('Erro ao remover notificacao:', err)
      return { success: false, error: err.message }
    }
  }, [notifications])

  /**
   * Limpar todas as notificacoes
   */
  const clearAll = useCallback(async () => {
    try {
      // Remover todas do localStorage
      notificationService.clearLocalNotifications()

      // Tentar remover do backend (se houver endpoint)
      // Nota: implementar endpoint no backend se necessario

      setNotifications([])
      setUnreadCount(0)

      return { success: true }
    } catch (err) {
      console.error('Erro ao limpar notificacoes:', err)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Obter notificacoes por tipo
   */
  const getByType = useCallback((type) => {
    return notifications.filter(n => n.type === type)
  }, [notifications])

  /**
   * Obter notificacoes nao lidas
   */
  const getUnread = useCallback(() => {
    return notifications.filter(n => !n.read)
  }, [notifications])

  /**
   * Verificar se ha notificacoes nao lidas
   */
  const hasUnread = useCallback(() => {
    return unreadCount > 0
  }, [unreadCount])

  // Iniciar polling quando autenticado
  useEffect(() => {
    isMountedRef.current = true

    // Aguardar AuthContext terminar de carregar
    if (isLoading) return

    if (isAuthenticated) {
      // Buscar notificacoes imediatamente
      fetchNotifications()

      // Configurar polling
      pollingIntervalRef.current = setInterval(() => {
        fetchNotifications(false) // Sem loading para nao atrapalhar UX
      }, POLLING_INTERVAL)
    } else {
      // Limpar estado quando deslogar
      setNotifications([])
      setUnreadCount(0)
      setError(null)
    }

    // Cleanup
    return () => {
      isMountedRef.current = false
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [isAuthenticated, isLoading, fetchNotifications])

  // Carregar notificacoes do localStorage na inicializacao
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const localNotifications = notificationService.getLocalNotifications()
      if (localNotifications.length > 0 && notifications.length === 0) {
        setNotifications(localNotifications)
        setUnreadCount(calculateUnreadCount(localNotifications))
      }
    }
  }, [isLoading, isAuthenticated, calculateUnreadCount, notifications.length])

  const value = {
    // Estado
    notifications,
    unreadCount,
    loading,
    error,
    hasNewNotifications,

    // Acoes
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    fetchNotifications,

    // Helpers
    getByType,
    getUnread,
    hasUnread,

    // Tipos disponiveis
    NOTIFICATION_TYPES
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * Hook para usar o contexto de notificacoes
 * @returns {Object} Contexto de notificacoes
 */
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider')
  }
  return context
}

export default NotificationContext
