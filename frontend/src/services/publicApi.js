import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// API pública (sem token de autenticação)
export const publicApi = axios.create({
  baseURL: `${API_BASE_URL}/api/public`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const bookingService = {
  // Buscar dados do estabelecimento
  getBusiness: async (slug) => {
    const response = await publicApi.get(`/business/${slug}`)
    return response.data
  },

  // Listar serviços
  getServices: async (slug, professionalId = null) => {
    const params = professionalId ? `?professional_id=${professionalId}` : ''
    const response = await publicApi.get(`/business/${slug}/services${params}`)
    return response.data
  },

  // Listar profissionais
  getProfessionals: async (slug, serviceId = null) => {
    const params = serviceId ? `?service_id=${serviceId}` : ''
    const response = await publicApi.get(`/business/${slug}/professionals${params}`)
    return response.data
  },

  // Buscar disponibilidade de múltiplos dias (para calendário)
  getMultiDayAvailability: async (slug, { professionalId, serviceId, days = 14 }) => {
    try {
      const params = new URLSearchParams({
        professional_id: professionalId,
        service_id: serviceId,
        days: days
      })
      const response = await publicApi.get(`/business/${slug}/availability/multi-day?${params}`)
      return response.data
    } catch (err) {
      console.error('Erro ao buscar disponibilidade multi-dia:', err)
      return { availability: [] }
    }
  },

  // Buscar disponibilidade
  getAvailability: async (slug, { serviceId, professionalId, date, days = 7 }) => {
    const availability = {}
    const startDate = new Date(date)

    // Gerar array de datas para buscar
    const dates = []
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      dates.push(currentDate.toISOString().split('T')[0])
    }

    // Buscar todas as disponibilidades em PARALELO
    const results = await Promise.allSettled(
      dates.map(async (dateStr) => {
        const params = new URLSearchParams({
          service_id: serviceId,
          professional_id: professionalId,
          date: dateStr
        })
        const response = await publicApi.get(`/business/${slug}/availability?${params}`)
        return { dateStr, data: response.data }
      })
    )

    // Processar resultados
    results.forEach((result, index) => {
      const dateStr = dates[index]

      if (result.status === 'fulfilled' && result.value.data.slots?.length > 0) {
        const data = result.value.data
        availability[dateStr] = {
          available: true,
          slots: data.slots.map(slot => ({
            time: slot.start_time,
            end_time: slot.end_time,
            professional_id: data.professional_id,
            professional_name: data.professional_name || null
          }))
        }
      } else {
        availability[dateStr] = {
          available: false,
          slots: []
        }
      }
    })

    return { availability }
  },

  // Criar agendamento
  createAppointment: async (slug, data) => {
    const response = await publicApi.post(`/business/${slug}/appointments`, data)
    return response.data
  },

  // Consultar agendamento
  getAppointment: async (code) => {
    const response = await publicApi.get(`/appointments/${code}`)
    return response.data
  },

  // Cancelar agendamento
  cancelAppointment: async (code, phone, reason) => {
    const response = await publicApi.put(`/appointments/${code}/cancel`, { phone, reason })
    return response.data
  },

  // Confirmar agendamento (quando require_confirmation = true)
  confirmAppointment: async (token) => {
    const response = await publicApi.post(`/appointments/confirm/${token}`)
    return response.data
  },

  // Criar cliente via agendamento público
  createClient: async (slug, clientData) => {
    const response = await publicApi.post(`/business/${slug}/clients`, clientData)
    return response.data
  }
}

export default bookingService
