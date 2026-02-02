import {
  formatDistanceToNow,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isYesterday,
  parseISO
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Bell
} from 'lucide-react'
import { NOTIFICATION_TYPES } from '../constants/notificationTypes'

/**
 * Formata o tempo de uma notificacao de forma relativa
 * Retorna strings como "ha 5 min", "ha 1h", "ontem", etc.
 *
 * @param {string|Date} timestamp - Timestamp da notificacao
 * @returns {string} Tempo formatado
 *
 * @example
 * formatNotificationTime('2024-01-15T10:00:00') // "ha 5 min"
 * formatNotificationTime(new Date(Date.now() - 3600000)) // "ha 1h"
 */
export function formatNotificationTime(timestamp) {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp
    const now = new Date()

    const minutesDiff = differenceInMinutes(now, date)
    const hoursDiff = differenceInHours(now, date)
    const daysDiff = differenceInDays(now, date)

    // Menos de 1 minuto
    if (minutesDiff < 1) {
      return 'agora'
    }

    // Menos de 60 minutos
    if (minutesDiff < 60) {
      return `ha ${minutesDiff} min`
    }

    // Menos de 24 horas
    if (hoursDiff < 24) {
      return `ha ${hoursDiff}h`
    }

    // Ontem
    if (isYesterday(date)) {
      return 'ontem'
    }

    // Menos de 7 dias
    if (daysDiff < 7) {
      return `ha ${daysDiff} dias`
    }

    // Mais de 7 dias - usar formatDistanceToNow
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR
    })
  } catch {
    return ''
  }
}

/**
 * Retorna o componente de icone lucide-react apropriado para cada tipo de notificacao
 * Considera o tipo da notificacao e a acao (action) no data para diferenciar icones
 *
 * @param {string} type - Tipo da notificacao (usar NOTIFICATION_TYPES)
 * @param {Object} data - Dados adicionais da notificacao (opcional)
 * @param {string} data.action - Acao especifica ('new', 'pending', 'completed', 'cancelled')
 * @returns {React.ComponentType} Componente do icone
 *
 * @example
 * const Icon = getNotificationIcon('appointment', { action: 'new' })
 * // <Icon className="w-5 h-5" />
 */
export function getNotificationIcon(type, data = {}) {
  const { action } = data

  // Icones especificos por acao de agendamento
  if (type === NOTIFICATION_TYPES.APPOINTMENT) {
    switch (action) {
      case 'pending':
        return Clock
      case 'completed':
        return CheckCircle
      case 'cancelled':
        return XCircle
      case 'new':
      default:
        return Calendar
    }
  }

  // Icones por tipo principal
  const iconMap = {
    [NOTIFICATION_TYPES.APPOINTMENT]: Calendar,
    [NOTIFICATION_TYPES.CLIENT]: UserPlus,
    [NOTIFICATION_TYPES.REMINDER]: Clock,
    [NOTIFICATION_TYPES.SYSTEM]: Info
  }

  return iconMap[type] || Bell
}

/**
 * Retorna as classes Tailwind para estilizacao de cada tipo de notificacao
 * Inclui classes para background, borda e cor do icone
 * Considera o tipo da notificacao e a acao (action) no data para diferenciar cores
 *
 * @param {string} type - Tipo da notificacao (usar NOTIFICATION_TYPES)
 * @param {Object} data - Dados adicionais da notificacao (opcional)
 * @param {string} data.action - Acao especifica ('new', 'pending', 'completed', 'cancelled')
 * @returns {Object} Objeto com classes Tailwind
 *
 * @example
 * const colors = getNotificationColor('appointment', { action: 'new' })
 * // { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-700' }
 */
export function getNotificationColor(type, data = {}) {
  const { action } = data

  // Cores especificas por acao de agendamento
  if (type === NOTIFICATION_TYPES.APPOINTMENT) {
    switch (action) {
      case 'pending':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800'
        }
      case 'completed':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: 'text-emerald-600',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800'
        }
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800'
        }
      case 'new':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800'
        }
    }
  }

  // Cores por tipo principal
  const colorMap = {
    [NOTIFICATION_TYPES.APPOINTMENT]: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800'
    },
    [NOTIFICATION_TYPES.CLIENT]: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800'
    },
    [NOTIFICATION_TYPES.REMINDER]: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800'
    },
    [NOTIFICATION_TYPES.SYSTEM]: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      text: 'text-gray-700',
      badge: 'bg-gray-100 text-gray-800'
    }
  }

  // Retornar cores padrao (cinza) se tipo nao reconhecido
  return colorMap[type] || {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'text-gray-600',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-800'
  }
}

