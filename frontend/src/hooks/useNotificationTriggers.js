import { useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNotifications } from '../contexts/NotificationContext'
import { NOTIFICATION_TYPES } from '../constants/notificationTypes'
import { playNotificationSound } from '../utils/notificationHelpers'

/**
 * Hook para disparar notificacoes automaticamente quando eventos acontecem
 *
 * @example
 * const { notifyNewAppointment, notifyNewClient } = useNotificationTriggers()
 *
 * // Quando um novo agendamento for criado:
 * notifyNewAppointment({
 *   client_name: 'Joao Silva',
 *   service_name: 'Corte de Cabelo',
 *   date: '2024-01-15T10:00:00'
 * })
 */
function useNotificationTriggers() {
  const { addNotification } = useNotifications()

  /**
   * Formata a data para exibicao na notificacao
   * @param {string|Date} date - Data a ser formatada
   * @returns {string} Data formatada (ex: "15/01 as 10:00")
   */
  const formatDate = useCallback((date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date
      return format(dateObj, "dd/MM 'as' HH:mm", { locale: ptBR })
    } catch {
      return date
    }
  }, [])

  /**
   * Notifica sobre um novo agendamento
   * @param {Object} appointment - Dados do agendamento
   * @param {string} appointment.client_name - Nome do cliente
   * @param {string} appointment.service_name - Nome do servico
   * @param {string|Date} appointment.date - Data do agendamento
   * @param {Object} options - Opcoes adicionais
   * @param {boolean} options.playSound - Se deve tocar som (default: true)
   */
  const notifyNewAppointment = useCallback((appointment, options = {}) => {
    const { playSound = true } = options
    const clientName = appointment.client_name || appointment.clientName || 'Cliente'
    const serviceName = appointment.service_name || appointment.serviceName || 'Servico'
    const date = appointment.date || appointment.start_time || appointment.startTime

    const formattedDate = formatDate(date)
    const message = `Novo agendamento de ${clientName} para ${serviceName} em ${formattedDate}`

    if (playSound) {
      playNotificationSound()
    }

    return addNotification(
      NOTIFICATION_TYPES.APPOINTMENT,
      'Novo Agendamento',
      message,
      { ...appointment, action: 'new' }
    )
  }, [addNotification, formatDate])

  /**
   * Notifica sobre um novo cliente cadastrado
   * @param {Object} client - Dados do cliente
   * @param {string} client.name - Nome do cliente
   * @param {Object} options - Opcoes adicionais
   * @param {boolean} options.playSound - Se deve tocar som (default: true)
   */
  const notifyNewClient = useCallback((client, options = {}) => {
    const { playSound = true } = options
    const clientName = client.name || client.client_name || 'Cliente'

    const message = `Novo cliente cadastrado: ${clientName}`

    if (playSound) {
      playNotificationSound()
    }

    return addNotification(
      NOTIFICATION_TYPES.CLIENT,
      'Novo Cliente',
      message,
      { ...client, action: 'new' }
    )
  }, [addNotification])

  /**
   * Notifica sobre um agendamento pendente de confirmacao
   * @param {Object} appointment - Dados do agendamento
   * @param {string} appointment.client_name - Nome do cliente
   * @param {string} appointment.service_name - Nome do servico
   * @param {Object} options - Opcoes adicionais
   * @param {boolean} options.playSound - Se deve tocar som (default: false para pendentes)
   */
  const notifyPendingAppointment = useCallback((appointment, options = {}) => {
    const { playSound = false } = options
    const clientName = appointment.client_name || appointment.clientName || 'Cliente'
    const serviceName = appointment.service_name || appointment.serviceName || 'Servico'

    const message = `Agendamento pendente de confirmacao: ${clientName} - ${serviceName}`

    if (playSound) {
      playNotificationSound()
    }

    return addNotification(
      NOTIFICATION_TYPES.APPOINTMENT,
      'Agendamento Pendente',
      message,
      { ...appointment, action: 'pending' }
    )
  }, [addNotification])

  /**
   * Notifica sobre um agendamento concluido
   * @param {Object} appointment - Dados do agendamento
   * @param {string} appointment.client_name - Nome do cliente
   * @param {Object} options - Opcoes adicionais
   * @param {boolean} options.playSound - Se deve tocar som (default: false para concluidos)
   */
  const notifyAppointmentCompleted = useCallback((appointment, options = {}) => {
    const { playSound = false } = options
    const clientName = appointment.client_name || appointment.clientName || 'Cliente'

    const message = `Agendamento de ${clientName} foi concluido`

    if (playSound) {
      playNotificationSound()
    }

    return addNotification(
      NOTIFICATION_TYPES.APPOINTMENT,
      'Agendamento Concluido',
      message,
      { ...appointment, action: 'completed' }
    )
  }, [addNotification])

  /**
   * Notifica sobre um agendamento cancelado
   * @param {Object} appointment - Dados do agendamento
   * @param {string} appointment.client_name - Nome do cliente
   * @param {Object} options - Opcoes adicionais
   * @param {boolean} options.playSound - Se deve tocar som (default: true para cancelados)
   */
  const notifyAppointmentCancelled = useCallback((appointment, options = {}) => {
    const { playSound = true } = options
    const clientName = appointment.client_name || appointment.clientName || 'Cliente'

    const message = `Agendamento de ${clientName} foi cancelado`

    if (playSound) {
      playNotificationSound()
    }

    return addNotification(
      NOTIFICATION_TYPES.APPOINTMENT,
      'Agendamento Cancelado',
      message,
      { ...appointment, action: 'cancelled' }
    )
  }, [addNotification])

  return {
    notifyNewAppointment,
    notifyNewClient,
    notifyPendingAppointment,
    notifyAppointmentCompleted,
    notifyAppointmentCancelled
  }
}

// Exportar funcoes individuais para uso direto
export {
  useNotificationTriggers
}

// Export default
export default useNotificationTriggers
