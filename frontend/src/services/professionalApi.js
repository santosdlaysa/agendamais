import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// Instância do axios para profissionais
const professionalAxios = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
professionalAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('professional_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Flag para evitar múltiplos redirects
let isRedirecting = false

// Interceptor para tratar erros de autenticação
professionalAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      const isProfessionalRoute = window.location.hash.includes('/profissional')
      const isProfessionalLoginPage = window.location.hash.includes('/profissional/login')

      if (isProfessionalRoute && !isProfessionalLoginPage) {
        isRedirecting = true
        localStorage.removeItem('professional_token')
        localStorage.removeItem('professional')
        window.location.hash = '#/profissional/login'

        setTimeout(() => {
          isRedirecting = false
        }, 1000)
      }
    }
    return Promise.reject(error)
  }
)

export const professionalApi = {
  // ==================== AUTH ====================

  login: async (email, password) => {
    const response = await professionalAxios.post('/professional-auth/login', { email, password })
    return response.data
  },

  activate: async (token, password) => {
    const response = await professionalAxios.post('/professional-auth/activate', { token, password })
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await professionalAxios.post('/professional-auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await professionalAxios.post('/professional-auth/reset-password', { token, password })
    return response.data
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await professionalAxios.post('/professional-auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
    return response.data
  },

  // ==================== DASHBOARD ====================

  getDashboard: async () => {
    const response = await professionalAxios.get('/professional/dashboard')
    return response.data
  },

  // ==================== APPOINTMENTS ====================

  getAppointments: async (params = {}) => {
    const response = await professionalAxios.get('/professional/appointments', { params })
    return response.data
  },

  getAppointment: async (id) => {
    const response = await professionalAxios.get(`/professional/appointments/${id}`)
    return response.data
  },

  completeAppointment: async (id, data) => {
    const response = await professionalAxios.put(`/professional/appointments/${id}/complete`, data)
    return response.data
  },

  cancelAppointment: async (id, reason) => {
    const response = await professionalAxios.put(`/professional/appointments/${id}/cancel`, { reason })
    return response.data
  },

  // ==================== SCHEDULE ====================

  getSchedule: async (startDate, endDate) => {
    const response = await professionalAxios.get('/professional/schedule', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response.data
  },

  getTodaySchedule: async () => {
    const today = new Date().toISOString().split('T')[0]
    const response = await professionalAxios.get('/professional/schedule', {
      params: { start_date: today, end_date: today }
    })
    return response.data
  },

  // ==================== WORKING HOURS ====================

  getWorkingHours: async () => {
    const response = await professionalAxios.get('/professional/working-hours')
    return response.data
  },

  updateWorkingHours: async (data) => {
    const response = await professionalAxios.put('/professional/working-hours', data)
    return response.data
  },

  // ==================== BLOCKED DATES ====================

  getBlockedDates: async () => {
    const response = await professionalAxios.get('/professional/blocked-dates')
    return response.data
  },

  blockDate: async (data) => {
    const response = await professionalAxios.post('/professional/blocked-dates', data)
    return response.data
  },

  unblockDate: async (id) => {
    const response = await professionalAxios.delete(`/professional/blocked-dates/${id}`)
    return response.data
  },

  // ==================== CLIENTS ====================

  getClients: async (params = {}) => {
    const response = await professionalAxios.get('/professional/clients', { params })
    return response.data
  },

  getClient: async (id) => {
    const response = await professionalAxios.get(`/professional/clients/${id}`)
    return response.data
  },

  // ==================== STATS ====================

  getStats: async (params = {}) => {
    const response = await professionalAxios.get('/professional/stats', { params })
    return response.data
  },

  getRevenueStats: async (params = {}) => {
    const response = await professionalAxios.get('/professional/stats/revenue', { params })
    return response.data
  }
}

export default professionalAxios
