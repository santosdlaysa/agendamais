import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, Palette, Clock, Calendar, Plus, Trash2, Loader2 } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const DAYS_OF_WEEK = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda-feira', short: 'Seg' },
  { id: 2, name: 'Terça-feira', short: 'Ter' },
  { id: 3, name: 'Quarta-feira', short: 'Qua' },
  { id: 4, name: 'Quinta-feira', short: 'Qui' },
  { id: 5, name: 'Sexta-feira', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' }
]

const DEFAULT_WORKING_HOURS = {
  0: { enabled: false, start: '09:00', end: '18:00', break_start: '', break_end: '' },
  1: { enabled: true, start: '09:00', end: '18:00', break_start: '12:00', break_end: '13:00' },
  2: { enabled: true, start: '09:00', end: '18:00', break_start: '12:00', break_end: '13:00' },
  3: { enabled: true, start: '09:00', end: '18:00', break_start: '12:00', break_end: '13:00' },
  4: { enabled: true, start: '09:00', end: '18:00', break_start: '12:00', break_end: '13:00' },
  5: { enabled: true, start: '09:00', end: '18:00', break_start: '12:00', break_end: '13:00' },
  6: { enabled: true, start: '09:00', end: '13:00', break_start: '', break_end: '' }
}

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

  // Estados para horários de trabalho
  const [activeTab, setActiveTab] = useState('info')
  const [workingHours, setWorkingHours] = useState(DEFAULT_WORKING_HOURS)
  const [savingHours, setSavingHours] = useState(false)

  // Estados para datas bloqueadas
  const [blockedDates, setBlockedDates] = useState([])
  const [loadingBlocked, setLoadingBlocked] = useState(false)
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')
  const [blockPeriodStart, setBlockPeriodStart] = useState('')
  const [blockPeriodEnd, setBlockPeriodEnd] = useState('')

  useEffect(() => {
    fetchServices()
    if (isEditMode) {
      fetchProfessional()
      fetchWorkingHours()
      fetchBlockedDates()
    }
  }, [id])

  const fetchWorkingHours = async () => {
    try {
      const response = await api.get(`/professionals/${id}/working-hours`)
      if (response.data.working_hours && response.data.working_hours.length > 0) {
        const hours = { ...DEFAULT_WORKING_HOURS }
        response.data.working_hours.forEach(wh => {
          hours[wh.day_of_week] = {
            enabled: true,
            start: wh.start_time,
            end: wh.end_time,
            break_start: wh.break_start || '',
            break_end: wh.break_end || ''
          }
        })
        // Marcar dias não retornados como desabilitados
        DAYS_OF_WEEK.forEach(day => {
          const exists = response.data.working_hours.find(wh => wh.day_of_week === day.id)
          if (!exists) {
            hours[day.id] = { ...hours[day.id], enabled: false }
          }
        })
        setWorkingHours(hours)
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    }
  }

  const fetchBlockedDates = async () => {
    try {
      setLoadingBlocked(true)
      const response = await api.get(`/professionals/${id}/blocked-dates`)
      setBlockedDates(response.data.blocked_dates || [])
    } catch (error) {
      console.error('Erro ao carregar datas bloqueadas:', error)
    } finally {
      setLoadingBlocked(false)
    }
  }

  const handleSaveWorkingHours = async () => {
    setSavingHours(true)
    try {
      const hoursData = Object.entries(workingHours)
        .filter(([_, data]) => data.enabled)
        .map(([day, data]) => ({
          day_of_week: parseInt(day),
          start_time: data.start,
          end_time: data.end,
          break_start: data.break_start || null,
          break_end: data.break_end || null
        }))

      await api.post(`/professionals/${id}/working-hours`, { working_hours: hoursData })
      toast.success('Horários salvos com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar horários')
    } finally {
      setSavingHours(false)
    }
  }

  const handleAddBlockedDate = async () => {
    if (!newBlockedDate) {
      toast.error('Selecione uma data')
      return
    }

    try {
      await api.post(`/professionals/${id}/blocked-dates`, {
        date: newBlockedDate,
        reason: newBlockedReason || null
      })
      toast.success('Data bloqueada adicionada!')
      setNewBlockedDate('')
      setNewBlockedReason('')
      fetchBlockedDates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao bloquear data')
    }
  }

  const handleAddBlockedPeriod = async () => {
    if (!blockPeriodStart || !blockPeriodEnd) {
      toast.error('Selecione as datas de início e fim')
      return
    }

    if (blockPeriodStart > blockPeriodEnd) {
      toast.error('Data inicial deve ser anterior à data final')
      return
    }

    try {
      await api.post(`/professionals/${id}/blocked-dates/bulk`, {
        start_date: blockPeriodStart,
        end_date: blockPeriodEnd,
        reason: newBlockedReason || 'Férias'
      })
      toast.success('Período bloqueado com sucesso!')
      setBlockPeriodStart('')
      setBlockPeriodEnd('')
      setNewBlockedReason('')
      fetchBlockedDates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao bloquear período')
    }
  }

  const handleRemoveBlockedDate = async (blockedId) => {
    try {
      await api.delete(`/professionals/${id}/blocked-dates/${blockedId}`)
      toast.success('Data desbloqueada!')
      fetchBlockedDates()
    } catch (error) {
      toast.error('Erro ao remover bloqueio')
    }
  }

  const handleWorkingHourChange = (dayId, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }))
  }

  const fetchServices = async () => {
    try {
      const response = await api.get('/services')
      setServices(response.data.services || [])
    } catch (error) {
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
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-jet-black-300 hover:bg-jet-black-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-jet-black-900">
              {isEditMode ? 'Editar Profissional' : 'Novo Profissional'}
            </h1>
            <p className="text-jet-black-600">
              {isEditMode ? 'Atualize as informações do profissional' : 'Preencha os dados do novo profissional'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs - só mostra em modo de edição */}
      {isEditMode && (
        <div className="border-b mb-6 bg-white rounded-t-lg">
          <nav className="flex gap-1 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
                activeTab === 'info'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-jet-black-500 hover:text-jet-black-700 hover:bg-jet-black-100'
              }`}
            >
              Informações
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hours')}
              className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'hours'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-jet-black-500 hover:text-jet-black-700 hover:bg-jet-black-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              Horários
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('blocked')}
              className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'blocked'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-jet-black-500 hover:text-jet-black-700 hover:bg-jet-black-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Folgas/Férias
            </button>
          </nav>
        </div>
      )}

      {/* Tab: Informações */}
      {activeTab === 'info' && (
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-jet-black-300'
                  }`}
                  placeholder="Ex: João Silva"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Cargo/Especialidade
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Cabeleireiro, Massagista, etc."
                />
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-jet-black-300'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-jet-black-300'
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
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Personalização</h3>
            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">
                Cor do Calendário
              </label>
              <p className="text-xs text-jet-black-500 mb-4">
                Esta cor será usada para identificar os agendamentos deste profissional no calendário
              </p>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-jet-black-200 flex items-center justify-center"
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
                          ? 'border-jet-black-400 scale-110'
                          : 'border-jet-black-200 hover:scale-105'
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
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Serviços</h3>
            <p className="text-sm text-jet-black-600 mb-4">
              Selecione os serviços que este profissional pode realizar:
            </p>
            
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services
                  .filter(service => service.active)
                  .map((service) => (
                  <div key={service.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-jet-black-50">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={formData.service_ids.includes(service.id)}
                      onChange={() => handleServiceChange(service.id)}
                      className="h-4 w-4 text-blue-600 border-jet-black-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-jet-black-900">{service.name}</div>
                      <div className="text-xs text-jet-black-500">
                        R$ {parseFloat(service.price).toFixed(2)} • {service.duration}min
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-jet-black-500 text-center py-8">
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
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Status</h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-jet-black-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-jet-black-700">
                Profissional ativo
              </label>
            </div>
            <p className="text-xs text-jet-black-500 mt-1">
              Profissionais inativos não aparecem para agendamento
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/professionals')}
              className="flex items-center px-4 py-2 border border-jet-black-300 rounded-lg text-jet-black-700 hover:bg-jet-black-50"
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
      )}

      {/* Tab: Horários de Trabalho */}
      {activeTab === 'hours' && isEditMode && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-jet-black-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Horários de Trabalho
            </h3>
            <p className="text-sm text-jet-black-500 mt-1">
              Configure os dias e horários em que este profissional atende
            </p>
          </div>

          <div className="space-y-4">
            {DAYS_OF_WEEK.map(day => (
              <div
                key={day.id}
                className={`p-4 rounded-lg border ${
                  workingHours[day.id]?.enabled
                    ? 'bg-white border-jet-black-200'
                    : 'bg-jet-black-50 border-jet-black-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingHours[day.id]?.enabled || false}
                      onChange={(e) => handleWorkingHourChange(day.id, 'enabled', e.target.checked)}
                      className="w-5 h-5 rounded border-jet-black-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`font-medium ${workingHours[day.id]?.enabled ? 'text-jet-black-900' : 'text-jet-black-500'}`}>
                      {day.name}
                    </span>
                  </label>

                  {workingHours[day.id]?.enabled && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={workingHours[day.id]?.start || '09:00'}
                          onChange={(e) => handleWorkingHourChange(day.id, 'start', e.target.value)}
                          className="px-3 py-1.5 border border-jet-black-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-jet-black-500">às</span>
                        <input
                          type="time"
                          value={workingHours[day.id]?.end || '18:00'}
                          onChange={(e) => handleWorkingHourChange(day.id, 'end', e.target.value)}
                          className="px-3 py-1.5 border border-jet-black-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-jet-black-600">
                        <span>Intervalo:</span>
                        <input
                          type="time"
                          value={workingHours[day.id]?.break_start || ''}
                          onChange={(e) => handleWorkingHourChange(day.id, 'break_start', e.target.value)}
                          className="px-2 py-1 border border-jet-black-300 rounded text-sm w-24"
                          placeholder="Início"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={workingHours[day.id]?.break_end || ''}
                          onChange={(e) => handleWorkingHourChange(day.id, 'break_end', e.target.value)}
                          className="px-2 py-1 border border-jet-black-300 rounded text-sm w-24"
                          placeholder="Fim"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t flex justify-end">
            <button
              type="button"
              onClick={handleSaveWorkingHours}
              disabled={savingHours}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {savingHours ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Horários
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Datas Bloqueadas */}
      {activeTab === 'blocked' && isEditMode && (
        <div className="space-y-6">
          {/* Bloquear data única */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-jet-black-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Bloquear Data Específica
            </h3>
            <p className="text-sm text-jet-black-500 mb-4">
              Use para folgas pontuais ou dias específicos que o profissional não atende
            </p>

            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-1">Data</label>
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-jet-black-700 mb-1">Motivo (opcional)</label>
                <input
                  type="text"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  placeholder="Ex: Consulta médica"
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddBlockedDate}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Bloquear
              </button>
            </div>
          </div>

          {/* Bloquear período (férias) */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-jet-black-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Bloquear Período (Férias)
            </h3>
            <p className="text-sm text-jet-black-500 mb-4">
              Use para bloquear um período contínuo de dias
            </p>

            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-1">De</label>
                <input
                  type="date"
                  value={blockPeriodStart}
                  onChange={(e) => setBlockPeriodStart(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-1">Até</label>
                <input
                  type="date"
                  value={blockPeriodEnd}
                  onChange={(e) => setBlockPeriodEnd(e.target.value)}
                  min={blockPeriodStart || new Date().toISOString().split('T')[0]}
                  className="px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddBlockedPeriod}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Bloquear Período
              </button>
            </div>
          </div>

          {/* Lista de datas bloqueadas */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Datas Bloqueadas</h3>

            {loadingBlocked ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : blockedDates.length === 0 ? (
              <p className="text-jet-black-500 text-center py-8">
                Nenhuma data bloqueada
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {blockedDates.map(blocked => (
                  <div
                    key={blocked.id}
                    className="flex items-center justify-between p-3 bg-jet-black-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-jet-black-900">
                          {new Date(blocked.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        {blocked.reason && (
                          <p className="text-sm text-jet-black-500">{blocked.reason}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedDate(blocked.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover bloqueio"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}