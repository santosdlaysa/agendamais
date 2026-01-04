import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Calendar, Clock, User, UserCheck, Briefcase, AlertTriangle } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function AppointmentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [services, setServices] = useState([])
  const [availableServices, setAvailableServices] = useState([])
  const [formData, setFormData] = useState({
    client_id: '',
    professional_id: '',
    service_id: '',
    appointment_date: '',
    start_time: '',
    status: 'scheduled',
    notes: '',
    price: ''
  })
  const [errors, setErrors] = useState({})
  const [availability, setAvailability] = useState({ available: true, end_time: '' })

  useEffect(() => {
    fetchInitialData()
    if (isEditMode) {
      fetchAppointment()
    }
  }, [id])

  useEffect(() => {
    if (formData.professional_id) {
      fetchAvailableServices(formData.professional_id)
    } else {
      setAvailableServices([])
      setFormData(prev => ({ ...prev, service_id: '', price: '' }))
    }
  }, [formData.professional_id])

  useEffect(() => {
    if (formData.service_id) {
      const selectedService = availableServices.find(s => s.id.toString() === formData.service_id)
      if (selectedService) {
        setFormData(prev => ({ ...prev, price: selectedService.price }))
      }
    }
  }, [formData.service_id, availableServices])

  useEffect(() => {
    if (formData.professional_id && formData.service_id && formData.appointment_date && formData.start_time) {
      checkAvailability()
    }
  }, [formData.professional_id, formData.service_id, formData.appointment_date, formData.start_time])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [clientsRes, professionalsRes, servicesRes] = await Promise.all([
        api.get('/clients?per_page=100'),
        api.get('/professionals?active_only=true'),
        api.get('/services?active_only=true')
      ])
      
      setClients(clientsRes.data.clients || [])
      setProfessionals(professionalsRes.data.professionals || [])
      setServices(servicesRes.data.services || [])
    } catch (error) {
      toast.error('Erro ao carregar dados necessários')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableServices = async (professionalId) => {
    try {
      const response = await api.get(`/professionals/${professionalId}/services`)
      setAvailableServices(response.data.services || [])
    } catch (error) {
      setAvailableServices([])
    }
  }

  const fetchAppointment = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/appointments/${id}`)
      const appointment = response.data.appointment
      
      setFormData({
        client_id: appointment.client_id.toString(),
        professional_id: appointment.professional_id.toString(),
        service_id: appointment.service_id.toString(),
        appointment_date: appointment.appointment_date,
        start_time: appointment.start_time.substring(0, 5),
        status: appointment.status,
        notes: appointment.notes || '',
        price: appointment.price.toString()
      })
    } catch (error) {
      toast.error('Erro ao carregar agendamento')
      navigate('/appointments')
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async () => {
    try {
      const response = await api.post('/appointments/check-availability', {
        professional_id: parseInt(formData.professional_id),
        service_id: parseInt(formData.service_id),
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        exclude_appointment_id: isEditMode ? parseInt(id) : undefined
      })
      
      setAvailability(response.data)
    } catch (error) {
      setAvailability({ available: false, end_time: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.client_id) {
      newErrors.client_id = 'Cliente é obrigatório'
    }

    if (!formData.professional_id) {
      newErrors.professional_id = 'Profissional é obrigatório'
    }

    if (!formData.service_id) {
      newErrors.service_id = 'Serviço é obrigatório'
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Data é obrigatória'
    } else {
      const selectedDate = new Date(formData.appointment_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.appointment_date = 'Data não pode ser no passado'
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Horário é obrigatório'
    }

    if (!availability.available) {
      newErrors.availability = 'Horário não disponível para este profissional'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      
      const submitData = {
        client_id: parseInt(formData.client_id),
        professional_id: parseInt(formData.professional_id),
        service_id: parseInt(formData.service_id),
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        status: formData.status,
        notes: formData.notes || null,
        price: parseFloat(formData.price)
      }

      if (isEditMode) {
        await api.put(`/appointments/${id}`, submitData)
        toast.success('Agendamento atualizado com sucesso!')
      } else {
        await api.post('/appointments', submitData)
        toast.success('Agendamento criado com sucesso!')
      }
      
      navigate('/appointments')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar agendamento'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleClientSearch = async (searchTerm) => {
    if (searchTerm.length < 2) return
    
    try {
      const response = await api.get(`/clients?search=${searchTerm}&per_page=20`)
      setClients(response.data.clients || [])
    } catch (error) {
      // Error handled silently
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const selectedService = availableServices.find(s => s.id.toString() === formData.service_id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/appointments')}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Atualize as informações do agendamento' : 'Preencha os dados do novo agendamento'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cliente e Profissional */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cliente e Profissional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Cliente *
                </label>
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                    errors.client_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.phone && `- ${client.phone}`}
                    </option>
                  ))}
                </select>
                {errors.client_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Não encontrou o cliente? 
                  <button
                    type="button"
                    onClick={() => navigate('/clients/new')}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    Cadastre aqui
                  </button>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCheck className="w-4 h-4 inline mr-1" />
                  Profissional *
                </label>
                <select
                  name="professional_id"
                  value={formData.professional_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                    errors.professional_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um profissional</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name} {professional.role && `- ${professional.role}`}
                    </option>
                  ))}
                </select>
                {errors.professional_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.professional_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Serviço */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Serviço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Serviço *
                </label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleInputChange}
                  disabled={!formData.professional_id}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.service_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">
                    {formData.professional_id ? 'Selecione um serviço' : 'Primeiro selecione um profissional'}
                  </option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {parseFloat(service.price).toFixed(2)} ({service.duration}min)
                    </option>
                  ))}
                </select>
                {errors.service_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.service_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Preço preenchido automaticamente com base no serviço
                </p>
              </div>
            </div>

            {selectedService && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Detalhes do Serviço</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <strong>Duração:</strong> {selectedService.duration} minutos
                  </div>
                  <div>
                    <strong>Preço:</strong> R$ {parseFloat(selectedService.price).toFixed(2)}
                  </div>
                  {selectedService.description && (
                    <div className="md:col-span-3">
                      <strong>Descrição:</strong> {selectedService.description}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Data e Horário */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data e Horário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data do Agendamento *
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                    errors.appointment_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.appointment_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horário de Início *
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${
                    errors.start_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.start_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                )}
                {availability.end_time && (
                  <p className="mt-1 text-xs text-gray-500">
                    Término previsto: {availability.end_time}
                  </p>
                )}
              </div>
            </div>

            {/* Availability Status */}
            {formData.professional_id && formData.service_id && formData.appointment_date && formData.start_time && (
              <div className={`mt-4 p-4 rounded-lg border ${
                availability.available
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  {availability.available ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      <span className="text-sm text-green-800">Horário disponível</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm text-red-800">Conflito de horário detectado</span>
                    </>
                  )}
                </div>
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
                )}
              </div>
            )}
          </div>

          {/* Status e Observações */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                >
                  <option value="scheduled">Agendado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="no_show">Faltou</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  placeholder="Observações especiais sobre o agendamento..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !availability.available}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')} Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}