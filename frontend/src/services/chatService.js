import api from '../utils/api'

const chatService = {
  getConversations: async (params = {}) => {
    const query = new URLSearchParams()
    if (params.status) query.append('status', params.status)
    if (params.search) query.append('search', params.search)
    if (params.page) query.append('page', params.page)
    if (params.limit) query.append('limit', params.limit)

    const response = await api.get(`/chat/conversations?${query}`)
    return response.data
  },

  createOrGetConversation: async (userId) => {
    const body = userId ? { userId } : {}
    const response = await api.post('/chat/conversations', body)
    return response.data
  },

  getMessages: async (conversationId, page = 1, limit = 50) => {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    )
    return response.data
  },

  markAsRead: async (conversationId) => {
    const response = await api.patch(`/chat/conversations/${conversationId}/read`)
    return response.data
  },

  getUnreadCount: async () => {
    const response = await api.get('/chat/conversations/unread-count')
    return response.data
  }
}

export default chatService
