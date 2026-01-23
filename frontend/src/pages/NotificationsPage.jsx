import { useState } from 'react'
import { Bell, Check, CheckCheck, Trash2, Filter, Calendar, User, Clock, Info } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { NOTIFICATION_TYPES } from '../constants/notificationTypes'
import { formatNotificationTime, getNotificationColor } from '../utils/notificationHelpers'

const TYPE_CONFIG = {
  [NOTIFICATION_TYPES.APPOINTMENT]: {
    label: 'Agendamentos',
    icon: Calendar,
    color: 'periwinkle'
  },
  [NOTIFICATION_TYPES.CLIENT]: {
    label: 'Clientes',
    icon: User,
    color: 'twilight-indigo'
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    label: 'Lembretes',
    icon: Clock,
    color: 'yellow'
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    label: 'Sistema',
    icon: Info,
    color: 'space-indigo'
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getByType,
    loading
  } = useNotifications()

  const [filter, setFilter] = useState('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    if (filter !== 'all' && notification.type !== filter) return false
    if (showUnreadOnly && notification.read) return false
    return true
  })

  // Agrupar por data
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let groupKey
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hoje'
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Ontem'
    } else {
      groupKey = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(notification)
    return groups
  }, {})

  const handleMarkAsRead = async (id) => {
    await markAsRead(id)
  }

  const handleRemove = async (id) => {
    await removeNotification(id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Notificações</h1>
          <p className="text-jet-black-600">
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Todas as notificações lidas'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 text-sm text-periwinkle-600 hover:bg-periwinkle-50 border border-periwinkle-200 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar todas
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-jet-black-400" />
            <span className="text-sm font-medium text-jet-black-700">Filtrar por:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-periwinkle-100 text-periwinkle-700'
                  : 'bg-jet-black-100 text-jet-black-600 hover:bg-jet-black-200'
              }`}
            >
              Todas
            </button>
            {Object.entries(TYPE_CONFIG).map(([type, config]) => {
              const Icon = config.icon
              const count = getByType(type).length
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`flex items-center px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filter === type
                      ? 'bg-periwinkle-100 text-periwinkle-700'
                      : 'bg-jet-black-100 text-jet-black-600 hover:bg-jet-black-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {config.label}
                  {count > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="ml-auto">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-10 h-5 rounded-full transition-colors ${
                showUnreadOnly ? 'bg-periwinkle-600' : 'bg-jet-black-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  showUnreadOnly ? 'translate-x-5' : ''
                }`} />
              </div>
              <span className="ml-2 text-sm text-jet-black-600">Apenas não lidas</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-jet-black-300 mb-4">
              <Bell className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-jet-black-600">
              {showUnreadOnly
                ? 'Não há notificações não lidas'
                : filter !== 'all'
                  ? `Não há notificações do tipo "${TYPE_CONFIG[filter]?.label}"`
                  : 'Você ainda não tem notificações'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-jet-black-100">
            {Object.entries(groupedNotifications).map(([date, notifs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="px-6 py-3 bg-jet-black-50 border-b border-jet-black-100">
                  <h3 className="text-sm font-medium text-jet-black-600 capitalize">{date}</h3>
                </div>

                {/* Notifications */}
                {notifs.map((notification) => {
                  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG[NOTIFICATION_TYPES.SYSTEM]
                  const Icon = config.icon
                  const colors = getNotificationColor(notification.type, notification.data)

                  return (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 hover:bg-jet-black-50 transition-colors ${
                        !notification.read ? 'bg-periwinkle-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colors.bg}`}>
                          <Icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className={`text-sm ${!notification.read ? 'font-semibold text-jet-black-900' : 'text-jet-black-700'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-jet-black-500 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-jet-black-400 mt-1">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1.5 text-periwinkle-600 hover:bg-periwinkle-100 rounded-lg transition-colors"
                                  title="Marcar como lida"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemove(notification.id)}
                                className="p-1.5 text-jet-black-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Unread indicator */}
                          {!notification.read && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-periwinkle-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-jet-black-700 mb-4">Resumo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(TYPE_CONFIG).map(([type, config]) => {
              const Icon = config.icon
              const count = getByType(type).length
              const unread = getByType(type).filter(n => !n.read).length

              return (
                <div
                  key={type}
                  className="text-center p-4 bg-jet-black-50 rounded-lg"
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 text-${config.color}-600`} />
                  <p className="text-2xl font-bold text-jet-black-900">{count}</p>
                  <p className="text-sm text-jet-black-600">{config.label}</p>
                  {unread > 0 && (
                    <p className="text-xs text-periwinkle-600 mt-1">{unread} não lida{unread > 1 ? 's' : ''}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
