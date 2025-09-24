import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Send
} from 'lucide-react'
import { Button } from './ui/button'
import api from '../utils/api'

export default function Reminders() {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState([])
  const [stats, setStats] = useState({})
  const [schedulerStatus, setSchedulerStatus] = useState({ running: false })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    reminder_type: '',
    professional_id: '',
    page: 1,
    per_page: 20
  })

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [remindersRes, statsRes, schedulerRes] = await Promise.all([
        fetchReminders(),
        fetchStats(),
        fetchSchedulerStatus()
      ])
      setReminders(remindersRes.reminders || [])
      setStats(statsRes.stats || {})
      setSchedulerStatus(schedulerRes.scheduler || { running: false })
    } catch (error) {
      console.error('Erro ao carregar dados dos lembretes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReminders = async () => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key])
    })

    const response = await api.get(`/reminders?${params}`)
    return response.data
  }

  const fetchStats = async () => {
    const response = await api.get('/reminders/stats')
    return response.data
  }

  const fetchSchedulerStatus = async () => {
    const response = await api.get('/reminders/scheduler/status')
    return response.data
  }

  const toggleScheduler = async () => {
    try {
      const action = schedulerStatus.running ? 'stop' : 'start'
      await api.post(`/reminders/scheduler/${action}`)
      setSchedulerStatus(prev => ({ ...prev, running: !prev.running }))
    } catch (error) {
      console.error('Erro ao controlar agendador:', error)
    }
  }

  const processReminders = async () => {
    try {
      await api.post('/reminders/process')
      fetchData() // Recarregar dados após processar
    } catch (error) {
      console.error('Erro ao processar lembretes:', error)
    }
  }

  const sendReminder = async (reminderId) => {
    try {
      await api.post(`/reminders/${reminderId}/send`)
      fetchData() // Recarregar dados após enviar
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      sent: { text: 'Enviado', class: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { text: 'Falhou', class: 'bg-red-100 text-red-800', icon: XCircle }
    }
    return badges[status] || { text: status, class: 'bg-gray-100 text-gray-800', icon: AlertCircle }
  }

  const getReminderTypeIcon = (type) => {
    return type === 'whatsapp' ? MessageSquare : Mail
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lembretes Automáticos</h1>
          <p className="text-gray-600">Gerencie os lembretes de agendamento</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate('/reminders/settings')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_reminders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="bg-green-500 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Enviados</p>
              <p className="text-xl font-bold text-gray-900">{stats.sent_reminders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending_reminders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="bg-red-500 p-2 rounded-lg">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Falharam</p>
              <p className="text-xl font-bold text-gray-900">{stats.failed_reminders || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${schedulerStatus.running ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                Agendador: {schedulerStatus.running ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={toggleScheduler}
              variant={schedulerStatus.running ? "destructive" : "default"}
              size="sm"
              className="flex items-center space-x-2"
            >
              {schedulerStatus.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{schedulerStatus.running ? 'Parar' : 'Iniciar'}</span>
            </Button>
            <Button
              onClick={processReminders}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Processar Agora</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="sent">Enviado</option>
              <option value="failed">Falhou</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.reminder_type}
              onChange={(e) => setFilters(prev => ({ ...prev, reminder_type: e.target.value, page: 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button
              onClick={() => setFilters({ status: '', reminder_type: '', professional_id: '', page: 1, per_page: 20 })}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Limpar Filtros</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">Lista de Lembretes</h3>
        </div>

        {reminders.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum lembrete encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agendamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agendado para
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reminders.map((reminder) => {
                  const statusBadge = getStatusBadge(reminder.status)
                  const TypeIcon = getReminderTypeIcon(reminder.reminder_type)

                  return (
                    <tr key={reminder.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reminder.appointment?.client?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reminder.phone_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reminder.appointment?.service?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reminder.appointment?.appointment_date} {reminder.appointment?.start_time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TypeIcon className={`h-4 w-4 mr-2 ${reminder.reminder_type === 'whatsapp' ? 'text-green-600' : 'text-blue-600'}`} />
                          <span className="text-sm text-gray-900 capitalize">
                            {reminder.reminder_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.class}`}>
                          <statusBadge.icon className="h-3 w-3 mr-1" />
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reminder.reminder_time).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {reminder.status === 'pending' && (
                          <Button
                            onClick={() => sendReminder(reminder.id)}
                            size="sm"
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <Send className="h-3 w-3" />
                            <span>Enviar</span>
                          </Button>
                        )}
                        {reminder.status === 'failed' && (
                          <Button
                            onClick={() => sendReminder(reminder.id)}
                            size="sm"
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Reenviar</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}