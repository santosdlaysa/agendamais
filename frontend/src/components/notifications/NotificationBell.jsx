import { useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '../../contexts/NotificationContext'

/**
 * Componente do sino de notificacoes
 * Exibe o icone de sino com badge de contagem e abre o dropdown ao clicar
 */
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const bellRef = useRef(null)

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    hasNewNotifications
  } = useNotifications()

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={bellRef}>
      {/* Botao do sino */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg text-jet-black-600 hover:bg-jet-black-100 hover:text-jet-black-900 transition-colors focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:ring-offset-2"
        aria-label={`Notificacoes${unreadCount > 0 ? ` (${unreadCount} nao lidas)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Icone do sino com animacao */}
        <Bell
          className={`h-5 w-5 ${hasNewNotifications ? 'animate-bell-ring' : ''}`}
        />

        {/* Badge de contagem */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Indicador de pulso para novas notificacoes */}
        {hasNewNotifications && unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-[18px] w-[18px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </button>

      {/* Dropdown de notificacoes */}
      <NotificationDropdown
        isOpen={isOpen}
        onClose={handleClose}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  )
}
