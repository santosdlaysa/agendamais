import { useState, useEffect, useRef } from 'react'
import { X, Wifi, WifiOff } from 'lucide-react'
import { useChat } from '../../contexts/ChatContext'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'

export default function ChatWindow({ isOpen, onClose }) {
  const {
    isConnected,
    messages,
    activeConversationId,
    typingUsers,
    loadingMessages,
    hasMoreMessages,
    openConversation,
    closeConversation,
    sendMessage,
    emitTyping,
    createConversation,
    loadMoreMessages
  } = useChat()

  const [initialized, setInitialized] = useState(false)
  const initRef = useRef(false)

  // Initialize conversation when open and connected
  useEffect(() => {
    if (isOpen && isConnected && !initRef.current) {
      initRef.current = true
      const init = async () => {
        try {
          const conversation = await createConversation()
          if (conversation?.id) {
            await openConversation(conversation.id)
            setInitialized(true)
          } else {
            initRef.current = false
          }
        } catch {
          initRef.current = false
        }
      }
      init()
    }
  }, [isOpen, isConnected, createConversation, openConversation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeConversationId) {
        closeConversation()
      }
    }
  }, [])

  const handleSend = (content) => {
    sendMessage(content)
  }

  const handleTyping = () => {
    emitTyping()
  }

  const typingUser = activeConversationId
    ? typingUsers[activeConversationId]
    : null

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:bottom-0 max-sm:right-0 bg-white rounded-2xl max-sm:rounded-none shadow-2xl border border-jet-black-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-periwinkle-600 text-white">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-sm font-semibold">Suporte Agendar Mais</h3>
            <div className="flex items-center gap-1">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span className="text-[10px] opacity-80">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span className="text-[10px] opacity-80">Reconectando...</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <ChatMessageList
        messages={messages}
        typingUser={typingUser}
        loadingMessages={loadingMessages}
        hasMoreMessages={hasMoreMessages}
        onLoadMore={loadMoreMessages}
      />

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onTyping={handleTyping}
        disabled={!initialized || !isConnected}
      />
    </div>
  )
}
