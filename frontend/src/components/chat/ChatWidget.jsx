import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useChat } from '../../contexts/ChatContext'
import ChatButton from './ChatButton'
import ChatWindow from './ChatWindow'

export default function ChatWidget() {
  const { user } = useAuth()
  const { unreadCount } = useChat()
  const [isOpen, setIsOpen] = useState(false)

  // Don't render for superadmin
  if (user?.role === 'superadmin') return null

  return (
    <>
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        unreadCount={unreadCount}
      />
    </>
  )
}