/**
 * Toca um som de notificacao
 * Usa a Web Audio API para gerar um som simples de notificacao
 *
 * @param {Object} options - Opcoes do som
 * @param {number} options.frequency - Frequencia do som em Hz (default: 800)
 * @param {number} options.duration - Duracao do som em ms (default: 150)
 * @param {number} options.volume - Volume do som de 0 a 1 (default: 0.3)
 * @returns {void}
 *
 * @example
 * playNotificationSound()
 * playNotificationSound({ frequency: 600, duration: 200, volume: 0.5 })
 */
export function playNotificationSound(options = {}) {
  const {
    frequency = 800,
    duration = 150,
    volume = 0.3
  } = options

  try {
    // Verificar se Web Audio API esta disponivel
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) {
      console.warn('Web Audio API nao suportada neste navegador')
      return
    }

    const audioContext = new AudioContext()

    // Criar oscilador para gerar o som
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Configurar o tipo de onda e frequencia
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

    // Configurar volume com fade out suave
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    )

    // Tocar o som
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)

    // Limpar recursos apos o som terminar
    oscillator.onended = () => {
      oscillator.disconnect()
      gainNode.disconnect()
      audioContext.close()
    }
  } catch (error) {
    console.warn('Erro ao tocar som de notificacao:', error)
  }
}

/**
 * Retorna o titulo legivel para cada tipo de notificacao
 * Considera o tipo da notificacao e a acao (action) no data
 *
 * @param {string} type - Tipo da notificacao (usar NOTIFICATION_TYPES)
 * @param {Object} data - Dados adicionais da notificacao (opcional)
 * @param {string} data.action - Acao especifica ('new', 'pending', 'completed', 'cancelled')
 * @returns {string} Titulo legivel
 */
export function getNotificationTitle(type, data = {}) {
  const { action } = data

  // Titulos especificos por acao de agendamento
  if (type === NOTIFICATION_TYPES.APPOINTMENT) {
    switch (action) {
      case 'pending':
        return 'Agendamento Pendente'
      case 'completed':
        return 'Agendamento Concluido'
      case 'cancelled':
        return 'Agendamento Cancelado'
      case 'new':
      default:
        return 'Novo Agendamento'
    }
  }

  // Titulos por tipo principal
  const titleMap = {
    [NOTIFICATION_TYPES.APPOINTMENT]: 'Agendamento',
    [NOTIFICATION_TYPES.CLIENT]: 'Novo Cliente',
    [NOTIFICATION_TYPES.REMINDER]: 'Lembrete',
    [NOTIFICATION_TYPES.SYSTEM]: 'Sistema'
  }

  return titleMap[type] || 'Notificacao'
}

/**
 * Agrupa notificacoes por data (hoje, ontem, esta semana, etc.)
 *
 * @param {Array} notifications - Lista de notificacoes
 * @returns {Object} Objeto com notificacoes agrupadas por periodo
 */
export function groupNotificationsByDate(notifications) {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: []
  }

  const now = new Date()

  notifications.forEach((notification) => {
    const timestamp = notification.timestamp || notification.created_at
    const date = typeof timestamp === 'string'
      ? parseISO(timestamp)
      : timestamp

    const daysDiff = differenceInDays(now, date)

    if (daysDiff === 0) {
      groups.today.push(notification)
    } else if (isYesterday(date)) {
      groups.yesterday.push(notification)
    } else if (daysDiff < 7) {
      groups.thisWeek.push(notification)
    } else {
      groups.older.push(notification)
    }
  })

  return groups
}

// Export default com todas as funcoes
export default {
  formatNotificationTime,
  getNotificationIcon,
  getNotificationColor,
  playNotificationSound,
  getNotificationTitle,
  groupNotificationsByDate
}
