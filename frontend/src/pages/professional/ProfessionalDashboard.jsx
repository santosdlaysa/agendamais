import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfessionalAuth } from '../../contexts/ProfessionalAuthContext'
import { professionalApi } from '../../services/professionalApi'
import toast from 'react-hot-toast'
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  User,
  Phone,
  ChevronRight,
  Loader2,
  CalendarDays,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

export default function ProfessionalDashboard() {
  const { professional } = useProfessionalAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboard = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const data = await professionalApi.getDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const formatTime = (time) => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'no_show':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado'
      case 'completed':
        return 'Concluido'
      case 'cancelled':
        return 'Cancelado'
      case 'no_show':
        return 'Faltou'
      default:
        return status
    }
  }

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await professionalApi.completeAppointment(appointmentId, {
        notes: 'Concluido via dashboard'
      })
      toast.success('Atendimento concluido!')
      fetchDashboard(true)
    } catch (error) {
      toast.error('Erro ao concluir atendimento')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  const stats = dashboardData?.stats || {}
  const todaySchedule = dashboardData?.today_schedule || []
  const upcomingAppointments = dashboardData?.upcoming_appointments || []

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}, {professional?.name?.split(' ')[0]}!
            </h1>
            <p className="text-emerald-100">
              {stats.today_appointments > 0
                ? `Voce tem ${stats.today_appointments} atendimento${stats.today_appointments > 1 ? 's' : ''} hoje`
                : 'Nenhum atendimento agendado para hoje'}
            </p>
          </div>
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-jet-black-900">{stats.today_appointments || 0}</p>
              <p className="text-sm text-jet-black-500">Hoje</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-jet-black-900">{stats.week_appointments || 0}</p>
              <p className="text-sm text-jet-black-500">Esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-jet-black-900">{stats.completion_rate || 0}%</p>
              <p className="text-sm text-jet-black-500">Taxa conclusao</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-jet-black-900">{formatCurrency(stats.month_revenue)}</p>
              <p className="text-sm text-jet-black-500">Este mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-jet-black-900">Agenda de Hoje</h2>
            </div>
            <button
              onClick={() => navigate('/profissional/agenda')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Ver completa
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
                <p className="text-jet-black-500">Nenhum atendimento para hoje</p>
                <p className="text-sm text-jet-black-400 mt-1">Aproveite para descansar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySchedule.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-3 bg-jet-black-50 rounded-xl hover:bg-jet-black-100 transition-colors"
                  >
                    {/* Time */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-jet-black-900">
                        {formatTime(appointment.start_time)}
                      </p>
                      <p className="text-xs text-jet-black-500">
                        {formatTime(appointment.end_time)}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-1 h-12 rounded-full bg-emerald-500"></div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-jet-black-900 truncate">
                        {appointment.client_name}
                      </p>
                      <p className="text-sm text-jet-black-500 truncate">
                        {appointment.service_name}
                      </p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleCompleteAppointment(appointment.id)}
                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg transition-colors"
                          title="Marcar como concluido"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-jet-black-900">Resumo do Mes</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Total de atendimentos</span>
                <span className="font-semibold text-jet-black-900">{stats.month_appointments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Concluidos</span>
                <span className="font-semibold text-emerald-600">{stats.month_completed || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Cancelados</span>
                <span className="font-semibold text-red-600">{stats.month_cancelled || 0}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-jet-black-700">Receita total</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(stats.month_revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-jet-black-900">Proximos</h3>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-jet-black-500 text-center py-4">
                Nenhum agendamento proximo
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-jet-black-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-jet-black-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-jet-black-900 truncate">
                        {appointment.client_name}
                      </p>
                      <p className="text-xs text-jet-black-500">
                        {appointment.appointment_date} as {formatTime(appointment.start_time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="font-semibold text-jet-black-900 mb-4">Acoes Rapidas</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/profissional/agenda')}
                className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-jet-black-50 transition-colors"
              >
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-jet-black-700">Ver agenda da semana</span>
              </button>
              <button
                onClick={() => navigate('/profissional/clientes')}
                className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-jet-black-50 transition-colors"
              >
                <User className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-jet-black-700">Meus clientes</span>
              </button>
              <button
                onClick={() => navigate('/profissional/configuracoes')}
                className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-jet-black-50 transition-colors"
              >
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-jet-black-700">Configurar horarios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
