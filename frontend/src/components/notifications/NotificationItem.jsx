import { Calendar, User, Bell, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Formata o tempo relativo (ex: "há 5 min", "há 1h", "há 2 dias")
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Tempo relativo formatado
 */
const formatRelativeTime = (date) => {
  const now = new Date()
  const notificationDate = new Date(date)
  const diffInSeconds = Math.floor((now - notificationDate) / 1000)

  if (diffInSeconds < 60) {
    return 'agora'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} min`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `há ${diffInHours}h`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `há ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`
}

/**
 * Retorna o icone apropriado baseado no tipo da notificacao
 * @param {string} type - Tipo da notificacao (appointment, client, reminder, system)
 * @returns {React.ComponentType} Componente do icone
 */
const getIconByType = (type) => {
  const icons = {
    appointment: Calendar,
    client: User,
    reminder: Bell,
    system: Info
  }
  return icons[type] || Bell
}

/**
 * Retorna as cores do icone baseado no tipo da notificacao
 * @param {string} type - Tipo da notificacao
 * @returns {string} Classes Tailwind para o icone
 */
const getIconColorByType = (type) => {
  const colors = {
    appointment: 'bg-periwinkle-100 text-periwinkle-600',
    client: 'bg-twilight-indigo-100 text-twilight-indigo-600',
    reminder: 'bg-yellow-100 text-yellow-600',
    system: 'bg-space-indigo-100 text-space-indigo-600'
  }
  return colors[type] || 'bg-jet-black-100 text-jet-black-600'
}

/**
 * Componente de item individual de notificacao
 * @param {Object} props
 * @param {Object} props.notification - Dados da notificacao
 * @param {string} props.notification.id - ID unico da notificacao
 * @param {string} props.notification.type - Tipo (appointment, client, reminder, system)
 * @param {string} props.notification.title - Titulo da notificacao
 * @param {string} props.notification.message - Mensagem da notificacao
 * @param {boolean} props.notification.read - Se foi lida
 * @param {string} props.notification.createdAt - Data de criacao
 * @param {string} [props.notification.link] - Link para navegacao ao clicar
 * @param {function} props.onMarkAsRead - Callback ao marcar como lida
 * @param {function} [props.onClick] - Callback customizado ao clicar
 */
export default function NotificationItem({ notification, onMarkAsRead, onClick }) {
  const navigate = useNavigate()
  const { id, type, title, message, read, createdAt, link } = notification

  const Icon = getIconByType(type)
  const iconColorClass = getIconColorByType(type)

  const handleClick = () => {
    // Marca como lida se ainda nao foi
    if (!read && onMarkAsRead) {
      onMarkAsRead(id)
    }

    // Callback customizado ou navegacao padrao
    if (onClick) {
      onClick(notification)
    } else if (link) {
      navigate(link)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-start gap-3 p-3 cursor-pointer transition-colors
        ${read ? 'bg-white' : 'bg-periwinkle-50/50'}
        hover:bg-jet-black-50
      `}
    >
      {/* Icone */}
      <div className={`flex-shrink-0 p-2 rounded-full ${iconColorClass}`}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Conteudo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${read ? 'font-normal text-jet-black-700' : 'font-semibold text-jet-black-900'}`}>
            {title}
          </p>
          {/* Indicador de nao lida */}
          {!read && (
            <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-periwinkle-500 rounded-full" />
          )}
        </div>
        <p className="text-sm text-jet-black-500 truncate mt-0.5">
          {message}
        </p>
        <p className="text-xs text-jet-black-400 mt-1">
          {formatRelativeTime(createdAt)}
        </p>
      </div>
    </div>
  )
}
