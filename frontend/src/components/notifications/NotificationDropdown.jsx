import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CheckCheck, Bell } from 'lucide-react'
import NotificationItem from './NotificationItem'

/**
 * Dropdown de notificacoes
 * @param {Object} props
 * @param {boolean} props.isOpen - Se o dropdown esta aberto
 * @param {function} props.onClose - Callback para fechar o dropdown
 * @param {Array} props.notifications - Lista de notificacoes
 * @param {function} props.onMarkAsRead - Callback para marcar uma notificacao como lida
 * @param {function} props.onMarkAllAsRead - Callback para marcar todas como lidas
 * @param {function} [props.onNotificationClick] - Callback ao clicar em uma notificacao
 * @param {number} [props.maxItems=5] - Numero maximo de itens a exibir
 */
export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  maxItems = 5
}) {
  const dropdownRef = useRef(null)

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Fechar ao pressionar Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayedNotifications = notifications.slice(0, maxItems)
  const hasUnreadNotifications = notifications.some(n => !n.read)

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-jet-black-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-jet-black-200 bg-jet-black-50">
        <h3 className="text-sm font-semibold text-jet-black-900">
          Notificacoes
        </h3>
        {hasUnreadNotifications && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-xs text-periwinkle-600 hover:text-periwinkle-700 font-medium transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Lista de notificacoes */}
      <div className="max-h-[400px] overflow-y-auto">
        {displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="p-3 bg-jet-black-100 rounded-full mb-3">
              <Bell className="h-6 w-6 text-jet-black-400" />
            </div>
            <p className="text-sm text-jet-black-500 text-center">
              Nenhuma notificacao
            </p>
            <p className="text-xs text-jet-black-400 text-center mt-1">
              Voce esta em dia!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-jet-black-100">
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-jet-black-200 bg-jet-black-50">
          <Link
            to="/notifications"
            onClick={onClose}
            className="block w-full py-3 text-center text-sm font-medium text-periwinkle-600 hover:text-periwinkle-700 hover:bg-jet-black-100 transition-colors"
          >
            Ver todas
          </Link>
        </div>
      )}
    </div>
  )
}
