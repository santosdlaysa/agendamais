import api from '../utils/api'

const STORAGE_KEY = 'agendamais_notifications'

/**
 * Serviço de notificações
 * Gerencia notificações do backend e localStorage como fallback
 */
export const notificationService = {
  /**
   * Buscar notificações do backend
   * @param {Object} params - Parâmetros de busca (page, limit, unread_only)
   * @returns {Promise<Object>} Lista de notificações
   */
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      // Se o backend falhar, retornar notificações do localStorage
      console.warn('Erro ao buscar notificações do backend, usando localStorage:', error.message)
      const localNotifications = notificationService.getLocalNotifications()
      return {
        success: true,
        data: {
          notifications: localNotifications,
          total: localNotifications.length,
          unread_count: localNotifications.filter(n => !n.read).length
        },
        fromCache: true
      }
    }
  },

  /**
   * Marcar notificação como lida
   * @param {string} id - ID da notificação
   * @returns {Promise<Object>} Resultado da operação
   */
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`)
      // Atualizar também no localStorage
      notificationService.updateLocalNotification(id, { read: true })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      // Fallback: atualizar apenas no localStorage
      console.warn('Erro ao marcar como lida no backend, atualizando localStorage:', error.message)
      notificationService.updateLocalNotification(id, { read: true })
      return {
        success: true,
        fromCache: true
      }
    }
  },

  /**
   * Marcar todas as notificações como lidas
   * @returns {Promise<Object>} Resultado da operação
   */
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all')
      // Atualizar também no localStorage
      notificationService.markAllLocalAsRead()
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      // Fallback: atualizar apenas no localStorage
      console.warn('Erro ao marcar todas como lidas no backend, atualizando localStorage:', error.message)
      notificationService.markAllLocalAsRead()
      return {
        success: true,
        fromCache: true
      }
    }
  },

  /**
   * Deletar uma notificação
   * @param {string} id - ID da notificação
   * @returns {Promise<Object>} Resultado da operação
   */
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`)
      // Remover também do localStorage
      notificationService.removeLocalNotification(id)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      // Fallback: remover apenas do localStorage
      console.warn('Erro ao deletar no backend, removendo do localStorage:', error.message)
      notificationService.removeLocalNotification(id)
      return {
        success: true,
        fromCache: true
      }
    }
  },

  /**
   * Criar uma notificação local (não sincronizada com backend)
   * @param {string} type - Tipo da notificação ('appointment', 'client', 'reminder', 'system')
   * @param {string} title - Título da notificação
   * @param {string} message - Mensagem da notificação
   * @param {Object} data - Dados extras (appointmentId, clientId, etc)
   * @returns {Object} Notificação criada
   */
  createLocalNotification: (type, title, message, data = {}) => {
    const notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString(),
      isLocal: true
    }

    const notifications = notificationService.getLocalNotifications()
    notifications.unshift(notification)

    // Limitar a 100 notificações locais
    const limitedNotifications = notifications.slice(0, 100)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedNotifications))

    return notification
  },

  // ==================== MÉTODOS DE LOCALSTORAGE ====================

  /**
   * Obter notificações do localStorage
   * @returns {Array} Lista de notificações
   */
  getLocalNotifications: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erro ao ler notificações do localStorage:', error)
      return []
    }
  },

  /**
   * Salvar notificações no localStorage
   * @param {Array} notifications - Lista de notificações
   */
  saveLocalNotifications: (notifications) => {
    try {
      // Limitar a 100 notificações
      const limitedNotifications = notifications.slice(0, 100)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedNotifications))
    } catch (error) {
      console.error('Erro ao salvar notificações no localStorage:', error)
    }
  },

  /**
   * Atualizar uma notificação no localStorage
   * @param {string} id - ID da notificação
   * @param {Object} updates - Campos a atualizar
   */
  updateLocalNotification: (id, updates) => {
    const notifications = notificationService.getLocalNotifications()
    const index = notifications.findIndex(n => n.id === id)

    if (index !== -1) {
      notifications[index] = { ...notifications[index], ...updates }
      notificationService.saveLocalNotifications(notifications)
    }
  },

  /**
   * Remover uma notificação do localStorage
   * @param {string} id - ID da notificação
   */
  removeLocalNotification: (id) => {
    const notifications = notificationService.getLocalNotifications()
    const filtered = notifications.filter(n => n.id !== id)
    notificationService.saveLocalNotifications(filtered)
  },

  /**
   * Marcar todas as notificações locais como lidas
   */
  markAllLocalAsRead: () => {
    const notifications = notificationService.getLocalNotifications()
    const updated = notifications.map(n => ({ ...n, read: true }))
    notificationService.saveLocalNotifications(updated)
  },

  /**
   * Limpar todas as notificações do localStorage
   */
  clearLocalNotifications: () => {
    localStorage.removeItem(STORAGE_KEY)
  },

  /**
   * Sincronizar notificações do backend com localStorage
   * @param {Array} backendNotifications - Notificações do backend
   */
  syncWithBackend: (backendNotifications) => {
    const localNotifications = notificationService.getLocalNotifications()

    // Manter notificações locais que não existem no backend
    const localOnly = localNotifications.filter(local =>
      local.isLocal && !backendNotifications.find(backend => backend.id === local.id)
    )

    // Combinar: backend primeiro, depois locais
    const combined = [...backendNotifications, ...localOnly]

    // Ordenar por data de criação (mais recentes primeiro)
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Salvar no localStorage
    notificationService.saveLocalNotifications(combined)

    return combined
  }
}

export default notificationService
