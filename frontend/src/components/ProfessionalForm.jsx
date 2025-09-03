import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Palette } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
]

export default function ProfessionalForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    color: PRESET_COLORS[0],
    active: true,
    service_ids: []
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchServices()
    if (isEditMode) {
      fetchProfessional()
    }
  }, [id])

  const fetchServices = async () => {
    try {
      const response = await api.get('/services')
      setServices(response.data.services || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços')
    }
  }

  const fetchProfessional = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/professionals/${id}`)
      const professional = response.data.professional
      
      setFormData({
        name: professional.name || '',
        role: professional.role || '',
        phone: professional.phone || '',
        email: professional.email || '',
        color: professional.color || PRESET_COLORS[0],
        active: professional.active !== false,
        service_ids: professional.services ? professional.services.map(s => s.id) : []
      })
    } catch (error) {
      console.error('Erro ao carregar profissional:', error)
      toast.error('Erro ao carregar profissional')
      navigate('/professionals')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido'
    }

    if (formData.phone && !/^[\d\s\(\)\-\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve conter apenas números e símbolos válidos'
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
      setLoading(true)
      
      const submitData = {
        ...formData,
        phone: formData.phone || null,
        email: formData.email || null,
        role: formData.role || null
      }

      if (isEditMode) {
        await api.put(`/professionals/${id}`, submitData)
        toast.success('Profissional atualizado com sucesso!')
      } else {
        await api.post('/professionals', submitData)
        toast.success('Profissional criado com sucesso!')
      }
      
      navigate('/professionals')
    } catch (error) {
      console.error('Erro ao salvar profissional:', error)
      const message = error.response?.data?.message || 'Erro ao salvar profissional'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleServiceChange = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId]
    }))
  }

  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, color }))
  }

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/professionals')}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Profissional' : 'Novo Profissional'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Atualize as informações do profissional' : 'Preencha os dados do novo profissional'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: João Silva"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo/Especialidade
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Cabeleireiro, Massagista, etc."
                />
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="joao@exemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cor do Calendário */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personalização</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Calendário
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Esta cor será usada para identificar os agendamentos deste profissional no calendário
              </p>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                >
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.color === color
                          ? 'border-gray-400 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Cor ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Serviços</h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecione os serviços que este profissional pode realizar:
            </p>
            
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .filter(service => service.active)
                  .map((service) => (
                  <div key={service.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={formData.service_ids.includes(service.id)}
                      onChange={() => handleServiceChange(service.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      <div className="text-xs text-gray-500">
                        R$ {parseFloat(service.price).toFixed(2)} • {service.duration}min
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum serviço ativo encontrado. 
                <button
                  type="button"
                  onClick={() => navigate('/services/new')}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Cadastre o primeiro serviço
                </button>
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Profissional ativo
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Profissionais inativos não aparecem para agendamento
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/professionals')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')} Profissional
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}