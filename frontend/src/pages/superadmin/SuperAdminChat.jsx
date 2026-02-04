import { useState, useEffect, useCallback } from 'react'
import { format, isToday } from 'date-fns'
import { Search, MessageCircle, ArrowLeft, Wifi, WifiOff } from 'lucide-react'
import { useChat } from '../../contexts/ChatContext'
import { ChatMessageList, ChatInput } from '../../components/chat'

export default function SuperAdminChat() {
  const {
    isConnected,
    conversations,
    messages,
    activeConversationId,
    typingUsers,
    loadingMessages,
    hasMoreMessages,
    openConversation,
    closeConversation,
    sendMessage,
    emitTyping,
    fetchConversations,
    loadMoreMessages
  } = useChat()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'unread'
  const [showChat, setShowChat] = useState(false) // mobile: toggle list/chat

  // Load conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const handleSelectConversation = useCallback(async (conversationId) => {
    await openConversation(conversationId)
    setShowChat(true)
  }, [openConversation])

  const handleBack = useCallback(() => {
    closeConversation()
    setShowChat(false)
  }, [closeConversation])

  const handleSend = useCallback((content) => {
    sendMessage(content)
  }, [sendMessage])

  const handleTyping = useCallback(() => {
    emitTyping()
  }, [emitTyping])

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isToday(date)) return format(date, 'HH:mm')
    return format(date, 'dd/MM')
  }

  // Filter and search conversations
  const filteredConversations = conversations.filter(c => {
    if (filter === 'unread' && (!c.unread_count || c.unread_count === 0)) return false
    if (search) {
      const term = search.toLowerCase()
      const name = (c.user?.name || c.user_name || '').toLowerCase()
      const email = (c.user?.email || c.user_email || '').toLowerCase()
      return name.includes(term) || email.includes(term)
    }
    return true
  })

  const activeConversation = conversations.find(c => c.id === activeConversationId)
  const typingUser = activeConversationId ? typingUsers[activeConversationId] : null

  return (
    <div className="h-[calc(100vh-7rem)] flex bg-white rounded-xl border border-jet-black-200 overflow-hidden">
      {/* Left Panel - Conversation List */}
      <div className={`w-full lg:w-1/3 lg:max-w-sm border-r border-jet-black-200 flex flex-col ${showChat ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-jet-black-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-jet-black-900">
              Conversas
              {conversations.length > 0 && (
                <span className="ml-2 text-sm font-normal text-jet-black-400">
                  ({conversations.length})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jet-black-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-jet-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-jet-black-500 hover:bg-jet-black-100'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-jet-black-500 hover:bg-jet-black-100'
              }`}
            >
              Nao lidas
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-jet-black-400">
              <MessageCircle className="w-8 h-8 mb-2" />
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          )}

          {filteredConversations.map(conversation => {
            const name = conversation.user?.name || conversation.user_name || 'Usuario'
            const isActive = conversation.id === activeConversationId

            return (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-jet-black-50 transition-colors ${
                  isActive ? 'bg-violet-50 border-l-2 border-violet-600' : 'border-l-2 border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-jet-black-900 truncate">{name}</p>
                    <span className="text-[10px] text-jet-black-400 flex-shrink-0 ml-2">
                      {formatTime(conversation.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-jet-black-500 truncate">
                      {conversation.last_message || 'Sem mensagens'}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-violet-600 text-white text-[10px] font-bold rounded-full">
                        {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className={`flex-1 flex flex-col ${!showChat ? 'hidden lg:flex' : 'flex'}`}>
        {activeConversationId && activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-jet-black-200">
              <button
                onClick={handleBack}
                className="lg:hidden p-1 rounded-lg hover:bg-jet-black-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {(activeConversation.user?.name || activeConversation.user_name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-jet-black-900 truncate">
                  {activeConversation.user?.name || activeConversation.user_name || 'Usuario'}
                </p>
                <p className="text-xs text-jet-black-400 truncate">
                  {activeConversation.user?.email || activeConversation.user_email || ''}
                  {activeConversation.user?.company_name || activeConversation.company_name
                    ? ` - ${activeConversation.user?.company_name || activeConversation.company_name}`
                    : ''}
                </p>
              </div>
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
              disabled={!isConnected}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-jet-black-400">
            <MessageCircle className="w-12 h-12 mb-3" />
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  )
}
