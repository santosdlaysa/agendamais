import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Clock, 
  User,
  UserCheck,
  Briefcase,
  DollarSign,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import CompleteAppointmentModal from './CompleteAppointmentModal'

const STATUS_CONFIG = {
  scheduled: {
    label: 'Agendado',
    color: 'bg-periwinkle-100 text-periwinkle-800',
    icon: Calendar
  },
  completed: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  },
  no_show: {
    label: 'Faltou',
    color: 'bg-orange-100 text-orange-800',
    icon: AlertCircle
  }
}

export default function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    start_date: '',
    end_date: '',
    professional_id: '',
    client_id: ''
  })
  const [professionals, setProfessionals] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    fetchProfessionals()
    fetchAppointments()
  }, [filters, currentPage])

  const fetchProfessionals = async () => {
    try {
      const response = await api.get('/professionals?active_only=true')
      setProfessionals(response.data.professionals || [])
    } catch (error) {
      // Error handled silently
    }
  }

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 20
      })
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })
      
      const response = await api.get(`/appointments?${params}`)
      setAppointments(response.data.appointments || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: newStatus
      })
      toast.success(`Status atualizado para ${STATUS_CONFIG[newStatus].label}`)
      fetchAppointments()
    } catch (error) {
      toast.error('Erro ao atualizar status do agendamento')
    }
  }

  const handleCompleteSuccess = () => {
    setShowCompleteModal(false)
    setSelectedAppointment(null)
    fetchAppointments()
    toast.success('Agendamento concluído com sucesso!')
  }

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      return
    }

    try {
      await api.delete(`/appointments/${appointmentId}`)
      toast.success('Agendamento excluído com sucesso!')
      fetchAppointments()
    } catch (error) {
      toast.error('Erro ao excluir agendamento')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      start_date: '',
      end_date: '',
      professional_id: '',
      client_id: ''
    })
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatTime = (timeString) => {
    return timeString.substring(0, 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Agendamentos</h1>
          <p className="text-jet-black-600">Gerencie todos os agendamentos</p>
        </div>
        <button
          onClick={() => navigate('/appointments/new')}
          className="flex items-center px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-black-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cliente ou profissional..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Profissional
            </label>
            <select
              value={filters.professional_id}
              onChange={(e) => handleFilterChange('professional_id', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
            >
              <option value="">Todos os profissionais</option>
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-jet-black-600">
            {appointments.length} agendamentos encontrados
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-periwinkle-600 hover:text-periwinkle-800"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-jet-black-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-jet-black-600 mb-6">
              {Object.values(filters).some(v => v) 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando o primeiro agendamento'
              }
            </p>
            {!Object.values(filters).some(v => v) && (
              <button
                onClick={() => navigate('/appointments/new')}
                className="flex items-center mx-auto px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-jet-black-200">
            {appointments.map((appointment) => {
              const StatusIcon = STATUS_CONFIG[appointment.status]?.icon || Calendar
              
              return (
                <div key={appointment.id} className="p-6 hover:bg-jet-black-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: appointment.professional.color }}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-jet-black-900">
                              {appointment.client.name}
                            </h3>
                            <span 
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[appointment.status]?.color}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {STATUS_CONFIG[appointment.status]?.label}
                            </span>
                          </div>
                          
                          {/* Descrição do agendamento com campos selecionados */}
                          <div className="mt-3 p-3 bg-jet-black-50 rounded-lg text-sm">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-jet-black-600">
                              <p><span className="font-medium">Serviço:</span> {appointment.service.name}</p>
                              <p><span className="font-medium">Profissional:</span> {appointment.professional.name}</p>
                              <p><span className="font-medium">Data:</span> {formatDate(appointment.appointment_date)}</p>
                              <p><span className="font-medium">Horário:</span> {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                              <p><span className="font-medium">Duração:</span> {appointment.service.duration} min</p>
                              <p><span className="font-medium">Valor:</span> R$ {parseFloat(appointment.price).toFixed(2)}</p>
                            </div>
                            {appointment.notes && (
                              <p className="mt-2 pt-2 border-t border-jet-black-200">
                                <span className="font-medium">Observações:</span> {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Status Actions */}
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setShowCompleteModal(true)
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 border border-green-200 rounded-lg"
                            title="Marcar como concluído"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
                            title="Cancelar agendamento"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                        className="p-2 text-periwinkle-600 hover:bg-periwinkle-50 border border-periwinkle-200 rounded-lg"
                        title="Editar agendamento"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
                        title="Excluir agendamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-jet-black-600">
              Página {pagination.page} de {pagination.pages} 
              ({pagination.total} agendamentos no total)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm border border-jet-black-300 rounded-md hover:bg-jet-black-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = Math.max(1, pagination.page - 2) + i
                if (page > pagination.pages) return null
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      page === pagination.page
                        ? 'bg-periwinkle-600 text-white border-periwinkle-600'
                        : 'border-jet-black-300 hover:bg-jet-black-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-2 text-sm border border-jet-black-300 rounded-md hover:bg-jet-black-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {appointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = appointments.filter(a => a.status === status).length
              return (
                <div key={status}>
                  <p className="text-2xl font-bold text-jet-black-900">{count}</p>
                  <p className="text-sm text-jet-black-600">{config.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Complete Appointment Modal */}
      {showCompleteModal && selectedAppointment && (
        <CompleteAppointmentModal
          appointment={selectedAppointment}
          onComplete={handleCompleteSuccess}
          onClose={() => {
            setShowCompleteModal(false)
            setSelectedAppointment(null)
          }}
        />
      )}
    </div>
  )
}