import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import chatService from '../services/chatService'

const ChatContext = createContext()

const VITE_API_URL = import.meta.env.VITE_API_URL

export function ChatProvider({ children }) {
  const { isAuthenticated, user, loading: authLoading } = useAuth()

  const socketRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const isMountedRef = useRef(true)

  const [isConnected, setIsConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [typingUsers, setTypingUsers] = useState({})
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(false)

  // Connect socket when authenticated
  useEffect(() => {
    isMountedRef.current = true

    if (authLoading || !isAuthenticated) return

    const token = localStorage.getItem('token')
    if (!token) return

    const socket = io(`${VITE_API_URL}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    })

    socketRef.current = socket

    socket.on('connect', () => {
      if (isMountedRef.current) setIsConnected(true)
    })

    socket.on('disconnect', () => {
      if (isMountedRef.current) setIsConnected(false)
    })

    socket.on('new_message', (message) => {
      if (!isMountedRef.current) return

      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev
        return [...prev, message]
      })

      // Update conversation list
      setConversations(prev =>
        prev.map(c =>
          c.id === message.conversation_id
            ? { ...c, last_message: message.content, last_message_at: message.created_at, unread_count: (c.unread_count || 0) + 1 }
            : c
        ).sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
      )

      // If the message is not in the active conversation, increment unread
      if (message.conversation_id !== activeConversationId) {
        setUnreadCount(prev => prev + 1)
      }
    })

    socket.on('conversation_updated', (conversation) => {
      if (!isMountedRef.current) return
      setConversations(prev => {
        const exists = prev.find(c => c.id === conversation.id)
        if (exists) {
          return prev.map(c => c.id === conversation.id ? { ...c, ...conversation } : c)
        }
        return [conversation, ...prev]
      })
    })

    socket.on('unread_update', (data) => {
      if (isMountedRef.current) {
        setUnreadCount(data.total_unread ?? data.unread_count ?? 0)
      }
    })

    socket.on('typing_indicator', ({ conversationId, userId, userName, isTyping }) => {
      if (!isMountedRef.current) return
      setTypingUsers(prev => {
        const next = { ...prev }
        if (isTyping) {
          next[conversationId] = { userId, userName }
        } else {
          delete next[conversationId]
        }
        return next
      })
    })

    socket.on('messages_read', ({ conversationId, readBy }) => {
      if (!isMountedRef.current) return
      setMessages(prev =>
        prev.map(m =>
          m.conversation_id === conversationId && m.sender_id !== readBy
            ? { ...m, read_at: new Date().toISOString() }
            : m
        )
      )
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        )
      )
    })

    socket.on('error', (err) => {
      console.error('Chat socket error:', err)
    })

    // Fetch initial unread count
    chatService.getUnreadCount()
      .then(data => {
        if (isMountedRef.current) setUnreadCount(data.total_unread ?? data.unread_count ?? 0)
      })
      .catch(() => {})

    return () => {
      isMountedRef.current = false
      socket.disconnect()
      socketRef.current = null
    }
  }, [isAuthenticated, authLoading])

  // Track activeConversationId in a ref for socket handlers
  const activeConvRef = useRef(activeConversationId)
  useEffect(() => {
    activeConvRef.current = activeConversationId
  }, [activeConversationId])

  const openConversation = useCallback(async (conversationId) => {
    if (!conversationId) return

    setActiveConversationId(conversationId)
    setLoadingMessages(true)
    setMessages([])

    // Join room via socket
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_conversation', { conversationId })
    }

    try {
      const data = await chatService.getMessages(conversationId, 1, 50)
      if (isMountedRef.current) {
        const msgs = data.messages || data.data || []
        setMessages(msgs.reverse ? msgs.reverse() : msgs)
        setHasMoreMessages(data.pagination ? data.pagination.page < data.pagination.totalPages : false)
      }
      // Mark as read
      await chatService.markAsRead(conversationId)
      if (isMountedRef.current) {
        setConversations(prev =>
          prev.map(c => c.id === conversationId ? { ...c, unread_count: 0 } : c)
        )
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    } finally {
      if (isMountedRef.current) setLoadingMessages(false)
    }
  }, [])

  const closeConversation = useCallback(() => {
    if (socketRef.current?.connected && activeConversationId) {
      socketRef.current.emit('leave_conversation', { conversationId: activeConversationId })
    }
    setActiveConversationId(null)
    setMessages([])
    setHasMoreMessages(false)
  }, [activeConversationId])

  const sendMessage = useCallback(async (content) => {
    if (!content?.trim() || !activeConversationId) return

    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', {
        conversationId: activeConversationId,
        content: content.trim()
      })
    }
  }, [activeConversationId])

  const emitTyping = useCallback((conversationId) => {
    if (!socketRef.current?.connected) return

    const convId = conversationId || activeConversationId
    if (!convId) return

    socketRef.current.emit('typing', { conversationId: convId, isTyping: true })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('typing', { conversationId: convId, isTyping: false })
      }
    }, 1000)
  }, [activeConversationId])

  const fetchConversations = useCallback(async (params = {}) => {
    try {
      const data = await chatService.getConversations(params)
      if (isMountedRef.current) {
        setConversations(data.conversations || data.data || [])
      }
      return data
    } catch (err) {
      console.error('Error fetching conversations:', err)
      return { conversations: [] }
    }
  }, [])

  const createConversation = useCallback(async (userId) => {
    try {
      const data = await chatService.createOrGetConversation(userId)
      const conversation = data.conversation || data.data || data
      if (isMountedRef.current && conversation?.id) {
        setConversations(prev => {
          if (prev.some(c => c.id === conversation.id)) return prev
          return [conversation, ...prev]
        })
      }
      return conversation
    } catch (err) {
      console.error('Error creating conversation:', err)
      return null
    }
  }, [])

  const loadMoreMessages = useCallback(async (page) => {
    if (!activeConversationId || loadingMessages) return

    setLoadingMessages(true)
    try {
      const data = await chatService.getMessages(activeConversationId, page, 50)
      if (isMountedRef.current) {
        const msgs = data.messages || data.data || []
        const reversed = msgs.reverse ? msgs.reverse() : msgs
        setMessages(prev => [...reversed, ...prev])
        setHasMoreMessages(data.pagination ? data.pagination.page < data.pagination.totalPages : false)
      }
    } catch (err) {
      console.error('Error loading more messages:', err)
    } finally {
      if (isMountedRef.current) setLoadingMessages(false)
    }
  }, [activeConversationId, loadingMessages])

  const value = {
    isConnected,
    unreadCount,
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
    createConversation,
    loadMoreMessages
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider')
  }
  return context
}

export default ChatContext
