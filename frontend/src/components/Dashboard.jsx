import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, Briefcase, Calendar, DollarSign, TrendingUp, MessageSquare, Clock, Eye } from 'lucide-react'
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

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fazer todas as requisições em paralelo para carregar mais rápido
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

      // Processar agendamentos para estatísticas
      let totalRevenue = 0
      let appointmentsByStatus = {}
      let recentAppointments = 0
      const allAppointments = allAppointmentsRes.status === 'fulfilled'
        ? (allAppointmentsRes.value.data.appointments || [])
        : []

      if (allAppointments.length > 0) {
        // Calcular receita total dos agendamentos concluídos
        totalRevenue = allAppointments
          .filter(apt => apt.status === 'completed' && apt.price)
          .reduce((sum, apt) => sum + parseFloat(apt.price || 0), 0)

        // Contar por status
        appointmentsByStatus = allAppointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1
          return acc
        }, {})

        // Agendamentos dos últimos 30 dias
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        recentAppointments = allAppointments.filter(apt => {
          const aptDate = new Date(apt.appointment_date)
          return aptDate >= thirtyDaysAgo
        }).length

        // Ordenar por data mais recente e pegar os 5 últimos agendamentos
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

      // Processar dados de lembretes (se disponíveis)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.total_clients,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Profissionais',
      value: stats.total_professionals,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Serviços',
      value: stats.total_services,
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      title: 'Agendamentos',
      value: stats.total_appointments,
      icon: Calendar,
      color: 'bg-yellow-500'
    },
    {
      title: 'Últimos 30 dias',
      value: stats.recent_appointments,
      icon: TrendingUp,
      color: 'bg-indigo-500'
    },
    {
      title: 'Receita Total',
      value: `R$ ${(stats.total_revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-emerald-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de agendamento</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      {stats.appointments_by_status && Object.keys(stats.appointments_by_status).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Agendamentos por Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(stats.appointments_by_status).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {status === 'scheduled' && 'Agendados'}
                  {status === 'completed' && 'Concluídos'}
                  {status === 'cancelled' && 'Cancelados'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agendamentos Recentes */}
      {recentAppointmentsList.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Agendamentos Recentes</h3>
            <button
              onClick={() => navigate('/appointments')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAppointmentsList.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.client?.name}</div>
                      <div className="text-xs text-gray-500">{appointment.client?.phone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service?.name}</div>
                      <div className="text-xs text-gray-500">R$ {parseFloat(appointment.price || 0).toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {appointment.professional?.color && (
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: appointment.professional.color }}
                          />
                        )}
                        <span className="text-sm text-gray-900">{appointment.professional?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.start_time?.slice(0, 5)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status === 'scheduled' && 'Agendado'}
                        {appointment.status === 'completed' && 'Concluído'}
                        {appointment.status === 'cancelled' && 'Cancelado'}
                        {appointment.status === 'no_show' && 'Faltou'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reminder Stats */}
      {reminderStats.total_reminders > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Lembretes Automáticos</h3>
            <button
              onClick={() => navigate('/reminders')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{reminderStats.sent_reminders || 0}</p>
              <p className="text-sm text-green-600">Enviados</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{reminderStats.pending_reminders || 0}</p>
              <p className="text-sm text-yellow-600">Pendentes</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{reminderStats.failed_reminders || 0}</p>
              <p className="text-sm text-red-600">Falharam</p>
            </div>
          </div>

          {upcomingReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Próximos lembretes (24h)</h4>
              <div className="space-y-2">
                {upcomingReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-900">
                        {reminder.appointment?.client?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(reminder.reminder_time).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/clients/new')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Novo Cliente</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/professionals/new')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <UserCheck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Novo Profissional</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/services/new')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Novo Serviço</p>
            </div>
          </button>
          <button 
            onClick={() => navigate('/appointments/new')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
          >
            <div className="text-center">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Novo Agendamento</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}