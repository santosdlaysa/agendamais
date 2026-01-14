import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// Usa a mesma instância de API, mas com prefixo /superadmin
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/superadmin`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Usa o mesmo token do sistema de autenticação principal
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redireciona para login principal se não autenticado
      window.location.hash = '#/login'
    }
    if (error.response?.status === 403) {
      // Sem permissão - redireciona para dashboard normal
      window.location.hash = '#/dashboard'
    }
    return Promise.reject(error)
  }
)

// API functions
export const superAdminApi = {
  // Companies
  getCompanies: (params = {}) => api.get('/companies', { params }),
  getCompany: (id) => api.get(`/companies/${id}`),
  suspendCompany: (id, reason) => api.post(`/companies/${id}/suspend`, { reason }),
  activateCompany: (id) => api.post(`/companies/${id}/activate`),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),

  // Subscriptions
  getSubscriptions: (params = {}) => api.get('/subscriptions', { params }),
  getSubscription: (id) => api.get(`/subscriptions/${id}`),
  changePlan: (id, newPlan) => api.put(`/subscriptions/${id}/plan`, { new_plan: newPlan }),
  extendSubscription: (id, days) => api.post(`/subscriptions/${id}/extend`, { days }),
  cancelSubscription: (id, reason) => api.post(`/subscriptions/${id}/cancel`, { reason }),
  getExpiringSubscriptions: (days = 7) => api.get('/subscriptions/expiring', { params: { days } }),

  // Analytics
  getOverview: () => api.get('/analytics/overview'),
  getRevenue: (params = {}) => api.get('/analytics/revenue', { params }),
  getGrowth: (params = {}) => api.get('/analytics/growth', { params }),
  getChurn: (params = {}) => api.get('/analytics/churn', { params }),
  getPlanDistribution: () => api.get('/analytics/plans'),

  // Activity
  getRecentActivity: (limit = 10) => api.get('/activity/recent', { params: { limit } }),
  getAlerts: () => api.get('/alerts'),
}

export default api
