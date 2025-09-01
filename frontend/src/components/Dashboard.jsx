import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, Briefcase, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import axios from 'axios'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/reports/dashboard')
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
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
      value: `R$ ${(stats.total_revenue || 0).toFixed(2)}`,
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