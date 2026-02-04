import { useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ChatMessage from './ChatMessage'
import ChatTypingIndicator from './ChatTypingIndicator'

export default function ChatMessageList({
  messages,
  typingUser,
  loadingMessages,
  hasMoreMessages,
  onLoadMore
}) {
  const { user } = useAuth()
  const containerRef = useRef(null)
  const bottomRef = useRef(null)
  const prevMessagesLenRef = useRef(0)
  const pageRef = useRef(1)

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > prevMessagesLenRef.current) {
      // Only auto-scroll if user was near the bottom or it's a new message (not load-more)
      const container = containerRef.current
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
        if (isNearBottom || messages.length - prevMessagesLenRef.current === 1) {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    prevMessagesLenRef.current = messages.length
  }, [messages.length])

  // Scroll to bottom on first load
  useEffect(() => {
    if (messages.length > 0 && prevMessagesLenRef.current === 0) {
      bottomRef.current?.scrollIntoView()
    }
  }, [messages.length])

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || loadingMessages || !hasMoreMessages || !onLoadMore) return

    if (container.scrollTop === 0) {
      pageRef.current += 1
      onLoadMore(pageRef.current)
    }
  }, [loadingMessages, hasMoreMessages, onLoadMore])

  // Reset page when messages reset
  useEffect(() => {
    if (messages.length === 0) {
      pageRef.current = 1
    }
  }, [messages.length])

  const isOwn = (message) => {
    return message.sender_id === user?.id
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-3 py-3"
    >
      {loadingMessages && messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-periwinkle-600" />
        </div>
      )}

      {!loadingMessages && messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-jet-black-400 text-sm">
          Envie uma mensagem para iniciar
        </div>
      )}

      {hasMoreMessages && loadingMessages && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-periwinkle-600" />
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isOwn={isOwn(message)}
        />
      ))}

      {typingUser && (
        <ChatTypingIndicator userName={typingUser.userName} />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
