import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Bell,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BarChart3,
  Clock,
  Zap,
  Plus
} from 'lucide-react'
import api, { reminderService } from '../utils/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_clients: 0,
    total_professionals: 0,
    total_services: 0,
    total_appointments: 0,
    recent_appointments: 0,
    total_revenue: 0,
    appointments_by_status: {}
  })
  const [reminderStats, setReminderStats] = useState({
    total_reminders: 0,
    pending_reminders: 0,
    sent_reminders: 0,
    failed_reminders: 0
  })
  const [upcomingReminders, setUpcomingReminders] = useState([])
  const [recentAppointmentsList, setRecentAppointmentsList] = useState([])
  const [loading, setLoading] = useState(true)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [
        clientsRes,
        professionalsRes,
        servicesRes,
        appointmentsRes,
        allAppointmentsRes,
        reminderStatsRes,
        upcomingRes
      ] = await Promise.allSettled([
        api.get('/clients?per_page=1'),
        api.get('/professionals?per_page=1'),
        api.get('/services?per_page=1'),
        api.get('/appointments?per_page=1'),
        api.get('/appointments?per_page=200'),
        reminderService.getStats(),
        reminderService.getUpcoming(24)
      ])

      let totalRevenue = 0
      let appointmentsByStatus = {}
      let recentAppointments = 0
      const allAppointments = allAppointmentsRes.status === 'fulfilled'
        ? (allAppointmentsRes.value.data.appointments || [])
        : []

      if (allAppointments.length > 0) {
        totalRevenue = allAppointments
          .filter(apt => apt.status === 'completed' && apt.price)
          .reduce((sum, apt) => sum + parseFloat(apt.price || 0), 0)

        appointmentsByStatus = allAppointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1
          return acc
        }, {})

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        recentAppointments = allAppointments.filter(apt => {
          const aptDate = new Date(apt.appointment_date)
          return aptDate >= thirtyDaysAgo
        }).length

        const sortedAppointments = [...allAppointments].sort((a, b) => {
          const dateA = new Date(`${a.appointment_date}T${a.start_time}`)
          const dateB = new Date(`${b.appointment_date}T${b.start_time}`)
          return dateB - dateA
        })
        setRecentAppointmentsList(sortedAppointments.slice(0, 5))
      }

      const newStats = {
        total_clients: clientsRes.status === 'fulfilled' ? (clientsRes.value.data.pagination?.total || 0) : 0,
        total_professionals: professionalsRes.status === 'fulfilled' ? (professionalsRes.value.data.pagination?.total || 0) : 0,
        total_services: servicesRes.status === 'fulfilled' ? (servicesRes.value.data.pagination?.total || 0) : 0,
        total_appointments: appointmentsRes.status === 'fulfilled' ? (appointmentsRes.value.data.pagination?.total || 0) : 0,
        recent_appointments: recentAppointments,
        total_revenue: totalRevenue,
        appointments_by_status: appointmentsByStatus
      }

      setStats(newStats)

      if (reminderStatsRes.status === 'fulfilled') {
        setReminderStats(reminderStatsRes.value.stats || {})
      }
      if (upcomingRes.status === 'fulfilled') {
        setUpcomingReminders(upcomingRes.value.reminders || [])
      }
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'text-sky-600 bg-sky-50',
      completed: 'text-emerald-600 bg-emerald-50',
      cancelled: 'text-rose-600 bg-rose-50',
      no_show: 'text-amber-600 bg-amber-50'
    }
    return colors[status] || 'text-jet-black-600 bg-jet-black-50'
  }

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: 'Agendado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      no_show: 'Faltou'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-periwinkle-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-periwinkle-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-jet-black-500">Carregando...</p>
        </div>
      </div>
    )
  }

  const scheduledCount = stats.appointments_by_status?.scheduled || 0
  const completedCount = stats.appointments_by_status?.completed || 0
  const totalStatusCount = completedCount + scheduledCount + (stats.appointments_by_status?.cancelled || 0)
  const completionRate = totalStatusCount > 0 ? Math.round((completedCount / totalStatusCount) * 100) : 0

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-periwinkle-600 to-space-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-space-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-periwinkle-200 text-sm mb-1 capitalize">{getFormattedDate()}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{getGreeting()}!</h1>
            <p className="text-periwinkle-100">
              {scheduledCount > 0
                ? `Você tem ${scheduledCount} agendamento${scheduledCount > 1 ? 's' : ''} pendente${scheduledCount > 1 ? 's' : ''}`
                : 'Você não tem agendamentos pendentes'}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[80px]">
              <p className="text-2xl md:text-3xl font-bold">{scheduledCount}</p>
              <p className="text-xs text-periwinkle-200">Pendentes</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[80px]">
              <p className="text-2xl md:text-3xl font-bold">{completionRate}%</p>
              <p className="text-xs text-periwinkle-200">Conclusão</p>
            </div>
            <div className="hidden sm:block bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[80px]">
              <p className="text-xl md:text-2xl font-bold">
                R$ {stats.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-periwinkle-200">Receita</p>
            </div>
          </div>
        </div>

        {/* Quick action button */}
        <button
          onClick={() => navigate('/appointments/new')}
          className="mt-6 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/clients')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-jet-black-900">{stats.total_clients}</p>
          <p className="text-sm text-jet-black-500">Clientes</p>
        </div>

        <div
          onClick={() => navigate('/services')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-periwinkle-200 hover:shadow-lg hover:shadow-periwinkle-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-periwinkle-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-periwinkle-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-jet-black-900">{stats.total_services}</p>
          <p className="text-sm text-jet-black-500">Serviços</p>
        </div>

        <div
          onClick={() => navigate('/appointments')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-jet-black-900">{stats.recent_appointments}</p>
          <p className="text-sm text-jet-black-500">Este mês</p>
        </div>

        <div
          onClick={() => navigate('/reports')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-jet-black-900">
            R$ {stats.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-jet-black-500">Receita</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments List - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-jet-black-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-jet-black-100 flex items-center justify-between">
            <h3 className="font-semibold text-jet-black-900">Agendamentos Recentes</h3>
            <button
              onClick={() => navigate('/appointments')}
              className="text-sm text-periwinkle-600 hover:text-periwinkle-700 font-medium flex items-center gap-1 group"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {recentAppointmentsList.length > 0 ? (
            <div className="divide-y divide-jet-black-50">
              {recentAppointmentsList.map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                  className="flex items-center justify-between px-5 py-4 hover:bg-jet-black-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-periwinkle-400 to-space-indigo-500 rounded-xl flex items-center justify-center text-white font-semibold">
                      {appointment.client?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-jet-black-900">{appointment.client?.name}</p>
                      <p className="text-sm text-jet-black-500">{appointment.service?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-jet-black-900">
                      {new Date(appointment.appointment_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm text-jet-black-500">{appointment.start_time?.slice(0, 5)}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
              <p className="text-jet-black-500">Nenhum agendamento recente</p>
              <button
                onClick={() => navigate('/appointments/new')}
                className="mt-4 text-periwinkle-600 hover:text-periwinkle-700 font-medium text-sm"
              >
                Criar primeiro agendamento
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Quick Actions & Reminders */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-5">
            <h3 className="font-semibold text-jet-black-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/clients/new')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-medium text-jet-black-700">Novo Cliente</span>
              </button>

              <button
                onClick={() => navigate('/professionals/new')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-medium text-jet-black-700">Novo Profissional</span>
              </button>

              <button
                onClick={() => navigate('/services/new')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-periwinkle-50 text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-periwinkle-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 text-periwinkle-600" />
                </div>
                <span className="font-medium text-jet-black-700">Novo Serviço</span>
              </button>

              <button
                onClick={() => navigate('/appointments/new')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-sky-600" />
                </div>
                <span className="font-medium text-jet-black-700">Novo Agendamento</span>
              </button>
            </div>
          </div>

          {/* Reminders */}
          {reminderStats.total_reminders > 0 && (
            <div className="bg-white rounded-xl border border-jet-black-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-jet-black-900">Lembretes</h3>
                <button
                  onClick={() => navigate('/reminders')}
                  className="text-sm text-periwinkle-600 hover:text-periwinkle-700 font-medium"
                >
                  Ver todos
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-xl font-bold text-emerald-600">{reminderStats.sent_reminders || 0}</p>
                  <p className="text-xs text-emerald-600">Enviados</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-xl font-bold text-amber-600">{reminderStats.pending_reminders || 0}</p>
                  <p className="text-xs text-amber-600">Pendentes</p>
                </div>
                <div className="text-center p-3 bg-rose-50 rounded-xl">
                  <p className="text-xl font-bold text-rose-600">{reminderStats.failed_reminders || 0}</p>
                  <p className="text-xs text-rose-600">Falharam</p>
                </div>
              </div>

              {upcomingReminders.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-jet-black-500 uppercase tracking-wide">Próximos (24h)</p>
                  {upcomingReminders.slice(0, 3).map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-jet-black-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-periwinkle-100 rounded-lg flex items-center justify-center text-periwinkle-600 font-medium text-sm">
                          {reminder.appointment?.client?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm text-jet-black-900 truncate max-w-[120px]">
                          {reminder.appointment?.client?.name}
                        </span>
                      </div>
                      <span className="text-xs text-jet-black-500">
                        {new Date(reminder.reminder_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Overview */}
          {stats.appointments_by_status && Object.keys(stats.appointments_by_status).length > 0 && (
            <div className="bg-white rounded-xl border border-jet-black-100 p-5">
              <h3 className="font-semibold text-jet-black-900 mb-4">Status</h3>
              <div className="space-y-3">
                {Object.entries(stats.appointments_by_status).map(([status, count]) => {
                  const percentage = totalStatusCount > 0 ? Math.round((count / totalStatusCount) * 100) : 0
                  const colorClass = getStatusColor(status)
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-jet-black-700">{getStatusLabel(status)}</span>
                        <span className="font-medium text-jet-black-900">{count}</span>
                      </div>
                      <div className="h-2 bg-jet-black-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            status === 'completed' ? 'bg-emerald-500' :
                            status === 'scheduled' ? 'bg-sky-500' :
                            status === 'cancelled' ? 'bg-rose-500' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
