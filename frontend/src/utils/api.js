import axios from 'axios'

// Configurar axios com base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.20.10.11:5000'

// Instância do axios configurada
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Appointment completion functions
export const appointmentService = {
  // Complete appointment with automatic value calculation
  completeAppointment: async (appointmentId, notes, customPrice = null, paymentMethod = null) => {
    const body = { notes }
    if (customPrice) {
      body.custom_price = customPrice
    }
    if (paymentMethod) {
      body.payment_method = paymentMethod
    }
    
    const response = await api.put(`/appointments/${appointmentId}/complete`, body)
    return response.data
  },

  // Get financial report
  getFinancialReport: async (filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.startDate) params.append('start_date', filters.startDate)
    if (filters.endDate) params.append('end_date', filters.endDate)
    if (filters.professionalId) params.append('professional_id', filters.professionalId)
    if (filters.serviceId) params.append('service_id', filters.serviceId)
    
    const response = await api.get(`/appointments/financial-report?${params}`)
    return response.data
  },

  // Update status with price (alternative method)
  updateStatusWithPrice: async (appointmentId, status, notes = '', customPrice = null) => {
    const body = { status, notes }
    if (customPrice) body.price = customPrice
    
    const response = await api.put(`/appointments/${appointmentId}/status`, body)
    return response.data
  }
}

// Reminder functions
export const reminderService = {
  // Get reminder statistics
  getStats: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.startDate) params.append('start_date', filters.startDate)
    if (filters.endDate) params.append('end_date', filters.endDate)
    if (filters.professionalId) params.append('professional_id', filters.professionalId)

    const response = await api.get(`/reminders/stats?${params}`)
    return response.data
  },

  // Get reminders list
  getReminders: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key])
    })

    const response = await api.get(`/reminders?${params}`)
    return response.data
  },

  // Get upcoming reminders
  getUpcoming: async (hours = 24) => {
    const response = await api.get(`/reminders/upcoming?hours=${hours}`)
    return response.data
  },

  // Get reminder settings for professional
  getSettings: async (professionalId) => {
    const response = await api.get(`/reminders/settings?professional_id=${professionalId}`)
    return response.data
  },

  // Update reminder settings
  updateSettings: async (professionalId, settings) => {
    const response = await api.put('/reminders/settings', {
      professional_id: professionalId,
      settings: settings
    })
    return response.data
  },

  // Get scheduler status
  getSchedulerStatus: async () => {
    const response = await api.get('/reminders/scheduler/status')
    return response.data
  },

  // Start scheduler
  startScheduler: async () => {
    const response = await api.post('/reminders/scheduler/start')
    return response.data
  },

  // Stop scheduler
  stopScheduler: async () => {
    const response = await api.post('/reminders/scheduler/stop')
    return response.data
  },

  // Process pending reminders
  processReminders: async () => {
    const response = await api.post('/reminders/process')
    return response.data
  },

  // Send specific reminder
  sendReminder: async (reminderId) => {
    const response = await api.post(`/reminders/${reminderId}/send`)
    return response.data
  },

  // Test WhatsApp connection
  testWhatsApp: async () => {
    const response = await api.post('/reminders/test/whatsapp')
    return response.data
  },

  // Test SMS connection
  testSMS: async () => {
    const response = await api.post('/reminders/test/sms')
    return response.data
  }
}

export default api